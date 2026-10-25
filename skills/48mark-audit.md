# Audit a web interface and prioritize fixes

## Purpose

Produce an evidence-based quality report with severity, affected location, reproduction steps, user impact, and a concrete fix. An audit is diagnostic by default; do not modify the workspace unless the user requests fixes or the authorized task clearly includes them.

## Workflow

1. **Set scope.** Identify the app/page and the requested review dimension: visual design, accessibility, responsiveness, behavior, content integrity, performance, or release readiness. Record which files, browsers, environments, and data are actually available.
2. **Collect evidence.** Inspect implementation and tests. Use a browser/preview and viewport screenshots if available. Reproduce suspected defects rather than reporting visual guesses as facts. State when a finding is based on static code review only.
3. **Check the task path.** Follow the primary action from entry to completion. Test navigation, forms, menus, filters, dismissals, empty states, errors, loading, and success feedback as applicable. Check that action labels match behavior and that success messages only appear after real success.
4. **Check responsive behavior.** Review narrow, medium, and wide widths when a renderer exists. Look for overflow, clipped controls, broken order, unreadable line lengths, fixed elements obscuring content, overly tall heroes, and hover-only interactions. Report exact tested widths when known.
5. **Check accessibility fundamentals.** Inspect semantic landmarks and heading order; names and labels; keyboard reachability and activation; visible focus; contrast; zoom/reflow; reduced motion; meaningful image alternatives; form errors; and status announcements. Use automated checks when available, but do not treat automation as proof of full conformance.
6. **Check content and integrity.** Flag unsupported claims, dead placeholder links, fake customer evidence, invented metrics, duplicate filler, missing image credits/licenses, untrue integration claims, and privacy-sensitive content. Do not invent evidence to strengthen a critique.
7. **Classify each finding.** Use `blocker` for security/data loss or a critical path that cannot work; `high` for a major task barrier or serious accessibility issue; `medium` for meaningful usability or responsive defects; `low` for polish. Explain severity through impact, not personal taste.
8. **Recommend the smallest useful fix.** Each finding needs a concise title, evidence/location, reproduction or test, user impact, suggested fix, and confidence (`high`, `medium`, or `low`). Deduplicate symptoms that share a root cause.
9. **State coverage.** List tested environments and methods, plus omitted browser/device/accessibility/performance checks. Keep confirmed defects separate from hypotheses and aesthetic preferences.

## Report format

1. Executive verdict and top risks.
2. Prioritized findings table: severity, location/evidence, impact, fix, confidence.
3. Coverage and checks actually run.
4. Residual risks and recommended next steps.

## Rules

- Prefer specific evidence over broad language such as “the design feels off”.
- Do not claim WCAG conformance from color contrast checks or an automated scan alone.
- Do not infer performance from code style; use measurements for performance claims.
- Do not assert a broken control without reproducing it or showing a clear implementation defect.
- Do not apply fixes during a report-only audit.
- If the browser or test runner is unavailable, report the limitation and give a static-review result with appropriately lower confidence.
