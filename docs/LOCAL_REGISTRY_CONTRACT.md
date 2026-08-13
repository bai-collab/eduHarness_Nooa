# Local Registry Contract

Status: Candidate 0.1

## Purpose
Local Registry is the installation-owned overlay for teacher-created Skills and explicit local routing policy. It does not copy or mutate the Official Registry.

## Schema

```yaml
schema_version: 1
registry_kind: eduharness-local-registry
overlay_contract_version: 1
scope: installation
namespace: local
status: active
skills: []
policies:
  disabled_official_skills: []
```

## Storage and locator rule
The Local Registry locator is installation-specific and MUST be resolved from formal ENV/control-plane configuration. The Local Registry content itself SHOULD use logical identities and MUST NOT embed secrets, tokens, cookies, credentials, student PII, or unrelated provider locators.

## Local Skill entry
Required fields:
- `id`
- `namespace_id`
- `mode`
- `artifact_ref` for `extend`/`override`
- routing/selection fields needed for the capability

Example extend:

```yaml
- id: reading-coach
  namespace_id: local:reading-coach
  mode: extend
  artifact_ref: artifact://installation/skill/reading-coach
  capabilities: [reading_coaching]
  selection:
    triggers: [閱讀理解引導, 閱讀策略]
    excludes: []
  relations:
    requires: []
    enhances: []
    routes: []
    conflicts: []
    replaces: []
    supports: []
```

Example override:

```yaml
- id: my-lesson-plan
  namespace_id: local:my-lesson-plan
  mode: override
  overrides:
    target: edu:lesson-plan-authoring
  artifact_ref: artifact://installation/skill/my-lesson-plan
  capabilities: [lesson_plan_authoring]
```

## Mode rules
### extend
- Adds a Local candidate.
- MUST NOT claim an existing Official Primary responsibility without explicit override.
- Capability overlap that creates multiple plausible Primary candidates is `REGISTRY_CAPABILITY_CONFLICT`.

### override
- MUST target exactly one existing Official `edu:` Skill.
- MUST use a distinct Local `id` and `local:` namespace identity.
- Missing target fails closed.
- Two active Local entries overriding the same Official target fail closed.
- Override does not bypass Project governance or Human Gate.

### disable
Disable is represented by policy, not a fake Skill package:

```yaml
policies:
  disabled_official_skills:
    - edu:item-authoring
```

Only exact Official Skill identities may be disabled. Kernel/project governance cannot be disabled here.

## Namespace and identity rules
- `namespace` MUST equal `local`.
- each `namespace_id` MUST begin with `local:`.
- `id` MUST be unique within Local Registry.
- Local `id` MUST NOT equal any Official Skill `id`, even when the Local entry is an override.
- Local `namespace_id` MUST NOT equal or impersonate an Official `edu:` identity.
- Override therefore requires a distinct Local basename such as `my-lesson-plan`, not `lesson-plan-authoring`.

## Artifact rules
Local Skill package resolution:

```text
artifact://installation/skill/<id>
  -> installation Artifact Index
  -> provider stable identity/revision
  -> package
```

- Skill package is the managed unit; `SKILL.md` is required.
- Required subresources MUST be listed in the Artifact Index/package contract.
- Provider stable identity is authoritative over path when available.
- unresolved artifact -> `LOCAL_ARTIFACT_UNRESOLVED`.

## Relations
Local entries may reference:
- `edu:*` Official Skills;
- `local:*` Local Skills.

Official Registry entries may not reference Local Skills. This asymmetry preserves Official portability and means attempted cross-layer cycles are rejected before effective graph construction.

Typed relations retain their Registry semantics and MUST NOT be flattened:
- `requires`: mandatory load dependency;
- `enhances`: supporting load;
- `routes`: conditional handoff/recommendation;
- `conflicts`: simultaneous activation constraint;
- `replaces`: explicit migration/replacement semantic within allowed scope;
- `supports`: information-only relation.

## Routing guard rules
Local routing uses the same effective guard contract supported by the active Kernel/Official Registry:
- missing facts MUST NOT be treated as false;
- inferred/conflicting evidence MUST NOT silently become TRUE;
- automatic handoff requires confirmed TRUE;
- route evaluation stage must be explicit where required;
- Local Registry MUST NOT invent private unverifiable KeyPoints to force routing.

## Local Skill creation lifecycle
1. Bootstrap formal Descriptor -> ENV.
2. Resolve Local Registry + Artifact Index.
3. Load relevant Official/Local Skills for create-vs-extend analysis.
4. Build complete Local Skill package candidate.
5. Validate package, routing impact and graph.
6. Human Gate when required by Project or mutation scope.
7. Write package to installation Storage.
8. Read back provider identity/revision.
9. Add/update installation Artifact Index entry.
10. Add/update Local Registry entry.
11. Rebuild Effective Routing View.
12. Verify and read back before declaring available.

Creating a Local Skill does not modify GitHub Canonical Distribution.

## Upstream promotion
A teacher may propose a Local Skill for Official distribution through a separate contribution workflow. Promotion requires portability cleanup, tests, routing review and maintainer approval. Local usage does not require upstream approval.

## Validation failures
- `LOCAL_REGISTRY_INVALID`
- `LOCAL_SKILL_ID_COLLISION`
- `LOCAL_OVERRIDE_TARGET_NOT_FOUND`
- `LOCAL_OVERRIDE_CONFLICT`
- `REGISTRY_CAPABILITY_CONFLICT`
- `LOCAL_ARTIFACT_UNRESOLVED`
- `LOCAL_SKILL_UNAVAILABLE`

Unknown or ambiguous states fail closed; the resolver MUST NOT invent an override or choose a winner by source order.
