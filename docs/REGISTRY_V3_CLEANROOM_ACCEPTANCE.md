# Registry v3 Clean-room Acceptance

Status: PASS (candidate)
Date: 2026-08-13
Scope: isolated ChatGPT Web + Notion + Dropbox + GitHub acceptance only
Production mutation: none
Canonical promotion: not performed

## Acceptance environment

- Installation: `eduHarness Registry v3 Cleanroom 2026-08-13 1503`
- Official distribution snapshot: immutable commit `b927a0f90a1215a1414ae14717ded26863b85ba7`
- Official Registry: schema 3, GitHub canonical snapshot
- Local Registry: schema 1, installation-owned Notion page
- Artifact Index: installation-owned Notion page
- Storage: isolated Dropbox root
- Effective Routing View: ephemeral

Installation-specific provider IDs are intentionally not copied into Canonical Distribution beyond this acceptance record.

## Verified results

1. Empty clean-room installation can be created without touching production.
2. Fresh installation does not copy the 17 Official Skills into Dropbox.
3. Bootstrap Descriptor resolves ENV schema 3.
4. ENV resolves Local Registry, Brain Index, Artifact Index, and storage only; it does not contain an Official Registry installation locator.
5. Official Registry schema 3 is read from the pinned GitHub snapshot.
6. `edu:lesson-plan-authoring` full Skill text is readable directly from the same pinned snapshot.
7. Local Skill `local:cleanroom-reading-coach` resolves through Local Registry -> Artifact Index -> Dropbox and works as `mode: extend` for capability `reading_coaching`.
8. Local Skill `local:cleanroom-lesson-plan` resolves through Local Registry -> Artifact Index -> Dropbox and works as explicit `mode: override` for `edu:lesson-plan-authoring`.
9. Project Human Gate precedence remains above Local override; Local configuration cannot lower Project governance.
10. A complete fresh-start from Bootstrap Descriptor reconstructs the same dual-layer routing state after both Local entries exist.
11. No production Notion, Dropbox, or GitHub `main` resource was modified.

## Executable resolver evidence

Separate GitHub Actions candidate validation already verified the Registry v3 resolver fixtures: 16/16 PASS.

The clean-room run validates the real provider resolution chain; the CI fixtures validate deterministic resolver semantics. Both are required evidence for promotion.

## Acceptance result

`REGISTRY_V3_CLEANROOM_ACCEPTANCE_PASS`

This result authorizes promotion planning only. It does not authorize GitHub `main` promotion or production migration.
