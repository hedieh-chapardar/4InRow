import { BaseComponent, Player } from ".";
import { ColorEnum } from "../enums/color-enum";

export class GameInfo implements BaseComponent {
    private _element: JQuery<HTMLElement>;
    /**
     * Players count
     */
    private _playersCount: number;

    players: Player[];

    constructor(playersCount: number) {
        this._playersCount = playersCount;
    }

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div id='game-info'></div>`);
        const playersBox = this.drawPlayersBox();
        return this._element.append(playersBox);
    }

    private drawPlayersBox(): JQuery<HTMLElement> {
        const playersBox = $(`<div id='players-box'></div>`);
        for (let playerIndex = 0; playerIndex < this._playersCount; playerIndex++) {
            const player = new Player(`Player ${playerIndex + 1}`, playerIndex === 0 ? ColorEnum.red : ColorEnum.blue);
            const playerContent = this.drawPlayerContent();
            const playerInfoElement = this.drawPlayerInfo(player);
            const playerBeadElement = this.drawPlayerBead(player);
            playerContent.append([playerInfoElement, playerBeadElement]);
            playersBox.append(playerContent);
        }
        return playersBox;
    }

    private drawPlayerContent(): JQuery<HTMLElement> {
        return $(`<div class='player-content'></div>`);
    }

    private drawPlayerInfo(player: Player): JQuery<HTMLElement> {
        return $(`<div class='player-info'>${player.name}</div>`);
    }

    private drawPlayerBead(player: Player): JQuery<HTMLElement> {
        return $(`<div class='player-bead ${player.color === ColorEnum.red ? `bg-red` : `bg-blue`}'></div>`);
    }    
}