import { BaseComponent, Bead, FakeBead, Placeholder } from '.';
import { Cell } from "../models";
import { SizeConstants } from "../constants/size-constants";
import { Player } from './player';
import { getActivePlayer } from '../helper/utilities';
import { Subject } from 'rxjs';

/**
 * Player minimum beads count to win the game (except the cell which is checking the condition on it)
 */
const winnerMinBeadsCount = 3;

export class GameBox implements BaseComponent {
    private _element: JQuery<HTMLElement>;
    /**
     * Game size number
     */
    private _gameSize: number;
    /**
     * Placeholders array in the game box
     */
    private _placeholders: Placeholder[][] = [];
    /**
     * Placeholder width/height in px which depends on game size */
    private _placeholderInnerSize: number;
    /**
     * Players array
     */
    private _players: Player[];
    /**
     * Indicated that game box is clickable or not
     */
    private _isGameBoxClickable: boolean = true;

    onBeadAdded: Subject<Cell>;
    onGameOver: Subject<Player>;

    constructor(gameSize: number, players: Player[]) {
        this.onBeadAdded = new Subject();
        this.onGameOver = new Subject();
        this._gameSize = gameSize;
        this._players = players;
        this.initGameBox();
        this.setPlaceholderInnerSize();
    }

    draw(): JQuery<HTMLElement> {
        this._element = this.drawGameBox();
        this.drawRowsDetails();
        return this._element;
    }

    checkIfCurrentPlayerWins(cell: Cell): Player | null {
        const currentPlaceholder = this._placeholders[cell.rowIndex][cell.columnIndex];
        const currentPlayer = currentPlaceholder.getBead().getPlayer();
        const currentPlayerWins = this.checkAllDirections(cell, currentPlayer);
        if (currentPlayerWins) {
            this._isGameBoxClickable = false;
            return currentPlayer;
        }

        return null;
    }

    private initGameBox(): void {
        this.initRowsDetails();
    }

    private initRowsDetails(): void {
        for (let rowIndex = 0; rowIndex < this._gameSize; rowIndex++) {
            this._placeholders[rowIndex] = [];
            this.initColumnsDetails(rowIndex);
        }
    }

    private initColumnsDetails(rowIndex: number) {
        for (let columnIndex = 0; columnIndex < this._gameSize; columnIndex++) {
            this.initPlaceholderInCell(rowIndex, columnIndex);
        }
    }

    private initPlaceholderInCell(rowIndex: number, columnIndex: number): void {
        const placeholder = new Placeholder();
        this.assignPlaceholderToCell(rowIndex, columnIndex, placeholder);
    }

    /**
     * Draws game box element
     * @returns game box element
     */
    private drawGameBox(): JQuery<HTMLElement> {
        return $(`<div id='game-box'></div>`);
    }

    /**
     * Draws each row details (row element & columns details)
     */
    private drawRowsDetails(): void {
        for (let rowIndex = 0; rowIndex < this._gameSize; rowIndex++) {
            const rowElement = this.drawRow();
            this.drawColumnsDetails(rowIndex, rowElement);
            this._element.append(rowElement);
        }
    }

    /**
     * Draws row element
     * @returns row element
     */
    private drawRow(): JQuery<HTMLElement> {
        return $(`<div class='row'></div>`);
    }

    private drawColumnsDetails(rowIndex: number, rowElement: JQuery<HTMLElement>): void {
        for (let columnIndex = 0; columnIndex < this._gameSize; columnIndex++) {
            const placeholderElement = this.addPlaceholderToCell(rowIndex, columnIndex);
            rowElement.append(placeholderElement);
        }
    }

    /**
     * Adds placeholder to the given cell & handle its click event 
     */
    private addPlaceholderToCell(rowIndex: number, columnIndex: number): JQuery<HTMLElement> {
        const placeholder = this._placeholders[rowIndex][columnIndex];
        const placeholderElement = placeholder.draw();

        placeholder.onClick.subscribe(() => {
            this.onPlaceholderClick(columnIndex);
        });

        return placeholderElement;
    }

    /**
     * Adds the given placeholder to the given cell */
    private assignPlaceholderToCell(rowIndex: number, columnIndex: number, placeholder: Placeholder): void {
        this._placeholders[rowIndex][columnIndex] = placeholder;
    }

