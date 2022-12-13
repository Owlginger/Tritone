import { App, app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';

app.whenReady().then(() => {
    
    /*  Start Tritone. 
        Pass app: Electron.App as a parameter to the Tritone application.
    */
    new Tritone(app);
});

/* @Class Tritone
   - The Tritone Application class.
   - The @class Tritone class is the main entry point to the Tritone application */

class Tritone {
    private tritone: App;
    private static mainWindow: BrowserWindow;

    private static controlPlane: TritoneWindow;
    private static controlPlaneMenu: TritoneWindow;

    private static mixer: TritoneWindow;
    private static mixerTimeline: TritoneWindow;
    private static decks: Map<number, TritoneWindow> = new Map<number, TritoneWindow>();
    private static mediaBrowser: TritoneWindow;
    private static equalizer: TritoneWindow;

    private static APP_TITLE: string = 'Tritone Audio';

    private static preloadPath: string = './core/preload.js';


    constructor(app: App) {    
        this.tritone = app; /* The Tritone application object. */

        Tritone.loadMainWindow(); /* Load the Tritone Main Control Plane Window. */

        /* CREATE MAIN CONTROL PLANE (PARENT WINDOW) */
        Tritone.createControlPlane();

        /* CREATE CHILD WINDOWS: MENU, MIXER, PLAYER DECK, EQ, TIMELINE, MEDIABROWSER */
        /* Control Plane Menu */
        let bounds = Tritone.controlPlane.getBounds();

        const controlMenuOptions = {
            width: 288,
            height: 120,
            x: (bounds.x + bounds.width),
            y: (bounds.y - bounds.height),
            frame: false,
            transparent: true,
            fullscreenable: false,
            parent: Tritone.controlPlane
        }

        Tritone.controlPlaneMenu = Tritone.createWindow(TritoneWindowPaths.controlPlaneMenu, controlMenuOptions, TritoneWindowType.controlMenu);

        Tritone.controlPlaneMenu.hide();
        Tritone.controlPlaneMenu.closable = false;

        /* Default Deck - Player Window */
        const playerWindowOptions = {
            width: 748,
            height: 279,
            frame: false,
            transparent: true,
            webPreferences: {
                preload: path.join(__dirname, Tritone.preloadPath)
            }
        }

        const defaultDeck = Tritone.createWindow(TritoneWindowPaths.player, playerWindowOptions, TritoneWindowType.deck);

        defaultDeck.title = 'Lyre Media Plaer - Deck 1';
        defaultDeck.loadFile(path.join(__dirname, TritoneWindowPaths.player));

        const key = defaultDeck.id;
        Tritone.decks.set(key, defaultDeck);

        /* zInitialize Event handlers. */
        this.attachEvents();
    }

    private attachEvents: Function = (): boolean => {

        this.tritone.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                Tritone.createControlPlane();
            }
        });

        this.tritone.on('browser-window-blur', (event: Electron.Event) => {
            const webContent = (event as IpcMainEvent).sender;
            webContent.send('blur-window', true);
        });

        this.tritone.on('browser-window-focus', (event: Electron.Event) => {
            const webContent = (event as IpcMainEvent).sender;
            webContent.send('activate-window', true);
        });

        Tritone.controlPlane.on('blur', (event: Electron.Event) => {
            const webContent = (event as IpcMainEvent).sender;
            webContent.send('blur', true);
        });

        ipcMain.on('show-main-menu', (event: IpcMainEvent, show: boolean) => {

            if (show) {

                let bounds = Tritone.controlPlane.getBounds();

                Tritone.controlPlaneMenu.setBounds({
                    width: 320,
                    height: 120,
                    x: (bounds.x + bounds.width),
                    y: bounds.y
                });
                Tritone.controlPlaneMenu.show();
            } else {
                Tritone.controlPlaneMenu.hide();
            }
        });

        ipcMain.on('minimize-window', (event: IpcMainEvent, close: boolean) => {
            const target = event.sender;
            const targetWindow = BrowserWindow.fromWebContents(target);
            targetWindow?.minimize();
        });

        ipcMain.on('close-window', (event: IpcMainEvent, close: boolean | any) => {
            const target = event.sender;
            const targetWindow = BrowserWindow.fromWebContents(target);

            if (typeof targetWindow !== null) {
                const targetId = targetWindow!.id;
                targetWindow?.close();
                Tritone.decks.delete(targetId); //If Deck, Remove Deck from Map
            }

        });

        ipcMain.on('minimize-app', () => {
            Tritone.controlPlane.minimize();
        });

        ipcMain.on('close-app', () => {
            this.tritone.quit();
        });

        return true;
    }

    private static loadMainWindow: Function = (): void => {
        Tritone.mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        });

        Tritone.mainWindow.loadFile('./tritone/index.html');
    }

    private static createWindow( viewPath: string, options: TritoneWindowOptions, type: TritoneWindowType): TritoneWindow {
        const tritoneWindow = new BrowserWindow(options);
        tritoneWindow.loadFile(path.join(__dirname, viewPath));

        return tritoneWindow;
    }

    private static createControlPlane = (): void => {
        Tritone.controlPlane = new BrowserWindow({
            width: 90,
            height: 90,
            frame: false,
            transparent: true,
            webPreferences: {
                preload: path.join(__dirname, Tritone.preloadPath)
            }
        });

        Tritone.controlPlane.title = Tritone.APP_TITLE;    
        Tritone.controlPlane.loadFile(path.join(__dirname, TritoneWindowPaths.controlPlane));
    }

    private getAllWindows(): TritoneWindow[] {
        const decks: TritoneWindow[] = [];
        Tritone.decks.forEach((value, key) => {
            decks.push(value);
        });

        return [...decks, Tritone.controlPlane, Tritone.controlPlaneMenu, Tritone.mixer, Tritone.mixerTimeline, Tritone.mediaBrowser, Tritone.equalizer];
    }

}

/* @Interface Tritone
    - Interface that represents a GUI Window in Tritone.
    - It extends the the Electron App @class BrowserWindow. */

interface TritoneWindow  extends BrowserWindow {}

/* @Interface TritoneWindowOptions
    - Interface that represents a GUI Window options object in Tritone
    - This interface extends the Electron App @class BrowserWindowConstructorOptions  */

interface TritoneWindowOptions extends BrowserWindowConstructorOptions {}

/* @Class  TritoneWindowPaths
   - This class is a container class for file paths that correspond to HTML files that are
    the views for all Tritone GUI windows.*/

class TritoneWindowPaths {
    static controlPlane: string = 'control-plane/index.html';
    static controlPlaneMenu: string = 'control-plane-menu/index.html';
    static mixer: string = 'mixer/index.html';
    static mixerTimeline: string = 'mixer-timeline/index.html';
    static mediaBrowser: string = 'media-browser/index.html';
    static equalizer: string = 'equalizer/index.html';
    static player: string = 'player-window/index.html';
    static settings: string = 'settings/index.html';
}

/* @Enum TritoneWindowType
   - Enumeration types that denote all the types of GUI windows in Tritone.*/

enum TritoneWindowType {
    control, controlMenu, mixer, deck, timeline, equalizer, mediabrowser, settings
}
