// Global variables
var urlBase = "";
// Images src
var currentSrc = "";
// Canvas
var main_img = new Image();
var ctx;
var canvas;
var canvas_height, canvas_width;
var max_img_height = 256;
var max_img_width = 256;
var canvasScale = 1.0;
var img_width, img_height, img_dwidth, img_dheight, canvas_dx, canvas_dy, canvas_cx, canvas_cy;
var flagMouseEvent = 0;
var newPoint= new Point();
// Drawing variables
var click_enable = true;
var triggeredpoint = -1;

/*
 * Load Page functions
 */

function loadScreenDrApp() {
    /** @description Initialize componentes of the application
     */
    $('#res-field-map').css('visibility', 'hidden');
    setScreenSize();    
    loadGallery();
    initCanvas();
    addEvents();
}

function setScreenSize() {
    /** @description Defines max image heigh according other page elements
     *  Size of all other elements are predefined.
     */

    $('footer').css('padding', '0');
    $('footer').css('border-width', '0');
    $('footer').empty();

    max_img_height = $(window).height() - $('#footer').height() - $('#header').height() - $('#gallery-row').height() - 28;
    max_img_width = $('#col-diag-img').width();
    // Set background of canvas 
    $('#app-row').height(max_img_height);

    //$('#gallery-row').width($(window).width())
}

