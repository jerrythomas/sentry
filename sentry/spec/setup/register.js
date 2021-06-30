import { parse } from 'path'
import { compile } from 'svelte/compiler'

export function transform(source, filename) {
  const { name } = parse(filename)

  const { js, warnings } = compile(source, {
    name: name[0].toUpperCase() + name.substring(1),
    format: 'esm',
    filename,
  })

  warnings.forEach(warning => {
    console.warn(`\nSvelte Warning in ${warning.filename}:`)
    console.warn(warning.message)
    console.warn(warning.frame)
  })

  return js.code
}

// export function loader(mod, filename) {
//   const orig = mod._compile.bind(mod)
//   mod._compile = code => transform(orig, code, filename)
//   loadJS(mod, filename)
// }
