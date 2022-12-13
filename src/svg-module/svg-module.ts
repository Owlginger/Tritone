export function createCircle(cx: number, cy: number, radius: number) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '"/>';
}

export function createRectangle(startX: number, startY: number, width: number, height: number, radiusX: number, radiusY: number) {
    if(typeof radiusX === 'undefined' || typeof radiusY === 'undefined') {
        return '<rect x="' + startX + '" y="' + startY + '" width="' + width + '" height="' + height + '"/>';
    }
    return '<rect x="' + startX + '" y="' + startY + '" rx="' + radiusX + '" ry="' + radiusY + '" width="' + width + '" height="' + height + '"/>';
}

export function createEmptyPath() {
    return '<path />';
    
}

export function createArc(radiusX: number, radiusY: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number) {
    return '<path d="A ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
}

export function createArcStartingAt(startX: number, startY: number, radiusX: number, radiusY: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number) {
    return '<path d="M ' + startX + ' ' + startY + ' a ' + radiusX + ' ' + radiusY + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y + '" />';
}

export function createRectangleCenteredAt(centerX: number, centerY: number, width: number, height: number) {
    return '<rect x="' + (centerX - (width / 2)) + '" y="' + (centerY - (height / 2)) + '" width="' + width + '" height="' + height + '"/>';
}

export function createBezierCurveStartingAt(centerX: number, centerY: number, x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
    return '<path d="M ' + centerX + ' '+ centerY + ' C ' + x1 +' '+ y1 +', ' + x2 + ' ' + y2 + ', ' + x + ' ' + y + '"/>';
}

export function createPath(paths: SvgCommand[]) {
    let path = 'd="';

    for (let index = 0; index < paths.length; index++) {
        path = path + paths[index].command + ' ';
        const values = Object.values(paths[index].values);
        path = path + values.join(' ');
    }
    return path + '"';
}

export function setSVGElementAttribute(element: string, attribute: string, value: string) {
    let elementSubstring = element.split(' ');
    let firstPart = [elementSubstring[0]];
    let lastPart = elementSubstring.slice(1);

    const elementAttr = attribute + '="' + value + '"';
    firstPart.push(' ' + elementAttr);

    return firstPart.concat(lastPart).join(' ');
}

export interface Point {
    x: number;  y: number;
}

export interface SvgCommand {
    command: string;
    values: SvgCommandValue;
}

export interface SvgCommandValue {

}