let win = require('electron').remote.getCurrentWindow()
let TMF = require('electron-transparency-mouse-fix')

new TMF({ fixPointerEvents: 'auto', electronWindow: win })
