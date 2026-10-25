# dsh-48mark

**Design and product-engineering workflows for DeepSeek Harness.**

`dsh-48mark` is an independently implemented DSH bundle that provides four on-demand skills for building product interfaces, redesigning existing experiences without losing behavior, auditing UI quality, and handling related engineering work. It uses DSH's native skill-provider registry and stores its instruction files inside the package.

Creator and owner: **mulqizamzam**

## What it includes

| Skill | Use it for | Output |
|---|---|---|
| `48mark-build` | Build a new interface or product flow from a brief | Runnable UI or focused code change, with actual verification results |
| `48mark-redesign` | Restyle or restructure an existing app | Redesigned UI plus a preservation check for routes, data, forms, and behavior |
| `48mark-audit` | Review a UI before or after implementation | Prioritized, evidence-based findings and remaining risks |
| `48mark-engineer` | Debug, test, automate, document, or integrate software | Minimal patch, regression coverage, and an honest test report |

The skills guide the harness to use only tools actually available in the current session. They do not add file, browser, shell, Python, network, credential, or deployment permissions. The bundle does not call a remote service, collect credentials, or send telemetry.

## Requirements

- DeepSeek Harness **`0.2.1-rc.2`**. The manifest pins this exact runtime version to avoid assuming a later prerelease has a compatible contract.
- Node.js and pnpm as required by the installed DSH distribution. `dsh plugin` forwards package management to pnpm.
- Network access only for installing from GitHub/package registries; the installed bundle itself reads its own packaged skill files locally.

**Compatibility note:** the source package and tests can be inspected without DSH, but the DSH executable is not bundled. This repository's compatibility with the exact runtime must be confirmed by an installation smoke test in an environment that has DSH `0.2.1-rc.2` installed.

## Install

### From GitHub (after a tagged release exists)

```bash
dsh plugin --profile web add "github:mulqizamzam/dsh-48mark#v0.1.0"
```

Restart the selected DSH profile after installation. Replace `web` with your target profile, such as `tui` or `sdk`, if that is where you work.

### From a local checkout

Clone or unpack this project, then install the local package into the profile:

```bash
git clone https://github.com/mulqizamzam/dsh-48mark.git
cd dsh-48mark
dsh plugin --profile web add "link:$PWD"
```

On Windows PowerShell, use a full path in the `link:` source, for example `link:C:/work/dsh-48mark`.

> The GitHub command works after the repository and matching tag are published. Until then, use the local checkout or the release archive.

## Configure and verify

The bundle has no user-specific configuration, no environment variables, and no external service credentials. Its manifest contributes one bundle layer, and its plugin registers the four skills with DSH's shared `ctx.skills` registry.

1. Confirm the version: `dsh --version` should report `0.2.1-rc.2`.
2. Install into the intended profile using one of the commands above.
3. Restart that profile.
4. Inspect the loaded composition. On shells with `grep`, run `dsh web --dump-config | grep dsh-48mark`; on Windows use `findstr dsh-48mark`.
5. In a session where the `skill` tool is available, request a relevant task explicitly, e.g. “Use `48mark-audit` to review this page for keyboard, responsive, and form-state defects.”
6. Check the result: skill names should appear in the session's skill catalog, and loading one should return the corresponding instruction body.

If a skill is missing, first verify the profile, restart status, bundle row, DSH version, and that the base composition loads the DSH skill registry and model-facing skill consumer.

## Validate from source

Node's built-in test runner is used; there is no build step and no extra test framework.

```bash
npm run check
npm test
npm run verify
```

`npm test` uses an isolated stub for the public skill-rank export and a minimal registry. That validates the plugin's local provider behavior, not a real DSH installation or runtime API compatibility. A proper release check should additionally install the exact DSH version into a disposable profile, restart it, check the composition, discover each skill, load all four instruction bodies, and run a small UI task.

## Examples

Build:

> Use `48mark-build` to implement a responsive settings page with keyboard-accessible tabs, validation, loading states, and a real save path. Inspect the existing stack first and report which tests you ran.

Redesign:

> Use `48mark-redesign` to modernize this billing screen. Inventory routes, fields, API calls, and event handlers before changing the layout; preserve them and verify the regression tests.

Audit:

> Use `48mark-audit` to check this dashboard at mobile and desktop widths. Report reproducible defects, severity, evidence, and the smallest useful fix without editing files.

Engineering:

> Use `48mark-engineer` to reproduce this build failure, identify the root cause, add a regression test, and update the setup docs. Do not claim a check passed unless it ran.

## Project structure

```text
dsh-48mark/
├── package.json              # DSH bundle identity and exact target engine
├── cordis.patch.yml          # Adds this bundle's plugin row
├── index.js                  # Native Cordis skill provider
├── skills/                   # Four independently scoped instruction bodies
├── assets/                   # Product-specific SVG brand system
├── docs/                     # Architecture, brand, compatibility, and release guidance
├── scripts/                  # Dependency-free package validation
├── tests/                    # Mocked provider tests and boundary checks
├── LICENSE
├── SECURITY.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

## Security and maintenance

Review [`SECURITY.md`](SECURITY.md) before extending the provider. Keep the package's code and skill bodies local and auditable. Never put secrets in a manifest, test fixture, issue, log, or release archive. Changes to skills or the runtime API should increment the package version and re-run local tests plus the real-DSH smoke test.

## License

MIT. See [`LICENSE`](LICENSE).
