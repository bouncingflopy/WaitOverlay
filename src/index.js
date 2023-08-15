const { app, BrowserWindow, ipcMain, Tray, globalShortcut, session } = require('electron');
const path = require('path');
require("electron-reload")(__dirname)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  session.defaultSession.webRequest.onBeforeRequest({
    urls: [
      'https://embed.twitch.tv/*channel=*'
    ]
  }, (details, cb) => {
    var redirectURL = details.url;

    var params = new URLSearchParams(redirectURL.replace('https://embed.twitch.tv/',''));
    if (params.get('parent') != '') {
        cb({});
        return;
    }
    params.set('parent', 'localhost');
    params.set('referrer', 'https://localhost/');

    var redirectURL = 'https://embed.twitch.tv/?' + params.toString();

    cb({
      cancel: false,
      redirectURL
    });
  });

  // works for dumb iFrames
  session.defaultSession.webRequest.onHeadersReceived({
    urls: [
      'https://www.twitch.tv/*',
      'https://player.twitch.tv/*',
      'https://embed.twitch.tv/*'
    ]
  }, (details, cb) => {
    var responseHeaders = details.responseHeaders;

    delete responseHeaders['Content-Security-Policy'];

    cb({
      cancel: false,
      responseHeaders
    });
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    skipTaskbar: true,
    transparent: true,
    minWidth: 700,
    minHeight: 500,
    type: "toolbar",
  });

  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);
  mainWindow.setAlwaysOnTop(true, "normal");

  function hide() {
    mainWindow.hide();
    mainWindow.webContents.executeJavaScript(`
      pauseTwitch();
      pauseYoutube();
    `);
  }

  function show() {
    mainWindow.show();
    mainWindow.webContents.executeJavaScript(`
      if (document.getElementById("mode").innerHTML === 'twitch') {
        playTwitch();
      } else if (document.getElementById("mode").innerHTML === 'youtube') {
        playYoutube();
      }
    `);
  }

  ipcMain.on("hide", () => hide());

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  tray = new Tray(path.join(__dirname, "/icon.ico"))

  tray.on('click', () => {
    if (mainWindow.isVisible() && !mainWindow.isMinimized()) {
      hide()
    } else {
      show()
    }
  })

  globalShortcut.register('\`', () => {
    if (mainWindow.isVisible() && !mainWindow.isMinimized()) {
      hide()
    } else {
      show()
    }
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.