import { Subject } from "rxjs";
import { BaseComponent } from "./base-component";
import { Bead } from './bead';

export class Placeholder implements BaseComponent {
    private _element: JQuery<HTMLElement>;
    /**
     * Bead object in the placeholder
     */
    private _bead: Bead;
    
    /**
     * Click event subject
     */
    onClick: Subject<any>;

    constructor() {
        this.onClick = new Subject();
    }

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div class='placeholder'></div>`);
        this._element.on('click', this.click.bind(this));
        return this._element;
    }

    /**
     * Checks if placeholder has bead
     * @returns true if placeholder has bead, false otherwise
     */
    hasBead(): boolean {
        return this._bead ? true : false;
    }

    /**
     * Placeholder click event handler
     */
    click(): void {
        this.onClick.next();
    }

    /**
     * Adds real bead to the placeholder
     * @param bead Bead object
     */
    addBead(bead: Bead): void {
        if (this.hasBead()) return;

        this._bead = bead;
        const beadElement = bead.draw();
        this._element.append(beadElement);
    }
}