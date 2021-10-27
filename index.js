#!/usr/bin/env node

import { Miniflare } from 'miniflare'
import Commander from 'commander'
import { readFileSync } from 'fs'

async function loadKV (mf, kvData) {
  for (const nsName in kvData) {
    const nsValues = Object.entries(kvData[nsName])
    const ns = await mf.getKVNamespace(nsName)
    await Promise.all(nsValues.map(([k, v]) => {
      ns.put(k, v)
    }))
  }
}

async function runMiniflare (options, cmd) {
  const { kvDataFile } = options
  const mf = new Miniflare({})
  if (kvDataFile !== undefined) {
    try {
      const kvData = JSON.parse(readFileSync(kvDataFile))
      await loadKV(mf, kvData)
    } catch(e) {
      console.log(e.message)
      process.exit(1)
    }
  }
  mf.createServer().listen(5000, () => {
    console.log("Listening on :5000");
  })
}

const program = new Commander.Command('miniflareRunner')

program
  .option(
    '-k, --kv-data-file <filepath>',
    'JSON file containing data to be inserted into kv namespaces'
  )
  .action(runMiniflare)
  .allowUnknownOption()
  .parseAsync(process.argv)
