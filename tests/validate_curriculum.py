"""Check curriculum transcription, source integrity and required-credit totals.

Run from any directory: python3 tests/validate_curriculum.py
Uses only the Python standard library. Elective options are intentionally not
summed: the original plans contain mutually exclusive options.
"""
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'assets/curriculum/catalog.json').read_text())
PROGRAMS = {p['id']: p for p in DATA['programs']}


class CurriculumChecks(unittest.TestCase):
    def test_original_documents_and_browser_data(self):
        self.assertEqual(DATA['year'], 115)
        self.assertEqual(len(DATA['documents']), 3)
        for doc in DATA['documents']:
            source = (ROOT / doc['url']).read_bytes()
            self.assertTrue(source.startswith(b'%PDF'))
            self.assertEqual(hashlib.sha256(source).hexdigest(), doc['sha256'])
        js = (ROOT / 'assets/curriculum-data.js').read_text()
        browser_data = json.loads(js.split('const CURRICULUM = ', 1)[1].strip().removesuffix(';'))
        self.assertEqual(browser_data, DATA)

    def test_programs_and_required_totals(self):
        self.assertEqual({p['name'] for p in PROGRAMS.values()}, {
            '機械科', '配管科', '商業經營科', '會計事務科',
            '資料處理科', '應用英語科', '綜合職能科', '體育班',
        })
        self.assertEqual(sum(len(p['courses']) for p in PROGRAMS.values()), 469)
        for program in PROGRAMS.values():
            with self.subTest(program=program['name']):
                base = '必修' if program['id'] == 'sports' else '部定必修'
                courses = program['courses']
                self.assertEqual(sum(c['credits'] for c in courses if c['requirement'] == base), program['required'])
                self.assertEqual(sum(c['credits'] for c in courses if c['requirement'] == '校訂必修'), program['schoolRequired'])
                self.assertEqual(program['required'] + program['schoolRequired'] + program['elective'], program['total'])
                self.assertEqual(program['total'], 182 if program['id'] == 'sports' else 187 if program['id'] == 'service' else 188)

    def test_semester_transcription_and_page_references(self):
        docs = {d['id']: d for d in DATA['documents']}
        for program in PROGRAMS.values():
            for course in program['courses']:
                with self.subTest(program=program['name'], course=course['name']):
                    self.assertEqual(len(course['semesters']), 6)
                    self.assertTrue(all(value.isdigit() or value.startswith('(') and value.endswith(')') and value[1:-1].isdigit() for value in course['semesters']))
                    # Parenthesized alternatives/special arrangements are not added.
                    self.assertEqual(sum(int(s) for s in course['semesters'] if s.isdigit()), course['credits'])
                    self.assertIn(course['page'], program['pages'])
                    self.assertLessEqual(course['page'], docs[program['doc']]['pages'])
                    self.assertFalse(course['name'].startswith(('備', '查', '版')))

    def test_representative_courses_against_source_tables(self):
        cases = [
            ('mechanical', '機械製圖實習', 6, ['3', '3', '0', '0', '0', '0'], 28),
            ('piping', '工業配管實習', 4, ['0', '0', '0', '0', '2', '2'], 31),
            ('data', '程式語言與設計', 4, ['2', '2', '0', '0', '0', '0'], 37),
            ('english', '外語簡報實務', 4, ['0', '0', '2', '2', '0', '0'], 39),
            ('service', '飲食調理實作', 6, ['0', '0', '3', '3', '0', '0'], 18),
            ('sports', '運動傷害防護', 2, ['0', '0', '1', '1', '0', '0'], 13),
        ]
        for program, name, credits, semesters, page in cases:
            course = next(c for c in PROGRAMS[program]['courses'] if c['name'] == name)
            self.assertEqual((course['credits'], course['semesters'], course['page']), (credits, semesters, page))


if __name__ == '__main__':
    unittest.main(verbosity=2)
