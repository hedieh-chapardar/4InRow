import { Player } from ".";
import { BaseComponent } from "./base-component";
import { getBgColorClassNameBasedOnColorEnum } from "../helper/utilities";

export class Bead implements BaseComponent {
    private _player: Player;

    constructor(player: Player) {
        this._player = player;
    }

    draw(): JQuery<HTMLElement> {
        const bgColorClass = getBgColorClassNameBasedOnColorEnum(this._player.color);
        return $(`<div class='bead real-bead ${bgColorClass}'></div>`);
    }

    getPlayer(): Player {
        return this._player;
    }
}