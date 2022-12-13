document.addEventListener('DOMContentLoaded', (event) => contentReady(event));

const contentReady = (ev: Event): void => {
    const canvas = document.getElementById('vinyl-canvas') as HTMLCanvasElement;
    if(canvas) {
        const vinylPlayer = new VinylPlayer(canvas);
    }
}

class VinylPlayer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private vinylRIm: VinylRim;
    private vinylBase: VinylBase;

    
    private cx: number;
    private cy: number;
    public vinyl: Vinyl;

    constructor(canvas: HTMLCanvasElement) {
        if(canvas) {
            this.canvas = canvas;
            const context = this.canvas.getContext('2d');
            if(context) {
                this.context = context;

                this.init();
                this.drawVinylPlayer();
                
            }
        }

        
    }

    private init: Function = (): void => {
        const parent = this.canvas.parentElement as HTMLElement;
        this.canvas.width = parent.getBoundingClientRect().width;
        this.canvas.height = parent.getBoundingClientRect().height;

        this.cx = this.canvas.width / 2;
        this.cy = this.canvas.height / 2;
    }

    private drawVinylRim: Function = (): void => {
        this.vinylRIm = new VinylRim(this.context, 165);
        this.vinylRIm.draw();
    }

    private drawVinylBase: Function = (): void => {
        this.vinylBase = new VinylBase(this.context, 147);
        this.vinylBase.draw();
    }

    private drawVinyl: Function = (): void => {
        this.vinyl = new Vinyl(this.context, 137);
        this.vinyl.draw();
    }

    private drawVinylPlayer: Function = (): void => {
        
        //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);        

        this.drawVinylRim();

        this.drawVinylBase();

        this.drawVinyl();
        
        /* setTimeout(() => {
            if(this.rotationIndex >= 360) {
                this.rotationIndex = 0
            } else {
                this.rotationIndex += 15;
            }
            this.context.restore();
            this.draw();
        }, 50); */
        

    }
}


class VinylRim implements VinylInterface {
    context: CanvasRenderingContext2D;
    cx: number;
    cy: number;
    radius: number;
    thickness: number = 7;
    externalMargin: number = 2;
    internalMargin: number = 1;

    constructor(context: CanvasRenderingContext2D, radius: number) {
        this.context = context;
        this.cx = this.context.canvas.width / 2;
        this.cy = this.context.canvas.height / 2;
        this.radius = ((this.cx + this.cy) / 2) - ((this.cx + this.cy) / 2 - radius);
    }
    
    draw: Function = ():void => {
        /* RIm */
        this.context.beginPath()
        this.context.lineWidth = this.thickness;
        this.context.strokeStyle = 'rgb(24, 85, 218)';
        this.context.arc(this.cx, this.cy, this.radius, 0, Math.PI*2) 
        this.context.stroke();
        this.context.closePath();

        /* Rim Margins */
        this.createRimMargins();
    };
    

