# Security policy

## Scope

`dsh-48mark` ships local instruction text and one small DSH skill-provider module. It does not open listeners, create network connections, spawn child processes, read user workspaces on its own, store credentials, or send telemetry. Skill instructions may guide a model to use tools provided by the host; those tools retain their own permission and approval boundaries.

## Safe use

- Review diffs before accepting file changes, package installs, or other mutations.
- Keep API keys, tokens, cookies, private URLs, and customer data out of source, fixtures, logs, and bug reports.
- Do not use generated UI to misrepresent capabilities, fabricate evidence, or claim a real backend action that did not occur.
- Treat dependency lifecycle scripts and any external integration as separate trust decisions.
- Test destructive or production-impacting operations in a disposable environment and require explicit approval before execution.

## Reporting

Report security issues privately to the repository owner through the GitHub security contact mechanism if available. Include the affected version, reproduction steps, impact, and a proposed mitigation. Do not publish exploitable details before a fix is available.
