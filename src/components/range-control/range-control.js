document.addEventListener('DOMContentLoaded', (event) => {
    const orientationOptions = {
        vertical: 'vertical',
        horizontal: 'horizontal'
    };
    const rangeControl = new RangeControl({ orientation: orientationOptions.vertical });
    rangeControl.createRangeControl(event);
});
class RangeControl {
    constructor(options) {
        /* Range Levels and level indicators */
        this.levels = [];
        this.indicatorParallel = 1; // Pixels
        this.indicatorPerpendicular = 19; // Pixels
        this.indicatorSubdivisionPerpendicular = 37; // Pixels
        this.indicatorSecondSubdivisionPerpendicular = 30; // Pixels
        this.indicatorCenterOffset = 20;
        this.indicatorWidth = 19;
        this.indicatorSubdivisionWidth = 37;
        this.indicatorSecondSubdivisionWidth = 30;
        this.indicatorHeight = 1;
        this.indicatorGap = 2.2;
        /* Properties */
        this.orientationOptions = {
            vertical: 'vertical',
            horizontal: 'horizontal'
        };
        this.rangePadding = 20;
        this.rangeControlWidth = 150;
        this.lastRangeDragEventId = -Infinity;
        this.parallel = (element) => {
            if (this.orientation === this.orientationOptions.horizontal) {
                return element.getBoundingClientRect().width;
            }
            return element.getBoundingClientRect().height;
        };
        this.perpendicular = (element) => {
            if (this.orientation === this.orientationOptions.horizontal) {
                return element.getBoundingClientRect().height;
            }
            return element.getBoundingClientRect().width;
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
        this.orientation = options.orientation;
        this.rangeControl = document.getElementById('range-control');
        this.rangeControlContainer = this.rangeControl.parentElement;
        this.initContainerBounds(this.rangeControl, this.rangeControlContainer);
        this.centerX = this.rangeControl.getBoundingClientRect().width / 2;
        this.centerY = this.rangeControl.getBoundingClientRect().height / 2;
        this.rangeUnits = document.getElementById('range-units-container');
        this.rangeTrack = document.getElementById('range-track-container');
        this.rangeKnob = document.getElementById('range-knob-container');
        this.initContainerBounds(this.rangeUnits, this.rangeControl);
        this.initContainerBounds(this.rangeTrack, this.rangeControl);
        this.initContainerBounds(this.rangeKnob, this.rangeControl);
        this.rangeMin = 0;
        this.rangeMax = 100;
        this.rangeStep = 1;
        this.currentLevel = this.parallel(this.rangeControl) - this.rangePadding;
        this.draggingKnob = false;
    }
    initContainerBounds(element, parent) {
        const parentBounds = parent.getBoundingClientRect();
        element.setAttribute('width', parentBounds.width + 'px');
        element.setAttribute('height', parentBounds.height + 'px');
        element.setAttribute('viewBox', '0 0 ' + parentBounds.width + ' ' + parentBounds.height + '');
    }
    createRangeControl(event) {
        let unitsBackground = this.createRectangle(this.centerX - (this.rangeControlWidth / 2), 0, this.rangeControlWidth, this.rangeControl.getBoundingClientRect().height);
        unitsBackground = this.setSVGElementAttribute(unitsBackground, 'id', 'range-units-background');
        this.rangeUnits.innerHTML += unitsBackground;
        let range = this.rangeMax - this.rangeMin + 1;
        let subdivisions = Math.round(range / this.rangeStep);
        let index = 0;
        for (let index = 0; index < subdivisions; index++) {
            let x, y, width, height;
            if (index === 0 || index === Math.floor(range / 2)
                || index === Math.floor(range / 4) || index === Math.floor((3 * range) / 4)
                || index === subdivisions - 1) {
                width = this.indicatorSubdivisionWidth;
            }
            else {
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
            const leftIndicElement = document.getElementById('left-indicator-' + index + '');
            const rightIndicElement = document.getElementById('right-indicator-' + index + '');
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
        let track = this.createRectangleCenteredAt(this.centerX, this.centerY, 5, this.rangeControl.getBoundingClientRect().height - this.rangePadding);
        track = this.setSVGElementAttribute(track, 'id', 'track');
        let trackLevel = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height - this.rangePadding, 5, 4);
        trackLevel = this.setSVGElementAttribute(trackLevel, 'id', 'track-level');
        this.rangeTrack.innerHTML += track;
        this.rangeTrack.innerHTML += trackLevel;
        this.rangeTrackLevel = document.getElementById('track-level');
        let knob = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height - this.rangePadding, 71, 37);
        knob = this.setSVGElementAttribute(knob, 'id', 'knob');
        let knobHandle = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height - this.rangePadding, 53, 19);
        knobHandle = this.setSVGElementAttribute(knobHandle, 'id', 'knob-handle');
        let knobHandleCenter = this.createRectangleCenteredAt(this.centerX, this.rangeControl.getBoundingClientRect().height - this.rangePadding, 37, 2);
        knobHandleCenter = this.setSVGElementAttribute(knobHandleCenter, 'id', 'knob-handle-center');
        this.rangeKnob.innerHTML += knob;
        this.rangeKnob.innerHTML += knobHandle;
        this.rangeKnob.innerHTML += knobHandleCenter;
        const rangeUnitsBackground = document.getElementById('range-units-background');
        const rangeTrackElement = document.getElementById('track');
        [this.rangeControl, this.rangeUnits, this.rangeTrack, rangeUnitsBackground, rangeTrackElement].forEach((element) => {
            element.addEventListener('mouseover', (event) => {
                if (this.draggingKnob) {
                    element.style.cursor = 'grabbing';
                    this.drag(event);
                }
            });
            element.addEventListener('mouseup', (event) => {
                if (this.draggingKnob) {
                    this.draggingKnob = false;
                    [this.rangeControl, this.rangeUnits, this.rangeTrack, rangeUnitsBackground, rangeTrackElement].forEach((el) => {
                        el.style.cursor = 'pointer';
                    });
                }
            });
        });
        this.rangeControl.addEventListener('mouseleave', (event) => {
            if (this.draggingKnob) {
                this.draggingKnob = false;
            }
        });
        this.knobElement = document.getElementById('knob');
        this.knobHandleElement = document.getElementById('knob-handle');
        this.knobHandleCenterElement = document.getElementById('knob-handle-center');
        [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
            el.draggable = true;
            el.tabIndex = 0;
            el.addEventListener('mousedown', (event) => {
                this.draggingKnob = true;
                el.style.cursor = 'grabbing';
            });
            el.addEventListener('mouseup', (event) => {
                el.style.cursor = 'grab';
                this.draggingKnob = false;
                [this.rangeControl, this.rangeUnits, this.rangeTrack, rangeUnitsBackground, rangeTrackElement].forEach((el) => {
                    el.style.cursor = 'default';
                });
            });
            el.addEventListener('mouseover', (event) => {
                if (this.draggingKnob) {
                    this.drag(event);
                }
            });
        });
        if (this.orientation === this.orientationOptions.horizontal) {
            this.rangeControl.style.transformOrigin = this.centerX + 'px ' + this.centerY + 'px';
            this.rangeControl.style.transform = 'rotate(90deg)';
        }
    }
    drag(event) {
        if (this.orientation === this.orientationOptions.vertical) {
            const mouseY = event.clientY - this.rangeControl.getBoundingClientRect().y;
            this.lastRangeDragEventId = event.timeStamp;
            if (mouseY - (this.rangeControl.getBoundingClientRect().height - this.rangePadding) >= 0) {
                this.currentLevel = this.rangeControl.getBoundingClientRect().height - this.rangePadding;
            }
            else if (event.clientY - this.rangeTrack.getBoundingClientRect().y < 0) {
                return;
            }
            else {
                if (mouseY - this.currentLevel < 0) { /* Move Up */
                    this.currentLevel = mouseY;
                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel - el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });
                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().height - this.currentLevel + '');
                }
                else if (mouseY - this.currentLevel > 0) { /* Move Down */
                    this.currentLevel = mouseY;
                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel + el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });
                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().height - this.currentLevel + '');
                }
            }
        }
        else {
            const mouseX = event.clientX - this.rangeControl.getBoundingClientRect().x;
            this.lastRangeDragEventId = event.timeStamp;
            if (mouseX - (this.rangeControl.getBoundingClientRect().width - this.rangePadding) >= 0) {
                this.currentLevel = this.rangeControl.getBoundingClientRect().width - this.rangePadding;
            }
            else if (event.clientX - this.rangeTrack.getBoundingClientRect().y < 0) {
                return;
            }
            else {
                if (mouseX - this.currentLevel > 0) { /* Move Left */
                    this.currentLevel = mouseX;
                    [this.knobElement, this.knobHandleElement, this.knobHandleCenterElement].forEach((el) => {
                        //el.getBoundingClientRect().y = this.currentLevel - el.getBoundingClientRect().height / 2;
                        el.setAttribute('y', this.currentLevel - el.getBoundingClientRect().height / 2 + '');
                    });
                    this.rangeTrackLevel.setAttribute('y', this.currentLevel + '');
                    this.rangeTrackLevel.setAttribute('height', this.rangeControl.getBoundingClientRect().width - this.currentLevel + '');
                }
                else if (mouseX - this.currentLevel < 0) { /* Move Right */
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
}
class Indicator {
    constructor(element) {
        this.x = (value) => {
            if (typeof value === 'number') {
                //Set x value
                this.indicator.getBoundingClientRect().x = value;
            }
            return this.indicator.getBoundingClientRect().x;
        };
        this.y = (value) => {
            if (typeof value === 'number') {
                //Set x value
                this.indicator.getBoundingClientRect().y = value;
            }
            return this.indicator.getBoundingClientRect().y;
        };
        this.indicator = element;
    }
}
class RangeControlOptions {
}
