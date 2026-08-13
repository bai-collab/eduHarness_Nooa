# Registry v3 Promotion Checklist

Status: candidate
Purpose: Human-Gate checklist for promoting Registry v3 from candidate to Canonical Distribution and then migrating production.

## A. Candidate evidence

- [x] Registry v3 dual-layer contract exists.
- [x] Local Registry contract/template exists.
- [x] Official Registry schema 3 candidate exists.
- [x] Kernel candidate supports Registry schemas 1/2/3.
- [x] Kernel canonical text length verified within governance limit.
- [x] Executable resolver exists.
- [x] Resolver fixtures 16/16 PASS in GitHub Actions.
- [x] Clean-room Notion + Dropbox + GitHub acceptance PASS.
- [x] Local `extend` acceptance PASS.
- [x] Local explicit `override` acceptance PASS.
- [x] Project Human Gate precedence preserved.
- [x] Full clean-room fresh-start repeatable.

## B. Before Canonical promotion

Must be freshly rechecked immediately before merge:

- [ ] Candidate branch is not behind `main`.
- [ ] Full branch diff reviewed; no unrelated mutation included.
- [ ] Resolver CI is green on the exact promotion head.
- [ ] `00_PROJECT_INSTRUCTIONS.yaml` canonical UTF-8 character count reverified.
- [ ] Distribution manifest references are internally consistent.
- [ ] Official Registry still contains all expected Official Skills.
- [ ] Official artifact paths resolve from the exact candidate head.
- [ ] Migration and rollback plan reviewed.
- [ ] Explicit Human Gate granted for GitHub `main` promotion.

## C. Canonical promotion bundle

Treat these as one governance release:

- `00_PROJECT_INSTRUCTIONS.yaml`
- `00_EDUHARNESS_DISTRIBUTION.yaml`
- `00_EDUHARNESS_ENV_TEMPLATE.yaml`
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/LOCAL_REGISTRY_TEMPLATE.yaml`
- `00_ADMIN/REGISTRY_V3_RUNTIME_RESOLVER.yaml`
- `00_ADMIN/REGISTRY_V3_RESOLVER_FIXTURES.yaml`
- `00_ADMIN/SKILLS/_META/cloud-bootstrap/SKILL.md`
- `.github/workflows/registry-v3-resolver.yml`
- `tools/registry-v3-resolver/*`
- Registry v3 contract/validation/migration documentation

After merge:

- [ ] Record immutable `main` promotion commit SHA.
- [ ] Verify all required files at that SHA.
- [ ] Verify resolver CI for that SHA or equivalent protected-branch checks.

## D. Before production migration

- [ ] Explicit, separate Human Gate granted for production migration.
- [ ] Freshly discover production Bootstrap Descriptor.
- [ ] Read production ENV v2.
- [ ] Read production Registry v2.
- [ ] Read production Brain Index and Artifact Index.
- [ ] Verify production Dropbox storage identities.
- [ ] Capture exact rollback state.
- [ ] Confirm no deletion is planned during initial cutover.

## E. Production cutover

- [ ] Create/validate production Local Registry schema 1.
- [ ] Prepare ENV v3 while preserving recoverable v2 ENV.
- [ ] Pin Official Distribution to the immutable promoted commit.
- [ ] Validate Official Registry + Local Registry.
- [ ] Build Effective Routing View.
- [ ] Verify Official Skill direct read from GitHub.
- [ ] Verify Local artifact resolution through Artifact Index.
- [ ] Verify Human Gate precedence.
- [ ] Switch Descriptor to verified ENV v3.
- [ ] Run full fresh-start verification.

## F. Success / rollback decision

Only declare success when all production verification steps pass:

`REGISTRY_V3_PRODUCTION_MIGRATION_VERIFIED`

Otherwise execute the documented authority rollback to v2 and preserve v3 evidence for diagnosis.

## G. Deferred cleanup

The following are never part of the initial promotion/cutover unless separately approved:

- deleting legacy Official Skill Dropbox mirrors
- deleting v2 ENV/Registry resources
- deleting clean-room resources
- bulk-moving or rewriting teacher-owned artifacts
