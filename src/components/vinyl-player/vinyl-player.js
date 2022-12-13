document.addEventListener('DOMContentLoaded', function (event) { return contentReady(event); });
var contentReady = function (ev) {
    var canvas = document.getElementById('vinyl-canvas');
    if (canvas) {
        var vinylPlayer = new VinylPlayer(canvas);
    }
};
var VinylPlayer = /** @class */ (function () {
    function VinylPlayer(canvas) {
        var _this = this;
        this.init = function () {
            var parent = _this.canvas.parentElement;
            _this.canvas.width = parent.getBoundingClientRect().width;
            _this.canvas.height = parent.getBoundingClientRect().height;
            _this.cx = _this.canvas.width / 2;
            _this.cy = _this.canvas.height / 2;
        };
        this.drawVinylRim = function () {
            _this.vinylRIm = new VinylRim(_this.context, 165);
            _this.vinylRIm.draw();
        };
        this.drawVinylBase = function () {
            _this.vinylBase = new VinylBase(_this.context, 147);
            _this.vinylBase.draw();
        };
        this.drawVinyl = function () {
            _this.vinyl = new Vinyl(_this.context, 137);
            _this.vinyl.draw();
        };
        this.drawVinylPlayer = function () {
            //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);        
            _this.drawVinylRim();
            _this.drawVinylBase();
            _this.drawVinyl();
            /* setTimeout(() => {
                if(this.rotationIndex >= 360) {
                    this.rotationIndex = 0
                } else {
                    this.rotationIndex += 15;
                }
                this.context.restore();
                this.draw();
            }, 50); */
        };
        if (canvas) {
            this.canvas = canvas;
            var context = this.canvas.getContext('2d');
            if (context) {
                this.context = context;
                this.init();
                this.drawVinylPlayer();
            }
        }
    }
    return VinylPlayer;
}());
var VinylRim = /** @class */ (function () {
    function VinylRim(context, radius) {
        var _this = this;
        this.thickness = 7;
        this.externalMargin = 2;
        this.internalMargin = 1;
        this.draw = function () {
            /* RIm */
            _this.context.beginPath();
            _this.context.lineWidth = _this.thickness;
            _this.context.strokeStyle = 'rgb(24, 85, 218)';
            _this.context.arc(_this.cx, _this.cy, _this.radius, 0, Math.PI * 2);
            _this.context.stroke();
            _this.context.closePath();
            /* Rim Margins */
            _this.createRimMargins();
        };
        this.context = context;
        this.cx = this.context.canvas.width / 2;
        this.cy = this.context.canvas.height / 2;
        this.radius = ((this.cx + this.cy) / 2) - ((this.cx + this.cy) / 2 - radius);
    }
    VinylRim.prototype.createRimMargins = function () {
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
    };
    return VinylRim;
}());
var VinylBase = /** @class */ (function () {
    function VinylBase(context, radius) {
        var _this = this;
        this.thickness = 22;
        this.externalMargin = 2;
        this.internalMargin = 1;
        this.draw = function () {
            /* Base */
            _this.createBase();
            _this.createBaseMargins();
        };
        this.context = context;
        this.cx = this.context.canvas.width / 2;
        this.cy = this.context.canvas.height / 2;
        this.radius = ((this.cx + this.cy) / 2) - ((this.cx + this.cy) / 2 - radius);
    }
    VinylBase.prototype.createBase = function () {
        this.context.beginPath();
        this.context.lineWidth = this.thickness;
        this.context.strokeStyle = 'rgb(53, 51, 50)';
        this.context.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
    };
    VinylBase.prototype.createBaseMargins = function () {
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
    };
    return VinylBase;
}());
var Vinyl = /** @class */ (function () {
    function Vinyl(context, radius) {
        var _this = this;
        this.thickness = 2;
        this.externalMargin = 1;
        this.internalMargin = 1;
        this.draw = function () {
            /* if(!this.firstRun) {
                this.context.translate(-this.cx, -this.cy);
            } else {
                this.firstRun = false;
            } */
            /* Vinyl Outer */
            _this.createVinylRim();
            //this.context.drawImage (this.albumArt,this.context.canvas.width/8, this.context.canvas.height/8, this.radius*2, this.radius*2);
            /* Vinyl */
            /* Vinyl */
            _this.createVinylRecord();
            /* Vinyl Inner Disc */
            _this.createInnerDisc();
            /* Vinyl Hole */
            _this.createVinylHolder();
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
    Vinyl.prototype.createVinylRim = function () {
        this.context.beginPath();
        this.context.lineWidth = this.externalMargin;
        this.context.fillStyle = 'rgb(31, 26, 19)';
        this.context.strokeStyle = 'rgb(243, 243, 243)';
        this.context.arc(this.cx, this.cy, this.radius + (this.thickness / 2) + (this.externalMargin / 2), 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    };
    Vinyl.prototype.createVinylRecord = function () {
        this.context.beginPath();
        this.context.arc(this.cx, this.cy, this.radius - (this.thickness / 2) + (this.internalMargin / 2), 0, Math.PI * 2);
        this.context.clip();
        this.context.drawImage(this.albumArt, 0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.closePath();
    };
    Vinyl.prototype.createVinylHolder = function () {
        this.context.beginPath();
        this.context.lineWidth = this.internalMargin;
        this.context.strokeStyle = 'rgb(120, 120, 120)';
        this.context.fillStyle = 'rgb(80, 80, 80)';
        this.context.arc(this.cx, this.cy, 4, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    };
    Vinyl.prototype.createInnerDisc = function () {
        this.context.beginPath();
        this.context.lineWidth = this.internalMargin;
        this.context.strokeStyle = 'rgb(0, 0, 0)';
        this.context.fillStyle = 'rgba(144, 144, 144)';
        this.context.arc(this.cx, this.cy, this.radius / Math.PI, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
        this.context.closePath();
    };
    return Vinyl;
}());
