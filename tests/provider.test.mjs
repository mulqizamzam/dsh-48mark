import assert from 'node:assert/strict'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'

async function loadWithStub() {
  const root = await mkdtemp(join(tmpdir(), 'dsh-48mark-test-'))
  await cp(new URL('../index.js', import.meta.url), join(root, 'index.js'))
  await cp(new URL('../skills', import.meta.url), join(root, 'skills'), { recursive: true })
  const stubDir = join(root, 'node_modules', '@deepseek-ai', 'dsh-skill')
  await mkdir(stubDir, { recursive: true })
  await writeFile(join(stubDir, 'package.json'), JSON.stringify({ name: '@deepseek-ai/dsh-skill', version: '0.2.1-rc.2', type: 'module', exports: './index.js' }))
  await writeFile(join(stubDir, 'index.js'), 'export const BUNDLED_SKILL_RANK = 600\n')
  const module = await import(`${pathToFileURL(join(root, 'index.js')).href}?test=${Date.now()}-${Math.random()}`)
  return { root, module }
}

test('registers one native provider with four separately scoped skills', async (t) => {
  const { root, module } = await loadWithStub()
  t.after(async () => rm(root, { recursive: true, force: true }))

  assert.equal(module.name, 'dsh-48mark')
  assert.deepEqual(module.inject, ['skills'])
  let provider
  module.apply({ skills: { registerProvider(factory) { provider = factory() } } })
  assert.ok(provider)
  assert.equal(provider.name, 'dsh-48mark')

  const skills = await provider.list()
  assert.deepEqual(skills.map((item) => item.name), [
    '48mark-build', '48mark-redesign', '48mark-audit', '48mark-engineer',
  ])
  for (const skill of skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(skill.description.length > 50)
    assert.deepEqual(skill.invocation, { modelInvocable: true, userInvocable: true })
    assert.equal(skill.rank, 600)
    assert.equal(skill.provider, 'dsh-48mark')
    assert.equal(skill.source, 'bundled')
    const definition = await provider.get(skill)
    assert.equal(definition.name, skill.name)
    assert.ok(definition.content.trim().length > 300)
    assert.equal(definition.resourceBase.kind, 'directory')
  }
})

test('rejects stale or unknown candidate locators instead of reading an arbitrary path', async (t) => {
  const { root, module } = await loadWithStub()
  t.after(async () => rm(root, { recursive: true, force: true }))

  let provider
  module.apply({ skills: { registerProvider(factory) { provider = factory() } } })
  await assert.rejects(
    () => provider.get({ name: '48mark-build', locator: '../package.json' }),
    /Unknown dsh-48mark skill candidate/,
  )
  await assert.rejects(
    () => provider.get({ name: 'not-registered', locator: 'not-registered.md' }),
    /Unknown dsh-48mark skill candidate/,
  )
})

test('fails clearly when the host has no skill registry', async (t) => {
  const { root, module } = await loadWithStub()
  t.after(async () => rm(root, { recursive: true, force: true }))
  assert.throws(() => module.apply({}), /requires the DSH skills registry/)
})

test('bundle/package metadata and documentation agree on the runtime target', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8')
  const compatibility = await readFile(new URL('../docs/compatibility.md', import.meta.url), 'utf8')
  assert.equal(pkg.name, 'dsh-48mark')
  assert.equal(pkg.engines.dsh, '0.2.1-rc.2')
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok(readme.includes('DeepSeek Harness **`0.2.1-rc.2`**'))
  assert.match(compatibility, /`0\.2\.1-rc\.2`/)
})
