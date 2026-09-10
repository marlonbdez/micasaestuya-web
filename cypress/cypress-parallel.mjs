import path from 'node:path'
import fs from 'node:fs'

const NODE_INDEX = Number(process.env.CI_NODE_INDEX ?? 1)
const NODE_TOTAL = Number(process.env.CI_NODE_TOTAL ?? 1)
const TEST_FOLDER = 'cypress/e2e'

const specFiles = getSpecFiles()
console.log(specFiles.join(','))

function getSpecFiles() {
  return fs
    .readdirSync(TEST_FOLDER, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort()
    .filter((_, index) => index % NODE_TOTAL === NODE_INDEX - 1)
}
