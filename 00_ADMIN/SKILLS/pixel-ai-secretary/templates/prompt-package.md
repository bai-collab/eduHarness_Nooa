# Pixel AI Secretary Prompt Package

> v1 prompt-only workflow. Does not generate images, call APIs, or guarantee model-side face consistency.

## Capability And Limits
- Produce prompts, safety rewrites, validation checklists.
- Preserve identity wording across positive prompts.
- No image API / API-key management.

## Reference Handling
- Reference image: `[provided / not provided]`
- Provided → identity reference only.
- Not provided → Character Bible.

## Character Bible
`[insert Character Bible]`

## Step 1: Character Lock Sheet Prompt
`[identity lock + Character Bible + office scene + pixel style lock]`

## Step 2: Safe Action List
`[normalized one-action items]`

## Step 3: One-Action Four-View Prompt
For each action, combine identity lock + Character Bible + exactly one safe action + four-view lock + scene/style lock.

## Reusable One-Action Four-View Template
Replace `[SAFE_ACTION]` with exactly one normalized action.

## Negative Prompt
`[insert Negative Prompt]`

## Checklist
- [ ] Identity lock in every positive prompt.
- [ ] Pixel style lock in every positive prompt.
- [ ] One action per prompt.
- [ ] Four views fixed.
- [ ] Risky wording rewritten.
- [ ] Negative prompt present.
- [ ] No image/API call falsely reported.

Upstream source blob: `16c96be9554c27f059835744d5220255468e9d4b`.
