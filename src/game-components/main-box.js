import { Placeholder } from "./placeholder";
var MainBox = /** @class */ (function () {
    function MainBox(size) {
        this.Placeholders = [];
        this.Size = size;
    }
    MainBox.prototype.Draw = function () {
        var box = this.DrawBox();
        for (var rowIndex = 0; rowIndex <= this.Size - 1; rowIndex++) {
            this.Placeholders[rowIndex] = [];
            var rowElem = this.DrawRow();
            for (var columnIndex = 0; columnIndex <= this.Size - 1; columnIndex++) {
                this.Placeholders[rowIndex][columnIndex] = columnIndex;
                var placeholderObj = new Placeholder();
                var placeholderElem = placeholderObj.Draw();
                rowElem.append(placeholderElem);
            }
            box.append(rowElem);
        }
        return box;
    };
    MainBox.prototype.DrawBox = function () {
        return $("<div id='box'></div>");
    };
    MainBox.prototype.DrawRow = function () {
        return $("<div class='row'></div>");
    };
    return MainBox;
}());
export { MainBox };
