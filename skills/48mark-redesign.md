# Redesign an existing interface without breaking its contracts

## Core rule

A redesign changes presentation and information hierarchy, not the product's essential meaning or wiring. Capture what exists before replacing it. The user must explicitly identify the target code, page, app, or design; do not silently assume that an existing product should be redesigned.

## Workflow

1. **Confirm the target and mode.** Establish the exact directory/page/app and whether the task is a full redesign, a restyle that preserves layout, or a limited polish. If the target is unclear, inspect the available workspace before asking.
2. **Create a preservation ledger.** Before editing, inventory routes and links, headings and key content, forms and field names, validation, event handlers, API calls, authentication/session behavior, feature flags, analytics hooks if present, keyboard paths, and tests. Use source inspection and tests where available. Capture baseline screenshots only when rendering tools are available.
3. **Identify design problems.** Separate structural issues (task order, hierarchy, navigation), system issues (type, spacing, colors, component consistency), and finish issues (alignment, focus states, responsive overflow). Tie each major change to a user or product goal.
4. **Design a distinct visual system.** Establish a deliberate visual thesis, semantic tokens, type scale, content widths, spacing, surface and border rules, and component states. Do not copy another product's branded assets, proprietary language, screenshots, exact layouts, or protected design files. A public page may inform high-level interaction patterns; implement an independently reasoned visual solution.
5. **Change in small slices.** Preserve domain logic and interaction contracts wherever possible. Prefer component and style changes over rewriting state/data layers. If the requested redesign truly requires a behavior change, identify it explicitly and seek approval when it changes product scope or creates a migration risk.
6. **Re-check preservation.** Re-run focused tests and inspect the ledger against the new version. Verify every required link, field, handler, route, data mapping, and heading remains present or has a documented reason for change. A visual improvement that drops a feature is a regression.
7. **Review the rendered result.** When browser/preview tools are available, compare baseline and result across narrow and wide viewports. Check focus order, sticky/fixed elements, long content, error states, reduced motion, and content that becomes obscured. Do not claim a screenshot comparison when no renderer ran.
8. **Provide a before/after handoff.** Explain the high-impact visual decisions, list preserved contracts, report test/browser results, and flag anything that could not be verified. Include a concise diff summary and avoid asserting parity without evidence.

## Stop conditions

Pause before destructive replacement if the target is ambiguous, required behavior cannot be inventoried, an auth/payment/data contract may be lost, or the requested approach needs an unavailable credential or external service. Make safe additive progress where possible; never silently remove business logic to obtain a cleaner screenshot.

## Completion checklist

- Target and redesign mode were clear.
- Existing behavior was inventoried before mutation.
- Visual changes are supported by a coherent design thesis rather than isolated decoration.
- Required functionality and semantics remain intact or approved changes are documented.
- Relevant checks ran and their actual outcomes are recorded.
