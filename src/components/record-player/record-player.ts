document.addEventListener('DOMContentLoaded', (event) => {
    const recordPlayer = new RecordPlayer();
    recordPlayer.createRecordPlayer(event);
});

class RecordPlayer {
    recordPlayerContainer: HTMLElement;
    recordPlayer: HTMLCanvasElement;

    recordPlayerSVG: HTMLElement;
    recordElement: HTMLElement;
    recordAlbumArt: string;

    cx: number = 0;
    cy: number = 0;
    outerRimRadius: number;

    index: number;
    step: number = 2;

    recordPlay: Animation;

    ctx: CanvasRenderingContext2D;

    constructor() {

        this.initComponents();
        this.setupContainers();
        this.setCenterPoint();
        
        this.outerRimRadius = this.recordPlayerSVG.getBoundingClientRect().width /2 - 20;

        this.recordAlbumArt = 'J Live - All Of The Above.jpg';

        this.index = 0;
    }

    createRecordPlayer: Function = (event: Event): void => {

        const rimContainerElement = document.getElementById('record-rim')!;
        rimContainerElement.setAttribute('width', `${this.cx * 2}px` );
        rimContainerElement.setAttribute('height', `${this.cy *2}px`);
        
        let rim = this.createCircle(this.cx, this.cy, this.outerRimRadius);
        rim = this.setSVGElementAttribute(rim, 'id', 'rim');
        
        let rimOuterBound = this.createCircle(this.cx, this.cy, this.outerRimRadius+6);
        rimOuterBound = this.setSVGElementAttribute(rimOuterBound, 'id', 'rim-outer-bound');

        let rimInnerStrip = this.createCircle(this.cx, this.cy, this.outerRimRadius-3);
        rimInnerStrip = this.setSVGElementAttribute(rimInnerStrip, 'id', 'rim-inner-strip');

        rimContainerElement.innerHTML += rim;
        rimContainerElement.innerHTML += rimOuterBound;
        rimContainerElement.innerHTML += rimInnerStrip;



        const recordSpinnerElement = document.getElementById('record-spinner')!;
        recordSpinnerElement.setAttribute('width', `${this.cx * 2}px` );
        recordSpinnerElement.setAttribute('height', `${this.cy *2}px`);

        let spinnerOuterBound = this.createCircle(this.cx, this.cy, this.outerRimRadius-5);
        spinnerOuterBound = this.setSVGElementAttribute(spinnerOuterBound, 'id', 'record-spinner-outer-strip');

        let art = '<image id="album-art" href="' + this.recordAlbumArt +'" draggable></image>';

        let spinner = this.createCircle(this.cx, this.cy, this.outerRimRadius-9);
        spinner = this.setSVGElementAttribute(spinnerOuterBound, 'id', 'record-spinner');

        let spinnerPad = this.createCircle(this.cx, this.cy, this.outerRimRadius-15);
        spinnerPad = this.setSVGElementAttribute(spinnerPad, 'id', 'record-spinner-pad');

        let record = this.createCircle(this.cx, this.cy, this.outerRimRadius-17);
        record = this.setSVGElementAttribute(record, 'id', 'record');

        let artClip = this.createCircle(this.cx, this.cy, this.outerRimRadius-14);
        artClip = this.setSVGElementAttribute(artClip, 'id', 'art-clip-circle');

        let recordInlay = this.createCircle(this.cx, this.cy, 50);
        recordInlay = this.setSVGElementAttribute(recordInlay, 'id', 'record-inlay');

        let recordInnerRim = this.createCircle(this.cx, this.cy, 27);
        recordInnerRim = this.setSVGElementAttribute(recordInnerRim, 'id', 'record-inner-rim');

        let recordSpinnerPin = this.createCircle(this.cx, this.cy, 5);
        recordSpinnerPin = this.setSVGElementAttribute(recordSpinnerPin, 'id', 'record-spinner-pin');

        recordSpinnerElement.innerHTML += spinnerOuterBound;
        recordSpinnerElement.innerHTML += spinner;
        recordSpinnerElement.innerHTML += spinnerPad;
        recordSpinnerElement.innerHTML += record;
        recordSpinnerElement.innerHTML += art;
        recordSpinnerElement.innerHTML += recordInlay;
        recordSpinnerElement.innerHTML += recordInnerRim;
        recordSpinnerElement.innerHTML += recordSpinnerPin;


        let artClipElement = document.getElementById('art-clip')!;
        artClipElement.innerHTML += artClip;

        this.recordElement = document.getElementById('album-art')!;
        this.recordElement.style.width = this.recordPlayerSVG.getBoundingClientRect().width +'px';
        this.recordElement.style.height = this.recordPlayerSVG.getBoundingClientRect().height + 'px';
        //recordElement.style.background = 'url("#pattern")';
        this.recordElement.style.backgroundPosition = 'center';
        this.recordElement.setAttribute('clip-path', 'url(#art-clip)');
        this.recordElement.style.transformOrigin = 'center';

        this.recordElement.addEventListener('dragstart', (event: DragEvent): void => {
            const target = event.target;
        });

        

        this.recordElement.addEventListener('dragend', (event: DragEvent): void => {
            console.log('Drag End...');
        });

        this.recordPlayerContainer.addEventListener('dragover', (event: DragEvent): void => {
            console.log('Drag Over');
        });

        this.recordPlayerContainer.addEventListener('drop', (event: DragEvent)=> {
            console.log('Drop');
        });

        const spinnerPadElement = document.getElementById('record-spinner-pad')!;
        spinnerPadElement.addEventListener('dragover', (event: DragEvent): void => {
            console.log('Drag Over');
        });

        spinnerPadElement.addEventListener('drop', (event: DragEvent)=> {
            console.log('Drop');
        });

        const recordSpinning = [
            { transform: 'rotate(0)', color: '#000' },
            { color: '#431236', offset: 0.3 },
            { transform: 'rotate(360deg)', color: '#000' }
        ];

        const recordTiming = {
            duration: 3000,
            iterations: Infinity
        }

        this.recordPlay = this.recordElement.animate(recordSpinning, recordTiming);
        this.recordPlay.pause();
        //this.rotate();
    }

