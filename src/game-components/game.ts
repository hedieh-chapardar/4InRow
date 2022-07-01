import Swal from 'sweetalert2';
import { ColorEnum } from '../enums/color-enum';
import { GameBox, GameInfo, Player } from '../game-components';
import { getActivePlayerIndex } from '../helper/utilities';
import { Cell } from '../models';

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
    private _players: Player[];
    /**
     * Game info
     */
    private _gameInfo: GameInfo;
    /**
     * Game box
     */
    private _gameBox: GameBox;

    constructor(gameSize: number, playersCount: number) {
        this._gameSize = gameSize;
        this._playersCount = playersCount;
        this.initGame();
    }

    draw(): void {
        $('#game').empty();
        const gameInfoElement = this.drawGameInfo();
        const gameBoxElement = this.drawGameBox();
        $('#game').append([gameInfoElement, gameBoxElement]);
    }

    private initGame(): void {
        this.initPlayers();
        this.initGameInfo(this._players);
        this.initGameBox(this._gameSize, this._players);
    }

    private initPlayers(): void {
        this._players = [];
        for (let playerIndex = 0; playerIndex < this._playersCount; playerIndex++) {
            const name = `Player ${playerIndex + 1}`;
            const color = this.assignColorToPlayer(playerIndex);
            const isActive = playerIndex === 0;
            const player = new Player(name, color, isActive);
            this._players.push(player);
        }
    }

    private initGameInfo(players: Player[]): void {
        this._gameInfo = new GameInfo(players);
    }

    private initGameBox(gameSize: number, players: Player[]): void {
        this._gameBox = new GameBox(gameSize, players);
        this.subscribeToBeadAddition();
    }

    private subscribeToBeadAddition() {
        this._gameBox.onBeadAdded.subscribe((cell: Cell) => {
            const currentActivePlayerIndex = getActivePlayerIndex(this._players);
            const nextPlayerIndex = this.getNextPlayerIndex(currentActivePlayerIndex);
            this.inactivateCurrentPlayer(currentActivePlayerIndex);
            this.checkGameWinner(cell);
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

    private checkGameWinner(cell: Cell): void {
        const currentPlayer: Player | null = this._gameBox.checkIfCurrentPlayerWins(cell);

        if (currentPlayer) {
            Swal.fire({
                title: `${currentPlayer.name} won!`,
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then(() => {
                this.initGame();
                this.draw();
            });
        }
    }
}