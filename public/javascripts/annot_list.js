
var ovary_list = [];
var ovary_eg = ['O', 500, 100];
ovary_list.push(ovary_eg);

function listOvary() {
    ///<summary>Preenche a tabela de Distâncias</summary>
    ///<param name="body">Elemento onde será adicionada a tabela.</param>
    var body = document.getElementById("list-annot");
    body.innerHTML = "";
    if (ovary_list.length > 0) {
        // Table of content
        var table = document.createElement("table");
        table.setAttribute("id", "table-ovary"); table.setAttribute("class", "table-dark");
        // Header elements
        var header = document.createElement("tr");
        var th1 = document.createElement("th");
        th1.appendChild(document.createTextNode("Ovary"));
        header.appendChild(th1);
        var th2 = document.createElement("th");
        th2.appendChild(document.createTextNode("Major axis"));
        header.appendChild(th2);
        var th3 = document.createElement("th");
        th3.appendChild(document.createTextNode("Minor axis"));
        header.appendChild(th3);
        var th4 = document.createElement("th");
        th4.appendChild(document.createTextNode("Edit"));
        header.appendChild(th4);
        var th5 = document.createElement("th");
        th5.appendChild(document.createTextNode("Delete"));
        header.appendChild(th5);
        table.appendChild(header);
        // Read all list of elements
        for (i = 0; i < ovary_list.length; i++) {
            // Element id to be listed
            idx = i + 1;
            // Get element
            el = ovary_list[i];
            // Row elements
            var row = document.createElement("tr");
            // Text Elements
            var td1 = document.createElement("td"); td1.setAttribute("class", "td-text-annot");
            td1.appendChild(document.createTextNode(el[0] + " #" + idx));
            row.appendChild(td1);
            var td2 = document.createElement("td"); td2.setAttribute("class", "td-text-annot");
            td2.appendChild(document.createTextNode(el[1] + "px"));
            row.appendChild(td2);
            var td3 = document.createElement("td"); td3.setAttribute("class", "td-text-annot");
            td3.appendChild(document.createTextNode(el[2] + "px"));
            row.appendChild(td3);
            // Edit Button
            var td4 = document.createElement("td"); td4.setAttribute("class", "td-btn-annot");
            td4.appendChild(document.createTextNode("100 px"));
            td4.innerHTML = '<button type="button" class="btn btn-light btn-list">' +
                '<i class="far fa-edit" ></i >' + '</button>'
            row.appendChild(td4);
            // Delete Button 
            var td5 = document.createElement("td"); td5.setAttribute("class", "td-btn-annot");
            td5.appendChild(document.createTextNode("100 px"));
            td5.innerHTML = '<button type="button" class="btn btn-primary btn-list">' +
                '<i class="far fa-trash-alt" ></i >' + '</button>'
            row.appendChild(td5);

            // Append Row to table
            table.appendChild(row);
        }
        // Append table to body
        body.appendChild(table);
    }    
}