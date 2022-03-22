import { Bead } from "./bead";
import { Placeholder } from "./placeholder";

export class MainBox {

    size: number;
    placeholders: Placeholder[][] = [];

    constructor(size: number) {
        this.size = size;
    }

    draw(): JQuery<HTMLElement> {
        let box = this.drawBox();
        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
            this.placeholders[rowIndex] = [];
            let rowElement = this.drawRow();
            for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
                let placeholder = new Placeholder();
                this.setPlaceholders(rowIndex, columnIndex, placeholder);
                const placeholderElement = placeholder.draw();

                placeholder.onClick.subscribe(() => {
                    placeholder.addBead(new Bead());
                });

                rowElement.append(placeholderElement);
            }
            box.append(rowElement);
        }
        return box;
    }

    private setPlaceholders(rowIndex: number, columnIndex: number, placeholder: Placeholder) {
        this.placeholders[rowIndex][columnIndex] = placeholder;
    }

    private drawBox(): JQuery<HTMLElement> {
        return $(`<div id='box'></div>`);
    }

    private drawRow(): JQuery<HTMLElement> {
        return $(`<div class='row'></div>`);
    }
}