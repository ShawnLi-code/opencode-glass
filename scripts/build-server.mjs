import { readFile, writeFile } from 'node:fs/promises'
import ts from 'typescript'
const root = new URL('../', import.meta.url)
const source = await readFile(new URL('src/index.ts', root), 'utf8')
const result = ts.transpileModule(source, { compilerOptions: {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
} })
await writeFile(new URL('dist/index.js', root), result.outputText)
