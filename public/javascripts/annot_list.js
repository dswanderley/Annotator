// Profile with data to draw lines
var draw_profile = new DrawProfile();

/** @description Classes enumeration  */
var ClassEnum = {
    OVARIAN_STROMA: 0,
    OVARIAN_FOLLICLE: 1,
    OVARIAN_CYST: 2,
    properties: {
        0: { name: "ovarian stroma", value: 0, code: "OVARIAN_STROMA", color: "#FF6468" },
        1: { name: "ovarian follicle", value: 1, code: "OVARIAN_FOLLICLE", color: "#DCFFD2" },        
        2: { name: "ovarian cyst", value: 2, code: "OVARIAN_CYST", color: "#0032B4" }
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
    if (id != null && id != undefined)
        this.id = id;
    else
        this.id = 0;
    // class
    if (class_name != null && class_name != undefined)
        this.class_name = class_name;
    else
        this.class_name = '';
    // color
    if (color != null && color != undefined)
        this.color = color;
    else
        this.color = '#FFFFFF';
    // thickness
    if (thick != null && thick != undefined)
        this.thick = thick;
    else
        this.thick = 1;
}

/* TABLE Functions */

function fillTable(body, el_str, el_list) {
    /** @description Fill data table with anotations reference
      * @param {Window} body A HTML element table
      * @param {Str} el_str Name of the class
      * @param {Array} el_list List with elements of the same class
     */
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
            td4.innerHTML = '<button type="button" class="btn btn-light btn-annot">' +
                '<i class="far fa-edit i-tab" ></i >' + '</button>'
            row.appendChild(td4);
            // Delete Button 
            var td5 = document.createElement("td");
            td5.setAttribute("class", "td-btn-annot");
            td5.innerHTML = '<button type="button" class="btn btn-primary btn-annot">' +
                '<i class="far fa-trash-alt i-tab" ></i >' + '</button>'
            row.appendChild(td5);

            // Append Row to table
            tbody.appendChild(row)
        }
        // Append table to body
        table.appendChild(tbody);
        body.appendChild(table);
    }    
}

function listAnnot() {

    // Body of list with annotations
    var body = document.getElementById("list-annot");
    body.innerHTML = "";

    // List with annotations
    for (c = 0; c < class_list.length; c++) {
        // Get each class
        var ldata = class_list[c];
        var el_list = [];
        // Check if has annotation for each class
        if (ldata != null && ldata != undefined) {
            // Draw all segments of each element
            for (i = 0; i < ldata.length; i++) {

                el = ['O', 500, 100];

                el_list.push(el);
            }
            fillTable(body, ldata[0].profile.class_name, el_list);
        }
    }
           
}

/* Draw Managing */

function drawElement(cId) {
    /** @description Active follicle draw  
     */
    if (cId >= 0 && cId < N_CLASSES) {
        // Set profile
        this.draw_profile = new DrawProfile(cId,
                                            ClassEnum.properties[cId].name,
                                            ClassEnum.properties[cId].color,
                                            3);
        // Active draw
        activeSmooth();
    }       
}


/* Calculate Parameters */

function calculateAxes() {

    var majorAxis = 100;
    var minorAxis = 50;

    return { major: majorAxis, minor: minorAxis };
}
