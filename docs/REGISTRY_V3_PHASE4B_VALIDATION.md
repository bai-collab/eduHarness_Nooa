# Registry v3 Phase 4B Validation

Status: PASS for candidate / NOT production-promoted

## Scope
Phase 4B adds Registry schema 3 Kernel support and an executable candidate resolver. No production installation or GitHub `main` mutation is included.

## Kernel candidate
- `00_PROJECT_INSTRUCTIONS.yaml` version: `eduHarness Cloud v2.1.0 Candidate`.
- Registry schema support: `[1, 2, 3]`.
- v1/v2 legacy routing path preserved.
- v3 precedence: Project > Local explicit policy > Official Registry > Skill self-routing.
- v3 Official Registry/Skill source: immutable pinned Distribution snapshot.
- v3 Local Registry source: formal ENV `control_plane.local_registry`.
- Effective Routing View persistence: ephemeral only.
- Local override cannot reduce Project Human Gate.
- Canonical UTF-8 source character count: 7764, within target `<=7800` and hard limit `<=8000`.

## Runtime resolver candidate
Contract: `00_ADMIN/REGISTRY_V3_RUNTIME_RESOLVER.yaml`.

Executable validator:
- `tools/registry-v3-resolver/resolver.mjs`
- `tools/registry-v3-resolver/test.mjs`
- fixture source: `00_ADMIN/REGISTRY_V3_RESOLVER_FIXTURES.yaml`

Validated behaviors include:
- Official only
- Local extend
- Local -> Official dependency
- explicit Local override
- Local disable
- basename ID collision
- namespace impersonation
- implicit capability collision
- missing override target
- duplicate override target
- Official -> Local forbidden dependency
- Local -> Local dependency
- Local requires cycle
- Project Human Gate preservation
- immutable snapshot consistency
- snapshot mismatch

## CI evidence
Workflow: `Registry v3 Resolver Candidate`.

GitHub Actions run: `31672762432`.
Job: `resolver-fixtures`.
Conclusion: `success`.

Test output: `Registry v3 resolver fixtures: 16/16 PASS`.

## Remaining boundaries
- Resolver is a candidate validation/reference implementation, not a hosted runtime service.
- Project Kernel candidate is not yet promoted to `main` or pasted into production Projects.
- Existing v2 production installations remain unchanged.
- v3 production cutover still requires clean-room bootstrap acceptance and explicit promotion Human Gate.

## Phase 4B conclusion
`REGISTRY_V3_KERNEL_AND_RESOLVER_CANDIDATE_PASS`

Next admissible stage: clean-room v3 bootstrap acceptance using the candidate branch, while preserving current production and v2 rollback resources.
