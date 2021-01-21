/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import path from 'path'
import rimraf from 'rimraf'
import esbuild from 'esbuild'
import esbuildMainConfig from '../esbuild.main.mjs'
import { track } from './track.mjs'

process.env.NODE_ENV = 'production'

function clean() {
  rimraf.sync(path.resolve('dist'))
}

async function build() {
  console.info(track(), 'Start')
  clean()

  console.info(track(), 'Creating production build...')

  await esbuild
      .build(esbuildMainConfig({ sourcemap: false }))
      .then(() => console.info(track(), 'Main built'))

  process.exit(0)
}

build()
