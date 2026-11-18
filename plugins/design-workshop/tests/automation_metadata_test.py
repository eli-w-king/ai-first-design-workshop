import unittest
from automation_metadata import validate_automation_metadata, default_read_dependencies


def manual():
    return {'version': 1, 'id': 'example-cards', 'name': 'Example cards', 'schedule': {'kind': 'manual'}}


class AutomationMetadataTests(unittest.TestCase):
    def test_requires_identity_and_schedule(self):
        validate_automation_metadata(manual(), {'kind': 'manual'}, set())
        for field in ['id', 'name', 'schedule']:
            with self.subTest(field=field):
                value = manual()
                del value[field]
                with self.assertRaises(ValueError):
                    validate_automation_metadata(value, {'kind': 'manual'}, set())
        with self.assertRaises(ValueError):
            validate_automation_metadata({**manual(), 'name': ' '}, {'kind': 'manual'}, set())

    def test_rejects_embedded_execution_settings(self):
        for field in ['enabled', 'workspace', 'model', 'permissions']:
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, 'execution configuration'):
                validate_automation_metadata({**manual(), field: True}, {'kind': 'manual'}, set())

    def test_rejects_ambiguous_or_invalid_identity(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            validate_automation_metadata(manual(), {'kind': 'manual'}, {'example-cards'})
        for identifier in ['UPPERCASE', 'contains spaces', 'x' * 65, None]:
            with self.subTest(identifier=identifier), self.assertRaises(ValueError):
                validate_automation_metadata({**manual(), 'id': identifier}, {'kind': 'manual'}, set())

    def test_preserves_reviewed_schedule_and_version_types(self):
        with self.assertRaisesRegex(ValueError, 'reviewed default'):
            validate_automation_metadata({**manual(), 'schedule': {'kind': 'hourly'}}, {'kind': 'manual'}, set())
        for version in [True, '1', 2]:
            with self.subTest(version=version), self.assertRaises(ValueError):
                validate_automation_metadata({**manual(), 'version': version}, {'kind': 'manual'}, set())


class DefaultReadBoundaryTests(unittest.TestCase):
    def test_skill_guides_are_allowed_only_in_optional_detail(self):
        link = '[guide](references/guide.md)'
        self.assertEqual(default_read_dependencies('# Task\nRead ' + link, True), ['references/guide.md'])
        self.assertEqual(default_read_dependencies('# Task\nInline steps.\n## Optional detail\n' + link, True), [])

    def test_generated_examples_do_not_create_read_dependencies(self):
        example = '# Task\n```markdown\n[local note](notes/one.md)\n```\nInline instructions.\n'
        self.assertEqual(default_read_dependencies(example, True), [])
        self.assertEqual(default_read_dependencies('# Task\n[local](file:///outside/guide.md)', True), ['file:///outside/guide.md'])

    def test_automation_cannot_hide_a_guide_in_an_optional_section(self):
        prompt = 'Write a draft.\n## Optional detail\n[guide](../skills/taste/references/guide.md)'
        self.assertEqual(default_read_dependencies(prompt, False), ['../skills/taste/references/guide.md'])
        self.assertEqual(default_read_dependencies('Read notes/ and write draft/output.md using these inline steps.', False), [])


if __name__ == '__main__':
    unittest.main()
