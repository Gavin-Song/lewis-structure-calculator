const ATOM_CLICK_DISTANCE_THRESHOLD = 30;
const DRAG_THRESHOLD = 10;
const FONT_SIZE = 24;
const ATOM_SIZE = 40/36 * FONT_SIZE;
const ELECTRON_SIZE = ATOM_SIZE / 8;

/**
 * Return 2-norm between 2 points
 * @param {number} x1 
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {number} distance
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Draw line between 2 points
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x1 
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/**
 * Draw circle (stroke and filled)
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x Center x
 * @param {number} y Center y
 * @param {number} r Radius
 */
function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

/**
 * Bad deepcopy
 * @param {*} x 
 * @return Deep copy of x
 */
function deepcopy(x) {
    return JSON.parse(JSON.stringify(x));
}

/**
 * Distance from (x, y) to line defined by other points
 * @see https://stackoverflow.com/a/6853926/6079328
 * @param {*} x 
 * @param {*} y 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @return {number} distance
 */
function pointLineDistance(x, y, x1, y1, x2, y2) {
    let A = x - x1;
    let B = y - y1;
    let C = x2 - x1;
    let D = y2 - y1;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) //in case of 0 length line
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}