
var ovary_list = [];
var ovary_eg = ['O', 500, 100];
ovary_list.push(ovary_eg);
ovary_list.push(ovary_eg);
var body = document.getElementById("list-annot");
body.innerHTML = "";

function listTable(body, el_str, el_list) {
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
        for (i = 0; i < ovary_list.length; i++) {
            // Element id to be listed
            idx = i + 1;
            // Get element
            el = ovary_list[i];
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