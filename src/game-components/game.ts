import { ColorEnum } from '../enums/color-enum';
import { GameInfo, MainBox, Player } from '../game-components';
import { getActivePlayer, getActivePlayerIndex } from '../helper/utilities';

export class Game {
    /**
     * Game size number
     */
    private _gameSize: number;
    /**
     * Players count
     */
    private _playersCount: number;
    /**
     * players
     */
    private _players: Player[] = [];
    /**
     * Game info
     */
    private _gameInfo: GameInfo;
    /**
     * Game box
     */
    private _gameBox: MainBox;

    constructor(gameSize: number, playersCount: number) {
        this._gameSize = gameSize;
        this._playersCount = playersCount;
        this.initPlayers();
        this.initGameInfo(this._players);
        this.initGameBox(this._gameSize, this._players);
    }

    draw(): void {
        $('#game').empty();
        const gameInfoElement = this.drawGameInfo();
        const mainBoxElement = this.drawGameBox();
        $('#game').append([gameInfoElement, mainBoxElement]);
    }

    private initPlayers(): void {
        for (let playerIndex = 0; playerIndex < this._playersCount; playerIndex++) {
            const playerName = `Player ${playerIndex + 1}`;
            const playerColor = this.assignColorToPlayer(playerIndex);
            const isPlayerActive = playerIndex === 0;
            const player = new Player(playerName, playerColor, isPlayerActive);
            this._players.push(player);
        }
    }

    private initGameInfo(players: Player[]): void {
        this._gameInfo = new GameInfo(players);
    }

    private initGameBox(gameSize: number, players: Player[]): void {
        this._gameBox = new MainBox(gameSize, players);
        this._gameBox.onBeadAdded.subscribe(() => {
            const currentActivePlayerIndex = getActivePlayerIndex(this._players);
            const nextPlayerIndex = this.getNextPlayerIndex(currentActivePlayerIndex);
            this.inactivateCurrentPlayer(currentActivePlayerIndex);
            this.activateNextPlayer(nextPlayerIndex);
            this.draw();
        });

    }

    private assignColorToPlayer(i: number): ColorEnum {
        return i === 0 ? ColorEnum.red : ColorEnum.blue;
    }

    private drawGameInfo(): JQuery<HTMLElement> {
        return this._gameInfo.draw();
    }

    private drawGameBox(): JQuery<HTMLElement> {

        return this._gameBox.draw();
    }

    private inactivateCurrentPlayer(playerIndex: number): void {
        this._players[playerIndex].isActive = false;
    }

    private activateNextPlayer(playerIndex: number): void {
        this._players[playerIndex].isActive = true;
    }

    private getNextPlayerIndex(currentPlayerIndex: number): number {
        const nextPlayerIndex = currentPlayerIndex + 1;
        if (nextPlayerIndex < this._playersCount)
            return nextPlayerIndex;

        return 0;
    }
}