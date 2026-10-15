import json
import re
import difflib
import os
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path('/Users/SC/Documents/New Horizon/app')
FEEDBACK = Path(os.environ.get('REWRITE_FEEDBACK_FILE', '/Users/SC/Downloads/question-feedback-2026-10-03.json'))
QUESTIONS = ROOT / 'exports/review-inventory/questions.json'
LIVE_QUESTIONS = ROOT / 'exports/review-inventory/live-questions.json'
OUT = Path(os.environ.get('REWRITE_OUTPUT_FILE', str(ROOT / 'outputs/New_Horizon_Initial_Feedback_Rewrite_Translation_Review.docx')))

def shade(cell, fill):
    props = cell._tc.get_or_add_tcPr()
    shd = props.find(qn('w:shd'))
    if shd is None:
        shd = OxmlElement('w:shd')
        props.append(shd)
    shd.set(qn('w:fill'), fill)

def borders(table, color='D9D9D9', size='6'):
    tblPr = table._tbl.tblPr
    b = tblPr.first_child_found_in('w:tblBorders')
    if b is None:
        b = OxmlElement('w:tblBorders')
        tblPr.append(b)
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        tag = 'w:' + edge
        el = b.find(qn(tag))
        if el is None:
            el = OxmlElement(tag)
            b.append(el)
        el.set(qn('w:val'), 'single')
        el.set(qn('w:sz'), size)
        el.set(qn('w:color'), color)

def cell_padding(cell, top=100, start=130, bottom=100, end=130):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = tcPr.first_child_found_in('w:tcMar')
    if tcMar is None:
        tcMar = OxmlElement('w:tcMar')
        tcPr.append(tcMar)
    for side, value in [('top', top), ('start', start), ('bottom', bottom), ('end', end)]:
        node = tcMar.find(qn(f'w:{side}'))
        if node is None:
            node = OxmlElement(f'w:{side}')
            tcMar.append(node)
        node.set(qn('w:w'), str(value))
        node.set(qn('w:type'), 'dxa')

def add_label_para(cell, label, text, color='142638'):
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(label)
    run.bold = True
    run.font.color.rgb = RGBColor.from_string(color)
    p.add_run(text or '—')
    return p

def add_diff_label_para(cell, label, before, after, side='right'):
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    lead = p.add_run(label)
    lead.bold = True
    lead.font.color.rgb = RGBColor.from_string('142638')
    # Compare meaningful tokens rather than broad replace blocks. This avoids
    # highlighting unchanged words that happen to sit inside a changed sentence
    # and treats Thai letter runs as comparable units instead of one whitespace-
    # separated token.
    token_pattern = r'\s+|[ก-๙]+|[A-Za-z0-9_]+|[^\w\s]'
    before_tokens = re.findall(token_pattern, before or '')
    after_tokens = re.findall(token_pattern, after or '')
    # Highlight only the actual removed span on the left or inserted/replaced
    # span on the right. SequenceMatcher preserves order and avoids marking
    # unchanged words merely because they occur elsewhere in the question.
    shown_tokens = after_tokens if side == 'right' else before_tokens
    sm = difflib.SequenceMatcher(a=before_tokens, b=after_tokens, autojunk=False)
    changed_indices = set()
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag != 'equal':
            changed_indices.update(range(j1, j2) if side == 'right' else range(i1, i2))
    for idx, token in enumerate(shown_tokens):
        run = p.add_run(token)
        if idx in changed_indices and not token.isspace():
            run.font.highlight_color = WD_COLOR_INDEX.YELLOW
    return p

def add_change_note(cell, text):
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    run.bold = True
    run.font.highlight_color = WD_COLOR_INDEX.YELLOW
    return p

def add_text(cell, text, style=None):
    for index, line in enumerate((text or '—').split('\n')):
        p = cell.add_paragraph(style=style)
        p.paragraph_format.space_after = Pt(3)
        p.add_run(line)
    return cell

def question_text(q, thai=False):
    context = (q.get('th') or {}).get('context') if thai else q.get('context')
    prompt = (q.get('th') or {}).get('prompt') if thai else q.get('prompt')
    options = q.get('options') or []
    chunks = [context or '', prompt or '']
    for option in options:
        label = option.get('thLabel') if thai else option.get('label')
        chunks.append(f"{option.get('id', '').upper()}. {label or ''}")
    return '\n'.join(x for x in chunks if x)

