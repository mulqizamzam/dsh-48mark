# Compatibility and test matrix

## Declared target

- DSH runtime: `0.2.1-rc.2` (exact version in `package.json`)
- Bundle contract: `dsh.bundle.patch`
- Plugin lifecycle: Cordis `name`, `inject`, and `apply(ctx)` exports
- Skill API: `ctx.skills.registerProvider(() => provider)` with candidate `list()` and definition `get()` methods
- Dependencies: peer/dev dependencies on `@deepseek-ai/cordis` and `@deepseek-ai/dsh-skill` at the target runtime version

## Expected local checks

| Check | Command | Evidence scope |
|---|---|---|
| Package and path validation | `npm run check` | Local manifest, bundle row, required files, assets, skill metadata, prohibited residue |
| Provider unit tests | `npm test` | Mocked skill-rank export and minimal registry contract |
| Combined local suite | `npm run verify` | Runs the two local checks above |
| Package installation | `dsh plugin --profile web add ...` | Must run in a machine with exact DSH and pnpm |
| Runtime smoke test | Restart profile, inspect composition, discover and load each skill | Must run inside exact DSH `0.2.1-rc.2` |
| User task smoke test | Execute one design, one audit, and one engineering task | Requires the actual harness session and workspace tools |

## Verification status

Source-level checks and isolated provider tests can be run without the DSH executable. Until the exact runtime smoke test is completed, installation and runtime behavior should be treated as unverified; the workflow table above separates those checks from local evidence.

## Upgrade policy

Do not widen `engines.dsh` or the peer dependency ranges because a later release appears similar. First test the exact new runtime in a disposable profile; update the supported range only after the provider API and active bundle composition both pass.
