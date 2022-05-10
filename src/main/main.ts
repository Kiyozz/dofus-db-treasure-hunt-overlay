import path from 'path'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { createWindowPositionStore } from './store'

let win: BrowserWindow | null = null
const js = `
  const goToWebsite = document.createElement('a')
  const quitButton = document.createElement('button')
  const topLayout = document.createElement('div')
  
  topLayout.classList.add('dmo-top-layout')
  quitButton.classList.add('dmo-quit-btn')
  goToWebsite.classList.add('dmo-go-to-website-btn')
  
  quitButton.innerText = 'Quit app'
  quitButton.setAttribute('tab-index', '-1')
  quitButton.addEventListener('click', () => {
    dmo.quit()
  })
  
  goToWebsite.innerText = 'DOFUS DB'
  goToWebsite.setAttribute('tab-index', '-1')
  goToWebsite.addEventListener('click', (evt) => {
    evt.preventDefault()
    dmo.goToWebsite()
  })
  
  topLayout.appendChild(goToWebsite);
  topLayout.appendChild(quitButton);
  
  document.querySelectorAll('input[type="number"]').forEach(elem => {
    elem.setAttribute('type', 'text')
  })
  
  document.body.appendChild(topLayout);0
`
const css = `
  .dmo-top-layout {
    position: fixed;
    top: 4px;
    right: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    color: white;
    app-region: no-drag;
  }
  
  .dmo-quit-btn {
    cursor: pointer;
    border: none;
    background: transparent;
    color: inherit;
  }
  
  .dmo-go-to-website-btn {
    cursor: pointer;
    app-region: no-drag;
    color: inherit;
  }

  body {
    background: transparent !important;
    border: 1px var(--q-color-primary) solid;
  }
  
  .treasure-hunt-directions, .q-field__inner {
    background: var(--q-color-primary) !important;
  }

  main > div.bg-primary {
    background: transparent !important;
    /*pointer-events: none;*/
  }

  .q-page-container {
    padding-top: 0 !important;
  }
  
  .q-page {
    padding: 0 !important;
  }
  
  .q-page > div:first-child {
    padding-top: 0;
  }
  
  .q-page > div > div:nth-child(3) { /* Buttons */
    padding-top: 1rem;
    -webkit-app-region: drag;
  }
  
  .q-page > div > div:nth-child(3) button,
  .q-page > div > div:nth-child(3) label {
    -webkit-app-region: no-drag;
  }
  
  .q-page > div > div:nth-child(3) > span {
    user-select: none;
  }
  
  .q-page > div > div:nth-child(7) {
    margin-top: 1.5rem;
  }
  
  .q-page > div > div:nth-child(9) {
    text-align: center;
    font-size: 0.75rem;
  }
  
  main.q-page, #q-app > .q-layout {
    min-height: unset !important;
  }
  
  .q-page > div > div:first-child, /* Title */
  .q-page > div > div:nth-child(2), /* Position */
  .q-page > div > div:nth-child(4), /* Direction */
  .q-page > div > div:nth-child(6), /* Indice */
  .q-page > div > a,
  .q-header,
  .q-card > div:nth-child(4),
  .q-card > div.text-center.q-pa-xs.text-grey-6,
  .q-loading-bar,
  .q-footer,
  .q-notifications {
    display: none !important;
  }
  
  .q-card > div:first-child.text-h5, .q-card > div:nth-child(2).text-h6 {
    font-size: 1rem;
  }
  
  .q-card > div:first-child.text-h5 i {
    margin-right: 6px;
    font-size: 1em !important;
  }
  
  .q-card > div:nth-child(2).text-h6 {
    font-size: 0;
    padding: 20px;
  }
  
  .q-card > div:nth-child(2).text-h6 span {
    font-size: 1rem;
  }
 
  .q-layout__shadow::after {
    box-shadow: none !important;
  }
  
  .q-field__control {
    padding: 0 4px !important;
  }
  
  .q-field__bottom, .q-field__append {
    display: none !important;
  }
  
  @media screen and (min-width: 599px) {
    .q-page > div:first-child {
      padding-right: 0;
      padding-left: 0;
    }
    
    .q-card {
      display: flex;
      position: relative;
      align-items: center;
    }
  
    .q-card > div:first-child.text-h5 {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  
  @media screen and (max-width: 599px) {
    .q-page > div > div:nth-child(3) {
      padding-top: 2rem;
    }
  
    .q-card > div:nth-child(2).text-h6, .q-card > div:first-child.text-h5 {
      padding: 2px;
    }
  
    span button[type="button"][role="button"] {
      font-size: 1rem !important;
    }
    
    .q-card {
      width: 100%;
    }
  }
`

function createWindow() {
  const winStore = createWindowPositionStore()

  const { x = 0, y = 90 } = winStore.store

  win = new BrowserWindow({
    width: 300,
    height: 545,
    minWidth: 300,
    minHeight: 545,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
    hasShadow: false,
    roundedCorners: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    acceptFirstMouse: true,
    x,
    y,
    show: false,
  })

  win.on('moved', () => {
    if (!win) return

    const [newX, newY] = win.getPosition()

    winStore.set({ x: newX, y: newY })
  })

  void win.loadURL('https://dofusdb.fr/fr/tools/treasure-hunt', { userAgent: 'Chrome' })

  win.webContents.on('did-finish-load', async () => {
    try {
      await Promise.all([win?.webContents.insertCSS(css), win?.webContents.executeJavaScript(js)])

      win?.show()
    } catch (err) {
      console.error(err)
      app.quit()
    }
  })

  win.on('closed', () => {
    win = null
  })

  ipcMain.handle('quit', () => {
    win?.close()
  })

  ipcMain.handle('go-to-website', () => {
    void shell.openExternal('https://dofusdb.fr/fr/tools/treasure-hunt')
  })
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', createWindow)