    rotate: Function = (timestamp?: number) => {
        if(this.index >= 360) {
            this.index = 0;
        }
        this.recordElement.style.transform = 'rotate(' + this.index +'deg)';

        this.index +=  this.step;
        window.requestAnimationFrame(this.rotate as FrameRequestCallback);
    }

    onReady: Function = (event: Event) => {
        this.recordPlayer! = document.getElementById('record-player') as HTMLCanvasElement;
        this.recordPlayerContainer = this.recordPlayer.parentElement as HTMLElement;

        const parentBounds = this.recordPlayerContainer.getBoundingClientRect();
        this.recordPlayer.setAttribute('width', parentBounds.width+'px');
        this.recordPlayer.setAttribute('height', parentBounds.height+'px');

        this.cursor = {
            x: this.recordPlayer.getBoundingClientRect().width/2,
            y: this.recordPlayer.getBoundingClientRect().width/2,
        };

        

            this.ctx = this.recordPlayer.getContext("2d") as CanvasRenderingContext2D;

            this.generateParticles(101);
            //this.setSize();
            
            this.drawRim();

            this.draw();

            

            addEventListener("mousemove", (e) => {
                this.cursor.x = this.recordPlayer.getBoundingClientRect().width/2;
                this.cursor.y = this.recordPlayer.getBoundingClientRect().height/2;
            });

            /* addEventListener(
                "touchmove",
                (e) => {
                    e.preventDefault();
                    this.cursor.x = e.touches[0].clientX;
                    this.cursor.y = e.touches[0].clientY;
                },
                { passive: false }
            ); */

            //addEventListener("resize", () => this.setSize());
    }

    drawRim: Function = () => {
        const cx = this.recordPlayer.getBoundingClientRect().width / 2;
        const cy = this.recordPlayer.getBoundingClientRect().height / 2;
        const outerRimRadius = this.recordPlayer.getBoundingClientRect().width /2 - 20;

        this.ctx.clearRect(0, 0, cx, cy);
        
        

        //Record Player Container

        // Main Rim
        this.ctx.beginPath();
        this.ctx.lineWidth = 8;
        this.ctx.strokeStyle = 'black';
        this.ctx.imageSmoothingEnabled = true;

        this.ctx.arc(cx, cy, outerRimRadius, 0, Math.PI * 2, true); 
        this.ctx.stroke();

        //Main Rim: Outer BOund
        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'blue';
        this.ctx.imageSmoothingEnabled = true;

        this.ctx.arc(cx, cy, outerRimRadius+6, 0, Math.PI * 2, true); 
        this.ctx.stroke();

        //Main Rim: Inner Strip bound
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'blue';
        this.ctx.imageSmoothingEnabled = true;

        this.ctx.arc(cx, cy, outerRimRadius-3, 0, Math.PI * 2, true); 
        this.ctx.stroke();

    }

