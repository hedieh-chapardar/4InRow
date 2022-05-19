import { Game } from './game-components';

const gameSize = 8;
const playersCount = 2;

jQuery(() => {
    const game = new Game(gameSize, playersCount);
    game.drawMainBox();
});