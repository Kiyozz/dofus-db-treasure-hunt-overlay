import { ipcRenderer, contextBridge } from 'electron'
import type { Languages } from './types/languages'

contextBridge.exposeInMainWorld('dmo', {
  quit: () => ipcRenderer.invoke('quit'),
  goToWebsite: () => ipcRenderer.invoke('go-to-website'),
  changeLanguage: (data: Languages) => ipcRenderer.invoke('changeLanguage', data),
})