function refreshScreenSize() {
    /** @description Refresh main Image Height
     */
    setScreenSize();
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
    // Escape
    document.addEventListener("keyup", checkEscape, false);
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
 * Canvas
 */


class CanvasSizes {
    constructor(x, y, w, h, cX, cY, cW, cH) {
        /** @description Classe with canvas dimensions
          * @param {int} x The x coordinate where to place the image on the canvas
          * @param {int} y The y coordinate where to place the image on the canvas
          * @param {int} w The width of the image to use (stretch or reduce the image)
          * @param {int} h The height of the image to use (stretch or reduce the image)
          * @param {int} cX The x coordinate where to start clipping
          * @param {int} cY The y coordinate where to start clipping
          * @param {int} cW The width of the clipped image
          * @param {int} cH The height of the clipped image
         */
        // x initial position
        if (x !== null && x !== undefined)
            this.canvasX = x;
        else
            this.canvasX = 0;
        // y initial position
        if (y !== null && y !== undefined)
            this.canvasY = y;
        else
            this.canvasY = 0;
        // canvas height - h
        if (h !== null && h !== undefined)
            this.canvasH = h;
        else
            this.canvasH = 100;
        // canvas width - w
        if (w !== null && w !== undefined)
            this.canvasW = w;
        else
            this.canvasW = 100;
        // intial crop postion - x
        if (cX !== null && cX !== undefined)
            this.cropX = cX;
        else
            this.cropX = 0;
        // initial crop postion - y
        if (cY !== null && cY !== undefined)
            this.cropY = cY;
        else
            this.cropY = 0;
        // crop height
        if (cH !== null && cH !== undefined)
            this.cropH = cH;
        else
            this.cropH = 100;
        // crop width
        if (cW !== null && cW !== undefined)
            this.cropW = cW;
        else
            this.cropW = 100;
    }
}

function initCanvas() {
    /** @description Initialize canvas
     */

    // Predefined values
    var img_width = 864;
    var img_height = 768;
    currentSrc = "";

    // Set data given img_id
    if (img_id >= 0) {
        currentSrc = galleryURL + im_obj.filename;
        img_height = im_obj.height
        img_width = im_obj.width;
    }

    // Reset image
    img = new Image();
    // Set canvas size
    setCanvasSize(img_width, img_height);
    // Draw context
    ctx.drawImage(img, csizes.cropX, csizes.cropY, csizes.cropW, csizes.cropH, csizes.canvasX, csizes.canvasY, csizes.canvasW, csizes.canvasH);
    // Draw image and current annotations
    img.onload = function () {
        ctx.drawImage(img, csizes.cropX, csizes.cropY, csizes.cropW, csizes.cropH, csizes.canvasX, csizes.canvasY, csizes.canvasW, csizes.canvasH);
        setAnotations();
    };
    // Load Image
    img.src = currentSrc;
}


function setCanvasSize(img_width, img_height) {
    /** @description Calculate canvas size (csize variable)
      * @param {int} img_width image width
      * @param {int} img_height image height
     */
    // load canvas
    canvas = document.getElementById("main-canvas");
    // set canvas dimensions
    canvas.width = Math.floor(max_img_width);
    canvas.height = Math.floor(max_img_height);
    // Load context
    ctx = canvas.getContext("2d");
    trackTransforms(ctx);
    // Calculate scale with canvas size
    this.canvasScale = Math.min(canvas.height / img_height, canvas.width / img_width);
    // Calculate start postions
    var cx = Math.round((canvas.width - img_width) / 2);
    var cy = Math.round((canvas.height - img_height) / 2);
    //Image original dimension
    csizes = new CanvasSizes(cx, cy, img_width, img_height, 0, 0, img_width, img_height);
}


function refreshCanvas() {
    /** @description Refresh canvas routine
    */
    // Get new coord
    var p1 = ctx.transformedPoint(0, 0);
    var p2 = ctx.transformedPoint(canvas.width, canvas.height);
    // Crop canvas
    this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    // Draw image
    this.ctx.drawImage(img, csizes.cropX, csizes.cropY, csizes.cropW, csizes.cropH, csizes.canvasX, csizes.canvasY, csizes.canvasW, csizes.canvasH);
    // Draw objects
    redraw();
}

function resetCanvas() {
    /** @description Reset canvas image to original size
    */
    // Clear transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa o que esta por cima da imagem, neste caso as segmentaçoes/linhas
    // Draw image
    this.ctx.drawImage(img, csizes.cropX, csizes.cropY, csizes.cropW, csizes.cropH, csizes.canvasX, csizes.canvasY, csizes.canvasW, csizes.canvasH);
    // Draw objects
    redraw();
}

function redraw() {
    /** @description Draw storaged annotations
    */
    
    // List with annotations
    for (let c = 0; c < smoothpiecewises.length; c++) {
        // Get each class
        var smoth_data = smoothpiecewises[c];
        // Draw all segments of each element
        drawSmooth(smoth_data.interpolatedPoints, smoth_data.profile.color, smoth_data.profile.thick);
    }
    if (flagMouseEvent === 2){
        drawHandleSmooth();
    }
}

function canvasZoom(clicks) {
    /** @description Set canvas zoom factor
      * @param {float} clicks increase of zoom (positive or negative)
     */
    // Factor for zoom
    var scaleFactor = 1.1;
    // Current transformations applied to context
    var c_status = ctx.getTransform();
    // Zoom factor
    var factor = Math.pow(scaleFactor, clicks);
    // New zoom transformation factor
    var tfactor = c_status.a * factor;
    //canvasScale = tfactor;
    // Apply conditions
    if (tfactor < 1) {
        // Reset Canvas to original size
        resetCanvas();
    }
    else if (tfactor < 10 / canvasScale) {
        // Current location
        var pt = ctx.transformedPoint(lastX, lastY);
        // Translate
        ctx.translate(pt.x, pt.y);
        // Scale
        ctx.scale(factor, factor);
        // Translate back with new coord
        ctx.translate(-pt.x, -pt.y);
        // Redraw image
        refreshCanvas();
    }
}


/*
 * Event Handler
 */

// Canvas controls
var lastX, lastY;
var dragStart = null;
var dragging = false;

function canvasMouseUp() {
    /** @description Canvas Mouse Up event
     */
    if (flagMouseEvent === 1) {
        // Current transformations applied to context
        if (dragging) {
            var c_status = ctx.getTransform();
            if (canvas.width / csizes.canvasW > 1 || canvas.height / csizes.height > 1 || c_status.a > 1) {
                dragging = false;
            }
        }
    } else if (flagMouseEvent === 2) {
        // Current transformations applied to context
        if (dragging) {
            var c_status = ctx.getTransform();
            if (canvas.width / csizes.canvasW > 1 || canvas.height / csizes.height > 1 || c_status.a > 1) {
                dragging = false;                
            }
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
    if (delta) canvasZoom(delta);
    return evt.preventDefault() && false;
}

function canvasMouseDown(evt) {
    /** @description Canvas Mouse Down event
      * @param {event} evt Button down event
     */
    if (flagMouseEvent === 1) { //canvas editar pontos
        // Current transformations applied to context
        var c_status = ctx.getTransform();
        // Check if has zoom 
        if (canvas.width / csizes.canvasW > 1 || canvas.height / csizes.height > 1 || c_status.a > 1) {
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

            lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
            lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
            dragStart = ctx.transformedPoint(lastX, lastY);
            dragging = false; //não permite o rato mover a imagem 
        }
    }
    else if (flagMouseEvent === 2){ 
        if(evt.button === 0 ){ //se quiser mudar a posição do point original
            handlePointEdit(evt);
            dragging = true;
            $("#main-canvas").css("cursor", "grabbing");
        }
        if(evt.button === 2){ //se quiser apagar um point original
            var ptnew = ctx.transformedPoint(evt.layerX, evt.layerY); //newpoint
            ptnew.x = ptnew.x / canvasScale;
            ptnew.y = ptnew.y / canvasScale;
            let nearPoint = getNearPoint(ptnew); 
            deletePoint(nearPoint[1]);
        }
    }
}

function canvasMouseMove(evt) {
    /** @description Canvas Mouse Move event
      * @param {event} evt event
     */

    // Store mouse position
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    var pt = ctx.transformedPoint(lastX, lastY);

    if (flagMouseEvent === 1) {
        if (dragging) {
            
            if (dragStart) {
                // Load  context current transformations
                var c_status = ctx.getTransform();
                // Define direction restrictions
                var moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
                if (c_status.e > - canvas.width * c_status.a + canvas.width / 1.2 && lastX < canvas.width) { moveLeft = true; }
                if (c_status.e < canvas.width / c_status.a / 2 && lastX > 0) { moveRight = true; }
                if (c_status.f > - canvas.height * c_status.a + canvas.height / 1.2 && lastY < canvas.height) { moveUp = true; }
                if (c_status.f < canvas.height / c_status.a / 2 && lastY > 0) { moveDown = true; }
                // Moviment direction
                var dx = pt.x - dragStart.x;
                var dy = pt.y - dragStart.y;
                // Check conditions
                if (!moveLeft && dx < 0 || !moveRight && dx > 0) { dx = 0; }
                if (!moveUp && dy < 0 || !moveDown && dy > 0) { dy = 0; }
                // Move image
                ctx.translate(dx, dy);
                refreshCanvas();
            }
        }
    }
    else if (flagMouseEvent === 2) {
        if (dragging) {            
            // Store mouse position
            newPoint = new Point(pt.x / canvasScale, pt.y / canvasScale);
            if (dragStart) {
                updatePoint(newPoint, triggeredpoint);
            }
        }
        else {
            // Calculate distance from nearst point
            let current_pt = new Point(pt.x / canvasScale, pt.y / canvasScale)
            let nearPoint = getNearPoint(current_pt);
            // Check if it is near enough
            if (nearPoint[0] < 10) {
                $("#main-canvas").css("cursor", "grab");
            }
            else {
                $("#main-canvas").css("cursor", "default");
            }
        }
    }
}

function checkEscape() {
    /** @description To monitor escape key.      
     */
    // Check if has smooth_temp object
    if (smooth_temp instanceof SmoothPiecewise) {
        // If is drawing and not editing
        if (flagMouseEvent === 1) {
            // Remove last point or line
            removeSmoothTemp();
            refreshCanvas();
        }
    }     
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
    };
}
