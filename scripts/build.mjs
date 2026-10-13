import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const body = readFileSync(join(root, 'src/client.js'), 'utf8').trimEnd()

const wrapped = [
  'window.__ModuleLoader__.load({',
  '  id: "dsh-sidebar-toggle",',
  '  factory: (require) => {',
  '    var module = { exports: {} };',
  '    var exports = module.exports;',
  '    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });',
  body,
  '',
  '    return module.exports;',
  '  }',
  '});',
  ''
].join('\n')

writeFileSync(join(root, 'lib/client.js'), wrapped, 'utf8')
