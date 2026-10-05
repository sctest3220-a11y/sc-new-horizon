# Dated question inventory versions

Publication authorized on 5 October 2026: the user requested pushing this snapshot, its supporting tools and the accumulated inventory updates to `kj-dee-branch`. Future snapshots still require a separate publication request. Snapshot files retain LF line endings across Git checkouts so their integrity hashes remain stable.

The current local consolidated review version is **2026.10.05 V.0**, created at the user's request on 5 October 2026. It captures the complete draft and live review inventory, with all saved reviewed revisions applied. Items not individually reviewed retain their pending status. A version name is not approval for a scored release, proof of resolved content issues, or approval of pending Thai translations.

## Naming and preservation

Use `YYYY.MM.DD V.N`, with `V.0` for the first snapshot on a date and `V.1`, `V.2` and so on for later snapshots that day. Do not overwrite a saved version. The generator refuses duplicate versions, and the asset builder checks each snapshot's SHA-256 hash before building it.

- `exports/review-inventory/versions.json` records versions, their membership, review provenance and Thai synchronization status.
- `exports/review-inventory/versions/2026.10.05-V.0.json` contains the frozen complete question records, including original audit wording, latest saved user-facing wording, choices, keys, scores, explanations, artifact decisions and review status.
- The original audit version remains unchanged inside each question. `live-bank` describes its source, not the date of the revised English wording.
- The latest rules remain approved v2.1 plus provisional v2.2-draft, with artifact standard v1.3. The inventory snapshot name does not rename these standards.
- Earlier wording and original artifact plans remain in the existing wording-refinement history and review log. Chat-only candidates or artifacts not yet integrated into the inventory are not silently promoted by taking a snapshot.

## Local review

Select **2026.10.05 V.0 (latest review)** in the Version filter to load its saved snapshot across both draft and live sources. The source, domain, role and other filters still apply. All versions shows the current working inventory. Original audit version filters remain separately labeled; they are not historical snapshots of the user-facing wording.

Later edits affect the working inventory only until another dated snapshot is explicitly generated. Saved version pages load version-specific index and detail files, so future working-copy wording changes do not silently change a saved version. Existing browser reviewer activity remains linked to question IDs; it is not a separate version-specific sign-off.

To create another authorized local snapshot:

```powershell
node scripts/create-review-inventory-version.mjs 'YYYY.MM.DD V.N'
```

Then verify that `public/review-inventory` resolves inside this checkout and is not a reparse point before running the asset builder. Run `node scripts/build-review-inventory-assets.mjs`, then `node --test scripts/test-review-inventory-versions.mjs`. The generator does not rewrite questions, translate Thai, commit, or push. Publish only when the user explicitly requests it.
