import { Subject } from "rxjs";
import { Bead } from './bead'

export class Placeholder {
    private _element: JQuery<HTMLElement>;
    private _bead: Bead;

    onClick: Subject<any>;

    constructor() {
        this.onClick = new Subject();
    }

    hasBead() {
        return this._bead ? true : false;
    }

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div class='placeholder'></div>`);
        this._element.on('click', this.click.bind(this));
        return this._element;
    }

    click(): void {
        this.onClick.next();
    }

    addBead(bead: Bead): void {
        if (this.hasBead()) return;
        
        this._bead = bead;
        const beadElement = bead.Draw();
        this._element.append(beadElement);
    }
}