    /**
     * Handles click event on some random placeholder & adds bead to suitable one 
     */
    private onPlaceholderClick(columnIndex: number): void {
        if (!this._isGameBoxClickable) return;

        const cell = this.getSuitableCellInfo(columnIndex);
        if (!cell) return;

        this.addFakeBead(cell, this.addRealBeadToSuitableCell.bind(this));
    }

    /**
     * Gets suitable cell in the selected/given column if exists */
    private getSuitableCellInfo(columnIndex: number): Cell | null {
        for (let rowIndex = this._gameSize - 1; rowIndex >= 0; rowIndex--) {
            const currentPlaceholder = this._placeholders[rowIndex][columnIndex];
            if (!currentPlaceholder.hasBead())
                return { rowIndex: rowIndex, columnIndex: columnIndex };
        }

        return null;
    }

    /**
     * Adds real bead to suitable cell
     */
    private addRealBeadToSuitableCell(cell: Cell): void {
        const currentActivePlayer = getActivePlayer(this._players);
        this._placeholders[cell.rowIndex][cell.columnIndex].addBead(new Bead(currentActivePlayer));
        this.onBeadAdded.next(cell);
        this._isGameBoxClickable = true;
    }

    /**
     * Calculates a bead's final top/left which it should animate to
     * @param index row/column index of the cell (row index for top & column index for left)
     */
    private calculateFakeBeadTopOrLeft(index: number): number {
        const previousPlaceHoldersSize = (index * this._placeholderInnerSize) + (index * 2 * SizeConstants.placeholderMarginSize) + (index * 2 * SizeConstants.placeholderBorderSize);
        return previousPlaceHoldersSize + SizeConstants.placeholderMarginSize + SizeConstants.placeholderBorderSize;
    }

    /**
     * Calculates and sets placeholders inner size  
     */
    private setPlaceholderInnerSize(): void {
        const placeholderSize = SizeConstants.boxSize / this._gameSize;
        this._placeholderInnerSize = placeholderSize - (2 * SizeConstants.placeholderMarginSize) - (2 * SizeConstants.placeholderBorderSize);
    }

    /**
     * Adds fake bead (which is animated to suitable cell before adding real bead to that cell) 
     */
    private addFakeBead(cell: Cell, callback: (cell: Cell) => void): void {
        this._isGameBoxClickable = false;
        const animateToTop = this.calculateFakeBeadTopOrLeft(cell.rowIndex);
        const left = this.calculateFakeBeadTopOrLeft(cell.columnIndex);
        const currentActivePlayer = getActivePlayer(this._players);

        const fakeBead = new FakeBead(this._placeholderInnerSize, left, currentActivePlayer.color);
        const fakeBeadElement = fakeBead.draw();
        this._element.append(fakeBeadElement);
        fakeBeadElement.animate({ top: animateToTop }, 500, 'swing', callback.bind(this, cell));
    }

    /**
     * Checks all sides of current cell
     * @param cell current cell
     * @param currentPlayer current player
     * @returns true if current player has at least four beads of its color in one direction
     */
    private checkAllDirections(cell: Cell, currentPlayer: Player): boolean {
        if (this.getHorizontalDirectionCount(cell, currentPlayer) >= winnerMinBeadsCount)
            return true;

        if (this.getVerticalDirectionToBottomCount(cell, currentPlayer) >= winnerMinBeadsCount)
            return true;

        if (this.getDiagonalDirectionToTopLeftOrBottomRightCount(cell, currentPlayer) >= winnerMinBeadsCount)
            return true;

        if (this.getDiagonalDirectionToTopRightOrBottomLeftCount(cell, currentPlayer) >= winnerMinBeadsCount)
            return true;

        return false;
    }

    private getHorizontalDirectionCount(cell: Cell, currentPlayer: Player): number {
        const leftCount = this.getHorizontalToLeftCount(cell, currentPlayer);
        const rightCount = this.getHorizontalToRightCount(cell, currentPlayer);
        return leftCount + rightCount;
    }

    private getDiagonalDirectionToTopLeftOrBottomRightCount(cell: Cell, currentPlayer: Player): number {
        const topLeftCount = this.getDiagonalToTopLeftCount(cell, currentPlayer);
        const bottomRightCount = this.getDiagonalToBottomRightCount(cell, currentPlayer);
        return topLeftCount + bottomRightCount;
    }

