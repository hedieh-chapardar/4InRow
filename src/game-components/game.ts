import { GameInfo, MainBox } from '../game-components';

export class Game {
    /**
     * Game size number
     */
    private _gameSize: number;
    /**
     * Players count
     */
    private _playersCount: number;

    constructor(gameSize: number, playersCount: number) {
        this._gameSize = gameSize;
        this._playersCount = playersCount;
    }

    draw(): void {
        const gameInfoElement = this.drawGameInfo();
        const mainBoxElement = this.drawMainBox();
        $('#game').append([gameInfoElement, mainBoxElement]);
    }

    drawMainBox(): JQuery<HTMLElement> {
        const mainBox = new MainBox(this._gameSize);
        return mainBox.draw();
    }

    drawGameInfo(): JQuery<HTMLElement> {
        const gameInfo = new GameInfo(this._playersCount);
        return gameInfo.draw();
    }


}