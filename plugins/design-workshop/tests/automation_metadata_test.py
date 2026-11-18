import unittest
from automation_metadata import validate_automation_metadata


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


if __name__ == '__main__':
    unittest.main()
