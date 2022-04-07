import { MainBox } from './game-components/main-box';

const rowSize = 8;

jQuery(() => {
    const mainBox = new MainBox(rowSize);
    const mainBoxElement = mainBox.draw();
    $('#wrapper').append(mainBoxElement);
});