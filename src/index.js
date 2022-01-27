import { MainBox } from './game-components/main-box';
var rowSize = 8;
jQuery(function () {
    var mainBoxObj = new MainBox(rowSize);
    var mainBoxElem = mainBoxObj.Draw();
    $('#wrapper').append(mainBoxElem);
});
// class MainBox {
//     constructor(size: number) {
//         this.Size = size;
//     }
//     Size: number;
//     Placeholders: number[][] = [];
//     Draw(): JQuery<HTMLElement> {
//         let box = this.DrawBox();
//         for (let rowIndex = 0; rowIndex <= this.Size - 1; rowIndex++) {
//             this.Placeholders[rowIndex] = [];
//             let rowElem = this.DrawRow();
//             for (let columnIndex = 0; columnIndex <= this.Size - 1; columnIndex++) {
//                 this.Placeholders[rowIndex][columnIndex] = columnIndex;
//                 let placeholderObj = new Placeholder();
//                 const placeholderElem = placeholderObj.Draw();
//                 rowElem.append(placeholderElem);
//             }
//             box.append(rowElem);
//         }
//         return box;
//     }
//     private DrawBox(): JQuery<HTMLElement> {
//         return $(`<div id='box'></div>`);
//     }
//     private DrawRow(): JQuery<HTMLElement> {
//         return $(`<div class='row'></div>`);
//     }
// }
// class Bead {
//     Size: number;
//     Color: ColorEnum;
// }
// enum ColorEnum {
//     Blue = 1,
//     Red = 2
// }
