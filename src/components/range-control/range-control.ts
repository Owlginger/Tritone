document.addEventListener('DOMContentLoaded', (event) => {
    const orientationOptions: {vertical: string, horizontal: string} = {
        vertical: 'vertical',
        horizontal: 'horizontal'
    };

    const rangeControl = new RangeControl({ orientation: orientationOptions.vertical });
    rangeControl.createRangeControl(event);
});

class RangeControl {

    /* Elements */
    rangeControlContainer: HTMLElement;
    rangeControl: HTMLElement;

    rangeUnits: HTMLElement;
    rangeTrack: HTMLElement;  /* Range track <g> element */
    rangeKnob: HTMLElement;


    /* Range Levels and level indicators */

    levels: Level[] = [];

    indicatorParallel: number = 1;  // Pixels
    indicatorPerpendicular: number = 19;  // Pixels
    indicatorSubdivisionPerpendicular: number = 37;  // Pixels
    indicatorSecondSubdivisionPerpendicular: number = 30;  // Pixels

    indicatorCenterOffset: number = 20;

    indicatorWidth: number = 19;
    indicatorSubdivisionWidth: number = 37;
    indicatorSecondSubdivisionWidth: number = 30;
    indicatorHeight: number = 1;

    indicatorGap: number = 2.2;

    /* Track */
    rangeTrackLevel: HTMLElement;


    /* Knob  */
    knobElement: HTMLElement;
    knobHandleElement: HTMLElement;
    knobHandleCenterElement: HTMLElement;


    /* Properties */
    orientationOptions: {vertical: string, horizontal: string} = {
        vertical: 'vertical',
        horizontal: 'horizontal'
    };
    orientation: string;

    centerX: number;
    centerY: number;

    rangeMin: number;
    rangeMax: number;
    rangeStep: number;

    rangePadding: number = 20;
    rangeControlWidth = 150;

    currentLevel: number;

    lastRangeDragEventId: number = -Infinity;
    draggingKnob: boolean;

    
    constructor(options: RangeControlOptions) {

        this.orientation = options.orientation;

        this.rangeControl! = document.getElementById('range-control') as HTMLElement;
        this.rangeControlContainer = this.rangeControl.parentElement as HTMLElement;

        this.initContainerBounds(this.rangeControl, this.rangeControlContainer);

        this.centerX = this.rangeControl.getBoundingClientRect().width / 2;
        this.centerY = this.rangeControl.getBoundingClientRect().height / 2;

        this.rangeUnits! = document.getElementById('range-units-container') as HTMLElement;
        this.rangeTrack! = document.getElementById('range-track-container') as HTMLElement;
        this.rangeKnob! = document.getElementById('range-knob-container') as HTMLElement;

        this.initContainerBounds(this.rangeUnits, this.rangeControl);
        this.initContainerBounds(this.rangeTrack, this.rangeControl);
        this.initContainerBounds(this.rangeKnob, this.rangeControl);

        this.rangeMin = 0;
        this.rangeMax = 100;
        this.rangeStep = 1;

        this.currentLevel = this.parallel(this.rangeControl) - this.rangePadding;

        this.draggingKnob = false;
    }

    initContainerBounds(element: Element, parent: Element) {
        const parentBounds = parent.getBoundingClientRect();
        element.setAttribute('width', parentBounds.width+'px');
        element.setAttribute('height', parentBounds.height+'px');
        element.setAttribute('viewBox', '0 0 '+ parentBounds.width +' '+ parentBounds.height +'');
    }

