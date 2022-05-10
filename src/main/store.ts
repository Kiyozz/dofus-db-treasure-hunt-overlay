import ElectronStore from 'electron-store'

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
