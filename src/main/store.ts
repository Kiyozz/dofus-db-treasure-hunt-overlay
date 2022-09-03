import ElectronStore from 'electron-store'
import type { Languages } from './types/languages'

export function createWindowPositionStore() {
  return new ElectronStore({
    configFileMode: 0o600,
    name: 'dmo_win',
    defaults: {
      x: 0,
      y: 90,
    },
  })
}

export function createLanguageStore() {
  return new ElectronStore({
    configFileMode: 0o600,
    name: 'dmo_language',
    defaults: {
      lan: 'fr' as Languages,
    },
  })
}
