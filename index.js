import { Miniflare, Log, LogLevel } from 'miniflare'
import merge from 'lodash.merge'

const defaultOptions = {
  kvData: {},
  mfOptions: {
    debug: true,
    watch: true,
    wranglerConfigPath: true,
    logUnhandledRejections: true,
    log: new Log(LogLevel.DEBUG),
    sourceMap: true,
  }
}

export const createMiniflareServer = async (options = defaultOptions) => {
  const {
    kvData,
    mfOptions
  } = merge(defaultOptions, options)

  const mf = new Miniflare(mfOptions)

  for (const nsName in kvData) {
    console.log(nsName)
    const nsEntries = Object.entries(kvData[nsName])
    console.log(nsEntries)
    const kvNamespace = await mf.getKVNamespace(nsName)
    await Promise.all(nsEntries.map(entry => kvNamespace.put(...entry)))
  }

  return mf
}

// const mf = new Miniflare({
//   scriptPath: 'worker/script.js',
//   buildWatchPaths: ['index.js', 'osoClasses.js'],
//   wranglerConfigPath: true,
//   debug: true,
//   watch: true,
//   wasmBindings: {
//     WASM_MODULE: 'worker/module.wasm',
//   },
// })
//
// const newcoBasicAuthNS = await mf.getKVNamespace('NEWCO_BASIC_AUTH')
// const fasdentifyAuthCredentialsNS = await mf.getKVNamespace('FASDENTIFY_AUTH_CREDENTIALS')
//
// await Promise.all([
//   newcoBasicAuthNS.put('USER', 'skipper'),
//   newcoBasicAuthNS.put('PASS', 'otto'),
//   fasdentifyAuthCredentialsNS.put('CLIENT_ID', '2e4edd1d-9fad-4977-98b3-1f9287e41f67'),
//   fasdentifyAuthCredentialsNS.put('CLIENT_SECRET', 'e510883c793db4f0c7efa1906cacaed5179aa67a'),
//   fasdentifyAuthCredentialsNS.put('TOKEN_URL', 'http://local.fasdentify.com:3000/oauth/token'),
//   fasdentifyAuthCredentialsNS.put('AUTHORIZE_URL', 'http://local.fasdentify.com:3000/oauth/authorize'),
//   fasdentifyAuthCredentialsNS.put('LOGIN_URL', 'http://local.fasdentify.com:3001/login'),
// ])


