// Global variables
var urlBase = "";
// Images src
var currentSrc = "";
var current_idx = "";
// Canvas
var main_img = new Image();
var ctx;
var canvas;
var canvas_height, canvas_width;
var max_img_height = 256;
var max_img_width = 256;
var canvasScale = 1.0;
var img_width, img_height, img_dwidth, img_dheight, canvas_dx, canvas_dy, canvas_cx, canvas_cy;

/*
 * Load Page functions
 */

function loadScreenDrApp() {
    /** @description Initialize componentes of the application
     */
    $('#res-field-map').css('visibility', 'hidden');
    setScreenSize();
    addEvents();

    currentSrc = 'screen/20170317_0001.png'
    setMainImage();
    
    //loadGallery();
}

function setScreenSize() {
    /** @description Defines max image heigh according other page elements
     *  Size of all other elements are predefined.
     */

    max_img_height = $(window).height() - $('#footer').height() - $('#header').height();
    max_img_width = $('#col-diag-center').width();
    
    $('#app-row').height(max_img_height);

    setCanvasSize();    
}

function refreshScreenSize() {
    /** @description Refresh main Image Height
     */
    setScreenSize();
    // Set canvas
    setMainImage();
}

function addEvents() {
    /** @description Add Events listener
     */
    canvas.addEventListener('mousedown', canvasMouseDown, false);
    canvas.addEventListener('mousemove', canvasMouseMove, false);
    canvas.addEventListener('mouseup', canvasMouseUp, false);
    // IE9, Chrome, Safari, Opera
    canvas.addEventListener("mousewheel", canvasScrollWheel, false);
    // Firefox
    canvas.addEventListener("DOMMouseScroll", canvasScrollWheel, false);

    document.addEventListener('mouseup', pageMouseUp, false);
}

function pageMouseUp(evt) {
    /** @description page Mouse Up event
      * @param {event} evt event
     */
    // Disable canvas image dragging if mouse is off canvas 
    if (dragging) {
        canvasMouseUp(evt);
    }
}


/*
 * Set Image
 */


function setMainImage() {
    /** @description Set original image src
     */
    redraw(true);
    w = 864;//galleryData[current_idx].width;
    h = 768;//galleryData[current_idx].height;
    // Set Canvas parameters
    setCanvasParameters(w, h);
    // Update image
    refreshCanvasImg();
    refreshCanvasImg();
}

/*
 * Canvas
 */

function setCanvasSize() {
    /** @description Set canvas size 
     */
    // Create main canvas 
    canvas_width = max_img_width;
    canvas_height = max_img_height;
    canvas = document.getElementById("main-canvas");
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    // CSS content 
    canvas.style.width = canvas.width.toString() + "px";
    canvas.style.height = canvas.height.toString() + "px";
    // Canvas context
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    trackTransforms(ctx);
}

function setCanvasParameters(w, h) {
    /** @description set canvas dimensions parameters
      * @param {int} w width
      * @param {int} h height
     */

    // Original image size
    img_width = w;
    img_height = h;
    // Display image size
    img_dwidth = canvasScale * img_width;
    img_dheight = canvasScale * img_height;
    // Calculate scale with canvas size
    canvasScale = Math.min(canvas.height / img_height, canvas.width / img_width);
    // coordinate in the destination canvas at which to place the top-left corner of the source image
    canvas_dx = (canvas.width - img_width * canvasScale) / 2;
    canvas_dy = (canvas.height - img_height * canvasScale) / 2;
    //coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context
    canvas_cx = 0;
    canvas_cy = 0;
}

function refreshCanvasImg() {
    /** @description Refresh canvas image
     */

    // Display image size
    img_dwidth = canvasScale * main_img.width;
    img_dheight = canvasScale * main_img.height;
    // Reload image ? 
    main_img = new Image();
    // Clear context
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
    // Load Image    
    main_img.onload = function () {
        // Draw image
        ctx.drawImage(main_img, canvas_cx, canvas_cy, img_width, img_height, canvas_dx, canvas_dy, img_dwidth, img_dheight);
    }
    main_img.src = currentSrc;
}

// Canvas controls
var lastX, lastY;
var dragStart = null;
var dragging = false;

function canvasMouseDown(evt) {
    /** @description Canvas Mouse Down event
      * @param {event} evt Button down event
     */

    // Current transformations applied to context
    var c_status = ctx.getTransform();
    // Check if has zoom 
    if (c_status.a > 1) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragging = true;
    }

}

