/* Classes */

var ClassEnum = {
    /** @description Classes enumeration  
    */
    OVARIAN_STROMA: 0,
    OVARIAN_FOLLICLE: 1,
    OVARIAN_CYST: 2,
    properties: {
        0: { name: "ovary", value: 0, type: "O", code: "OVARIAN_STROMA", color: "#FF00FF" },
        1: { name: "follicle", value: 1, type: "F", code: "OVARIAN_FOLLICLE", color: "#BFFF00" },        
        2: { name: "cyst", value: 2, type: "C", code: "OVARIAN_CYST", color: "#00BFFF" }
        //color = "#0000FF";
    }
};

// Draw profile class
class DrawProfile {
    constructor(id, class_name, color, thick) {
        /** @description Classe with canvas dimensions
          * @param {int} x Class id
          * @param {string} class_name Name of the class
          * @param {string} color Color of the class
          * @param {int} thick Line thickness
         */
        // id
        if (id !== null && id !== undefined)
            this.id = id;
        else
            this.id = -1;
        // class
        if (class_name !== null && class_name !== undefined)
            this.class_name = class_name;
        else
            this.class_name = '';
        // color
        if (color !== null && color !== undefined)
            this.color = color;
        else
            this.color = '#FFFFFF';
        // thickness
        if (thick !== null && thick !== undefined)
            this.thick = thick;
        else
            this.thick = 1;
    }
}

// Profile with data to draw lines
var draw_profile = new DrawProfile();

// Number of Classes
var N_CLASSES = Object.keys(ClassEnum).length - 1;

// Array with classes draws
var class_list = new Array(N_CLASSES);


/* TABLE Functions */

function fillTable(body, el_list) {
    /** @description Fill data table with anotations reference
      * @param {Window} body A HTML element table
      * @param {Array} el_list List with elements of the same class
     */

    //Check if there is any element
    if (el_list.length > 0) {
        // Table of content
        var table = document.createElement("table");
        table.setAttribute("id", "table-annot");
        table.setAttribute("class", "table table-striped table-dark");
        // Header elements
        var header = document.createElement("tr");
        var th1 = document.createElement("th");
        th1.appendChild(document.createTextNode("ID"));
        header.appendChild(th1);
        var th2 = document.createElement("th");
        th2.appendChild(document.createTextNode("Class"));
        header.appendChild(th2);
        var th3 = document.createElement("th");
        th3.appendChild(document.createTextNode("Axis"));
        header.appendChild(th3);
        var th4 = document.createElement("th");
        th4.appendChild(document.createTextNode("Edit"));
        header.appendChild(th4);
        var th5 = document.createElement("th");
        th5.appendChild(document.createTextNode("Delete"));
        header.appendChild(th5);
        // Append header
        var thead = document.createElement("thead");
        thead.appendChild(header);
        table.appendChild(thead);
        // Start body
        var tbody = document.createElement("tbody");
        // Read all list of elements
        for (i = 0; i < el_list.length; i++) {
            // Element id to be listed
            idx = i + 1;
            // Get element
            el = el_list[i];
            // Row elements
            var row = document.createElement("tr");
            // Text Elements
            var td1 = document.createElement("td");
            td1.setAttribute("class", "td-text-annot");
            td1.appendChild(document.createTextNode(el.id));
            row.appendChild(td1);
            var td2 = document.createElement("td");
            td2.setAttribute("class", "td-text-annot");
            td2.appendChild(document.createTextNode(el.class));
            row.appendChild(td2);
            var td3 = document.createElement("td");
            td3.setAttribute("class", "td-text-annot");
            td3.appendChild(document.createTextNode(el.major + "px"));
            row.appendChild(td3);
            // Edit Button
            var td4 = document.createElement("td");
            td4.setAttribute("class", "td-btn-annot");           
            var icon1 = document.createElement("i");
            icon1.classList.add("far", "fa-edit", "i-tab");
            var btn1 = document.createElement("button");
            btn1.classList.add("btn", "btn-light", "btn-annot");
            btn1.setAttribute("id", "btn-edit-" +  el.id_class  + "-" + el.id_seg)
            btn1.setAttribute("onClick", "editSmooth(this," + el.id_class  + " , "+ el.id_seg + ", 2);");
            btn1.appendChild(icon1);
            td4.appendChild(btn1);
            row.appendChild(td4);
            // Delete Button
            var icon2 = document.createElement("i");
            icon2.classList.add("far", "fa-trash-alt", "i-tab");
            var btn2 = document.createElement("button");
            btn2.classList.add("btn", "btn-primary", "btn-annot");
            btn2.setAttribute("onClick", "deleteSmooth(" + el.id_class  + " , "+ el.id_seg + ");");
            btn2.appendChild(icon2);
            var td5 = document.createElement("td");
            td5.setAttribute("class", "td-btn-annot");
            td5.appendChild(btn2);            
            row.appendChild(td5);
            
            // Append Row to table
            tbody.appendChild(row);
        }
        // Append table to body
        table.appendChild(tbody);
        body.appendChild(table);
    }    
}