def draft_text(q, thai=False):
    draft = q.get('userFacingDraft') or {}
    trans = draft.get('th') or {}
    context = trans.get('context') if thai else draft.get('context')
    prompt = trans.get('prompt') if thai else draft.get('prompt')
    chunks = [context or '', prompt or '']
    parts = draft.get('parts') or []
    if parts:
        for part in parts:
            part_prompt = part.get('thPrompt') if thai else part.get('prompt')
            chunks.append(part_prompt or '')
            for option in part.get('options') or []:
                label = option.get('thLabel') if thai else option.get('label')
                chunks.append(f"{option.get('id', '').upper()}. {label or ''}")
    else:
        for option in draft.get('options') or []:
            label = option.get('thLabel') if thai else option.get('label')
            chunks.append(f"{option.get('id', '').upper()}. {label or ''}")
    explanation = trans.get('explanation') if thai else draft.get('explanation')
    if explanation:
        chunks.append(('คำอธิบาย: ' if thai else 'Explanation: ') + explanation)
    return '\n'.join(x for x in chunks if x)

def concise_draft_text(q, thai=False):
    """Create a review proposal from the latest draft without changing source data."""
    draft = q.get('userFacingDraft') or {}
    trans = draft.get('th') or {}
    # Where the reviewer supplied a concrete suggested revision, use it as the
    # editorial source for the English proposal. This ensures the rewrite is
    # driven by the feedback rather than only by formatting cleanup.
    if not thai:
        entries = feedback.get('questions', {}).get(q.get('id'), [])
        suggestions = [
            e.get('suggestedChange', '').strip()
            for e in entries
            if e.get('suggestedChange')
            # Some reviewers wrote their suggested change entirely in Thai.
            # Those notes belong in the feedback section, not the English
            # question column.
            and len(re.findall(r'[ก-๙]', e.get('suggestedChange', ''))) <= 5
        ]
        if suggestions:
            proposal = suggestions[-1]
            # Prefer plain terms that Thai testers are more likely to use.
            replacements = {
                'Cross-functional professional': 'A staff member working with several departments',
                'cross-functional professional': 'a staff member working with several departments',
                'cross-functional team': 'team from several departments',
                'Cross-functional team': 'Team from several departments',
                'frontline team': 'customer-facing team',
                'frontline teams': 'customer-facing teams',
            }
            for old, new in replacements.items():
                proposal = proposal.replace(old, new)
            return proposal
    context = trans.get('context') if thai else draft.get('context')
    prompt = trans.get('prompt') if thai else draft.get('prompt')
    parts = draft.get('parts') or []
    lines = []
    if context:
        # Remove common scaffolding labels and keep the latest draft's evidence.
        context = re.sub(r'^(Scenario|สถานการณ์):\s*', '', context.strip())
        context = re.sub(r'\n+(Use|Rule|Risk|Evidence|Extra function cue|ข้อมูลที่ใช้|ข้อกำหนด|ความเสี่ยง|หลักฐาน|เงื่อนไขเพิ่มเติมของสายงาน):\s*', ' ', context)
        context = re.sub(r'\s+', ' ', context).strip()
        lines.append(context)
    if parts:
        for part in parts:
            part_prompt = part.get('thPrompt') if thai else part.get('prompt')
            if part_prompt:
                lines.append(part_prompt.strip())
            for option in part.get('options') or []:
                label = option.get('thLabel') if thai else option.get('label')
                if label:
                    lines.append(f"{option.get('id', '').upper()}. {label.strip().rstrip('.')}")
    else:
        if prompt and not re.search(r'Answer both questions|ตอบทั้งสองข้อ', prompt):
            lines.append(prompt.strip())
        for option in draft.get('options') or []:
            label = option.get('thLabel') if thai else option.get('label')
            if label:
                lines.append(f"{option.get('id', '').upper()}. {label.strip().rstrip('.')}")
    result = '\n'.join(lines)
    if not thai:
        result = result.replace('Cross-functional professional', 'A staff member working with several departments')
        result = result.replace('cross-functional professional', 'a staff member working with several departments')
        result = result.replace('cross-functional team', 'team from several departments')
        result = result.replace('frontline team', 'customer-facing team')
    return result

def short_feedback(entries):
    bits = []
    for entry in entries:
        if entry.get('decision'):
            bits.append(f"Decision: {entry['decision']}")
        if entry.get('rating') is not None:
            bits.append(f"Rating: {entry['rating']}/5")
        if entry.get('clarity'):
            bits.append(f"Clarity: {entry['clarity']}")
        if entry.get('artifact'):
            bits.append(f"Artifact: {entry['artifact']}")
        if entry.get('comment'):
            bits.append('Reviewer comment: ' + entry['comment'].strip())
        if entry.get('suggestedChange'):
            suggestion = entry['suggestedChange'].strip()
            if len(suggestion) > 900:
                suggestion = suggestion[:897] + '...'
            bits.append('Reviewer suggestion: ' + suggestion)
    return '\n'.join(bits) or 'No written feedback recorded.'

