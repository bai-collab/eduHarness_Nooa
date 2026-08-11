# Registry v2 Pre-Cutover Verification Report

Status: READY FOR FINAL HUMAN GATE  
Runtime SSOT changed: **No**  
Current runtime Registry: `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml` schema v1  
Cutover candidate: `docs/REGISTRY_V2_CUTOVER_CANDIDATE.yaml` schema v2

## 1. Completed work

The following phases are complete:

1. Registry v1 graph audit.
2. Registry Graph Schema v2 specification.
3. 16-Skill shadow Registry candidate.
4. Static graph validation.
5. v1 vs v2 routing regression fixtures and report.
6. Adjudication of Phase 3 review items.
7. Portable Kernel update with backward-compatible Registry schema v1/v2 routing contract.
8. Registry v2 cutover candidate generation.

## 2. Adjudicated architecture decisions

### Reasoning relation

`edu:conjecturing-five-stage` uses:

```text
enhances[reasoning_policy.activation] -> edu:reasoning-kernel
```

It does not use an unconditional `requires` relation.

`edu:conjecturing-five-stage-facilitator` uses:

```text
enhances[stage_3_validation] -> edu:reasoning-kernel
```

### Route ordering

Registry v2 uses one `routes` relation type with optional:

```yaml
evaluation: entry | post_execution
```

Current migrated routes are marked `evaluation: entry` because their guards are based on task/input state.

Runtime order is:

```text
Selection
→ provisional Primary Skill
→ entry routes
→ confirm Primary Skill
→ requires
→ enhances
→ execute
→ post-execution routes
→ verify
```

Route loops are bounded by repeated-node-state stop and `max_route_hops: 5`.

## 3. Kernel compatibility

Canonical `00_PROJECT_INSTRUCTIONS.yaml` is now `eduHarness Cloud v1.4.0 Portable Kernel`.

It declares support for Registry schema versions 1 and 2.

Therefore existing installations that still have Registry schema v1 remain compatible while the canonical Registry has not yet been cut over.

## 4. Candidate graph status

Expected graph properties:

- 16 unique Skill namespace nodes.
- canonical `edu:*` relation references.
- all relation targets resolve.
- `requires` graph is acyclic.
- no self dependencies.
- no replacement cycles.
- no hard require/conflict contradictions.
- route evaluation values are `entry` or `post_execution` only.
- route cycles are permitted only with loop protection.

No blocking graph regression was found in the Phase 3 regression suite.

## 5. Remaining operation

The remaining governance-changing operation is:

```text
replace canonical runtime Registry
00_ADMIN/00_EDU_SKILL_REGISTRY.yaml (schema v1)
with validated Registry v2 cutover content
```

After replacement, required follow-up verification is:

1. read back canonical Registry and confirm `schema_version: 2`;
2. confirm graph policy and 16 Skill nodes are present;
3. confirm Distribution still references `00_ADMIN/00_EDU_SKILL_REGISTRY.yaml`;
4. preserve the previous v1 blob/commit as rollback source;
5. verify an installed Cloud runtime through its ENV before declaring migration fully complete.

## 6. Gate

Changing the canonical Registry runtime SSOT is a major Registry/routing governance change and may affect installed Cloud runtimes after synchronization or installation.

Therefore the cutover MUST NOT occur until explicit final Human Gate approval is received.

Current state:

`PRE_CUTOVER_READY_AWAITING_FINAL_HUMAN_GATE`
