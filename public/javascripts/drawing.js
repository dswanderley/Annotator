// Drawing points
var points = [];
var mouse_pos = [];
// Smooth line data
var smoothpiecewises = [];
var smooth_temp = null;
var smoothConfig = {
    method: Smooth.METHOD_CUBIC,
    clip: Smooth.CLIP_CLAMP, //CLIP_PERIODIC
    cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
};

/*
 * Line and Point
 */

class Point {
    constructor(x, y) {
        /** @description Class Point
          * @param {int} x Coordinate x
          * @param {int} y Coordinate y
         */
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(pi, pf) {
        /** @description Class Line
          * @param {Point} pi Initial point
          * @param {Point} pf Final point
         */
        this.pi = new Point(pi.x, pi.y); //ponto inicial da linha
        this.pf = new Point(pf.x, pf.y); //ponto final
    }
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
        width = 1;//draw_profile.thick;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.moveTo(this.canvasScale * line.pi.x, this.canvasScale * line.pi.y);
    this.ctx.lineTo(this.canvasScale * line.pf.x, this.canvasScale * line.pf.y);
    this.ctx.stroke();
}


/*
 * Smooth Element
 */

class SmoothPiecewise {
    constructor() {
        /** @description Picewise of smooth object (small lines)
         */
        this.originalPoints = new Array();
        this.interpolatedPoints = new Array();
        this.profile = new DrawProfile();
        this.idSegment = 0;
    }
}

function activeSmooth() {
    /** @description Active functions to draw the smooth picewise object.
     */
    canvas.addEventListener("mousedown", storeSmoothPoints, false);
    $("#main-canvas").css("cursor", "crosshair");
}

function deactiveSmooth() {
    /** @description Deactive functions to draw the smooth picewise object.
     */
    canvas.removeEventListener("mousedown", storeSmoothPoints, false);
    $("#main-canvas").css("cursor", "default");    
}


/* 
 * Draw Events
 */

function drawingSmooth(ev) {
    /** @description Function to draw the smoothpiecewise during mouse move.
      * @param {event}   ev  Event
     */
    if (!ev) { ev = window.event; }
    var pt = ctx.transformedPoint(ev.layerX, ev.layerY);
    mouse_pos = new Point(pt.x / canvasScale, pt.y / canvasScale);
    smooth_temp.originalPoints = points;
    smooth_temp.idSegment = 0;
    refreshCanvas();
    // Check the number of points 
    if (points.length >= 2) {
        refreshSmoothTemp(mouse_pos);
        drawSmooth(smooth_temp.interpolatedPoints);
    }
    else {
        drawLine(new Line(points[0], mouse_pos));
        smooth_temp.interpolatedPoints[0] = mouse_pos;
    }
}

function refreshSmoothTemp(p) {
    /** @description Update the smooth line and insert a new line to the temp piecewise object.
      * @param {Point}   P  Current point
     */
    var pts = [
        [points[points.length - 2].x, points[points.length - 2].y],
        [points[points.length - 1].x, points[points.length - 1].y],
        [p.x, p.y]
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

function removeSmoothTemp() {
    /** @description Function to remove smooth temp points.
     */
    // Check if has points
    if (points.length > 1) {
        // Remove last point
        points.pop();
        smooth_temp.originalPoints = points;
        smooth_temp.interpolatedPoints.pop();
        // Draw smooth or line
        if (points.length >= 2) {
            refreshSmoothTemp(mouse_pos);
            drawSmooth(smooth_temp.interpolatedPoints);
        }
        else {
            drawLine(new Line(points[0], mouse_pos));
            smooth_temp.interpolatedPoints[0] = mouse_pos;
        }
    }
    else {
        // Remove all data
        points = []
        smooth_temp = [];
        canvas.removeEventListener("mousemove", drawingSmooth, false);
    }    
}


/* 
 * Storage
 */

function storeSmoothPoints(ev) {
    /** @description Store reference points to draw smooth piecewise.
      * @param {event}   ev  Event
     */
    if (flagMouseEvent === 1) {
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
        if (ev.button === 2 && points.length > 2) {//responsabel por fechar a segmentação
            // Close draw tool
            saveSmooth(smooth_temp);
            canvas.removeEventListener("mousemove", drawingSmooth, false);
            refreshCanvas();
        }
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
    var el_list = class_list[draw_profile.id];
    if (el_list === null || el_list === undefined) {
        el_list = [];
    }
    el_list.push(smooth_temp);
    class_list[draw_profile.id] = el_list;
    let tam = el_list.length;
    if (tam !== 0){
        smooth_temp.idSegment = tam;
    }
    var arr = point2array(smooth_temp.originalPoints);
    smooth_temp.interpolatedPoints = getSmoothPiecewises(arr);
    smoothpiecewises.push(smooth_temp);
    refreshCanvas();
    // Clear temps
    points = [];
    smooth_temp = null;
    // List annotations on table
    listAnnot();
}


/* 
 * Edition
 */

function deleteSmooth(spType, idSeg) {
    /** @description Function to delete the SmoothPiecewise object.
      * @param {SmoothPiecewise} ds SmoothPiecewise object
     */

    // Remove on classes list
    class_list[spType].splice(idSeg, 1);
    let merged = [].concat.apply([], class_list);
    smoothpiecewises = [];
    // remove on general list
    for (let i = 0; i < merged.length; i++) {
        if (merged[i] !== undefined && merged[i] !== null)
            smoothpiecewises.push(merged[i]);
    }
    // Remove save button if has no more annotations
    if (smoothpiecewises.length < 1) {
        $("#btn-save").hide();
    }
    // Set flags
    flagMouseEvent = 1;
    click_enable = true;
    // Refresh content
    activeSmooth();
    listAnnot();
    refreshCanvas();  
}

function deletePoint(idnearpoint) {
     /** @description delete an original point
      * @param {int} idnearpoint Position of the orginal point in the array smooth.originalPoint.
     */ 
    canvas.removeEventListener('mouseup', canvasMouseUp, false);
    if (smooth_temp.originalPoints.length > 3) {
        smooth_temp.originalPoints.splice(idnearpoint, 1);
        var arr = point2array(smooth_temp.originalPoints);
        smooth_temp.interpolatedPoints = getSmoothPiecewises(arr);
        idnearpoint = -1;
        refreshCanvas();
    } else if (smooth_temp.originalPoints.length <= 3) {
        refreshCanvas();
    }
}

function editSmooth(btn, idtype, idSeg, flag) {
    /** @description Edit Segmentation
      * @param {element} btn Button element.
      * @param {int} idtype Type ID.
      * @param {int} idSeg Segment ID.
      * @param {int} flag Flag for handle smooth points.
     */
    
    // Avoid click during drawing
    if (smooth_temp instanceof SmoothPiecewise) {
        return;
    }
     // Clear button already selected for edition
    let save_icons = $(".fa-save");
    if (save_icons.length > 0) {
        for (let i= 0; i < save_icons.length; i++) {
            let tmp_btn = save_icons[i].parentElement;
            tmp_btn.removeChild(tmp_btn.getElementsByTagName("svg")[0]);    
            let id_items = tmp_btn.id.split("-");
            tmp_btn.setAttribute("onClick", "editSmooth(this," + id_items[2] + " , "+ id_items[3] + ", 2);");
            let tmp_icon = document.createElement("i");
            tmp_icon.classList.add("far", "fa-edit", "i-tab");
            tmp_btn.appendChild(tmp_icon);
        }
    }
    // Clean button
    btn.removeChild(btn.getElementsByTagName("svg")[0]);
    btn.innerHTML = '';
    // Re-set button
    btn.setAttribute("onClick", "storeNewPoints(this," + idtype  + " , "+ idSeg + ", " + flagMouseEvent + ");");
    var icon = document.createElement("i");
    icon.classList.add("fas", "fa-save", "i-tab");
    btn.appendChild(icon);
    // Block buttom click
    click_enable = false;
    // Process data
    smooth_temp = getSegmentation(idtype, idSeg);
    refreshCanvas();
    flagMouseEvent = flag;
    if (flagMouseEvent === 2) {
        deactiveSmooth();
        canvas.addEventListener("dblclick", addNewSmoothPoint, false);
        drawHandleSmooth();
     } 
}

function storeNewPoints(btn, idtype, idSeg, flag) {
    /** @description Store points edited.
      * @param {element} btn Button element.
      * @param {int} idtype Type ID.
      * @param {int} idSeg Segment ID.
      * @param {int} flag Flag for handle smooth points.
     */

    // Clean button
    btn.removeChild(btn.getElementsByTagName("svg")[0]);
    btn.innerHTML = '';
    // Re-set button
    var icon = document.createElement("i");
    icon.classList.add("far", "fa-edit", "i-tab");
    btn.setAttribute("onClick", "editSmooth(this," + idtype + " , "+ idSeg + ", 2);");
    btn.appendChild(icon);
    // Free button
    click_enable = true;
    // Set segmentation
    setSegmentation(smooth_temp, idtype, idSeg);
    smooth_temp = null;
    // Set main
    flagMouseEvent = flag;
    setDraw(idtype);
    refreshCanvas();
}

function handlePointEdit(event) {
    /** @description Moves points selected.
      * @param {event} event New Point.
     */
    if (!event) { event = window.event; }
    // Convert point position using scale
    var ptsnew = ctx.transformedPoint(event.layerX, event.layerY); //newpoint
    ptsnew.x = ptsnew.x / canvasScale;
    ptsnew.y = ptsnew.y / canvasScale;
    let [mindistAB, idnearpoint] = getNearPoint(ptsnew); //mindistAB,idnearpoint
    if (mindistAB < 5) {
        //document.body.style.cursor = 'pointer';
        updatePoint(ptsnew, idnearpoint);
    }
    triggeredpoint = idnearpoint;
}

function updatePoint(point, idx) {
    /** @description Update a point on smooth temp.
      * @param {Point} point Point.
      * @param {int} idx Index of the point.
     */
    var x = point.x;
    var y = point.y;
    smooth_temp.originalPoints[idx] = new Point(x, y);
    var arr = point2array(smooth_temp.originalPoints);
    smooth_temp.interpolatedPoints = getSmoothPiecewises(arr);
    refreshCanvas();
}

function drawHandleSmooth() {
    /** @description Allow smooth edition
     */
    var pts = smooth_temp.originalPoints;
    for (var i = 0; i < pts.length; i++) {
        var x = pts[i].x*canvasScale;
        var y = pts[i].y*canvasScale;
        drawCircle(x, y,1);
    }
}

function updatesmooth(ev, idx, offset) {
    /** @description Edit SmoothPicewise
      * @param {obj} ev event
      * @param {int} idx Smoothpicewises id
      * @param {int} offset Points offset in screen
     */
    if (!offset) offset = 0;

    var y = ev.clientY + offset;
    var x = ev.clientY  + offset;

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
    var pnew = new Point(ev.layerX / canvasScale, ev.layerY / canvasScale);

    var oPoint = smooth_temp.originalPoints;
    var interp_pts = smooth_temp.interpolatedPoints;
    var d_min = 10000;
    var imin = -1;
    //var jmin = -1;
    for (var i = 0; i < oPoint.length; i++) {
        for (var j=0;j<interp_pts[i].length; j++ ){
            var d=distance(interp_pts[i][j] ,pnew);
            if (d < d_min) {
                d_min = d;
                imin = i;
            }
        }
    }

    // Update array
    oPoint.splice(imin + 1, 0, pnew); //adiciona o ponto no array na posição idx
    var arr = point2array(oPoint);
    var new_interp_pts = getSmoothPiecewises(arr);
    // Update temp smooth
    smooth_temp.originalPoints = oPoint;
    smooth_temp.interpolatedPoints = new_interp_pts;
    // Update handle pointss
    drawHandleSmooth();
    refreshCanvas();
    drawSmooth(smooth_temp.interpolatedPoints);
}

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


/*
 * Aux Functions
 */

function getSegmentation(idtype, idSeg) {
    /** @description Get segmentation draw.
      * @param {int} idtype Segmantation type ID.
      * @param {int} idSeg Segmentation item ID.
     */
    var segmbytype = [];
    var segm = [];
    segmbytype = class_list[idtype];
    segm = segmbytype[idSeg];
    return segm;
}

function setSegmentation(seg, idtype, idSeg) {
    /** @description Get segmentation draw.
      * @param {SmoothPiecewise} seg Segmantation.
      * @param {int} idtype Segmantation type ID.
      * @param {int} idSeg Segmentation item ID.
     */
    class_list[idtype][idSeg] = seg;
}

function getNearPoint(pt) {
    /** @description Get the nearst draw point given another point
      * @param {Point} pt click postion.
     */
    var i;
    var mindistAB = 10000;
    var distAB, idnearpoint;
    
    for ( i = 0; i < smooth_temp.originalPoints.length;  i++){
        distAB = distance(pt, smooth_temp.originalPoints[i])
        if(distAB < mindistAB){
            mindistAB = distAB;
            idnearpoint = i;
        }
    }
    return [mindistAB, idnearpoint];
}

function distance(pointA, pointB) {
    /** @description Calculate euclidian distance.
      * @param {Point} pointA Point A
      * @param {Point} pointB Point B
     */
    var dx = pointA.x - pointB.x //delta x
    var dy = pointA.y - pointB.y //delta y
    var distAB = Math.sqrt(dx * dx + dy * dy); // distance
    return distAB;
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
            arr.push([pts[i].x, pts[i].y]);
        }
        return arr;
    }
    else {
        return [pts[i].x, pts[i].y];
    }
}

function drawCircle(x, y, width, color) {
    /** @descriptio Convert an array of Points to an array of coordinates
      * @param {int} x Horizontal coordinate
      * @param {int} y Vertical coordinate
      * @param {int} width Width
      * @param {string} color Color #RGB
     */
    if (!ev) { var ev = window.event; }
    if (color === null || color === undefined) {
        color = smooth_temp.profile.color;
    }
    if (width === null || width === undefined) {
        width = 1;//draw_profile.thick;
    }
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    //this.ctx.fillStyle =color;
    //this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
    this.ctx.stroke();
}