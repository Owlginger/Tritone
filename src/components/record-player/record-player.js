document.addEventListener('DOMContentLoaded', (event) => {
    const recordPlayer = new RecordPlayer();
    recordPlayer.createRecordPlayer(event);
});
class RecordPlayer {
    constructor() {
        this.cx = 0;
        this.cy = 0;
        this.step = 2;
        this.createRecordPlayer = (event) => {
            const rimContainerElement = document.getElementById('record-rim');
            rimContainerElement.setAttribute('width', `${this.cx * 2}px`);
            rimContainerElement.setAttribute('height', `${this.cy * 2}px`);
            let rim = this.createCircle(this.cx, this.cy, this.outerRimRadius);
            rim = this.setSVGElementAttribute(rim, 'id', 'rim');
            let rimOuterBound = this.createCircle(this.cx, this.cy, this.outerRimRadius + 6);
            rimOuterBound = this.setSVGElementAttribute(rimOuterBound, 'id', 'rim-outer-bound');
            let rimInnerStrip = this.createCircle(this.cx, this.cy, this.outerRimRadius - 3);
            rimInnerStrip = this.setSVGElementAttribute(rimInnerStrip, 'id', 'rim-inner-strip');
            rimContainerElement.innerHTML += rim;
            rimContainerElement.innerHTML += rimOuterBound;
            rimContainerElement.innerHTML += rimInnerStrip;
            const recordSpinnerElement = document.getElementById('record-spinner');
            recordSpinnerElement.setAttribute('width', `${this.cx * 2}px`);
            recordSpinnerElement.setAttribute('height', `${this.cy * 2}px`);
            let spinnerOuterBound = this.createCircle(this.cx, this.cy, this.outerRimRadius - 5);
            spinnerOuterBound = this.setSVGElementAttribute(spinnerOuterBound, 'id', 'record-spinner-outer-strip');
            let art = '<image id="album-art" href="' + this.recordAlbumArt + '" draggable></image>';
            let spinner = this.createCircle(this.cx, this.cy, this.outerRimRadius - 9);
            spinner = this.setSVGElementAttribute(spinnerOuterBound, 'id', 'record-spinner');
            let spinnerPad = this.createCircle(this.cx, this.cy, this.outerRimRadius - 15);
            spinnerPad = this.setSVGElementAttribute(spinnerPad, 'id', 'record-spinner-pad');
            let record = this.createCircle(this.cx, this.cy, this.outerRimRadius - 17);
            record = this.setSVGElementAttribute(record, 'id', 'record');
            let artClip = this.createCircle(this.cx, this.cy, this.outerRimRadius - 14);
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
            let artClipElement = document.getElementById('art-clip');
            artClipElement.innerHTML += artClip;
            this.recordElement = document.getElementById('album-art');
            this.recordElement.style.width = this.recordPlayerSVG.getBoundingClientRect().width + 'px';
            this.recordElement.style.height = this.recordPlayerSVG.getBoundingClientRect().height + 'px';
            //recordElement.style.background = 'url("#pattern")';
            this.recordElement.style.backgroundPosition = 'center';
            this.recordElement.setAttribute('clip-path', 'url(#art-clip)');
            this.recordElement.style.transformOrigin = 'center';
            this.recordElement.addEventListener('dragstart', (event) => {
                const target = event.target;
            });
            this.recordElement.addEventListener('dragend', (event) => {
                console.log('Drag End...');
            });
            this.recordPlayerContainer.addEventListener('dragover', (event) => {
                console.log('Drag Over');
            });
            this.recordPlayerContainer.addEventListener('drop', (event) => {
                console.log('Drop');
            });
            const spinnerPadElement = document.getElementById('record-spinner-pad');
            spinnerPadElement.addEventListener('dragover', (event) => {
                console.log('Drag Over');
            });
            spinnerPadElement.addEventListener('drop', (event) => {
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
            };
            this.recordPlay = this.recordElement.animate(recordSpinning, recordTiming);
            this.recordPlay.pause();
            //this.rotate();
        };
        this.rotate = (timestamp) => {
            if (this.index >= 360) {
                this.index = 0;
            }
            this.recordElement.style.transform = 'rotate(' + this.index + 'deg)';
            this.index += this.step;
            window.requestAnimationFrame(this.rotate);
        };
        this.onReady = (event) => {
            this.recordPlayer = document.getElementById('record-player');
            this.recordPlayerContainer = this.recordPlayer.parentElement;
            const parentBounds = this.recordPlayerContainer.getBoundingClientRect();
            this.recordPlayer.setAttribute('width', parentBounds.width + 'px');
            this.recordPlayer.setAttribute('height', parentBounds.height + 'px');
            this.cursor = {
                x: this.recordPlayer.getBoundingClientRect().width / 2,
                y: this.recordPlayer.getBoundingClientRect().width / 2,
            };
            this.ctx = this.recordPlayer.getContext("2d");
            this.generateParticles(101);
            //this.setSize();
            this.drawRim();
            this.draw();
            addEventListener("mousemove", (e) => {
                this.cursor.x = this.recordPlayer.getBoundingClientRect().width / 2;
                this.cursor.y = this.recordPlayer.getBoundingClientRect().height / 2;
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
        };
        this.drawRim = () => {
            const cx = this.recordPlayer.getBoundingClientRect().width / 2;
            const cy = this.recordPlayer.getBoundingClientRect().height / 2;
            const outerRimRadius = this.recordPlayer.getBoundingClientRect().width / 2 - 20;
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
            this.ctx.arc(cx, cy, outerRimRadius + 6, 0, Math.PI * 2, true);
            this.ctx.stroke();
            //Main Rim: Inner Strip bound
            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'blue';
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.arc(cx, cy, outerRimRadius - 3, 0, Math.PI * 2, true);
            this.ctx.stroke();
        };
        this.draw = (timestamp) => {
            if (this.ctx) {
                const cx = this.recordPlayer.getBoundingClientRect().width / 2;
                const cy = this.recordPlayer.getBoundingClientRect().height / 2;
                const outerRimRadius = this.recordPlayer.getBoundingClientRect().width / 2 - 20;
                const indexRad = (this.index - 90) * Math.PI / 180.0;
                this.ctx.clearRect(0, 0, this.recordPlayer.getBoundingClientRect().width, this.recordPlayer.getBoundingClientRect().height);
                this.drawRim();
                //Deck: Outer Strip bound
                this.ctx.beginPath();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'white';
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.arc(cx, cy, outerRimRadius - 5, 0, Math.PI * 2);
                this.ctx.stroke();
                //Deck: body
                this.ctx.beginPath();
                this.ctx.lineWidth = 10;
                this.ctx.strokeStyle = 'rgb(31, 75, 31)';
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.arc(cx, cy, outerRimRadius - 9, 0, Math.PI * 2);
                this.ctx.stroke();
                //Deck: Record Pad
                this.ctx.beginPath();
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'black';
                this.ctx.fillStyle = 'green';
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.arc(cx, cy, outerRimRadius - 15, 0, Math.PI * 2);
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
                const pattern = this.ctx.createPattern(img, 'no-repeat');
                this.ctx.fillStyle = pattern;
                this.ctx.arc(cx, cy, outerRimRadius - 17, indexRad, indexRad + Math.PI * 2);
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
                window.requestAnimationFrame(this.draw);
            }
        };
        this.cursor = {
            x: 0,
            y: 0,
        };
        this.particlesArray = [];
        this.generateParticles = (amount) => {
            for (let i = 0; i < amount; i++) {
                this.particlesArray[i] = new Particle(this.recordPlayer.getBoundingClientRect().width / 2, this.recordPlayer.getBoundingClientRect().height / 2, 4, this.generateColor(), 0.02);
            }
        };
        this.generateColor = () => {
            let hexSet = "0123456789ABCDEF";
            let finalHexString = "#";
            for (let i = 0; i < 6; i++) {
                finalHexString += hexSet[Math.ceil(Math.random() * 15)];
            }
            return finalHexString;
        };
        this.setSize = () => {
            this.recordPlayer.height = innerHeight;
            this.recordPlayer.width = innerWidth;
        };
        this.createCircle = (cx, cy, radius) => {
            return '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>';
        };
        this.createRectangle = (startX, startY, width, height, radiusX, radiusY) => {
            if (typeof radiusX === 'undefined' || typeof radiusY === 'undefined') {
                return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
            }
            return '<rect x="' + startX + '" y="' + startY + '" rx="' + radiusX + '" ry="' + radiusY + '" width="' + width + '" height="' + height + '"/>';
        };
        this.createEmptyPath = () => {
            return '<path />';
        };
        this.createArc = (radiusX, radiusY, xAxisRotation, largeArcFlag, sweepFlag, x, y) => {
            return '<path d="A ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
        };
        this.createArcStartingAt = (startX, startY, radiusX, radiusY, xAxisRotation, largeArcFlag, sweepFlag, x, y) => {
            return '<path d="M ' + startX + ' ' + startY + ' a ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
        };
        this.createRectangleCenteredAt = (centerX, centerY, width, height) => {
            return '<rect x="' + (centerX - (width / 2)) + '" y="' + (centerY - (height / 2)) + '" width="' + width + '" height="' + height + '"/>';
        };
        this.createBezierCurveStartingAt = (centerX, centerY, x1, y1, x2, y2, x, y) => {
            return '<path d="M ' + centerX + ' ' + centerY + ' C ' + x1 + ' ' + y1 + ', ' + x2 + ' ' + y2 + ', ' + x + ' ' + y + '"/>';
        };
        this.createGElement = () => {
            return '<g ></g>';
        };
        this.createPath = (paths) => {
            let path = 'd="';
            for (let index = 0; index < paths.length; index++) {
                path = path + paths[index].command + ' ';
                const values = Object.values(paths[index].values);
                path = path + values.join(' ');
            }
            return path + '"';
        };
        this.setSVGElementAttribute = (element, attribute, value) => {
            let elementSubstring = element.split(' ');
            let firstPart = [elementSubstring[0]];
            let lastPart = elementSubstring.slice(1);
            const elementAttr = attribute + `="` + value + `"`;
            firstPart.push(' ' + elementAttr);
            return firstPart.concat(lastPart).join(' ');
        };
        this.initComponents();
        this.setupContainers();
        this.setCenterPoint();
        this.outerRimRadius = this.recordPlayerSVG.getBoundingClientRect().width / 2 - 20;
        this.recordAlbumArt = 'J Live - All Of The Above.jpg';
        this.index = 0;
    }
    setCenterPoint() {
        this.cx = this.recordPlayerSVG.getBoundingClientRect().width / 2;
        this.cy = this.recordPlayerSVG.getBoundingClientRect().height / 2;
    }
    setupContainers() {
        const parentBounds = this.recordPlayerContainer.getBoundingClientRect();
        this.recordPlayerSVG.setAttribute('width', parentBounds.width + 'px');
        this.recordPlayerSVG.setAttribute('height', parentBounds.height + 'px');
        this.recordPlayerSVG.setAttribute('viewBox', '0 0 ' + parentBounds.width + ' ' + parentBounds.height + '');
    }
    initComponents() {
        this.recordPlayerSVG = document.getElementById('record-player');
        this.recordPlayerContainer = this.recordPlayerSVG.parentElement;
    }
}
class Particle {
    constructor(x, y, particleTrailWidth, strokeColor, rotateSpeed) {
        this.rotate = (ctx, cursor) => {
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
        };
        this.x = x;
        this.y = y;
        this.particleTrailWidth = particleTrailWidth;
        this.strokeColor = strokeColor;
        this.theta = Math.random() * Math.PI * 2;
        this.rotateSpeed = rotateSpeed;
        this.t = Math.random() * 150;
    }
}
