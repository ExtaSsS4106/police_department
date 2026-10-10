const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('authStorage', {
    load: () => ipcRenderer.invoke('auth:load'),
    save: (tokens) => ipcRenderer.invoke('auth:save', tokens),
    clear: () => ipcRenderer.invoke('auth:clear'),
    findApiBase: () => ipcRenderer.invoke('api:find-base')
});