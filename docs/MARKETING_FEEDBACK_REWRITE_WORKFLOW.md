# Marketing question feedback and rewrite workflow

The source workbook `exports/marketing/Marketing_Competency_AI_Adoption_D1-D6.xlsx` is the marketing competency and questionnaire reference. It contains six dimensions (D1-D6), ten competencies (C01-C10), 30 pilot questions, answer keys, explanations, and marketing keywords.

Use sandbox feedback as the change evidence for these questions. A rewrite must preserve the source question's dimension, competency mapping, intended answer, and evidence level unless the feedback shows that the item is measuring the wrong skill. New questions should be added when the workbook identifies a coverage gap or when feedback shows that an existing item cannot be repaired without changing its construct.

For each imported feedback record, retain the stable question ID and record:

- review status: unreviewed, reviewed, or pending decision;
- change status: unchanged, rewritten, or new question;
- translation status: not required, incomplete, or complete;
- decision: pending, approve, revise, or reject;
- source workbook row and feedback export ID.

Do not treat the workbook as tester evidence. It is a content and competency reference. Tester evidence comes from hosted review feedback, including comments, ratings, clarity flags, artifact flags, decisions, and suggested changes.

Before publishing a revised marketing item, compare the old and new wording, verify the answer key and distractors, check the English and Thai versions, and rerun the inventory build and Cloudflare sandbox checks.
