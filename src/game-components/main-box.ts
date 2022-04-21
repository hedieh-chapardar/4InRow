import { BaseComponent } from "./base-component";
import { Bead } from "./bead";
import { FakeBead } from "./fake-bead";
import { Placeholder } from "./placeholder";
import { CellInfo } from "../models/cell-info";
import { SizeConstants } from "../constants/size-constants";

export class MainBox implements BaseComponent {
    private _element: JQuery<HTMLElement>;
    /**
     * Game size numeber
     */
    private _gameSize: number;
    /**
     * Placeholders array in the main box
     */
    private _placeholders: Placeholder[][] = [];
    /**
     * Placeholder width/height in px which depends on game size */
    private _placeholderInnerSize: number;
    /**
     * Indicated that main box is clickable or not
     */
    private _isMainBoxClickable: boolean = true;

    constructor(gameSize: number) {
        this._gameSize = gameSize;
        this.setPlaceholderInnerSize();
    }

    draw(): JQuery<HTMLElement> {
        this._element = this.drawMainBox();
        this.drawRowsDetails();
        return this._element;
    }

    /**
     * Draws main box element
     * @returns main box element
     */
    private drawMainBox(): JQuery<HTMLElement> {
        return $(`<div id='main-box'></div>`);
    }

    /**
     * Draws each row details (row element & columns details)
     */
    private drawRowsDetails(): void {
        for (let rowIndex = 0; rowIndex < this._gameSize; rowIndex++) {
            this._placeholders[rowIndex] = [];
            const rowElement = this.drawRow();
            this.drawColumnsDetails(rowIndex, rowElement);
            this._element.append(rowElement);
        }
    }

    /**
     * Draws row element
     * @returns row element
     */
    private drawRow(): JQuery<HTMLElement> {
        return $(`<div class='row'></div>`);
    }

    private drawColumnsDetails(rowIndex: number, rowElement: JQuery<HTMLElement>) {
        for (let columnIndex = 0; columnIndex < this._gameSize; columnIndex++) {
            const placeholderElement = this.addPlaceholderToCell(rowIndex, columnIndex);
            rowElement.append(placeholderElement);
        }
    }

    /**
     * Adds placeholder to the given cell & handle its click event 
     */
    private addPlaceholderToCell(rowIndex: number, columnIndex: number) {
        const placeholder = new Placeholder();
        this.assignPlaceholderToCell(rowIndex, columnIndex, placeholder);
        const placeholderElement = placeholder.draw();

        placeholder.onClick.subscribe(() => {
            this.onPlaceholderClick(columnIndex);
        });

        return placeholderElement;
    }

    /**
     * Adds the given placeholder to the given cell */
    private assignPlaceholderToCell(rowIndex: number, columnIndex: number, placeholder: Placeholder) {
        this._placeholders[rowIndex][columnIndex] = placeholder;
    }

    /**
     * Handles click event on some random placeholder & add bead to suitable one 
     */
    private onPlaceholderClick(columnIndex: number): void {
        if (!this._isMainBoxClickable) return;

        const cellInfo = this.getSuitableCellInfo(columnIndex);
        if (!cellInfo) return;

        this.addFakeBead(cellInfo, this.addRealBeadToSuitableCell.bind(this));
    }

    /**
     * Gets suitable cell info in the selected/given column if exists */
    private getSuitableCellInfo(columnIndex: number): CellInfo | null {
        for (let rowIndex = this._gameSize - 1; rowIndex >= 0; rowIndex--) {
            const currentPlaceholder = this._placeholders[rowIndex][columnIndex];
            if (!currentPlaceholder.hasBead())
                return { rowIndex: rowIndex, columnIndex: columnIndex };
        }

        return null;
    }

    /**
     * Adds real bead to suitable placeholder in the selected/given column 
     */
    private addRealBeadToSuitableCell(cellInfo: CellInfo): void {
        this._placeholders[cellInfo.rowIndex][cellInfo.columnIndex].addBead(new Bead());
        this._isMainBoxClickable = true;
    }

    /**
     * Calculates a bead's final top/left which it should animate to
     * @param index row/column index of the cell (row index for top & column index for left)
     */
    private calculateFakeBeadTopOrLeft(index: number): number {
        const previousPlaceHoldersSize = (index * this._placeholderInnerSize) + (index * 2 * SizeConstants.placeholderMarginSize) + (index * 2 * SizeConstants.placeholderBorderSize);
        return previousPlaceHoldersSize + SizeConstants.placeholderMarginSize + SizeConstants.placeholderBorderSize;
    }

    /**
     * Calculates and sets placeholders inner size  
     */
    private setPlaceholderInnerSize() {
        const placeholderSize = SizeConstants.boxSize / this._gameSize;
        this._placeholderInnerSize = placeholderSize - (2 * SizeConstants.placeholderMarginSize) - (2 * SizeConstants.placeholderBorderSize);
    }

    /**
     * Adds fake bead (which is animated to suitable cell before adding real bead to that cell) 
     */
    private addFakeBead(cellInfo: CellInfo, callback: (cellInfo: CellInfo) => void): void {
        this._isMainBoxClickable = false;
        const animateToTop = this.calculateFakeBeadTopOrLeft(cellInfo.rowIndex);
        const left = this.calculateFakeBeadTopOrLeft(cellInfo.columnIndex);

        const fakeBead = new FakeBead(this._placeholderInnerSize, left);
        const fakeBeadElement = fakeBead.draw();
        this._element.append(fakeBeadElement);
        fakeBeadElement.animate({ top: animateToTop }, 500, 'swing', callback.bind(this, cellInfo));
    }
}