# Contributing

Thanks for helping maintain `dsh-48mark`.

## Local workflow

1. Use Node.js 18 or newer for the dependency-free source checks; use a separate environment with the exact supported DSH runtime for runtime testing.
2. Make a focused change and add a regression test where behavior is observable.
3. Run `npm run verify` and inspect the complete diff.
4. For changes to `index.js`, also run the exact-runtime smoke test described in [`docs/compatibility.md`](docs/compatibility.md) before proposing a compatibility claim.
5. Update `CHANGELOG.md` for user-visible changes and document any new runtime requirements.

## Acceptance requirements

- Use original code, prose, and assets or include clear licensing/attribution for permitted third-party material.
- Keep the package limited to the DSH bundle and its local skill provider; do not add a service or dependency without a specific need.
- Preserve the explicit boundaries between discovery, mutation, tests, and reporting.
- Do not weaken a test just to pass; explain any intentional behavior change.
- Never commit credentials, private data, generated caches, or unreviewed build outputs.