    createRangeControl(event: Event) {
        

        let unitsBackground = this.createRectangle(this.centerX-(this.rangeControlWidth/2) , 0, this.rangeControlWidth, this.rangeControl.getBoundingClientRect().height);
        unitsBackground = this.setSVGElementAttribute(unitsBackground, 'id', 'range-units-background');
        this.rangeUnits.innerHTML += unitsBackground;

        let range = this.rangeMax - this.rangeMin + 1;
        let subdivisions = Math.round(range / this.rangeStep);

        let index = 0;

        for (let index = 0; index < subdivisions; index++) {

            let x: number, y: number, width: number, height: number;

            if(index === 0 || index  === Math.floor(range/2) 
                || index  === Math.floor(range/4) || index  === Math.floor((3*range)/4) 
                || index  === subdivisions - 1) {
                    width = this.indicatorSubdivisionWidth;
            } else {
                width = this.indicatorWidth;
            }

            /* Left Indicator */
            x = this.centerX - this.indicatorCenterOffset - width;
            y = (this.rangeControl.getBoundingClientRect().height - this.rangePadding) - ((this.indicatorHeight + this.indicatorGap) * index);

            let leftIndicatorStr = this.createRectangle(x, y, width, this.indicatorHeight);
            leftIndicatorStr = this.setSVGElementAttribute(leftIndicatorStr, 'id', 'left-indicator-' + index + '');

            /* RIght Indicator */
            x = this.centerX + this.indicatorCenterOffset;
            y = (this.rangeControl.getBoundingClientRect().height - this.rangePadding) - ((this.indicatorHeight + this.indicatorGap) * index);

            let rightIndicatorStr = this.createRectangle(x, y, width, this.indicatorHeight);
            rightIndicatorStr = this.setSVGElementAttribute(rightIndicatorStr, 'id', 'right-indicator-' + index + '');

            /* Add the indicator pair (representing a level) to DOM Tree */
            this.rangeUnits.innerHTML += leftIndicatorStr;
            this.rangeUnits.innerHTML += rightIndicatorStr;

            /* Retrive newly created indicator pair elements from DOM */
    
            const leftIndicElement = document.getElementById('left-indicator-' + index + '') as HTMLElement;
            const rightIndicElement = document.getElementById('right-indicator-' + index + '') as HTMLElement;
    
            [leftIndicElement, rightIndicElement].forEach((el) => {
                el.classList.add('indicator');
            });
    
            /* Create the right and left indicators for the level and add to the levels array */
            const leftIndicator = new Indicator(leftIndicElement);
            const rightIndicator = new Indicator(rightIndicElement);
    
            this.levels.push({
                left: leftIndicator,
                right: rightIndicator
            });
            
        }



        
        let track = this.createRectangleCenteredAt(this.centerX, this.centerY, 5, this.rangeControl.getBoundingClientRect().height-this.rangePadding);
        track = this.setSVGElementAttribute(track, 'id', 'track');

        let trackLevel = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height-this.rangePadding, 5, 4);
        trackLevel = this.setSVGElementAttribute(trackLevel, 'id', 'track-level');

        this.rangeTrack.innerHTML += track;
        this.rangeTrack.innerHTML += trackLevel;

        this.rangeTrackLevel = document.getElementById('track-level') as HTMLElement;
        



