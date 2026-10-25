import assert from 'node:assert/strict'
import { lstat, readFile, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const errors = []
const check = (condition, message) => { if (!condition) errors.push(message) }

let pkg
try {
  pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
} catch (error) {
  console.error(`FAIL: package.json is not valid JSON: ${error.message}`)
  process.exit(1)
}

check(pkg.name === 'dsh-48mark', 'package name must be dsh-48mark')
check(pkg.version === '0.1.0', 'version must align with the current release package (0.1.0)')
check(pkg.author === 'mulqizamzam', 'mulqizamzam must be the only package author/owner identity')
check(pkg.engines?.dsh === '0.2.1-rc.2', 'engines.dsh must pin exact target 0.2.1-rc.2')
check(pkg.main === 'index.js', 'main must point to the real runtime entry point')
check(pkg.dsh?.bundle?.patch === './cordis.patch.yml', 'dsh.bundle.patch must point to ./cordis.patch.yml')
check(pkg.peerDependencies?.['@deepseek-ai/dsh-skill'] === '0.2.1-rc.2', 'dsh-skill peer dependency must match target runtime')
check(pkg.peerDependencies?.['@deepseek-ai/cordis'] === '0.2.1-rc.2', 'cordis peer dependency must match target runtime')
check(Array.isArray(pkg.files) && pkg.files.includes('index.js') && pkg.files.includes('skills/'), 'package allowlist must include runtime entry and skill bodies')

const patch = await readFile(join(root, 'cordis.patch.yml'), 'utf8')
check(/^- insert:\s*\n\s+- id: dsh-48mark\s*\n\s+name: dsh-48mark\s*$/m.test(patch.trim()), 'bundle patch must insert the package runtime row')

const required = [
  'README.md', 'LICENSE', 'SECURITY.md', 'CONTRIBUTING.md', 'CHANGELOG.md',
  'index.js', 'cordis.patch.yml',
  'skills/48mark-build.md', 'skills/48mark-redesign.md', 'skills/48mark-audit.md', 'skills/48mark-engineer.md',
  'assets/icon.svg', 'assets/logo-light.svg', 'assets/logo-dark.svg',
  'docs/architecture.md', 'docs/compatibility.md', 'docs/brand-identity.md',
]
for (const path of required) {
  try { await lstat(join(root, path)) } catch { errors.push(`required file missing: ${path}`) }
}

const skillNames = ['48mark-build', '48mark-redesign', '48mark-audit', '48mark-engineer']
for (const name of skillNames) {
  const path = join(root, 'skills', `${name}.md`)
  try {
    const body = await readFile(path, 'utf8')
    check(body.trim().length >= 300, `${name} skill body is too short`)
    check(!/^---\s*\nname:/m.test(body), `${name} DSH skill body should not imply an OpenAI/Codex SKILL.md frontmatter contract`)
  } catch { /* required-file finding already emitted */ }
}

const entry = await readFile(join(root, 'index.js'), 'utf8')
check(entry.includes("export const name = 'dsh-48mark'"), 'runtime entry must export the expected Cordis name')
check(entry.includes("export const inject = ['skills']"), 'runtime entry must inject the skills registry')
check(entry.includes('ctx.skills.registerProvider(() => provider)'), 'runtime entry must register a native skill provider')
check(entry.includes('BUNDLED_SKILL_RANK'), 'skill candidates must use the DSH bundled-provider rank')

const icon = await readFile(join(root, 'assets/icon.svg'), 'utf8')
check(/<svg\b[^>]*\bwidth="128"[^>]*\bheight="128"[^>]*\bviewBox="0 0 128 128"/.test(icon), 'icon.svg must be square and use a numeric 128×128 viewBox')
check(!/(?:https?:)?\/\//i.test(icon.replace('http://www.w3.org/2000/svg', '')), 'icon.svg must not link to external resources')
for (const assetPath of ['assets/logo-light.svg', 'assets/logo-dark.svg']) {
  const svg = await readFile(join(root, assetPath), 'utf8')
  check(/<svg\b[^>]*\bwidth="420"[^>]*\bheight="112"[^>]*\bviewBox="0 0 420 112"/.test(svg), `${assetPath} must declare its numeric canvas`)
  check(!/https:\/\//i.test(svg), `${assetPath} must not reference remote resources`)
  check(svg.includes('48mark'), `${assetPath} must carry the product wordmark`)
}

const bannedTerms = [
  ['hall', 'mark'].join(''),
  'Nut' + 'lope',
  'Together' + ' AI',
  'use' + 'hall' + 'mark.com',
  'Jake' + 'schincariol',
]
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-[A-Za-z0-9_-]{24,}\b/,
]
const ignoreDirs = new Set(['.git', 'node_modules', 'dist', 'coverage'])
const textExtensions = new Set(['.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.md', '.svg', '.txt', '.py'])

async function walk(dir) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch (error) {
    errors.push(`cannot read directory ${relative(root, dir)}: ${error.message}`)
    return
  }
  for (const item of entries) {
    if (item.name.startsWith('.') && item.name !== '.gitignore') {
      if (item.name === '.git') continue
      if (item.name === '.env' || item.name.startsWith('.env.')) errors.push(`secret-shaped file present: ${relative(root, join(dir, item.name))}`)
    }
    if (ignoreDirs.has(item.name)) continue
    const full = join(dir, item.name)
    const info = await lstat(full)
    const rel = relative(root, full).split(sep).join('/')
    check(!info.isSymbolicLink(), `symlink is not allowed: ${rel}`)
    if (info.isDirectory()) {
      await walk(full)
      continue
    }
    check(info.isFile(), `special filesystem entry is not allowed: ${rel}`)
    if (!info.isFile()) continue
    check(!/(^|\/)(__pycache__|\.pytest_cache|\.mypy_cache|\.DS_Store|Thumbs\.db)(\/|$)/i.test(rel), `transient file or cache is not allowed: ${rel}`)
    const extension = rel.includes('.') ? `.${rel.split('.').pop()}` : ''
    if (!textExtensions.has(extension)) continue
    let content
    try { content = await readFile(full, 'utf8') } catch { continue }
    for (const term of bannedTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) errors.push(`unwanted source identity/reference '${term}' found in ${rel}`)
    }
    for (const pattern of secretPatterns) {
      if (pattern.test(content)) errors.push(`secret-shaped token found in ${rel}`)
    }
  }
}

await walk(root)

if (errors.length) {
  console.error(`FAIL: ${errors.length} validation error(s)`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('PASS: package identity, DSH bundle manifest, provider entry point, four skill files, SVG assets, source hygiene, and secret-shaped content checks.')
console.log(`Validated ${required.length} required paths and ${skillNames.length} skills for ${pkg.name}@${pkg.version}.`)
