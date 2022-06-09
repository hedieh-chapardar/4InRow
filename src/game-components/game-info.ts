import { BaseComponent, Player } from ".";
import { getBgColorClassNameBasedOnColorEnum } from "../helper/utilities";

export class GameInfo implements BaseComponent {
    private _element: JQuery<HTMLElement>;
    /**
     * Players array
     */
    _players: Player[];

    constructor(players: Player[]) {
        this._players = players;
    }

    draw(): JQuery<HTMLElement> {
        this._element = $(`<div id='game-info'></div>`);
        const playersBoxElement = this.drawPlayersBox();
        return this._element.append(playersBoxElement);
    }

    private drawPlayersBox(): JQuery<HTMLElement> {
        const playersBoxElement = $(`<div id='players-box'></div>`);
        this.appendPlayersDetailsToPlayersBox(playersBoxElement);
        return playersBoxElement;
    }

    private appendPlayersDetailsToPlayersBox(playersBox: JQuery<HTMLElement>) {
        this._players.forEach((player: Player) => {
            const playerElement = this.drawPlayer(player);
            const playerInfoElement = this.drawPlayerInfo(player);
            const playerBeadElement = this.drawPlayerBead(player);
            playerElement.append([playerInfoElement, playerBeadElement]);
            playersBox.append(playerElement);
        });
    }

    private drawPlayer(player: Player): JQuery<HTMLElement> {
        const activityStatusClass = player.isActive ? ' active' : '';
        return $(`<div class='player${activityStatusClass}'></div>`);
    }

    private drawPlayerInfo(player: Player): JQuery<HTMLElement> {
        return $(`<div class='player-info'>${player.name}</div>`);
    }

    private drawPlayerBead(player: Player): JQuery<HTMLElement> {
        const backgroundColorClass = getBgColorClassNameBasedOnColorEnum(player.color);        
        return $(`<div class='player-bead ${backgroundColorClass}'></div>`);
    }
}