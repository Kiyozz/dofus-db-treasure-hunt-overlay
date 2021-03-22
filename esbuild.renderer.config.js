const path = require('path')

/** @var {Partial<import('esbuild').BuildOptions>} */
module.exports = {
  platform: 'browser',
  entryPoints: [path.resolve('src/renderer/index.ts')],
  bundle: true,
  target: 'chrome89', // electron version target
  loader: {
    '.ts': 'ts'
  }
}
