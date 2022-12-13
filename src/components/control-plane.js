
document.onreadystatechange =  () => {
    if (document.readyState === 'complete') {

        const deck = document.getElementById('deck');

        const parent = deck.parentElement;

        const viewSize = 360;
        deck.style.width = parent.getBoundingClientRect().width + 'px';
        deck.style.height = parent.getBoundingClientRect().height + 'px';
        deck.setAttribute('viewBox', '0 0 '+ parent.getBoundingClientRect().width +' '+ parent.getBoundingClientRect().width +'');
        deck.setAttribute('xmlns', '"http://www.w3.org/2000/svg"');

        const deckBounds = deck.getBoundingClientRect();

        const cx = deckBounds.width / 2;
        const cy = deckBounds.height / 2;

        const buttonCenterX = cx - (cx / 2) + 10;
        const buttonCenterY = cy + (cy / 8);
        const buttonRadius = cx / 6;

        /*
        * Control Points 
        */
        const division_factor = Math.PI*1.2;   // THe Larger the Factor the smaller the difference.
        const curvesPointOffset = 20;

        const cPoint1 = {x: (cx-cx/division_factor), y: (cy-cy/division_factor)};
        const cPoint2 = {x: (cx-cx/division_factor), y: (cy+cy/division_factor)};
        const cPoint3 = {x: (cx+cx/division_factor), y: (cy+cy/division_factor)};
        const cPoint4 = {x: (cx+cx/division_factor), y: (cy-cy/division_factor)};

        /*
        * Component Shapes 
        */
        const arcs = [
            {
                command: 'M',
                values: cPoint1
            },
            {
                command: 'a',
                values: {radiusX: (cx/3), radiusY: (cy/3), xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: 0, y: cPoint2.y-cPoint1.y}
            },
            {
                command: 'a',
                values: {radiusX: (cx/2), radiusY: (cy/2), xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: cPoint3.x-cPoint2.x, y: 0}
            },
            {
                command: 'a',
                values: {radiusX: (cx/3), radiusY: (cy/3), xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: 0, y: cPoint4.y-cPoint3.y}
            },
            {
                command: 'a',
                values: {radiusX: (cx/3), radiusY: (cy/3), xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: cPoint1.x-cPoint4.x, y: 0}
            }
        ];

        const curves = [
            {
                command: 'M',
                values: cPoint1
            },
            {
                command: 'C',
                values: {x1: cPoint1.x + curvesPointOffset, y1: cPoint1.y, x2: cx - curvesPointOffset, y2: cPoint1.x - curvesPointOffset, x: cx, y: cPoint1.y - curvesPointOffset }
            },
            {
                command: 'S',
                values: {x2: cPoint4.x - curvesPointOffset, y2: cPoint4.y, x: cPoint4.x, y: cPoint4.y }
            },
            {
                command: 'A',
                values: {rx: (cx/3), ry: (cy/3), xAaxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: cPoint1.x, y: cPoint1.y }
            }
        ];

        
        let arc = '<path ' + createPath(arcs) + '/>';;
        arc = setSVGElementAttribute(arc, 'id', 'arc-1');
        deck.innerHTML = deck.innerHTML + arc;              

        let path = '<path ' + createPath(curves) + '/>';
        path = setSVGElementAttribute(path, 'id', 'toolbar');
        deck.innerHTML = deck.innerHTML + path;

        let buttonCircle = createCircle(buttonCenterX, buttonCenterY,buttonRadius);
        buttonCircle = setSVGElementAttribute(buttonCircle, 'id', 'menu-button-placeholder');
        deck.innerHTML = deck.innerHTML + buttonCircle;

        /* 
        * HTML Elements
        */

        let arcElement = document.getElementById('arc-1');
        arcElement.style.transformOrigin = cx +'px '+ cy +'px';
        arcElement.style.transform = 'rotate(-18deg)';

        let pathElement = document.getElementById('toolbar');  
        pathElement.style.transformOrigin = cx +'px '+ cy +'px';
        pathElement.style.transform = 'rotate(-18deg)';

        let buttonCircleElement = document.getElementById('menu-button-placeholder');  

    }
};

function createCircle(cx, cy, radius) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>';
}

function createRectangle(startX, startY, width, height, radiusX, radiusY) {
    if(typeof radiusX === 'undefined' || typeof radiusY === 'undefined') {
        return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
    }
    return '<rect x="' + startX + '" y="' + startY + '" rx="' + radiusX + '" ry="' + radiusY + '" width="' + width + '" height="' + height + '"/>';
}

function createPath() {
    return '<path />';
    
}

function createArc(radiusX, radiusY, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    return '<path d="A ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
}

function createArcStartingAt(startX, startY, radiusX, radiusY, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    return '<path d="M ' + startX + ' ' + startY + ' a ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
}

function createRectangleCenteredAt(centerX, centerY, width, height) {
    return '<rect x="' + (centerX - (width / 2)) + '" y="' + (centerY - (height / 2)) + '" width="' + width + '" height="' + height + '"/>';
}

function createBezierCurveStartingAt(centerX, centerY, x1, y1, x2, y2, x, y) {
    return '<path d="M ' + centerX + ' '+ centerY + ' C ' + x1 +' '+ y1 +', ' + x2 + ' ' + y2 + ', ' + x + ' ' + y + '"/>';
}

function createPath(paths) {
    let path = 'd="';

    for (let index = 0; index < paths.length; index++) {
        path = path + paths[index].command + ' ';
        const values = Object.values(paths[index].values);
        path = path + values.join(' ');
    }
    return path + '"';
}

function setSVGElementAttribute(element, attribute, value) {
    let elementSubstring = element.split(' ');
    let firstPart = [elementSubstring[0]];
    let lastPart = elementSubstring.slice(1);

    const elementAttr = attribute + '="' + value + '"';
    firstPart.push(' ' + elementAttr);

    return firstPart.concat(lastPart).join(' ');
}
