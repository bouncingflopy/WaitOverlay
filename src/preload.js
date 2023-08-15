const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {
    hide: () => ipcRenderer.send("hide")
});