function listAnnot() {
    /** @description List all annotations
     * */

    // Body of list with annotations
    var body = document.getElementById("list-annot");
    body.innerHTML = "";
    
    // List with annotations
    var el_list = [];
    for (c = 0; c < class_list.length; c++) {
        // Get each class
        var ldata = class_list[c];
        // Check if has annotation for each class
        if (ldata !== null && ldata !== undefined) {
            // Draw all segments of each element
            for (i = 0; i < ldata.length; i++) {
                let annot = ldata[i];
                // Calculate major axis
                let axes = calculateAxes(annot.originalPoints);
                let class_profile = ClassEnum.properties[annot.profile.id]
                // Create element to list
                let el = {
                        id: class_profile.type + (i + 1),
                        class: class_profile.name,
                        major: Math.round(axes.major),
                        id_seg: i,
                        id_class: class_profile.value
                        };
                el_list.push(el);
            }
        }
    }
    // Update table
    fillTable(body, el_list);

    if (class_list[0] !== undefined || class_list[1] !== undefined || class_list[2] !== undefined) {
        $("#btn-save").show();
    }
    else {
        $("#btn-save").hide();
    }
}


/* Draw Managing */

function drawElement(cId) {
    /** @description Active class draw
     * @param {int} cId Class ID
     */

    if (click_enable) {
        // Reset button
        if ($(".btn-class-annot.btn-outline-info").length > 0) {
            let btn = $(".btn-class-annot.btn-outline-info")[0]
            btn.classList.remove("btn-outline-info");
            btn.classList.add("btn-info");
        }

        refreshCanvas();
        // Check status to enable or disable draw
        if (draw_profile.id === cId) {
            // Disable draw
            flagMouseEvent = 0;
            draw_profile = new DrawProfile();
            deactiveSmooth();
        }
        else {
            // Enable draw
            flagMouseEvent = 1;           
            setDraw(cId);
            // Add new class to selected button
            let btn = $(".btn-class-annot")[cId];
            btn.classList.remove("btn-info");
            btn.classList.add("btn-outline-info");
        }
    }
}

function setDraw(cId) {
    /** @description Set class draw
     * @param {int} cId Class ID
     */

    if (flagMouseEvent === 1) {
        // Enable draw
        if (cId >= 0 && cId < N_CLASSES) {
            // Set profile
            draw_profile = new DrawProfile(cId,
                            ClassEnum.properties[cId].name,
                            ClassEnum.properties[cId].color,
                            1);
            // Active draw
            activeSmooth();
        }
    }
}

function saveAnnot() {
    /** @description Save annotations.
     */
    //  new element
    let annot_list = new Array();
    // Read all elements in order to remove interpolatedPoints
    for (let i = 0; i < class_list.length; i++) {
        // This comparison is necessary because there is a fixed array size (yet)
        if (class_list[i] != undefined) {
            let sp = class_list[i]
            let listofelements = new Array();
            // Read elements on each list
            for (let j = 0; j < sp.length; j++){
                let data_obj = copyObject(sp[j]);
                // Delete intperpolatedPoints and push to new temp list of elements
                delete data_obj.interpolatedPoints;
                // Remove offset from original points list
                for (let k = 0; k < data_obj.originalPoints.length; k++) {
                    data_obj.originalPoints[k].x = data_obj.originalPoints[k].x * canvasScale - csizes.canvasX;
                    data_obj.originalPoints[k].y = data_obj.originalPoints[k].y * canvasScale - csizes.canvasY;
                }
                listofelements.push(data_obj);
            }
            // Upload temp list of list
            annot_list.push(listofelements);
        }
    }
    // Update Global Variable
    im_obj.annotations = annot_list;
    imageList[img_id] = im_obj;

    // Data to set ajax post
    let url = "/annot";
    let updata = JSON.stringify(im_obj);
    $.ajax({
        type: 'POST',
        url: url, 
        data: updata,
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            console.log(msg);
        }
    });

    // Change and update image
    identImage(1);
    updatePercentage();

}


/* Calculate Parameters */

function calculateAxes(p_list) {
    /** @description Function to be implemented.
     */

    let majorAxis = 0;
    for (let i = 0; i < p_list.length - 1; i++) {
        for (let j = i + 1; i < p_list.length; i++) {
            // Calculate distance
            let d = distance(p_list[i], p_list[j]);
            // Compare and set
            if (d > majorAxis)
                majorAxis = d;
        }
    }

    return { major: majorAxis};
}
