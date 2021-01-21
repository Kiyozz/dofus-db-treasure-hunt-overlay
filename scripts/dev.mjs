/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import path from 'path'
import { spawn } from 'child_process'
import chokidar from 'chokidar'
import esbuild from 'esbuild'
import debounce from 'debounce-fn'
import depsTree from 'dependency-tree'
import esbuildMainConfig from '../esbuild.main.mjs'
import { track } from './track.mjs'

process.env.NODE_ENV = 'development'

/** @var {import('stream').Stream} */
let electronProcess
const isWindows = process.platform === 'win32'
const electronBin = isWindows ? 'electron.cmd' : 'electron'

function killProcess(pid) {
  if (isWindows) {
    spawn('taskkill', ['/pid', pid, '/f', '/t'])
  } else {
    process.kill(pid)
  }
}

function getDeps(file) {
  return depsTree.toList({
    filename: file,
    directory: path.dirname(file),
    filter: filePath => filePath.indexOf('node_modules') === -1
  })
}

function startMain() {
  if (electronProcess) {
    console.info(track(), 'Kill latest main')

    try {
      killProcess(electronProcess.pid)
    } catch (e) {
      console.error('Error occured while killing latest main', e)
    }

    electronProcess = undefined
  }

  console.info(track(), 'Start main')
  electronProcess = spawn(
    path.resolve(path.resolve(`node_modules/.bin/${electronBin}`)),
    ['dist/main/main.js']
  )

  electronProcess.stdout.on('data', data => {
    console.log(track(), data.toString().trim())
  })
  electronProcess.stderr.on('data', data => {
    console.log(track(), 'STDERR', data.toString().trim())
  })

  electronProcess.on('close', (code, signal) => {
    if (signal !== null) {
      process.exit(code || 0)
    }
  })
}

let mainBuilder

async function mainBuild() {
  console.info(track(), 'Building main')

  if (mainBuilder) {
    await mainBuilder.rebuild()
  } else {
    mainBuilder = await esbuild.build(esbuildMainConfig({ incremental: true }))
  }

  console.info(track(), 'Main built')
}

function watchMain() {
  const mainSources = path.join(path.resolve('src/main'), '**', '*.ts')
  const mainWatcher = chokidar.watch([
    mainSources,
    ...getDeps(path.resolve('src/main/main.ts')),
    path.resolve('src/main/preload.js')
  ])

  mainWatcher.on('ready', () => {
    mainWatcher.on(
      'all',
      debounce(
        async () => {
          await mainBuild()
          startMain()
          await mainWatcher.close()
          watchMain()
        },
        { wait: 200 }
      )
    )
  })
}

async function dev() {
  console.info(track(), 'Start')

  watchMain()

  await mainBuild()
  startMain()
}

dev()
