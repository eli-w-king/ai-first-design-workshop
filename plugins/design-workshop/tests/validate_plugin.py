#!/usr/bin/env python3
"""Validate the workshop package's metadata, relative links and punctuation."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit
from automation_metadata import validate_automation_metadata

try:
    import yaml
except ImportError:
    sys.exit('This maintainer check needs PyYAML. It never installs dependencies automatically.')

PLUGIN = Path(__file__).resolve().parents[1]
REPO = PLUGIN.parents[1]
EXPECTED = {
    'workshop-setup', 'variations', 'demo-walkthrough', 'prototypes', 'pair-test',
    'taste', 'overnight-plan', 'publish-pages', 'job-search',
}
errors = []


class UniqueLoader(yaml.SafeLoader):
    pass


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in result:
            raise ValueError(f'Duplicate frontmatter key: {key}')
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def frontmatter(path, include_body=False):
    text = path.read_text(encoding='utf-8')
    match = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)', text, re.S)
    if not match:
        raise ValueError('Missing frontmatter at the beginning of the file')
    value = yaml.load(match.group(1), Loader=UniqueLoader)
    if not isinstance(value, dict):
        raise ValueError('Frontmatter must be a mapping')
    return (value, text[match.end():]) if include_body else value


def outside_fences(text):
    return re.sub(r'(?ms)^(`{3,}|~{3,})[^\n]*\n.*?^\1\s*$', '', text)


def heading_ids(text):
    counts = {}
    ids = set()
    for match in re.finditer(r'^#{1,6}\s+(.+?)\s*#*\s*$', outside_fences(text), re.M):
        title = re.sub(r'\[([^]]+)\]\([^)]+\)', r'\1', match.group(1))
        slug = re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-')
        count = counts.get(slug, 0)
        ids.add(f'{slug}-{count}' if count else slug)
        counts[slug] = count + 1
    return ids


skills = sorted((PLUGIN / 'skills').glob('*/SKILL.md'))
if {path.parent.name for path in skills} != EXPECTED:
    errors.append('The package must contain exactly the nine advertised skills.')
for path in skills:
    try:
        metadata = frontmatter(path)
        name = metadata.get('name')
        if name != path.parent.name or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', str(name)) or len(str(name)) > 64:
            raise ValueError('Skill name must match its folder and use kebab case')
        description = metadata.get('description')
        if not isinstance(description, str) or not 1 <= len(description) < 1024:
            raise ValueError('Description must be a nonempty string under 1024 characters')
    except (ValueError, yaml.YAMLError) as exc:
        errors.append(f'{path.relative_to(REPO)}: {exc}')

manifest = json.loads((PLUGIN / 'plugin.json').read_text())
marketplace_path = REPO / '.github/plugin/marketplace.json'
marketplace = json.loads(marketplace_path.read_text())
allowed_manifest_fields = {'$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions'}
if set(manifest) - allowed_manifest_fields:
    errors.append('Agent Plugins 1.0 does not allow extra top-level component paths.')
if manifest.get('$schema') != 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json':
    errors.append('Unexpected plugin schema.')
if manifest.get('name') != 'design-workshop' or marketplace.get('name') != 'ai-first-design-workshop':
    errors.append('Unexpected plugin or marketplace name.')
entries = marketplace.get('plugins', [])
if len(entries) != 1 or entries[0].get('name') != manifest['name']:
    errors.append('Marketplace must advertise this plugin exactly once.')
else:
    if (REPO / entries[0]['source']).resolve() != PLUGIN or entries[0].get('version') != manifest.get('version'):
        errors.append('Marketplace source or version does not match the package.')

expected_automations = {
    'keep-my-taste-current': {'kind': 'cron', 'expression': '0 9 * * 1', 'timeZone': 'local'},
    'weekly-roles-digest': {'kind': 'manual'},
    'daily-cards': {'kind': 'manual'},
}
automations = sorted((PLUGIN / 'automations').glob('*.automation.md'))
if {path.name.removesuffix('.automation.md') for path in automations} != expected_automations.keys():
    errors.append('The package must contain the three advertised automation templates.')
seen_automation_ids = set()
for path in automations:
    try:
        identifier = path.name.removesuffix('.automation.md')
        if identifier not in expected_automations:
            raise ValueError('Unexpected automation template file')
        metadata, body = frontmatter(path, include_body=True)
        checked_id = validate_automation_metadata(metadata, expected_automations[identifier], seen_automation_ids)
        if checked_id != identifier:
            raise ValueError('Automation id must match its advertised filename')
        if not body.strip():
            raise ValueError('Automation template is missing its prompt')
        seen_automation_ids.add(checked_id)
    except (ValueError, yaml.YAMLError) as exc:
        errors.append(f'{path.relative_to(REPO)}: {exc}')

files = [p for p in PLUGIN.rglob('*') if p.is_file() and p.suffix in {'.md', '.json', '.mjs', '.py'}]
files += [REPO / 'README.md', marketplace_path]
links = 0
for path in files:
    text = path.read_text(encoding='utf-8')
    if any(line != line.rstrip(' \t') for line in text.splitlines()):
        errors.append(f'{path.relative_to(REPO)}: trailing whitespace')
    if any(char in text for char in (chr(0x2013), chr(0x2014))):
        errors.append(f'{path.relative_to(REPO)}: contains an em or en dash')
    if path.suffix != '.md':
        continue
    body = outside_fences(text)
    targets = re.findall(r'\[[^\]\n]+\]\(([^\s)]+)(?:\s+"[^"]*")?\)', body)
    targets += re.findall(r'^\[[^]]+\]:\s*(\S+)', body, re.M)
    for target in targets:
        target = target.strip('<>')
        parts = urlsplit(target)
        if parts.scheme or parts.netloc:
            continue
        links += 1
        destination = (path.parent / unquote(parts.path)).resolve() if parts.path else path
        if not destination.is_relative_to(REPO) or not destination.exists():
            errors.append(f'{path.relative_to(REPO)}: broken or out-of-repo link {target}')
        elif parts.fragment and destination.suffix == '.md' and unquote(parts.fragment) not in heading_ids(destination.read_text(encoding='utf-8')):
            errors.append(f'{path.relative_to(REPO)}: missing heading in {target}')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(skills)} skills, plugin and marketplace metadata, {len(automations)} opt-in automations, {links} relative links, and {len(files)} text files without long dashes.')
