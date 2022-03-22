import { MainBox } from './game-components/main-box';

const rowSize = 4;

jQuery(() => {
    const mainBox = new MainBox(rowSize);
    const mainBoxElement = mainBox.draw();
    $('#wrapper').append(mainBoxElement);
});