    private getDiagonalDirectionToTopRightOrBottomLeftCount(cell: Cell, currentPlayer: Player): number {
        const topRightCount = this.getDiagonalToTopRightCount(cell, currentPlayer);
        const bottomLeftCount = this.getDiagonalToBottomLeftCount(cell, currentPlayer);
        return topRightCount + bottomLeftCount;
    }

    private getHorizontalToLeftCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const previousColumnIndex = cell.columnIndex - 1;
        if (previousColumnIndex < 0) return count;

        for (let colIndex = previousColumnIndex; colIndex >= 0; colIndex--) {
            const currentPlaceholder = this._placeholders[cell.rowIndex][colIndex];
            if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                count++;
            }
            else
                break;
        }

        return count;
    }

    private getHorizontalToRightCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const nextColumnIndex = cell.columnIndex + 1;
        if (nextColumnIndex >= this._gameSize) return count;

        for (let colIndex = nextColumnIndex; colIndex < this._gameSize; colIndex++) {
            const currentPlaceholder = this._placeholders[cell.rowIndex][colIndex];
            if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                count++;
            }
            else
                break;
        }

        return count;
    }

    private getVerticalDirectionToBottomCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const nextRowIndex = cell.rowIndex + 1;
        if (nextRowIndex >= this._gameSize) return count;

        for (let rowIndex = nextRowIndex; rowIndex < this._gameSize; rowIndex++) {
            const currentPlaceholder = this._placeholders[rowIndex][cell.columnIndex];
            if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                count++;
            }
            else
                break;
        }

        return count;
    }

    private getDiagonalToTopLeftCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const previousColumnIndex = cell.columnIndex - 1;
        let previousRowIndex = cell.rowIndex - 1;
        if (previousColumnIndex < 0 || previousRowIndex < 0) return count;

        for (let colIndex = previousColumnIndex; colIndex >= 0; colIndex--) {
            if (previousRowIndex >= 0) {
                const currentPlaceholder = this._placeholders[previousRowIndex][colIndex];
                if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                    count++;
                    previousRowIndex--;
                }
                else
                    break;
            }
            else
                break;
        }

        return count;
    }

    private getDiagonalToBottomLeftCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const previousColumnIndex = cell.columnIndex - 1;
        let nextRowIndex = cell.rowIndex + 1;
        if (previousColumnIndex < 0 || nextRowIndex >= this._gameSize) return count;

        for (let colIndex = previousColumnIndex; colIndex >= 0; colIndex--) {
            if (nextRowIndex < this._gameSize) {
                const currentPlaceholder = this._placeholders[nextRowIndex][colIndex];
                if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                    count++;
                    nextRowIndex++;
                }
                else
                    break;
            }
            else
                break;
        }

        return count;
    }

    private getDiagonalToTopRightCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const nextColumnIndex = cell.columnIndex + 1;
        let previousRowIndex = cell.rowIndex - 1;
        if (nextColumnIndex >= this._gameSize || previousRowIndex < 0) return count;

        for (let colIndex = nextColumnIndex; colIndex < this._gameSize; colIndex++) {
            if (previousRowIndex >= 0) {
                const currentPlaceholder = this._placeholders[previousRowIndex][colIndex];
                if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                    count++;
                    previousRowIndex--;
                }
                else
                    break;
            }
            else
                break;
        }

        return count;
    }

    private getDiagonalToBottomRightCount(cell: Cell, currentPlayer: Player): number {
        let count = 0;
        const nextColumnIndex = cell.columnIndex + 1;
        let nextRowIndex = cell.rowIndex + 1;
        if (nextColumnIndex >= this._gameSize || nextRowIndex >= this._gameSize) return count;

        for (let colIndex = nextColumnIndex; colIndex < this._gameSize; colIndex++) {
            if (nextRowIndex < this._gameSize) {
                const currentPlaceholder = this._placeholders[nextRowIndex][colIndex];
                if (this.isCurrentPlaceholderFilledByCurrentPlayer(currentPlaceholder, currentPlayer)) {
                    count++;
                    nextRowIndex++;
                }
                else
                    break;
            }
            else
                break;
        }

        return count;
    }

    private isCurrentPlaceholderFilledByCurrentPlayer(placeholder: Placeholder, player: Player): boolean {
        return placeholder.hasBead() && placeholder.getBead().getPlayer().id === player.id;
    }
}