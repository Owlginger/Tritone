import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';


export type electronBridge = {
    closeApp: (close: IpcRendererEvent) => void,
    minimizeApp: (minimize: IpcRendererEvent) => void,
    closeWindow: (close: IpcRendererEvent) => void,
    minimizeWindow: (minimize: IpcRendererEvent) => void,
    showMainMenu: (show: IpcRendererEvent) => void,
    onWindowBlur: (eventType: string, callback: Function) => void,
    onActivate: (eventType: string, callback: Function) => void
}

const electronApi : electronBridge = {
    closeApp: (close) => {
        ipcRenderer.send('close-app', close);
    },
    minimizeApp: (minimize) => {
        ipcRenderer.send('minimize-app', minimize);
    },
    closeWindow: (close) => {
        ipcRenderer.send('close-window', close);
    },
    minimizeWindow: (minimize) => {
        ipcRenderer.send('minimize-window', minimize);
    },
    showMainMenu: (show) => {
        ipcRenderer.send('show-main-menu', show)
    },
    onWindowBlur: (eventType, callback) => {
        ipcRenderer.on('blur-window', callback());
    },
    onActivate: (eventType, callback) => {
        ipcRenderer.on('activate-window', callback());
    }
}

contextBridge.exposeInMainWorld('electron', electronApi);