        let knob = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height-this.rangePadding, 71, 37);
        knob = this.setSVGElementAttribute(knob, 'id', 'knob');

        let knobHandle = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height-this.rangePadding, 53, 19);
        knobHandle = this.setSVGElementAttribute(knobHandle, 'id', 'knob-handle');
        

        let knobHandleCenter = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height-this.rangePadding, 37, 2);
        knobHandleCenter = this.setSVGElementAttribute(knobHandleCenter, 'id', 'knob-handle-center');

        this.rangeKnob.innerHTML += knob;
        this.rangeKnob.innerHTML += knobHandle;
        this.rangeKnob.innerHTML += knobHandleCenter;


        
        const rangeUnitsBackground = document.getElementById('range-units-background') as HTMLElement;
        const rangeTrackElement = document.getElementById('track') as HTMLElement;

        [this.rangeControl, this.rangeUnits, this.rangeTrack, rangeUnitsBackground, rangeTrackElement].forEach((element) => {
            element.addEventListener('mouseover', (event: MouseEvent) => {
                if(this.draggingKnob) {
                    element.style.cursor = 'grabbing';
                    this.drag(event);
                }
            });
    
            element.addEventListener('mouseup', (event: MouseEvent) => {
                if(this.draggingKnob) {
                    this.draggingKnob = false;

                    [this.rangeControl, this.rangeUnits, this.rangeTrack, rangeUnitsBackground, rangeTrackElement].forEach((el) => {
                        el.style.cursor = 'pointer';
                    });
                    
                }
            });

            
        });

        this.rangeControl.addEventListener('mouseleave', (event: MouseEvent) => {
            if(this.draggingKnob) {
                this.draggingKnob = false;
            }
        });




        this.knobElement = document.getElementById('knob') as HTMLElement;
        this.knobHandleElement = document.getElementById('knob-handle') as HTMLElement;
        this.knobHandleCenterElement = document.getElementById('knob-handle-center') as HTMLElement;

        [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
            el.draggable = true;
            el.tabIndex = 0;

            el.addEventListener('mousedown', (event: MouseEvent) => {
                this.draggingKnob = true;
                el.style.cursor = 'grabbing';
            });

            el.addEventListener('mouseup', (event: MouseEvent) => {
                el.style.cursor = 'grab';
                this.draggingKnob = false;
                [this.rangeControl, this.rangeUnits, this.rangeTrack, rangeUnitsBackground, rangeTrackElement].forEach((el) => {
                    el.style.cursor = 'default';
                });
            });

            el.addEventListener('mouseover', (event: MouseEvent) => {
                if(this.draggingKnob) {
                    this.drag(event);
                }
            })
        });

        if(this.orientation === this.orientationOptions.horizontal) {
            this.rangeControl.style.transformOrigin = this.centerX + 'px ' + this.centerY + 'px';
            this.rangeControl.style.transform = 'rotate(90deg)';
        }
    }

    drag(event: MouseEvent) {

        if(this.orientation === this.orientationOptions.vertical) {
            const mouseY = event.clientY - this.rangeControl.getBoundingClientRect().y;

            this.lastRangeDragEventId = event.timeStamp;
            
            if(mouseY - (this.rangeControl.getBoundingClientRect().height-this.rangePadding) >= 0) {
                this.currentLevel = this.rangeControl.getBoundingClientRect().height-this.rangePadding;

            } else if(event.clientY - this.rangeTrack.getBoundingClientRect().y < 0) {
                return;
            } else {

                if(mouseY - this.currentLevel < 0) {  /* Move Up */
                    this.currentLevel = mouseY;

                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel - el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });

                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().height - this.currentLevel + '');
                } else if(mouseY - this.currentLevel > 0) { /* Move Down */
                    this.currentLevel = mouseY;

                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel + el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });

                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().height - this.currentLevel + '');
                }
                
            }
        } else {
            const mouseX = event.clientX - this.rangeControl.getBoundingClientRect().x;

            this.lastRangeDragEventId = event.timeStamp;
            
            if(mouseX - (this.rangeControl.getBoundingClientRect().width-this.rangePadding) >= 0) {
                this.currentLevel = this.rangeControl.getBoundingClientRect().width-this.rangePadding;

            } else if(event.clientX - this.rangeTrack.getBoundingClientRect().y < 0) {
                return;
            } else {

                if(mouseX - this.currentLevel > 0) {  /* Move Left */
                    this.currentLevel = mouseX;

                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel - el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });

                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().width - this.currentLevel + '');

                } else if(mouseX - this.currentLevel < 0) { /* Move Right */
                    this.currentLevel = mouseX;

                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel + el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });

                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().width - this.currentLevel + '');

                }
                
            }
        }
        
    }

    parallel: Function = (element: HTMLElement): number => {
        if(this.orientation === this.orientationOptions.horizontal) {
            return element.getBoundingClientRect().width;
        }

        return element.getBoundingClientRect().height;
    }

    perpendicular: Function = (element: HTMLElement): number => {
        if(this.orientation === this.orientationOptions.horizontal) {
            return element.getBoundingClientRect().height;
        }

        return element.getBoundingClientRect().width;
    }



    createLine: Function = (x1: number, y1: number, x2: number, y2: number):string => {
        return '<line x1="' + x1 + '" x2="' + x2 + '" y1="' + y1 + '" y2="' + y2 + '"/>';
    }

    createCircle: Function = (cx: number, cy: number, radius: number) => {
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>';
    }
    
    createRectangle: Function = (startX: string, startY: string, width: string, height: string, radiusX: string, radiusY: string): string => {
        if(typeof radiusX === 'undefined' || typeof radiusY === 'undefined') {
            return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
        }
        return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
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
}

class Indicator {
     indicator: HTMLElement;

    constructor(element: HTMLElement) {
        this.indicator = element;
    }

    x: Function = (value?: number): number => {
        if(typeof value === 'number') {
            //Set x value
            this.indicator.getBoundingClientRect().x = value;
        }

        return this.indicator.getBoundingClientRect().x;
    }

    y: Function = (value?: number): number => {
        if(typeof value === 'number') {
            //Set x value
            this.indicator.getBoundingClientRect().y = value;
        }

        return this.indicator.getBoundingClientRect().y;
    }
}

interface Level {
    left: Indicator;
    right: Indicator;
}


class RangeControlOptions {
    public orientation: string;
}