function canvasMouseMove(evt) {
    /** @description Canvas Mouse Move event
      * @param {event} evt event
     */
    if (dragging) {
        // Store mouse position
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        var pt = ctx.transformedPoint(lastX, lastY);
        if (dragStart) {
            // Load  context current transformations
            var c_status = ctx.getTransform();
            // Define direction restrictions
            var moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
            if ((c_status.e > (- canvas.width * c_status.a) + canvas.width / 1.2) && (lastX < canvas.width)) { moveLeft = true; }
            if ((c_status.e < canvas.width / c_status.a / 2) && (lastX > 0)) { moveRight = true; }
            if ((c_status.f > - (canvas.height * c_status.a) + canvas.height / 1.2) && (lastY < canvas.height)) { moveUp = true; }
            if ((c_status.f < canvas.height / c_status.a / 2) && (lastY > 0)) { moveDown = true; }
            // Moviment direction
            var dx = pt.x - dragStart.x;
            var dy = pt.y - dragStart.y;
            // Check conditions
            if (((!moveLeft) && (dx < 0)) || ((!moveRight) && (dx > 0))) { dx = 0; }
            if (((!moveUp) && (dy < 0)) || ((!moveDown) && (dy > 0))) { dy = 0; }
            // Move image
            ctx.translate(dx, dy);
            redraw(false);
        }
    }
}

function canvasMouseUp(evt) {
    /** @description Canvas Mouse Up event
      * @param {event} evt event
     */

    // Current transformations applied to context
    if (dragging) {
        var c_status = ctx.getTransform();
        if (c_status.a > 1) {
            //  dragStart = null;
            dragging = false;
        }
    }
}

function canvasScrollWheel(evt) {
    /** @description Canvas Mouse Scroll Wheel event
      * @param {event} ev Scroll Wheel event
     */
    lastX = evt.offsetX;
    lastY = evt.offsetY;
    var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
    if (delta) canvasZoom(delta, lastX, lastY);
    return evt.preventDefault() && false;
}

function canvasZoom(clicks, mouseX, mouseY) {
    /** @description Set canvas zoom factor
      * @param {float} clicks increase of zoom (positive or negative)
      * @param {int} mouseX mouse x coord over canvas
      * @param {int} mouseY mouse y coord over canvas
     */
    // Factor for zoom
    var scaleFactor = 1.1;
    // Current transformations applied to context
    var c_status = ctx.getTransform();
    // Zoom factor
    var factor = Math.pow(scaleFactor, clicks);
    // New zoom transformation factor
    var tfactor = c_status.a * factor;
    // Apply conditions
    if (tfactor < 1) {
        redraw(true);
    }
    else if (tfactor < 10 * 1 / canvasScale) {
        // Current location
        var pt = ctx.transformedPoint(lastX, lastY);
        // Translate
        ctx.translate(pt.x, pt.y);
        // Scale
        ctx.scale(factor, factor);
        // Translate back with new coord
        ctx.translate(-pt.x, -pt.y);
        // Redraw image
        redraw(false);
    }
}

function redraw(reset) {
    /** @description Redraw canvas
      * @param {bool} reset if true, reset canvas to original size
     */
    if (reset) {
        // Clear transformations
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else {
        // Get new coord
        var p1 = ctx.transformedPoint(0, 0);
        var p2 = ctx.transformedPoint(canvas.width, canvas.height);
        // Crop canvas
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    }
    // Draw Image
    ctx.drawImage(main_img, canvas_cx, canvas_cy, main_img.width, main_img.height, canvas_dx, canvas_dy, img_dwidth, img_dheight);
}



/*
 * * SVG
 */

function trackTransforms(ctx) {
    /** @description Canvas transformation control
      * @param {obj} ctx canvas context
     */
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function () { return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };
    var translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };
    var transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };
    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function (x, y) {
        pt.x = x; pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}


/*
 * * Canvas Size
 */
 
function CanvasSizes(x, y, w, h, cX, cY, cW, cH) {
    /// <summary>Classe para guardar posições do canvas</summary>
    /// <param name="x" type="Object"></param>
    /// <param name="y" type="Object"></param>
    /// <param name="w" type="Object"></param>
    /// <param name="h" type="Object"></param>
    /// <param name="cX" type="Object"></param>
    /// <param name="cY" type="Object"></param>
    /// <param name="cW" type="Object"></param>
    /// <param name="cH" type="Object"></param>
    
    // posição inicial x
    if (x != null && x != undefined)
        this.canvasX = x;
    else
        this.canvasX = 0;
    // posição inicial y
    if (y != null && y != undefined)
        this.canvasY = y;
    else
        this.canvasY = 0;
    // altura canvas - h
    if (h != null && h != undefined)
        this.canvasH = h;
    else
        this.canvasH = 100;
    // largura canvas - w
    if (w != null && w != undefined)
        this.canvasW = w;
    else
        this.canvasW = 100;
    // inicio corte - x
    if (cX != null && cX != undefined)
        this.cropX = cX;
    else
        this.cropX = 0;
    // inicio corte - y
    if (cY != null && cY != undefined)
        this.cropY = cY;
    else
        this.cropY = 0;
    // altura corte
    if (cH != null && cH != undefined)
        this.cropH = cH;
    else
        this.cropH = 100;
    // largura corte
    if (cW != null && cW != undefined)
        this.cropW = cW;
    else
        this.cropW = 100;
}