feedback = json.loads(FEEDBACK.read_text())
if 'batches' in feedback:
    # Normalize the hosted inventory export to the original question->entries
    # shape used by this review document generator.
    feedback = {'questions': {qid: value.get('entries', []) for qid, value in feedback.get('questions', {}).items()}}
payload = json.loads(QUESTIONS.read_text())
live_payload = json.loads(LIVE_QUESTIONS.read_text()) if LIVE_QUESTIONS.exists() else {'questions': []}
questions = {q['id']: q for q in [*payload['questions'], *live_payload['questions']]}
reviewed = []
for qid, entries in feedback['questions'].items():
    if qid in questions:
        reviewed.append((questions[qid], entries))

def role_name(q):
    labels = q.get('functionLabels') or []
    if labels:
        return labels[0]
    qid = q.get('id', '')
    role_map = {
        'CUSTOMERSERVICE': 'Customer service',
        'MARKETING': 'Marketing',
        'TECHNICAL': 'Technical / engineering',
        'PEOPLE': 'People / HR',
        'GENERAL': 'General / cross-functional',
    }
    for key, label in role_map.items():
        if key in qid:
            return label
    if qid.startswith(('NH-CORE-', 'ADV-', 'TREND-', 'DEPTH-')):
        return 'General / cross-functional'
    return 'Other'

# Tester distribution order: role, domain, difficulty, then stable question ID.
reviewed.sort(key=lambda item: (
    role_name(item[0]).casefold(),
    (item[0].get('domain') or 'Unspecified').casefold(),
    (item[0].get('difficulty') or 'Unspecified').casefold(),
    item[0].get('id', ''),
))

doc = Document()
section = doc.sections[0]
section.orientation = WD_ORIENT.LANDSCAPE
section.page_width, section.page_height = section.page_height, section.page_width
section.top_margin = Inches(0.55)
section.bottom_margin = Inches(0.55)
section.left_margin = Inches(0.6)
section.right_margin = Inches(0.6)

styles = doc.styles
styles['Normal'].font.name = 'Sukhumvit Set Text'
styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'), 'Sukhumvit Set Text')
styles['Normal'].font.size = Pt(9)
styles['Title'].font.name = 'Sukhumvit Set Text'
styles['Title']._element.rPr.rFonts.set(qn('w:eastAsia'), 'Sukhumvit Set Text')
styles['Title'].font.size = Pt(20)
styles['Title'].font.bold = True
styles['Title'].font.color.rgb = RGBColor(0, 0, 0)
for name, size in [('Heading 1', 14), ('Heading 2', 11)]:
    styles[name].font.name = 'Sukhumvit Set Text'
    styles[name]._element.rPr.rFonts.set(qn('w:eastAsia'), 'Sukhumvit Set Text')
    styles[name].font.size = Pt(size)
    styles[name].font.bold = True
    styles[name].font.color.rgb = RGBColor(0, 0, 0)

title = doc.add_paragraph(style='Title')
title.add_run('Initial Feedback Rewrite and Translation Review')
subtitle = doc.add_paragraph()
subtitle.add_run('Draft for tester distribution · 203 reviewed questions · 4 October 2026').italic = True
intro = doc.add_paragraph()
intro.add_run('Purpose. ').bold = True
intro.add_run('This document presents the current question beside a concise proposed rewrite and retranslation for tester review. It is a review-only draft. No question database, inventory export, version history, or sandbox asset has been updated.')
intro2 = doc.add_paragraph()
intro2.add_run('How to review. ').bold = True
intro2.add_run('Check meaning, answerability, construct alignment, English clarity, Thai naturalness, answer-key equivalence, and reading load. Treat the right column as a proposal, not an approved version.')

rules_heading = doc.add_paragraph(style='Heading 1')
rules_heading.add_run('Rewrite and retranslation rules for this review')
rules_intro = doc.add_paragraph('These rules explain the changes used in the right-hand column. If testers approve the approach, apply the same rules to other unreviewed draft questions after human review.')
rules = [
    'Preserve the tested competency, difficulty, evidence boundary, answer key, and interaction type.',
    'Use one concrete role and one realistic situation; remove generic labels such as cross-functional professional when a role can be named.',
    'Use AI consistently when the subject is the AI system; do not use assistant, system, or workspace when that could mean a human or another component.',
    'Ask one direct question at a time. Keep separate parts only when they measure separate decisions.',
    'Keep only evidence needed to answer the question. Remove policy, approval, risk, or profile details that do not affect the key.',
    'Make the answer options parallel, concise, and mutually distinguishable. Do not combine two decisions inside one option.',
    'Use plain language before technical terms. Retain technical terms only when they are part of the competency or add a short explanation.',
    'Translate meaning and evidence, not English sentence structure. Keep the Thai version natural, complete, and equivalent in difficulty and key.',
    'Do not publish partially translated content. Check the scenario, prompt, options, feedback, explanation, and visible artifact text together.',
    'Target approximately 45–75 English words for awareness/applied items and 75–110 for proficient/advanced items, excluding options.',
]
for rule in rules:
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(2)
    p.add_run(rule)
