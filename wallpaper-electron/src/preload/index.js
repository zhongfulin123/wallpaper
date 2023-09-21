import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  setWallpaper: (url, dir) => {
    ipcRenderer.send('setWallpaper', url, dir)
  },
  checkDirectory: (dir) => {
    return ipcRenderer.invoke('checkDirectory', dir)
  },
  setImageSaveDirectory: () => {
    return ipcRenderer.invoke('setImageDirectory')
  },
  downloadImage: (url)=>{
    ipcRenderer.send('downloadImage',url)
  }
  // checkDirectory: (path) => {
  //   return ipcRenderer.invoke('checkDirectory', path)
  // }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
