import { BrowserWindow, app as electronApp } from 'electron'
import path from 'path'

class Application {
  win: BrowserWindow | null = null

  start() {
    this.createWindow()
  }

  createWindow() {
    this.create()
    this.load()
    this.inject()
    this.onClose()
  }

  private create() {
    this.win = new BrowserWindow({
      width: 323,
      height: 530,
      webPreferences: {
        nodeIntegration: false,
        devTools: true,
        preload: this.passTrough()
      },
      alwaysOnTop: true,
      frame: false,
      transparent: true,
      acceptFirstMouse: true,
      x: 0,
      y: 90
    })

    this.win.setIgnoreMouseEvents(true, { forward: true })
  }

  private load() {
    this.win!.loadURL('https://dofus-map.com/hunt')
  }

  private onClose() {
    this.win!.on('closed', () => {
      this.win = null
    })
  }

  private inject() {
    this.win!.webContents.on('did-finish-load', () => {
      this.win!.webContents.insertCSS(this.css())
    })
  }

  private css(): string {
    return `
      #menu {
        -webkit-user-select: none;
        -webkit-app-region: drag;
      }
      
      #menu a {
        -webkit-app-region: no-drag;
      }
      
      body, #menu {
        background: transparent !important;
      }
      
      #donateBox + h1, #donateBox + h1 + p, #bottomBox, #closeBottomBox, #startingPosition > h2, #forgottenHint, #misplacedHint, #hint h2, #semiColon {
        display: none;
      }
      
      #semiColon + button {
        margin-left: 10px;
      }
      
      #startingPosition {
        padding-top: 15px;
      }
      
      #left, #right, #bottom, #top {
        background: white !important;
      }
      
      .nightMode #left, .nightMode #right, .nightMode #bottom, .nightMode #top {
        background: #2f2f2f !important;
      }
      
      body {
        pointer-events: none;
      }
      
      #directions, #menu, #startingPosition button, #startingPosition input, #hintName {
        pointer-events: all;
      }
      
      #result #firstLine svg {
        width: 24px !important;
      }
      
      #result #firstLine span {
        font-size: 44px !important;
      }
    `
  }

  private passTrough(): string {
    return path.join(electronApp.getAppPath(), 'yo.js')
  }
}

const app = new Application()

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit()
  }
})

electronApp.allowRendererProcessReuse = true

electronApp.on('ready', () => app.start())
