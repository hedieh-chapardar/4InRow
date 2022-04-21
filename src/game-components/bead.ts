import { BaseComponent } from "./base-component";

export class Bead implements BaseComponent {    
    draw(): JQuery<HTMLElement> {
        return $(`<div class='bead real-bead bg-red'></div>`);
    }
}