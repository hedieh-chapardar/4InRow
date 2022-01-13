"use strict";
const rowSize = 8;
jQuery(() => {
    const mainBoxObj = new MainBox(rowSize);
    const mainBoxElem = mainBoxObj.Draw();
    $('#wrapper').append(mainBoxElem);
});
class MainBox {
    constructor(size) {
        this.Placeholders = [];
        this.Size = size;
    }
    Draw() {
        let box = this.DrawBox();
        for (let rowIndex = 0; rowIndex <= this.Size - 1; rowIndex++) {
            this.Placeholders[rowIndex] = [];
            let rowElem = this.DrawRow();
            for (let columnIndex = 0; columnIndex <= this.Size - 1; columnIndex++) {
                this.Placeholders[rowIndex][columnIndex] = columnIndex;
                let placeholderObj = new Placeholder();
                const placeholderElem = placeholderObj.Draw();
                rowElem.append(placeholderElem);
            }
            box.append(rowElem);
        }
        return box;
    }
    DrawBox() {
        return $(`<div id='box'></div>`);
    }
    DrawRow() {
        return $(`<div class='row'></div>`);
    }
}
class Placeholder {
    HasBead() {
        return this.IsFilled;
    }
    Draw() {
        this._elem = $(`<div class='placeholder'></div>`);
        return this._elem;
    }
}
class Bead {
}
var ColorEnum;
(function (ColorEnum) {
    ColorEnum[ColorEnum["Blue"] = 1] = "Blue";
    ColorEnum[ColorEnum["Red"] = 2] = "Red";
})(ColorEnum || (ColorEnum = {}));
