import { Base } from './base';
import { Bead } from './bead';

export class FakeBead extends Bead implements Base {
    private _element: JQuery<HTMLElement>;
    /**Width & height (based on game size, etc.) */
    private _size: number;
    /**Left styles (based on game size, etc.) */
    private _left: number;

    constructor(size: number, left: number) {
        super();
        this._size = size;
        this._left = left;
    }

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div class='bead fake-bead bg-red'></div>`);
        this.setInitialStyles();
        return this._element;
    }

    /**Sets width, height & left based on game size */
    private setInitialStyles(): void {
        this._element.css('width', this._size);
        this._element.css('height', this._size);
        this._element.css('left', this._left);
    }
}