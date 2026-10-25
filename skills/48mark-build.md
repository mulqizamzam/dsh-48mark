# Build a product interface

## Outcome

Deliver a working interface whose layout, content, visual hierarchy, and interactions follow the user's actual job. A pretty static screen is not complete when the requested experience needs navigation, inputs, persistence, validation, or feedback.

## Workflow

1. **Extract the brief.** Identify the user, primary task, success state, essential content, required screens, available data, existing stack, and explicit constraints. Separate stated facts from assumptions. Ask one focused question only when an ambiguity blocks a safe or materially correct implementation; otherwise state a reversible assumption and proceed.
2. **Inspect before choosing.** Read the existing entry points, package scripts, component patterns, style tokens, routing, data types, and tests when a workspace is available. Reuse the project's conventions where they are sound. Do not invent an installed framework, API, image, data point, font license, or capability.
3. **Define the information structure.** Give the primary user action visual and structural priority. Order sections by the task a visitor must complete, not by a generic landing-page template. Use purposeful content density and real UI states; do not fill the page with empty cards or repeated marketing patterns.
4. **Choose a coherent visual system.** Record a short design thesis before writing extensive UI code. Define semantic color tokens, type roles, spacing rhythm, widths, border/radius behavior, surfaces, focus treatment, and a small set of reusable components. Distinguish the design from generic starter-template conventions through a reasoned combination of typography, composition, detail, and content—not random decoration.
5. **Implement the whole critical path.** Build semantic structure, responsive behavior, and the primary interaction together. Forms need labels, validation, pending/success/error states, and a real submit path when one exists. Buttons must do what their labels promise. If no backend exists, disclose the limitation and implement only an honest local/demo behavior; never report a fake successful submission.
6. **Cover state and edge cases.** Include loading, empty, validation, permission, failure, and success states where the product requires them. Check long text, missing optional data, narrow screens, keyboard input, and reduced-motion preferences.
7. **Verify against evidence.** Run the repository's relevant checks and render the screen in the available browser/preview when the host provides one. Check at least a narrow viewport and a wide viewport. Compare rendered behavior with the brief; code inspection alone does not prove visual layout or click behavior.
8. **Report the handoff.** Summarize files changed, visible behaviors, checks actually executed, results, and remaining assumptions or blocked checks. Separate verified results from recommendations.

## Quality gates

- Do not ship knowingly broken navigation, form actions, keyboard controls, or responsive layout.
- Preserve factual accuracy: use supplied assets and facts; label placeholders; do not fabricate customers, testimonials, pricing, statistics, integrations, or legal claims.
- Ensure visible text and controls have readable contrast, meaningful focus indicators, semantic names, and touch-friendly spacing.
- Avoid a section merely because it is common on other sites. Each major element must serve the identified task.
- Prefer a small set of reusable, named design tokens over scattered one-off values.
- Prefer the smallest implementation that satisfies the brief and project's architecture. Do not add a framework or dependency just for styling convenience.
- If browser, test, shell, or file tools are unavailable, continue as far as possible and mark those checks as not run rather than implying they passed.

## Default deliverable

A runnable interface or the smallest credible patch to the existing app, accompanied by a concise verification note. If the brief is underspecified, propose concrete structure and visual direction rather than returning only generic design advice.
