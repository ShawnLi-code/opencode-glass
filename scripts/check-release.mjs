import { readFile } from 'node:fs/promises'
const root = new URL('../', import.meta.url)
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
for (const file of Object.values(pkg.exports)) await readFile(new URL(file, root))
const bundle = await readFile(new URL(pkg.exports['./gui-experimental'], root), 'utf8')
if (/GLASS_[A-Z_]*(?:TEST|INSPECT|AUDIT|DIAGNOSTIC)|opencode-glass\.acceptance|structure-key|palette-checkpoint/.test(bundle)) {
  throw new Error('Refusing to pack a diagnostic GUI. Clear GLASS_DESKTOP_TEST and run npm run verify first.')
}
console.log('Release entrypoints present; diagnostic code excluded.')