    private createRimMargins() {
        /* Rim Outer Margin */
        this.context.beginPath();
        this.context.lineWidth = this.externalMargin;
        this.context.strokeStyle = 'rgb(24, 85, 218)';
        this.context.arc(this.cx, this.cy, this.radius + (this.thickness / 2) + (this.externalMargin / 2), 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();

        /* Rim Inner Margin */
        this.context.beginPath();
        this.context.lineWidth = this.internalMargin;
        this.context.strokeStyle = 'rgb(24, 85, 218)';
        this.context.arc(this.cx, this.cy, this.radius - (this.thickness / 2) + (this.internalMargin / 2), 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
    }
}

class VinylBase implements VinylInterface {
    context: CanvasRenderingContext2D;
    cx: number;
    cy: number;
    radius: number;
    thickness: number = 22;
    externalMargin: number = 2;
    internalMargin: number = 1;

    constructor(context: CanvasRenderingContext2D, radius: number) {
        this.context = context;
        this.cx = this.context.canvas.width / 2;
        this.cy = this.context.canvas.height / 2;
        this.radius = ((this.cx + this.cy) / 2) - ((this.cx + this.cy) / 2 - radius);
    }

    draw: Function = ():void => {
        /* Base */
        this.createBase();
        this.createBaseMargins();
    };
    
    private createBase() {
        this.context.beginPath();
        this.context.lineWidth = this.thickness;
        this.context.strokeStyle = 'rgb(53, 51, 50)';
        this.context.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
    }

    private createBaseMargins() {

        /* Base Outer Margin */
        this.context.beginPath();
        this.context.lineWidth = this.externalMargin;
        this.context.strokeStyle = 'rgb(44, 44, 44)';
        this.context.arc(this.cx, this.cy, this.radius + (this.thickness / 2) + (this.externalMargin / 2), 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();

        /* Base Inner Margin */
        this.context.beginPath();
        this.context.lineWidth = this.internalMargin;
        this.context.strokeStyle = 'rgb(44, 44, 44)';
        this.context.arc(this.cx, this.cy, this.radius - (this.thickness / 2) + (this.internalMargin / 2), 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
    }
}

class Vinyl implements VinylInterface {
    context: CanvasRenderingContext2D;
    cx: number;
    cy: number;
    radius: number;
    thickness: number = 2;
    externalMargin: number = 1;
    internalMargin: number = 1;

    albumArt: HTMLImageElement;

    private rotationIndex: number;
    firstRun: boolean;

    constructor(context: CanvasRenderingContext2D, radius: number) {
        this.context = context;
        this.cx = this.context.canvas.width / 2;
        this.cy = this.context.canvas.height / 2;
        this.radius = ((this.cx + this.cy) / 2) - ((this.cx + this.cy) / 2 - radius);

        var image = new Image();
        image.src = "../J Live - All Of The Above.jpg";
        this.albumArt = image;

        this.rotationIndex = 0;
        this.firstRun = true;
    }

    draw: Function = ():void => {
        
        
        /* if(!this.firstRun) {
            this.context.translate(-this.cx, -this.cy);
        } else {
            this.firstRun = false;
        } */
        
        

        /* Vinyl Outer */
        this.createVinylRim();

        //this.context.drawImage (this.albumArt,this.context.canvas.width/8, this.context.canvas.height/8, this.radius*2, this.radius*2);

        /* Vinyl */
        /* Vinyl */
        this.createVinylRecord();

        /* Vinyl Inner Disc */
        this.createInnerDisc();

        /* Vinyl Hole */
        this.createVinylHolder();

        

        /* setTimeout(() => {
            if(this.rotationIndex >= 360) {
                this.rotationIndex = 0
            } else {
                this.rotationIndex += 1;
            }
            this.context.translate(this.cx, this.cy);
            this.context.rotate(this.rotationIndex * Math.PI / 180.0);
            this.draw();
        }, 300); */
    };

    private createVinylRim() {
        this.context.beginPath();
        this.context.lineWidth = this.externalMargin;
        this.context.fillStyle = 'rgb(31, 26, 19)';
        this.context.strokeStyle = 'rgb(243, 243, 243)';
        this.context.arc(this.cx, this.cy, this.radius + (this.thickness / 2) + (this.externalMargin / 2), 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }

    private createVinylRecord() {
        this.context.beginPath();
        this.context.arc(this.cx, this.cy, this.radius - (this.thickness / 2) + (this.internalMargin / 2), 0, Math.PI * 2);
        this.context.clip();
        this.context.drawImage(this.albumArt, 0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.closePath();
    }

    private createVinylHolder() {
        this.context.beginPath();
        this.context.lineWidth = this.internalMargin;
        this.context.strokeStyle = 'rgb(120, 120, 120)';
        this.context.fillStyle = 'rgb(80, 80, 80)';
        this.context.arc(this.cx, this.cy, 4, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }

    private createInnerDisc() {
        this.context.beginPath();
        this.context.lineWidth = this.internalMargin;
        this.context.strokeStyle = 'rgb(0, 0, 0)';
        this.context.fillStyle = 'rgba(144, 144, 144)';
        this.context.arc(this.cx, this.cy, this.radius / Math.PI, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    }
}

interface VinylInterface {
    context: CanvasRenderingContext2D;
    draw: Function;
}