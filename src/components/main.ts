
import { App, app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';

app.whenReady().then(() => {
    new Main(app);
});

class Main {

    private static lyre: App;
    private static controlPlane: LyreWindow;
    private static controlPlaneMenu: LyreWindow;

    private static mixer: LyreWindow;
    private static mixerTimeline: LyreWindow;
    private static decks: Map<number, LyreWindow> = new Map<number, LyreWindow>();
    private static mediaBrowser: LyreWindow;
    private static equalizer: LyreWindow;

    private static APP_TITLE: string = 'Lyre Media Player';

    private static preloadPath: string = './core/preload.js';

    constructor(app: App) {
        Main.lyre = app;

        Main.main();
    }

    private static createControlPlane = () => {
        this.controlPlane = new BrowserWindow({
            width: 90,
            height: 90,
            frame: false,
            transparent: true,
            webPreferences: {
                preload: path.join(__dirname, Main.preloadPath)
            }
        });
    
        this.controlPlane.title = Main.APP_TITLE;    
        this.controlPlane.loadFile(path.join(__dirname, LyreWindowPaths.controlPlane));
    }

    private static createWindow( viewPath: string, options: LyreWindowOptions, type: LyreWindowType): LyreWindow {
        const lyreWindow = new BrowserWindow(options);
        lyreWindow.loadFile(path.join(__dirname, viewPath));

        return lyreWindow;
    }

    private getAllWindows(): LyreWindow[] {
        const decks: LyreWindow[] = [];
        Main.decks.forEach((value, key) => {
            decks.push(value);
        })
        return [...decks, Main.controlPlane, Main.controlPlaneMenu, Main.mixer, Main.mixerTimeline, Main.mediaBrowser, Main.equalizer];
    }

    public static main(args?: string): void {

        // CREATE MAIN CONTROL PLANE (PARENT WINDOW)
        this.createControlPlane();

        // CREATE CHILD WINDOWS: MENU, MIXER, PLAYER DECK, EQ, TIMELINE, MEDIABROWSER
        
        // Control Plane Menu
        let bounds = Main.controlPlane.getBounds();

        const controlMenuOptions = {
            width: 288,
            height: 120,
            x: (bounds.x + bounds.width),
            y: (bounds.y - bounds.height),
            frame: false,
            transparent: true,
            fullscreenable: false,
            parent: Main.controlPlane
        }

        Main.controlPlaneMenu = this.createWindow(LyreWindowPaths.controlPlaneMenu, 
            controlMenuOptions, LyreWindowType.controlMenu);

        Main.controlPlaneMenu.hide();
        Main.controlPlaneMenu.closable = false;

        // Player Window
        const playerWindowOptions = {
            width: 748,
            height: 279,
            frame: false,
            transparent: true,
            webPreferences: {
                preload: path.join(__dirname, Main.preloadPath)
            }
        }

        const defaultDeck = Main.createWindow(LyreWindowPaths.player, 
            playerWindowOptions, LyreWindowType.deck);

        defaultDeck.title = 'Lyre Media Plaer - Deck 1';
        defaultDeck.loadFile(path.join(__dirname, LyreWindowPaths.player));
        
        const key = defaultDeck.id;
    
        Main.decks.set(key, defaultDeck);

        // EVENT HANDLERS
    
        Main.lyre.on('activate', () => {
            if(BrowserWindow.getAllWindows().length === 0) {
                this.createControlPlane();
            }
        });
    
        Main.lyre.on('browser-window-blur', (event: Electron.Event) => {
            const webContent = (event as IpcMainEvent).sender;
            webContent.send('blur-window', true);
        });
    
        Main.lyre.on('browser-window-focus', (event: Electron.Event) => {
            const webContent = (event as IpcMainEvent).sender;
            webContent.send('activate-window', true);
        });
    
        
        Main.controlPlane.on('blur', (event: Electron.Event) => {
            const webContent = (event as IpcMainEvent).sender;
            webContent.send('blur', true);
        })
    
        ipcMain.on('show-main-menu', (event: IpcMainEvent, show: boolean) => {
    
            if(show) {
    
                let bounds = Main.controlPlane.getBounds();
    
                Main.controlPlaneMenu.setBounds({
                    width: 320,
                    height: 120,
                    x: (bounds.x + bounds.width),
                    y: bounds.y
                })
                Main.controlPlaneMenu.show();
            } else {
                Main.controlPlaneMenu.hide();
            }
        })
    
        ipcMain.on('minimize-window', (event: IpcMainEvent, close: boolean) => {
            const target = event.sender;
            const targetWindow = BrowserWindow.fromWebContents(target);
            targetWindow?.minimize();
        })
    
        ipcMain.on('close-window', (event: IpcMainEvent, close: boolean | any) => {
            const target = event.sender;
            const targetWindow = BrowserWindow.fromWebContents(target);
            
            if(typeof targetWindow !== null) {
                const targetId = targetWindow!.id;
                targetWindow?.close();
                Main.decks.delete(targetId); //If Deck, Remove Deck from Map
            }
            
        })
    
        ipcMain.on('minimize-app', () => {
            Main.controlPlane.minimize();
        })
    
        ipcMain.on('close-app', () => {
            Main.lyre.quit();
        })

    }
}



interface LyreWindow  extends BrowserWindow {}

interface LyreWindowOptions extends BrowserWindowConstructorOptions {}

class LyreWindowPaths {
    static controlPlane: string = 'control-plane/index.html';
    static controlPlaneMenu: string = 'control-plane-menu/index.html';
    static mixer: string = 'mixer/index.html';
    static mixerTimeline: string = 'mixer-timeline/index.html';
    static mediaBrowser: string = 'media-browser/index.html';
    static equalizer: string = 'equalizer/index.html';
    static player: string = 'player-window/index.html';
    static settings: string = 'settings/index.html';
}

enum LyreWindowType {
    control, controlMenu, mixer, deck, timeline, equalizer, mediabrowser, settings
}







