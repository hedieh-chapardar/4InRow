import { Bead } from "./bead";
import { Placeholder } from "./placeholder";

export class MainBox {
    size: number;
    placeholders: Placeholder[][] = [];

    constructor(size: number) {
        this.size = size;
    }

    draw(): JQuery<HTMLElement> {
        const box = this.drawBox();
        this.drawRowsDetails(box);
        return box;
    }
    
    private drawBox(): JQuery<HTMLElement> {
        return $(`<div id='box'></div>`);
    }

    private drawRowsDetails(box: JQuery<HTMLElement>) {
        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
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
        for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
            const placeholderElement = this.addPlaceholderToCell(rowIndex, columnIndex);
            rowElement.append(placeholderElement);
        }
    }

    /**add placeholder to the given cell & handle its click event */
    private addPlaceholderToCell(rowIndex: number, columnIndex: number) {
        const placeholder = new Placeholder();
        this.assignPlaceholderToCell(rowIndex, columnIndex, placeholder);
        const placeholderElement = placeholder.draw();

        placeholder.onClick.subscribe(() => {
            this.onPlaceholderClick(columnIndex);
        });

        return placeholderElement;
    }

    /**add the given placeholder to the given cell */
    private assignPlaceholderToCell(rowIndex: number, columnIndex: number, placeholder: Placeholder) {
        this.placeholders[rowIndex][columnIndex] = placeholder;
    }

    /**handle click event on some random placeholder & add bead to suitable one */
    private onPlaceholderClick(columnIndex: number): void {
        const suitablePlaceholder: Placeholder | null = this.getSuitablePlaceholder(columnIndex);
        this.addBeadToSuitablePlaceholder(suitablePlaceholder);
    }

    /**get suitable placeholder in the selected/given column */
    private getSuitablePlaceholder(columnIndex: number): Placeholder | null {
        for (let rowIndex = this.size - 1; rowIndex >= 0; rowIndex--) {
            const currentPlaceholder = this.placeholders[rowIndex][columnIndex];
            if (!currentPlaceholder.hasBead())
                return currentPlaceholder;
        }

        return null;
    }

    /**add bead to suitable placeholder in the selected/given column */
    private addBeadToSuitablePlaceholder(placeholder: Placeholder | null): void {
        if (placeholder)
            placeholder.addBead(new Bead());
    }
}