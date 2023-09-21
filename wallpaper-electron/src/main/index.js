import { app, shell, BrowserWindow, ipcMain, dialog, Menu, Tray } from 'electron'
import path, { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import wallpaper from 'wallpaper'
import fetch from 'node-fetch'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import fs from 'fs'
const downloadFile = async (url, localFile) => {
  const streamPipeline = promisify(pipeline)
  const response = await fetch(url)

  if (!response.ok) {
    dialog.showErrorBox('后盾人温馨提示', '图片下载失败')
    throw new Error(`unexpected response ${response.statusText}`)
  }
  await streamPipeline(response.body, createWriteStream(localFile))
  return localFile
}

ipcMain.on('setWallpaper', async (event, url, path) => {
  try {
    const localFile = resolve(path, url.split('/').pop())
    const file = await downloadFile(url, localFile)
    wallpaper.set(file, { screen: 'all', scale: 'auto' })
  } catch (error) {
    // dialog.showErrorBox('', '图片下载失败，请在设置中心定义目录')
  }
})
ipcMain.on('downloadImage', async (event, url) => {
  const fileName = url.split('/').pop()
  const res = await dialog.showSaveDialog({
    title: '下载目录',
    defaultPath: fileName,
    properties: ['createDirectory']
  })
  if (!res.canceled && res.filePath.length) downloadFile(url, res.filePath)
})

ipcMain.handle('checkDirectory', async (event, path) => {
  return fs.existsSync(path)
})

ipcMain.handle('setImageDirectory', async () => {
  const res = await dialog.showOpenDialog({
    title: '选择图片保存目录',
    properties: ['createDirectory', 'openDirectory']
  })
  if (!res.canceled && res.filePaths.length) {
    return res.filePaths[0]
  }
  return undefined
})
let mainWindow = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    skipTaskbar: false, // 任务栏图标隐藏
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray = null
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  tray = new Tray(path.resolve(__dirname, '../../resources/wallpaper.png'))
  const contextMenu = Menu.buildFromTemplate([{ label: '退出', role: 'quit' }])
  tray.setToolTip('wallpaper')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow.show()
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
