

function listOvary() {
    ///<summary>Preenche a tabela de Distâncias</summary>
    ///<param name="body">Elemento onde será adicionada a tabela.</param>
    var body = document.getElementById("list-annot");
    body.innerHTML = "";

    var table = document.createElement("table");
    table.setAttribute("id", "table-ovary"); table.setAttribute("class","table-dark");

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

    var row = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.appendChild(document.createTextNode("#O1"));
    row.appendChild(td1);
    var td2 = document.createElement("td");
    td2.appendChild(document.createTextNode("500 px"));
    row.appendChild(td2);
    var td3 = document.createElement("td");
    td3.appendChild(document.createTextNode("100 px"));
    row.appendChild(td3);

    var td4 = document.createElement("td");
    td4.appendChild(document.createTextNode("100 px"));
    td4.innerHTML =  '<button type="button" class="btn btn-light btn-list">' +
                     '<i class="far fa-edit" ></i >' + '</button>'         
    row.appendChild(td4);

    var td5 = document.createElement("td");
    td5.appendChild(document.createTextNode("100 px"));
    td5.innerHTML = '<button type="button" class="btn btn-primary btn-list">' +
        '<i class="far fa-trash-alt" ></i >' + '</button>'
    row.appendChild(td5);


    table.appendChild(row);



        body.appendChild(table);
    
}