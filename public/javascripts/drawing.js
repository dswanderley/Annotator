// Drawing points
var points = [];
// Smooth line data
var smoothpiecewises = [];
var smooth_temp = [];
var smoothConfig = {
    method: Smooth.METHOD_CUBIC,
    clip: Smooth.CLIP_MIRROR, //CLIP_PERIODIC
    cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
};

/*
 * Line and Point
 */

function Point(x, y) {
    /** @description Class Point
      * @param {int} x Coordinate x
      * @param {int} y Coordinate y
     */
    this.X = x;
    this.Y = y;
}

function Line(pi, pf) {
    /** @description Class Line
      * @param {Point} pi Initial point
      * @param {Point} pf Final point
     */
    this.pi = new Point(pi.X, pi.Y); //ponto inicial da linha
    this.pf = new Point(pf.X, pf.Y); //ponto final
}

function drawLine(line, color, width) {
    /** @description Draw a line on canvas
      * @param {Line}   line  Line
      * @param {string} color Color of the line
      * @param {int}    y Line width
     */

    if (color === null || color === undefined) {
        color = draw_profile.color;
    }
    if (width === null || width === undefined) {
        width = 3;//draw_profile.thick;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.moveTo(this.canvasScale * line.pi.X, this.canvasScale * line.pi.Y);
    this.ctx.lineTo(this.canvasScale * line.pf.X, this.canvasScale * line.pf.Y);
    this.ctx.stroke();
}


/*
 * Smooth Element
 */

/* Class and activation */
function SmoothPiecewise() {
    /** @description Picewise of smooth object (small lines)
     */
    this.originalPoints = new Array();
    this.interpolatedPoints = new Array();
    this.profile = new DrawProfile();
}

function activeSmooth() {
    /** @description Active functions to draw the smooth picewise object.
     */
    canvas.addEventListener("mousedown", storeSmoothPoints, false);
}


/* Draw Events */

function drawingSmooth(ev) {
    /** @description Function to draw the smoothpiecewise during mouse move.
      * @param {event}   ev  Event
     */
    if (!ev) { ev = window.event; }
    var pt = ctx.transformedPoint(ev.layerX, ev.layerY);
    var p = new Point(pt.x / canvasScale, pt.y / canvasScale);
    smooth_temp.originalPoints = points;

    refreshCanvas();
    // Check the number of points 
    if (points.length >= 2) {
        refreshSmoothTemp(p);
        drawSmooth(smooth_temp.interpolatedPoints);
    }
    else {
        drawLine(new Line(points[0], p));
        smooth_temp.interpolatedPoints[0] = p;
    }
}

function refreshSmoothTemp(p) {
    /** @description Update the smooth line and inser a new line to the temp piecewise object.
      * @param {Point}   P  Current point
     */
    var pts = [
        [points[points.length - 2].X, points[points.length - 2].Y],
        [points[points.length - 1].X, points[points.length - 1].Y],
        [p.X, p.Y]
    ];
    // Calculate the smooth piecewises (interpolation)
    var v = Smooth(pts, smoothConfig);
    // Calculate each point of the interpolation
    var arr_ints = getSmoothPoints(v, pts);
    var p_ints = new Array(2);
    p_ints[0] = array2point(arr_ints[0]);
    p_ints[1] = array2point(arr_ints[1]);
    // Update smooth temp
    smooth_temp.interpolatedPoints[points.length - 2] = p_ints[0];
    smooth_temp.interpolatedPoints[points.length - 1] = p_ints[1];
}

function drawSmooth(ipts, color, width) {
    /** @description Function to draw SmoothPiecewise.
      * @param {Point[]} ipts List of Interpolated Points
     */

    if (color === null || color === undefined) {
        color = draw_profile.color;
    }
    if (width !== null && width !== undefined) {
        width = draw_profile.thick;
    }

    if (!ipts) return;
    for (var j = 0; j < ipts.length; j++) {
        var curve = ipts[j];
        for (var i = 0; i < curve.length - 2; i++) {
            drawLine(new Line(curve[i], curve[i + 1]), color, width);
        }
    }
}


/* Storage */

function storeSmoothPoints(ev) {
    /** @description Store reference points to draw smooth piecewise.
      * @param {event}   ev  Event
     */
    if (!ev) { ev = window.event; }
    // Convert point position using scale
    var pt = ctx.transformedPoint(ev.layerX, ev.layerY);
    var p = new Point(pt.x / canvasScale, pt.y / canvasScale);
    if (ev.button === 0) {
        // Enable draw
        if (points.length === 0) {
            points.push(p);
            smooth_temp = new SmoothPiecewise();
            smooth_temp.profile = draw_profile;
            canvas.addEventListener("mousemove", drawingSmooth, false);
        }
        else {
            points.push(p);
        }
    }
    if (ev.button === 2 && points.length > 2) {
        // Close draw tool
        saveSmooth(smooth_temp);
        canvas.removeEventListener("mousemove", drawingSmooth, false);
        refreshCanvas();
    }
}

function saveSmooth(sp) {
    /** @description Function to save the SmoothPiecewise object on smooth_temp.
      * @param {SmoothPiecewise} sp SmoothPiecewise object
     */
    var p = sp.originalPoints[0];
    refreshSmoothTemp(p);
    drawSmooth(sp.interpolatedPoints);
    // Store

    // Get list with same element
    el_list = class_list[draw_profile.id];
    if (el_list === null || el_list === undefined) {
        el_list = [];
    }
    el_list.push(smooth_temp);
    // return list with elements
    class_list[draw_profile.id] = el_list;
    smoothpiecewises.push(smooth_temp);
    // Clear temps
    points = [];
    smooth_temp = [];
    // List annotations on table
    listAnnot();
}


/* Edition */

function deleteSmooth(d, h) {
    /** @description Delete smoothpiecewise
      * @param {string} d Object position in Array
      * @param {string} h Number of objects to erase
     */
    smoothpiecewises.splice(d, h);
    refreshCanvas();
}

function editSmooth(id) {
    /** @description Edit SmoothPicewise
      * @param {int} id Id in smoothpicewises array.
     */
    canvas.removeEventListener("mousedown", storeSmoothPoints, false);

    canvas.addEventListener("dblclick", addNewSmoothPoint, false);

    smooth_temp = smoothpiecewises[id];
    smoothpiecewises[id] = [];

    createHandleSmooth();
}

function createHandleSmooth() {
    /** @description Allow smooth edition
     */
    var pts = smooth_temp.originalPoints;
    for (var i = 0; i < pts.length; i++) {

        var x = pts[i].X;
        var y = pts[i].Y;

        var offset = 6;
        makeHandle(x, y, i, offset);
    }
}

function updatesmooth(el, idx, offset) {
    /** @description Edit SmoothPicewise
      * @param {obj} el Element
      * @param {int} idx Smoothpicewises id
      * @param {int} offset Points offset in screen
     */
    if (!offset) offset = 0;

    var y = el.position().top + offset;
    var x = el.position().left + offset;

    var len = smooth_temp.originalPoints.length;
    smooth_temp.originalPoints[idx] = new Point(x, y);

    var arr = point2array(smooth_temp.originalPoints);
    smooth_temp.interpolatedPoints = getSmoothPiecewises(arr);

    refreshCanvas();
    drawSmooth(smooth_temp.interpolatedPoints);
}

function addNewSmoothPoint(ev) {
    /** @description Add new point to Smooth piecewise.
      * @param {event} ev Event
     */
    if (!ev) { ev = window.event; }
    var p = new Point(ev.layerX / canvasScale, ev.layerY / canvasScale);

    var len = smooth_temp.originalPoints.length;
    var new_pts = smooth_temp.originalPoints.slice(0);
    var pts = smooth_temp.originalPoints.slice(0);
    pts[-1] = smooth_temp.originalPoints[len - 1];
    pts[len] = smooth_temp.originalPoints[0];
    // Find closest points
    var d_max = 10000;
    var idx = -1;
    for (var i = 0; i < len; i++) {

        var p0 = pts[i];
        var p1 = pts[i + 1];
        var d = .5 * (Math.dist(p0.X, p0.Y, p.X, p.Y) + Math.dist(p1.X, p1.Y, p.X, p.Y));

        if (d < d_max) {
            d_max = d;
            idx = i;
        }
    }
    // Update array
    new_pts.splice(idx + 1, 0, p);
    var arr = point2array(new_pts);
    var new_interp_pts = getSmoothPiecewises(arr);
    // Update temp smooth
    smooth_temp.originalPoints = new_pts;
    smooth_temp.interpolatedPoints = new_interp_pts;
    // Update handle pointss
    clearHandle();

    createHandleSmooth();
    refreshCanvas();
    drawSmooth(smooth_temp.interpolatedPoints);
}

function clearHandle() {
    /** @description Clear Handle objects
     */
    $('.handle').remove();
}

function makeHandle(x, y, idx, offset) {
    /** @descriptio Create handle objects
      * @param {int} x X coord
      * @param {int} y Y coord
      * @param {int} idx Smooth index
      * @param {?} offset offset
     */
    if (!offset) offset = 6;
    var handle;
    handle = $('<div/>').addClass('handle').appendTo('#div-canvas-in').css({
        left: x - offset,
        top: y - offset
    });
    /* if (typeof idx !== 'undefined') {
         handle.attr('id', 'point-'+idx.toString());
     }*/
    handle.draggable({
        drag: function (event, ui) {
            updatesmooth(handle, idx, offset);
        },
        stop: updatesmooth(handle, idx, offset)
    });
    /*handle.dblclick(function (ev) {
        return handleDoubleClick(handle);
    });*/
    handle.css({
        position: 'absolute'
    });
    return handle;
}


/* Auxiliary */

function getSmoothPoints(smooth, pts) {
    /** @description Function to get the interpolated points of the SmoothPiecewise object.
      * @param {Smooth} smooth Smooth object
      * @param {array}  pts    Reference points
     */
    var deltaX1 = Math.abs(pts[1][0] - pts[0][0]);
    var deltaY1 = Math.abs(pts[1][1] - pts[0][1]);
    var stp1 = 1 / Math.max(deltaX1, deltaY1);
    stp1 = stp1 / 10;

    var deltaX2 = Math.abs(pts[1][0] - pts[2][0]);
    var deltaY2 = Math.abs(pts[1][1] - pts[2][1]);
    var stp2 = 1 / Math.max(deltaX2, deltaY2);
    stp2 = stp2 / 10;

    var v1 = new Array();
    for (i = 0; i < 1; i += stp1) {
        v1.push(smooth(i));
    }
    v1.push(pts[1]);

    var v2 = new Array();
    for (i = 1; i < 2; i += stp2) {
        v2.push(smooth(i));
    }
    v2.push(pts[2]);

    var v = new Array();
    v.push(v1);
    v.push(v2);

    return v;
}

function getSmoothPiecewises(arr) {
    /** @description Get SmoothPicewise
      * @param {Point[]} arr Original Points
     */
    var v;
    var interp_pts = [];
    var arr2 = arr;
    arr2.push(arr[0]);
    arr2[-1] = arr[arr.length - 2];

    for (var i = 0; i < arr.length - 1; i++) {

        var pts = [
            arr2[i - 1],
            arr2[i],
            arr2[i + 1]
        ];
        v = Smooth(pts, smoothConfig);
        var arr_ints = getSmoothPoints(v, pts);
        var p_ints = new Array(2);
        interp_pts.push(array2point(arr_ints[1]));
    }

    return interp_pts;
}

function array2point(arr) {
    /** @descriptio Convert an array of coordinates to an array of Points
      * @param {float[]} arr Point array
     */
    if (arr.length > 1) {
        var pts = new Array();
        for (var i = 0; i < arr.length; i++) {
            pts.push(new Point(arr[i][0], arr[i][1]));
        }
        return pts;
    }
    else {
        return new Point(Point(arr[0], arr[1]));
    }
}

function point2array(pts) {
    /** @descriptio Convert an array of Points to an array of coordinates
      * @param {Point[]} pts Array of Points
     */
    if (pts.length > 1) {
        var arr = new Array();
        for (var i = 0; i < pts.length; i++) {
            arr.push([pts[i].X, pts[i].Y]);
        }
        return arr;
    }
    else {
        return [pts[i].X, pts[i].Y];
    }
}