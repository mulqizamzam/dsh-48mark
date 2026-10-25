import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BUNDLED_SKILL_RANK } from '@deepseek-ai/dsh-skill'

const PROVIDER_NAME = 'dsh-48mark'
const SKILLS_URL = new URL('./skills/', import.meta.url)
const RESOURCE_BASE = Object.freeze({
  kind: 'directory',
  path: fileURLToPath(SKILLS_URL),
})
const INVOCATION = Object.freeze({ modelInvocable: true, userInvocable: true })

const SPECS = Object.freeze([
  {
    name: '48mark-build',
    file: '48mark-build.md',
    description: 'Plan and implement a complete, responsive product interface from a user brief. Use for new pages, screens, flows, components, landing pages, dashboards, or front-end product work where visual quality and working behavior both matter.',
    whenToUse: 'A user needs a new interface or product experience implemented from requirements.',
  },
  {
    name: '48mark-redesign',
    file: '48mark-redesign.md',
    description: 'Redesign an existing website or application while preserving its content, routes, data contracts, and interactions. Use for visual rebuilds, restyles, layout changes, or modernization of an existing codebase.',
    whenToUse: 'A user explicitly identifies an existing product or page to redesign, restyle, or modernize.',
  },
  {
    name: '48mark-audit',
    file: '48mark-audit.md',
    description: 'Audit a web interface for visual consistency, responsiveness, accessibility, interaction states, content accuracy, and implementation defects. Use when the user asks for a quality review, UI critique, readiness check, or focused fix list.',
    whenToUse: 'A user wants findings and prioritized fixes before or after implementation.',
  },
  {
    name: '48mark-engineer',
    file: '48mark-engineer.md',
    description: 'Debug, test, document, automate, or integrate software changes using reproducible evidence and small verifiable steps. Use for coding bugs, regression tests, build failures, developer tooling, technical docs, and integration work that supports a product.',
    whenToUse: 'A user needs a repeatable engineering loop beyond interface design, especially diagnosis, tests, or documentation.',
  },
])

const specByName = new Map(SPECS.map((spec) => [spec.name, spec]))
const candidates = Object.freeze(SPECS.map((spec) => Object.freeze({
  name: spec.name,
  description: spec.description,
  whenToUse: spec.whenToUse,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: spec.file,
})))

const provider = Object.freeze({
  name: PROVIDER_NAME,
  async list() {
    return [...candidates]
  },
  async get(candidate) {
    const spec = specByName.get(candidate?.name)
    if (!spec || candidate.locator !== spec.file) {
      throw new Error(`Unknown dsh-48mark skill candidate: ${String(candidate?.name ?? '')}`)
    }

    return {
      name: spec.name,
      description: spec.description,
      whenToUse: spec.whenToUse,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      content: await readFile(new URL(spec.file, SKILLS_URL), 'utf8'),
    }
  },
})

export const name = 'dsh-48mark'
export const inject = ['skills']

/** Register the package's immutable, on-demand skill catalog with DSH. */
export function apply(ctx) {
  if (!ctx?.skills || typeof ctx.skills.registerProvider !== 'function') {
    throw new TypeError('dsh-48mark requires the DSH skills registry (ctx.skills.registerProvider).')
  }
  ctx.skills.registerProvider(() => provider)
}
