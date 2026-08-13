# Registry v3 — v2 to v3 Production Migration Plan

Status: candidate plan only
Production execution: requires separate explicit Human Gate

## Goal

Move an existing Registry v2 installation from installation-authoritative Official Registry/Official Skill mirrors to Registry v3 dual-layer routing without deleting or overwriting recoverable v2 state during initial cutover.

## Preconditions

All must be true before production mutation:

- Registry v3 candidate contracts reviewed.
- Resolver fixtures 16/16 PASS.
- Clean-room acceptance PASS.
- Candidate Kernel canonical UTF-8 length remains <= 7800 characters target and <= 8000 hard limit.
- Candidate branch is not behind `main`, or conflicts have been revalidated.
- Exact production Descriptor/ENV/Registry/Brain/Artifact/Storage identities are freshly read from production.
- Explicit Human Gate for Canonical Distribution promotion and production migration is obtained.

## Migration principles

- No delete during initial cutover.
- No batch overwrite of legacy Official Skill mirrors.
- Existing v2 Official mirrors remain non-authoritative rollback evidence/cache.
- User-owned Brain, knowledge, templates, experience, error logs, outputs, and work artifacts remain untouched.
- Official Registry and Official Skills switch authority to one pinned GitHub snapshot.
- Local/teacher-owned Skills remain installation-owned and resolve through Artifact Index.
- Effective Routing View remains ephemeral.

## Stage 0 — Freeze and evidence capture

Read and record without modification:

1. production Bootstrap Descriptor
2. production ENV v2
3. production Registry v2
4. production Brain Index
5. production Artifact Index
6. storage root/artifacts/output/work_area
7. current GitHub `main` commit and intended v3 promotion commit

Verify that production resources match the expected installation and are not ambiguous.

## Stage 1 — Canonical promotion

Promotion bundle must be atomic at governance level and include at minimum:

- `00_PROJECT_INSTRUCTIONS.yaml`
- `00_EDUHARNESS_DISTRIBUTION.yaml`
- `00_EDUHARNESS_ENV_TEMPLATE.yaml`
- `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`
- `00_ADMIN/LOCAL_REGISTRY_TEMPLATE.yaml`
- `00_ADMIN/REGISTRY_V3_RUNTIME_RESOLVER.yaml`
- `00_ADMIN/REGISTRY_V3_RESOLVER_FIXTURES.yaml`
- `00_ADMIN/SKILLS/_META/cloud-bootstrap/SKILL.md`
- resolver validation tool + CI workflow
- Registry v3 / Local Registry contracts and validation docs

After merge, resolve `main` to an immutable promotion commit SHA. That commit becomes the v3 canonical snapshot candidate for production cutover.

## Stage 2 — Create Local Registry

Create a production Local Registry schema 1 in the existing installation Control Plane.

Initial state should be empty unless the installation already has teacher-owned Custom Skills that must be migrated. Do not copy Official Registry entries into Local Registry.

Validate namespace, mode, collision, relation, and Human Gate rules before proceeding.

## Stage 3 — Prepare ENV v3 without destroying ENV v2

Create a new ENV v3 resource or otherwise preserve a recoverable exact v2 ENV before switching authority.

ENV v3 must contain:

- `control_plane.local_registry`
- `control_plane.brain_index`
- `control_plane.artifact_index`
- storage roles
- runtime ephemeral state policy

ENV v3 must not contain an installation locator for Official Registry as authoritative source.

## Stage 4 — Validate dual-layer routing before cutover

Using the intended immutable promotion commit:

1. read Official Registry schema 3
2. validate Local Registry schema 1
3. validate cross-layer relations
4. build ephemeral Effective Routing View
5. read at least one Official Skill directly from the pinned snapshot
6. resolve each existing installation-owned Local artifact through Artifact Index
7. verify Project Human Gate precedence

Any failure stops the migration before Descriptor/ENV authority is switched.

## Stage 5 — Cut over installation entry

Update the production Bootstrap Descriptor only after ENV v3 and routing validation pass.

Descriptor must resolve the verified ENV v3. Do not delete ENV v2.

Immediately run fresh-start verification from Descriptor:

`Descriptor -> ENV v3 -> Local Registry/Brain/Artifact Index + pinned Official Distribution -> Effective Routing View`

## Stage 6 — Post-cutover acceptance

Required checks:

- Official Skill reads do not require Dropbox mirrors.
- Local artifacts still resolve through Artifact Index.
- Official + Local graph validates.
- Human Gate remains effective.
- storage output/work_area remain writable as before.
- fresh-start is repeatable.
- v2 Official Skill mirrors remain present but non-authoritative.

Only then mark production migration successful.

## Rollback strategy

Rollback is authority restoration, not data deletion.

Trigger rollback if any of the following occurs after cutover:

- Descriptor cannot resolve ENV v3.
- Official Distribution snapshot cannot be read consistently.
- Official Registry schema 3 fails validation.
- Local Registry/Artifact Index resolution fails for required Local artifacts.
- Effective Routing View is ambiguous or graph-invalid.
- Human Gate precedence is not preserved.
- fresh-start verification fails.

Rollback procedure:

1. stop new v3 writes except evidence logging
2. restore Bootstrap Descriptor to the preserved v2 ENV locator/configuration
3. restore v2 Registry authority
4. resume v2 Official Skill mirror resolution through existing Artifact Index bindings
5. verify a fresh v2 bootstrap
6. retain failed v3 resources for diagnosis; do not delete automatically

Rollback does not require removing the v3 GitHub release; it only returns the affected installation to its previous authority model.

## Deferred cleanup

Deletion or archival of legacy Official Skill mirrors, superseded ENV/Registry records, or clean-room resources is explicitly out of scope for initial migration and requires a separate Human Gate.

## Success state

`REGISTRY_V3_PRODUCTION_MIGRATION_VERIFIED`

This state may only be declared after tool-backed production fresh-start verification succeeds.
