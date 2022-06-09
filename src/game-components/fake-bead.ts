import { ColorEnum } from '../enums/color-enum';
import { getBgColorClassNameBasedOnColorEnum } from '../helper/utilities';
import { BaseComponent } from './base-component';

export class FakeBead implements BaseComponent {
    private _element: JQuery<HTMLElement>;
    /**
     * Width & height sizes (based on game size, etc.) 
     */
    private _size: number;
    /**
     * Left styles (based on game size, etc.) 
     */
    private _left: number;
    /**
     * Color of the fake bead
     */
    private _color: ColorEnum;

    constructor(size: number, left: number, color: ColorEnum) {
        this._size = size;
        this._left = left;
        this._color = color;
    }

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div class='bead fake-bead'></div>`);
        this.initStyles();
        return this._element;
    }

    /**
     * Sets width, height & left (based on game size), etc.
     */
    private initStyles(): void {
        this._element.css('width', this._size);
        this._element.css('height', this._size);
        this._element.css('left', this._left);
        this._element.addClass(getBgColorClassNameBasedOnColorEnum(this._color));
    }
}