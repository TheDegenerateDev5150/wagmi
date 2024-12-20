import fs from 'node:fs/promises'
import path from 'node:path'

// Restores package.json files from package.json.tmp files.

console.log('Restoring package.json files.')

// Get all package.json files
const packagePaths = await Array.fromAsync(
  new Bun.Glob('packages/**/package.json.tmp').scan(),
)

let count = 0
for (const packagePath of packagePaths) {
  type Package = { name?: string | undefined } & Record<string, unknown>
  const file = Bun.file(packagePath)
  const packageJson = (await file.json()) as Package

  count += 1
  console.log(`${packageJson.name} — ${path.dirname(packagePath)}`)

  await Bun.write(
    packagePath.replace('.tmp', ''),
    `${JSON.stringify(packageJson, undefined, 2)}\n`,
  )
  await fs.rm(packagePath)
}

console.log(`Done. Restored ${count} ${count === 1 ? 'file' : 'files'}.`)
