document.addEventListener('DOMContentLoaded', (event) => {
    const radius = 27;
    const rangeDial = new RangeDial(radius);
    rangeDial.createRangeDial(event);
});
class RangeDial {
    constructor(radius) {
        this.rotateMin = -135; // Degrees
        this.rotateMax = 135; // Degrees
        this.rotationUnit = 5;
        this.createRangeDial = (eevent) => {
            this.dialRimContainer = document.getElementById('dial-rim');
            this.dialLevelsContainer = document.getElementById('dial-levels');
            this.dialCurrentLevelContainer = document.getElementById('current-level');
            //this.initContainerBounds(this.dialRimContainer, this.rangeDial);
            let rimBase = this.createCircle(this.centerX, this.centerY, this.radius - 3);
            rimBase = this.setSVGElementAttribute(rimBase, 'id', 'rim-base');
            let rimBaseOuter = this.createCircle(this.centerX, this.centerY, this.radius);
            rimBaseOuter = this.setSVGElementAttribute(rimBaseOuter, 'id', 'rim-base-outer');
            let rimBaseInner = this.createCircle(this.centerX, this.centerY, this.radius - 5);
            rimBaseInner = this.setSVGElementAttribute(rimBaseInner, 'id', 'rim-base-inner');
            this.dialRimContainer.innerHTML += rimBase;
            this.dialRimContainer.innerHTML += rimBaseOuter;
            this.dialRimContainer.innerHTML += rimBaseInner;
            const MIDPOINT = 0; // Degrees
            const CURRENTLEVEL = -30; // Degrees
            let index = this.rotateMin;
            let levelRadius = this.radius + 10;
            while (index < this.rotateMax) {
                //Degrees To Radians
                const indexRad = (index - 90) * Math.PI / 180.0;
                // cx = radius x cos(angle)  ; Angle in radians
                const cx = (levelRadius * (Math.cos(indexRad)));
                // cy = radius x sin(angle)  ; Angle in radians
                const cy = (levelRadius * (Math.sin(indexRad)));
                let dot = this.createCircle(cx + this.centerX, cy + this.centerY, 1);
                dot = this.setSVGElementAttribute(dot, 'class', 'level');
                this.dialLevelsContainer.innerHTML += dot;
                index = index + this.rotationUnit;
            }
            let currentLevel = this.createCircle(((this.radius - 21) * (Math.cos((CURRENTLEVEL - 90) * Math.PI / 180.0))) + this.centerX, ((this.radius - 21) * (Math.sin((CURRENTLEVEL - 90) * Math.PI / 180.0))) + this.centerY, 2);
            currentLevel = this.setSVGElementAttribute(currentLevel, 'id', 'current-level-indicator');
            this.dialCurrentLevelContainer.innerHTML += currentLevel;
        };
        this.createLine = (x1, y1, x2, y2) => {
            return '<line x1="' + x1 + '" x2="' + x2 + '" y1="' + y1 + '" y2="' + y2 + '"/>';
        };
        this.createCircle = (cx, cy, radius) => {
            return '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>';
        };
        this.createRectangle = (startX, startY, width, height, radiusX, radiusY) => {
            if (typeof radiusX === 'undefined' || typeof radiusY === 'undefined') {
                return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
            }
            return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
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
        this.rangeDial = document.getElementById('range-dial');
        this.rangeDialContainer = this.rangeDial.parentElement;
        this.initContainerBounds(this.rangeDial, this.rangeDialContainer);
        this.centerX = this.rangeDial.getBoundingClientRect().width / 2;
        this.centerY = this.rangeDial.getBoundingClientRect().height / 2;
        this.radius = radius;
    }
    initContainerBounds(element, parent) {
        const parentBounds = parent.getBoundingClientRect();
        element.setAttribute('width', parentBounds.width + 'px');
        element.setAttribute('height', parentBounds.height + 'px');
        element.setAttribute('viewBox', '0 0 ' + parentBounds.width + ' ' + parentBounds.height + '');
    }
}