    draw: Function = (timestamp: any) => {

        if (this.ctx) {
            
            const cx = this.recordPlayer.getBoundingClientRect().width / 2;
            const cy = this.recordPlayer.getBoundingClientRect().height / 2;
            const outerRimRadius = this.recordPlayer.getBoundingClientRect().width /2 - 20;

            const indexRad = (this.index-90) * Math.PI / 180.0;

            this.ctx.clearRect(0, 0, this.recordPlayer.getBoundingClientRect().width, this.recordPlayer.getBoundingClientRect().height);

            this.drawRim();

            //Deck: Outer Strip bound
            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'white';
            this.ctx.imageSmoothingEnabled = true;

            this.ctx.arc(cx, cy, outerRimRadius-5, 0, Math.PI * 2); 
            this.ctx.stroke();

            //Deck: body
            this.ctx.beginPath();
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = 'rgb(31, 75, 31)';
            this.ctx.imageSmoothingEnabled = true;

            this.ctx.arc(cx, cy, outerRimRadius-9, 0, Math.PI * 2); 
            this.ctx.stroke();

            //Deck: Record Pad
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'black';
            this.ctx.fillStyle = 'green';
            this.ctx.imageSmoothingEnabled = true;

            this.ctx.arc(cx, cy, outerRimRadius-15, 0, Math.PI * 2); 
            this.ctx.stroke();
            this.ctx.fill();

            // The Record
            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'white';
            this.ctx.imageSmoothingEnabled = true;

            const img = new Image();
            img.src = this.recordAlbumArt;
            img.width = this.recordPlayer.getBoundingClientRect().width - 1;
            img.height = this.recordPlayer.getBoundingClientRect().height - 1;
            const pattern = this.ctx.createPattern(img, 'no-repeat') as CanvasPattern;

            this.ctx.fillStyle = pattern;            

            this.ctx.arc(cx, cy, outerRimRadius-17, indexRad, indexRad + Math.PI * 2); 
            this.ctx.stroke();
            this.ctx.fill();     


            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = '#A2A';
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.arc(cx, cy, 54, 0, Math.PI * 2); 
            this.ctx.stroke();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = '#58A';
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.arc(cx, cy, 30, 0, Math.PI * 2); 
            this.ctx.stroke();
            this.ctx.fill();

            // Record player center pin
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = '#000';
            this.ctx.imageSmoothingEnabled = true;

            this.ctx.arc(cx, cy, 5, 0, Math.PI * 2);

            this.ctx.stroke();
            this.ctx.fill();

            this.index = this.index + this.step;


            
            this.particlesArray.forEach((particle) => particle.rotate(this.ctx, this.cursor));
        
            window.requestAnimationFrame(this.draw as FrameRequestCallback);
          }
    }
            
    cursor = {
        x: 0,
        y: 0,
    };

    particlesArray: Particle[] = [];

    generateParticles: Function = (amount: number) => {
        for (let i = 0; i < amount; i++) {
            this.particlesArray[i] = new Particle(
                this.recordPlayer.getBoundingClientRect().width / 2,
                this.recordPlayer.getBoundingClientRect().height / 2,
                4,
                this.generateColor(),
                0.02
            );
        }
    }

    generateColor: Function = () => {
        let hexSet = "0123456789ABCDEF";
        let finalHexString = "#";
        for (let i = 0; i < 6; i++) {
            finalHexString += hexSet[Math.ceil(Math.random() * 15)];
        }
        return finalHexString;
    }

    setSize = () => {
        this.recordPlayer.height = innerHeight;
        this.recordPlayer.width = innerWidth;
    }

    createCircle: Function = (cx: number, cy: number, radius: number) => {
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>';
    }
    
