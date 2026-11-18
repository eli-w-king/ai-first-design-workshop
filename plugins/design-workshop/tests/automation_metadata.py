"""Validate the inert metadata of one advertised automation template."""
import re


def validate_automation_metadata(metadata, expected_schedule, seen_ids):
    if not isinstance(metadata, dict):
        raise ValueError('Automation frontmatter must be a mapping')
    required = {'version', 'id', 'name', 'schedule'}
    allowed = required | {'description'}
    if required - metadata.keys():
        raise ValueError('Automation is missing required identity or schedule fields')
    if metadata.keys() - allowed:
        raise ValueError('Automation template contains execution configuration or unknown fields')
    if type(metadata['version']) is not int or metadata['version'] != 1:
        raise ValueError('Automation version must be the integer 1')
    identifier = metadata['id']
    if not isinstance(identifier, str) or not re.fullmatch(r'[a-z0-9][a-z0-9.-]{0,63}', identifier):
        raise ValueError('Automation id must be a short lowercase identifier')
    if identifier in seen_ids:
        raise ValueError('Duplicate automation id')
    if not isinstance(metadata['name'], str) or not metadata['name'].strip():
        raise ValueError('Automation name must be a nonempty string')
    if 'description' in metadata and not isinstance(metadata['description'], str):
        raise ValueError('Automation description must be a string')
    if metadata['schedule'] != expected_schedule:
        raise ValueError('Automation schedule does not match its reviewed default')
    return identifier
