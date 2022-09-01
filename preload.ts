import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('dmo', {
  quit: () => ipcRenderer.invoke('quit'),
  goToWebsite: () => ipcRenderer.invoke('go-to-website'),
  changeLanguage:(data : string) => ipcRenderer.invoke('changeLanguage',data),
})