doc.add_paragraph('These are proposed editing rules for tester feedback and are not yet a new approved rewrite standard.')
legend = doc.add_paragraph()
legend.add_run('Change marking. ').bold = True
legend.add_run('Yellow highlighting marks the portions being changed: cut or removed text is highlighted in the left-hand column, while added or replacement text is highlighted in the right-hand column. English and Thai are compared separately.')

summary = doc.add_paragraph()
summary.add_run('Scope: ').bold = True
summary.add_run(f"{len(reviewed)} questions with feedback entries from {feedback.get('exportedAt', 'the initial test round')}. Each record includes question metadata, reviewer feedback, and an English/Thai before-and-after comparison.")

for index, (q, entries) in enumerate(reviewed, 1):
    role = role_name(q)
    domain = q.get('domain') or 'Unspecified'
    competency = q.get('competencyLabel') or 'Unspecified'
    difficulty = q.get('difficulty') or 'Unspecified'
    source = q.get('sourceInventory') or 'draft'
    h = doc.add_paragraph(style='Heading 1')
    h.add_run(f"{index}. {q['id']}")
    meta = doc.add_paragraph()
    meta.paragraph_format.space_after = Pt(4)
    for label, value in [('Role', role), ('Domain', domain), ('Competency', competency), ('Difficulty', difficulty), ('Source', source)]:
        r = meta.add_run(f"{label}: ")
        r.bold = True
        meta.add_run(f"{value}    ")

    feedback_heading = doc.add_paragraph()
    feedback_heading.add_run('User feedback').bold = True
    feedback_heading.paragraph_format.space_after = Pt(2)
    feedback_para = doc.add_paragraph(short_feedback(entries))
    feedback_para.paragraph_format.space_after = Pt(6)

    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    borders(table)
    widths = [Inches(4.9), Inches(4.9)]
    for i, cell in enumerate(table.rows[0].cells):
        cell.width = widths[i]
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
        cell_padding(cell)
        shade(cell, 'DCE6F1' if i == 0 else 'E2F0D9')
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run('LATEST CURRENT DRAFT' if i == 0 else 'PROPOSED CONCISE REWRITE AND RETRANSLATION')
        run.bold = True
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0, 0, 0)
    english = table.add_row().cells
    thai = table.add_row().cells
    for cell in (*english, *thai):
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
        cell_padding(cell)
    for row_cells in (english, thai):
        shade(row_cells[0], 'F7F9FC')
        shade(row_cells[1], 'F7FBF4')
    current_en = draft_text(q, False)
    proposed_en = concise_draft_text(q, False)
    current_th = draft_text(q, True)
    proposed_th = concise_draft_text(q, True)
    add_diff_label_para(english[0], 'English\n', current_en, proposed_en, 'left')
    add_diff_label_para(english[1], 'English\n', current_en, proposed_en, 'right')
    add_diff_label_para(thai[0], 'Thai\n', current_th, proposed_th, 'left')
    add_diff_label_para(thai[1], 'Thai\n', current_th, proposed_th, 'right')
    for cell in (*english, *thai):
        for p in cell.paragraphs:
            p.paragraph_format.space_after = Pt(3)
            for run in p.runs:
                run.font.size = Pt(8.5)
    # Keep the English and Thai blocks vertically paired across both columns.
    # The explanatory note sits below the comparison so it does not offset
    # either language relative to its counterpart.
    add_change_note(doc, 'Change note: concise wording; redundant instructions or explanations removed where applicable. / หมายเหตุการเปลี่ยนแปลง: ย่อถ้อยคำ และตัดคำสั่งหรือคำอธิบายที่ซ้ำเมื่อไม่จำเป็น')
    note = doc.add_paragraph()
    note.paragraph_format.space_after = Pt(10)
    note.add_run('Draft status: ').bold = True
    note.add_run('Proposed for tester review only; not recorded as a new version.')

doc.add_paragraph('End of review draft', style='Heading 1')
OUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUT)
print(OUT)
print(f'questions={len(reviewed)}')
