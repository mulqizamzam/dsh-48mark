# Architecture and workflow boundary

## Product boundary

`dsh-48mark` is a **DSH bundle** that contributes four immutable skills through the native `@deepseek-ai/dsh-skill` provider interface. It does not ship a hosted backend, MCP server, browser runner, deployment service, telemetry, or credentials. These omissions are deliberate: the core job is repeatable guidance and quality gates, and the harness should use its own available tools for workspace changes and verification.

## Runtime flow

1. DSH installs the package and recognizes `dsh.bundle.patch` in `package.json`.
2. `cordis.patch.yml` inserts the `dsh-48mark` plugin row into the selected profile composition.
3. Cordis injects the existing `skills` registry into `index.js`.
4. `apply()` registers one provider with four skill candidates. Candidate summaries are available for discovery; full Markdown bodies are read only when a skill is loaded.
5. The provider returns `source: bundled`, explicit model/user invocation policy, a package-relative resource base, and the native bundled-skill precedence rank.

## Workflow disposition

| Capability | Disposition | Reason |
|---|---|---|
| New interface planning and implementation | Included (`48mark-build`) | Repeatable user outcome with concrete implementation and verification gates |
| Existing interface redesign | Included (`48mark-redesign`) | Different preservation ledger and regression-risk profile from greenfield work |
| Visual / behavior / accessibility review | Included (`48mark-audit`) | Report-only diagnosis has a distinct, lower-mutation boundary |
| Debugging, testing, docs, automation, integrations | Included (`48mark-engineer`) | Cross-cutting engineering loop grounded in reproducible evidence |
| Bundled design-theme catalog or third-party image library | Excluded | No need for copied catalogues, remote assets, or license-sensitive artwork |
| Automatic deployment, destructive edits, or production actions | Excluded | These require separate tools and explicit authorization, not a design instruction bundle |
| Hosted APIs / MCP | Excluded | No external data/action dependency is required by these four workflows |

## Capability and mutation policy

The skills instruct the model to inspect before editing; distinguish evidence from assumptions; use repository-defined tools and commands; preserve interfaces; run actual tests; and report skipped checks. File writes, shell commands, package installation, remote integrations, destructive changes, and deployment remain subject to the host's own permissions and the user's authorization. A skill is not a grant of tools or privileges.

## Identity and clean-room boundary

The plugin name, display identity, code, architecture decisions, prompts, instruction bodies, SVG assets, tests, documentation, and package configuration are original to `mulqizamzam`. The DSH APIs are used according to their documented public contract. The package contains no imported upstream Git history, third-party image library, or source-project-specific assets.
