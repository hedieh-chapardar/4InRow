import { Base } from "./base";
import { Bead } from "./bead";
import { FakeBead } from "./fake-bead";
import { Placeholder } from "./placeholder";
import { CellInfo } from "./cell-info";
import { SizeConstants } from "./constants";

export class MainBox implements Base {
    private _element: JQuery<HTMLElement>;
    /**Placeholder width/height in px which depends on game size */
    private _placeholderInnerSize: number;

    gameSize: number;
    placeholders: Placeholder[][] = [];

    constructor(gameSize: number) {
        this.gameSize = gameSize;
        this.setPlaceholderInnerSize();
    }

    draw(): JQuery<HTMLElement> {
        this._element = this.drawBox();
        this.drawRowsDetails(this._element);
        return this._element;
    }

    private drawBox(): JQuery<HTMLElement> {
        return $(`<div id='box'></div>`);
    }

    private drawRowsDetails(box: JQuery<HTMLElement>) {
        for (let rowIndex = 0; rowIndex < this.gameSize; rowIndex++) {
            this.placeholders[rowIndex] = [];
            const rowElement = this.drawRow();
            this.drawColumnsDetails(rowIndex, rowElement);
            box.append(rowElement);
        }
    }

    private drawRow(): JQuery<HTMLElement> {
        return $(`<div class='row'></div>`);
    }

    private drawColumnsDetails(rowIndex: number, rowElement: JQuery<HTMLElement>) {
        for (let columnIndex = 0; columnIndex < this.gameSize; columnIndex++) {
            const placeholderElement = this.addPlaceholderToCell(rowIndex, columnIndex);
            rowElement.append(placeholderElement);
        }
    }

    /**Adds placeholder to the given cell & handle its click event */
    private addPlaceholderToCell(rowIndex: number, columnIndex: number) {
        const placeholder = new Placeholder();
        this.assignPlaceholderToCell(rowIndex, columnIndex, placeholder);
        const placeholderElement = placeholder.draw();

        placeholder.onClick.subscribe(() => {
            this.onPlaceholderClick(columnIndex);
        });

        return placeholderElement;
    }

    /**Adds the given placeholder to the given cell */
    private assignPlaceholderToCell(rowIndex: number, columnIndex: number, placeholder: Placeholder) {
        this.placeholders[rowIndex][columnIndex] = placeholder;
    }

    /**Handles click event on some random placeholder & add bead to suitable one */
    private onPlaceholderClick(columnIndex: number): void {
        const cellInfo = this.getSuitableCellInfo(columnIndex);
        if (!cellInfo) return;
        
        this.addFakeBead(cellInfo, this.addRealBeadToSuitableCell.bind(this));        
    }

    /**Gets suitable cell info in the selected/given column if exists */
    private getSuitableCellInfo(columnIndex: number): CellInfo | null {
        for (let rowIndex = this.gameSize - 1; rowIndex >= 0; rowIndex--) {
            const currentPlaceholder = this.placeholders[rowIndex][columnIndex];
            if (!currentPlaceholder.hasBead())
                return { rowIndex: rowIndex, columnIndex: columnIndex };
        }

        return null;
    }

    /**Adds real bead to suitable placeholder in the selected/given column */
    private addRealBeadToSuitableCell(cellInfo: CellInfo): void {
        this.placeholders[cellInfo.rowIndex][cellInfo.columnIndex].addBead(new Bead());
    }

    /**Calculates a bead's final top/left which it should animate to
     * @param index row/column index of the cell (row index for top & column index for left)
     */
    private calculateFakeBeadTopOrLeft(index: number): number {
        const previousPlaceHoldersSize = (index * this._placeholderInnerSize) + (index * 2 * SizeConstants.placeholderMarginSize) + (index * 2 * SizeConstants.placeholderBorderSize);
        return previousPlaceHoldersSize + SizeConstants.placeholderMarginSize + SizeConstants.placeholderBorderSize;
    }

    /**Calculates and sets placeholders inner size  */
    private setPlaceholderInnerSize() {
        const placeholderSize = SizeConstants.boxSize / this.gameSize;
        this._placeholderInnerSize = placeholderSize - (2 * SizeConstants.placeholderMarginSize) - (2 * SizeConstants.placeholderBorderSize);
    }

    /**Adds fake bead (which is animated to suitable cell before adding real bead to that cell) */
    private addFakeBead(cellInfo: CellInfo, callback: (cellInfo: CellInfo) => void): void {
        const animateToTop = this.calculateFakeBeadTopOrLeft(cellInfo.rowIndex);
        const left = this.calculateFakeBeadTopOrLeft(cellInfo.columnIndex);

        const fakeBead = new FakeBead(this._placeholderInnerSize, left);
        const fakeBeadElement = fakeBead.draw();
        this._element.append(fakeBeadElement);
        fakeBeadElement.animate({ top: animateToTop}, 500, 'swing', callback.bind(this, cellInfo));
    }
}