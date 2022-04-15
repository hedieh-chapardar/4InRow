import { Base } from './base';
import { Bead } from './bead';

export class FakeBead extends Bead implements Base {
    private _element: JQuery<HTMLElement>;

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div class='bead fake-bead bg-red'></div>`);
        return this._element;
    }

    /**Sets width, height & left based on game size */
    setInitialStyles(size: number, left: number): void {
        this._element.css('width', size);
        this._element.css('height', size);
        this._element.css('left', left);
    }
}