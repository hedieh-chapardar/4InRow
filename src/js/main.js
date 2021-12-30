var rowsSize = 8;

$(document).ready(function () {

    var box = $("#box");
    for (rowIndex = 1; rowIndex <= rowsSize; rowIndex++) {
        var row = $(`<div class='row' id='${rowIndex}'></div>`);
        for (itemIndex = 1; itemIndex <= rowsSize; itemIndex++) {
            var boxItem = "<div class='box-item'></div>";
            row.append(boxItem);
        }
        box.append(row);
    }

});