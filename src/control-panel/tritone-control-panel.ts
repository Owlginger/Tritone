import { createCircle, createPath, Point, setSVGElementAttribute, SvgCommand } from '../svg-module/svg-module.js';

document.onreadystatechange =  () => {
    
    if (document.readyState === 'complete') {
        
        const xhr = new XMLHttpRequest();
        
        xhr.addEventListener('load', (event) => {

            const body = document.getElementsByTagName('tritone')[0];   //Acquire document body DOM element.
            const content = xhr.responseText;

            body.innerHTML += content;

            /* Initialize Tritone Control Plane */
            new ControlPlane();
            
        });

        xhr.open('GET', './control-panel/control-panel.html');

        xhr.send();
    }

};



/* Tritone Control Plane  */

class ControlPlane {
    private static deck: HTMLElement;
    private static parent: HTMLElement;

    private static viewSize: number;
    private static cx: number;
    private static cy: number;

    private static division_factor: number;   // THe Larger the Factor the smaller the difference.
    private static curvesPointOffset: number;

    private static deckBounds: DOMRect;

    private static buttonCenterX: number;
    private static buttonCenterY: number;
    private static buttonRadius: number;

    /* Control Plane SVG control points. */

    private static cPoint1: Point;
    private static cPoint2: Point;
    private static cPoint3: Point;
    private static cPoint4: Point;

    /* Control Plane GUI Svg draw commands */
    private static arcs: SvgCommand[];
    private static curves: SvgCommand[];

    constructor() {
        ControlPlane.deck = document.getElementById('deck');

        ControlPlane.parent = ControlPlane.deck.parentElement;

        ControlPlane.viewSize = 360;
        ControlPlane.deck.style.width = ControlPlane.parent.getBoundingClientRect().width + 'px';
        ControlPlane.deck.style.height = ControlPlane.parent.getBoundingClientRect().height + 'px';
        ControlPlane.deck.setAttribute('viewBox', '0 0 '+ ControlPlane.parent.getBoundingClientRect().width +' '+ ControlPlane.parent.getBoundingClientRect().width +'');
        ControlPlane.deck.setAttribute('xmlns', '"http://www.w3.org/2000/svg"');

        ControlPlane.deckBounds = ControlPlane.deck.getBoundingClientRect();

        ControlPlane.cx = ControlPlane.deckBounds.width / 2;
        ControlPlane.cy = ControlPlane.deckBounds.height / 2;

        ControlPlane.buttonCenterX = ControlPlane.cx - (ControlPlane.cx / 2) + 10;
        ControlPlane.buttonCenterY = ControlPlane.cy + (ControlPlane.cy / 8);
        ControlPlane.buttonRadius = ControlPlane.cx / 6;

        /*
        * Control Points 
        */
        ControlPlane.division_factor = Math.PI*1.2;   // THe Larger the Factor the smaller the difference.
        ControlPlane.curvesPointOffset = 20;

        ControlPlane.cPoint1 = {x: (ControlPlane.cx-ControlPlane.cx/ControlPlane.division_factor), y: (ControlPlane.cy-ControlPlane.cy/ControlPlane.division_factor)};
        ControlPlane.cPoint2 = {x: (ControlPlane.cx-ControlPlane.cx/ControlPlane.division_factor), y: (ControlPlane.cy+ControlPlane.cy/ControlPlane.division_factor)};
        ControlPlane.cPoint3 = {x: (ControlPlane.cx+ControlPlane.cx/ControlPlane.division_factor), y: (ControlPlane.cy+ControlPlane.cy/ControlPlane.division_factor)};
        ControlPlane.cPoint4 = {x: (ControlPlane.cx+ControlPlane.cx/ControlPlane.division_factor), y: (ControlPlane.cy-ControlPlane.cy/ControlPlane.division_factor)};

        /*
        * Component Shapes 
        */
        ControlPlane.arcs = [
            {
                command: 'M',
                values: ControlPlane.cPoint1
            },
            {
                command: 'a',
                values: {radiusX: (ControlPlane.cx/3), radiusY: (ControlPlane.cy/3), xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: 0, y: ControlPlane.cPoint2.y-ControlPlane.cPoint1.y}
            },
            {
                command: 'a',
                values: {radiusX: (ControlPlane.cx/2), radiusY: (ControlPlane.cy/2), xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: ControlPlane.cPoint3.x-ControlPlane.cPoint2.x, y: 0}
            },
            {
                command: 'a',
                values: {radiusX: (ControlPlane.cx/3), radiusY: (ControlPlane.cy/3), xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: 0, y: ControlPlane.cPoint4.y-ControlPlane.cPoint3.y}
            },
            {
                command: 'a',
                values: {radiusX: (ControlPlane.cx/3), radiusY: (ControlPlane.cy/3), xAxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: ControlPlane.cPoint1.x-ControlPlane.cPoint4.x, y: 0}
            }
        ];

        ControlPlane.curves = [
            {
                command: 'M',
                values: ControlPlane.cPoint1
            },
            {
                command: 'C',
                values: {x1: ControlPlane.cPoint1.x + ControlPlane.curvesPointOffset, y1: ControlPlane.cPoint1.y, x2: ControlPlane.cx - ControlPlane.curvesPointOffset, y2: ControlPlane.cPoint1.x - ControlPlane.curvesPointOffset, x: ControlPlane.cx, y: ControlPlane.cPoint1.y - ControlPlane.curvesPointOffset }
            },
            {
                command: 'S',
                values: {x2: ControlPlane.cPoint4.x - ControlPlane.curvesPointOffset, y2: ControlPlane.cPoint4.y, x: ControlPlane.cPoint4.x, y: ControlPlane.cPoint4.y }
            },
            {
                command: 'A',
                values: {rx: (ControlPlane.cx/3), ry: (ControlPlane.cy/3), xAaxisRotation: 0, largeArcFlag: 0, sweepFlag: 1, x: ControlPlane.cPoint1.x, y: ControlPlane.cPoint1.y }
            }
        ];

        ControlPlane.createElements();
    }
    
    private static createElements() {
        let arc = '<path ' + createPath(ControlPlane.arcs) + '/>';;
        arc = setSVGElementAttribute(arc, 'id', 'arc-1');
        ControlPlane.deck.innerHTML = ControlPlane.deck.innerHTML + arc;              

        let path = '<path ' + createPath(ControlPlane.curves) + '/>';
        path = setSVGElementAttribute(path, 'id', 'toolbar');
        ControlPlane.deck.innerHTML = ControlPlane.deck.innerHTML + path;

        let buttonCircle = createCircle(ControlPlane.buttonCenterX, ControlPlane.buttonCenterY,ControlPlane.buttonRadius);
        buttonCircle = setSVGElementAttribute(buttonCircle, 'id', 'menu-button-placeholder');
        ControlPlane.deck.innerHTML = ControlPlane.deck.innerHTML + buttonCircle;

        /* 
        * HTML Elements
        */

        let arcElement = document.getElementById('arc-1');
        arcElement.style.transformOrigin = ControlPlane.cx +'px '+ ControlPlane.cy +'px';
        arcElement.style.transform = 'rotate(-18deg)';

        let pathElement = document.getElementById('toolbar');  
        pathElement.style.transformOrigin = ControlPlane.cx +'px '+ ControlPlane.cy +'px';
        pathElement.style.transform = 'rotate(-18deg)';

        let buttonCircleElement = document.getElementById('menu-button-placeholder');  
    }

}
