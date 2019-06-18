// Profile with data to draw lines
var draw_profile = new DrawProfile();
var flagsave = -1;

/* Classes */

var ClassEnum = {
    /** @description Classes enumeration  
    */
    OVARIAN_STROMA: 0,
    OVARIAN_FOLLICLE: 1,
    OVARIAN_CYST: 2,
    properties: {
        0: { name: "ovary", value: 0, code: "OVARIAN_STROMA", color: "#FF6468" },
        1: { name: "follicle", value: 1, code: "OVARIAN_FOLLICLE", color: "#DCFFD2" },        
        2: { name: "cyst", value: 2, code: "OVARIAN_CYST", color: "#0032B4" }
        //color = "#0000FF";
    }
};
// Number of Classes
var N_CLASSES = Object.keys(ClassEnum).length - 1;
// Array with classes draws
var class_list = new Array(N_CLASSES);

/* CLASSES */

function DrawProfile(id, class_name, color, thick) {
    /** @description Classe with canvas dimensions
      * @param {int} x Class id
      * @param {string} class_name Name of the class
      * @param {string} color Color of the class
      * @param {int} thick Line thickness
     */

    // id
    if (id !==null && id !==undefined)
        this.id = id;
    else
        this.id = 0;
    // class
    if (class_name !==null && class_name !==undefined)
        this.class_name = class_name;
    else
        this.class_name = '';
    // color
    if (color !== null && color !== undefined)
        this.color = color;
    else
        this.color = '#FFFFFF';
    // thickness
    if (thick !==null && thick !==undefined)
        this.thick = thick;
    else
        this.thick = 1;
}

/* TABLE Functions */

function fillTable(body, ldata, el_list) {
    /** @description Fill data table with anotations reference
      * @param {Window} body A HTML element table
      * @param {Array} el_list List with elements of the same class
      * @param {Array} ldata list of all the SmoothPieceWise, aka, segementations
     */
    el_str=ldata[0].profile.class_name;
    //Check if there is any element
    if (el_list.length > 0) {
        // Table of content
        var table = document.createElement("table");
        table.setAttribute("id", "table-" + el_str.toLowerCase());
        table.setAttribute("class", "table table-striped table-dark");
        // Header elements
        var header = document.createElement("tr");
        var th1 = document.createElement("th");
        th1.appendChild(document.createTextNode(el_str));
        header.appendChild(th1);
        var th2 = document.createElement("th");
        th2.appendChild(document.createTextNode("Major"));
        header.appendChild(th2);
        var th3 = document.createElement("th");
        th3.appendChild(document.createTextNode("Minor"));
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
            td1.appendChild(document.createTextNode("#" + idx));
            row.appendChild(td1);
            var td2 = document.createElement("td");
            td2.setAttribute("class", "td-text-annot");
            td2.appendChild(document.createTextNode(el[1] + "px"));
            row.appendChild(td2);
            var td3 = document.createElement("td");
            td3.setAttribute("class", "td-text-annot");
            td3.appendChild(document.createTextNode(el[2] + "px"));
            row.appendChild(td3);
            // Edit Button
            var td4 = document.createElement("td");
            td4.setAttribute("class", "td-btn-annot");           
            var icon1 = document.createElement("i");
            icon1.classList.add("far", "fa-edit", "i-tab");
            var btn1 = document.createElement("button");
            btn1.classList.add("btn", "btn-light", "btn-annot");
            btn1.setAttribute("onClick", "editSmooth(this," + ldata[i].profile.id  + " , "+ ldata[i].idSegment + ", 0);");
            btn1.appendChild(icon1);
            td4.appendChild(btn1);
            row.appendChild(td4);
            // Delete Button
            var icon2 = document.createElement("i");
            icon2.classList.add("far", "fa-trash-alt", "i-tab");
            var btn2 = document.createElement("button");
            btn2.classList.add("btn", "btn-primary", "btn-annot");
            btn2.setAttribute("onClick", "deleteSmooth(" + ldata[i].profile.id  + " , "+ ldata[i].idSegment + ");");
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
    for (c = 0; c < class_list.length; c++) {
        // Get each class
        var ldata = class_list[c];
        var el_list = [];
        // Check if has annotation for each class
        if (ldata !== null && ldata !== undefined) {
            // Draw all segments of each element
            for (i = 0; i < ldata.length; i++) {

                el = ['O', 500, 100];
                ldata[i].idSegment=i+1; //actualiza o id do segmento
                el_list.push(el);
                
            }
            fillTable(body, ldata, el_list); //Alterei
        }
    }
    if (class_list[0] !== undefined || class_list[1] !== undefined || class_list[2] !== undefined) {
        if (flagsave === -1) {
            flagsave = 1;
        }
    }
}

/* Draw Managing */

function drawElement(cId) {
    /** @description Active follicle draw
     * @param {int} cId Class ID
     */

    if (click_enable) {
        // Reset button
        if ($(".btn-class-annot.btn-outline-info").length > 0) {
            let btn = $(".btn-class-annot.btn-outline-info")[0]
            btn.classList.remove("btn-outline-info");
            btn.classList.add("btn-info");
        }
        // Global flag for events
        flagMouseEvent = 1;
        refreshCanvas();
        // Set profile
        if (cId >= 0 && cId < N_CLASSES) {
            draw_profile = new DrawProfile(cId,
                            ClassEnum.properties[cId].name,
                            ClassEnum.properties[cId].color,
                            1);
            // Active draw
            activeSmooth();
        }
        // Add new class to selected button
        let btn = $(".btn-class-annot")[cId];
        btn.classList.remove("btn-info");
        btn.classList.add("btn-outline-info");
    }
}

function drawSave(){
    /** @description Save drawn element.
     */
    var btn = document.createElement("button");
    
    btn.setAttribute("id", "btn-save");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "btn-save");
    document.getElementById("col-diag-data").append(btn);        
    btn.onclick = function () { saveAnnot(); }; 
    var t=document.createTextNode("Save");
    btn.appendChild(t);
}

function saveAnnot() {
    /** @description Save annotations.
     */
    //  new element
    let upload_list = new Array();
    // Read all elements in order to remove interpolatedPoints
    for (let i =0; i < class_list.length; i++) {
        // This comparison is necessary because there is a fixed array size (yet)
        if (class_list[i] != undefined) {
            let sp = class_list[i]
            let listofelements = new Array();
            // Read elements on each list
            for (let j=0; j < sp.length; j++){
                data_obj = sp[j];
                // Delete intperpolatedPoints and push to new temp list of elements
                delete data_obj.interpolatedPoints;
                listofelements.push(data_obj);
            }
            // Upload temp list of list
            upload_list.push(listofelements);
        }        
    }
    // Data ibject to be stored
    let upload_data = { 
        image_data: im_obj, 
        annotations: upload_list
    };
    // Data to set ajax post
    let url = "/annot";
    let updata = JSON.stringify(upload_data);
    $.ajax({
        type: 'POST',
        url: url, 
        data: updata,
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            console.log("Saved");
            // Needs handle of the current data.
        }
      });
}

/* Calculate Parameters */

function calculateAxes() {
    /** @description Function to be implemented.
     */
    var majorAxis = 100;
    var minorAxis = 50;

    return { major: majorAxis, minor: minorAxis };
}
