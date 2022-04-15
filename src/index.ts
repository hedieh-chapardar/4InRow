import { MainBox } from './game-components/main-box';

const gameSize = 8;

jQuery(() => {
    const mainBox = new MainBox(gameSize);
    const mainBoxElement = mainBox.draw();
    $('#wrapper').append(mainBoxElement);
});