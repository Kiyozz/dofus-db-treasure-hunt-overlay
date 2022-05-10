import * as path from 'path'
import type { BuildOptions } from 'esbuild'

const config: BuildOptions = {
  platform: 'node',
  entryPoints: [path.resolve('src/main/main.ts'), path.resolve('src/main/preload.ts')],
  bundle: true,
  target: 'node16.13.0', // electron version target
}

// eslint-disable-next-line import/no-default-export
export default config