    createRectangle: Function = (startX: string, startY: string, width: string, height: string, radiusX: string, radiusY: string): string => {
        if(typeof radiusX === 'undefined' || typeof radiusY === 'undefined') {
            return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
        }
        return '<rect x="' + startX + '" y="' + startY + '" rx="' + radiusX + '" ry="' + radiusY + '" width="' + width + '" height="' + height + '"/>';
    }
    
    createEmptyPath = (): string => {
        return '<path />';
        
    }
    
    createArc: Function = (radiusX: string, radiusY: string, xAxisRotation: string, largeArcFlag: string, sweepFlag: string, x: string, y: string): string => {
        return '<path d="A ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
    }
    
   createArcStartingAt: Function = (startX: string, startY: string, radiusX: string, radiusY: string, xAxisRotation: string, largeArcFlag: string, sweepFlag: string, x: string, y: string):  string => {
        return '<path d="M ' + startX + ' ' + startY + ' a ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
    }
    
    createRectangleCenteredAt: Function = (centerX: number, centerY: number, width: number, height:  number): string => {
        return '<rect x="' + (centerX - (width / 2)) + '" y="' + (centerY - (height / 2)) + '" width="' + width + '" height="' + height + '"/>';
    }
    
    createBezierCurveStartingAt: Function = (centerX: number, centerY: number, x1: number, y1: number, x2: number, y2: number, x: number, y: number): string => {
        return '<path d="M ' + centerX + ' '+ centerY + ' C ' + x1 +' '+ y1 +', ' + x2 + ' ' + y2 + ', ' + x + ' ' + y + '"/>';
    }

    createGElement: Function = (): string => {
        return '<g ></g>';
    }
    
    createPath: Function = (paths: {command:string, values: []}[]): string => {
        let path = 'd="';
    
        for (let index = 0; index < paths.length; index++) {
            path = path + paths[index].command + ' ';

            const values = Object.values(paths[index].values);
            path = path + values.join(' ');
        }
        return path + '"';
    }
    
    setSVGElementAttribute: Function = (element: string, attribute: string, value: string): string => {
        let elementSubstring = element.split(' ');
        let firstPart = [elementSubstring[0]];
        let lastPart = elementSubstring.slice(1);
    
        const elementAttr = attribute + `="` + value + `"`;
        firstPart.push(' ' + elementAttr);
    
        return firstPart.concat(lastPart).join(' ');
    }

    private setCenterPoint() {
        this.cx = this.recordPlayerSVG.getBoundingClientRect().width / 2;
        this.cy = this.recordPlayerSVG.getBoundingClientRect().height / 2;
    }

    private setupContainers() {
        const parentBounds = this.recordPlayerContainer.getBoundingClientRect();
        this.recordPlayerSVG.setAttribute('width', parentBounds.width + 'px');
        this.recordPlayerSVG.setAttribute('height', parentBounds.height + 'px');
        this.recordPlayerSVG.setAttribute('viewBox', '0 0 ' + parentBounds.width + ' ' + parentBounds.height + '');
    }

    private initComponents() {
        this.recordPlayerSVG! = document.getElementById('record-player') as HTMLElement;
        this.recordPlayerContainer = this.recordPlayerSVG.parentElement as HTMLElement;
    }
}


class Particle {
    x: number;
    y: number;
    particleTrailWidth: number;
    strokeColor: string;
    theta: number;
    rotateSpeed: number;
    t: number;

    constructor(x: number, y: number, particleTrailWidth: number, strokeColor: string, rotateSpeed: number) {
        this.x = x;
        this.y = y;
        this.particleTrailWidth = particleTrailWidth;
        this.strokeColor = strokeColor;
        this.theta = Math.random() * Math.PI * 2;
        this.rotateSpeed = rotateSpeed;
        this.t = Math.random() * 150;
      
    }

    rotate: Function = (ctx: CanvasRenderingContext2D, cursor: any) => {
        const ls = {
          x: this.x,
          y: this.y,
        };

        this.theta += this.rotateSpeed;
        this.x = cursor.x + Math.cos(this.theta) * this.t;
        this.y = cursor.y + Math.sin(this.theta) * this.t;

        ctx.beginPath();
        ctx.lineWidth = this.particleTrailWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.moveTo(ls.x, ls.y);
        //ctx.globalAlpha = 0.5;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
}



