import { MainBox } from './game-components/main-box';

const rowSize = 8;

jQuery(() => {
    const mainBoxObj = new MainBox(rowSize);
    const mainBoxElem = mainBoxObj.Draw();
    $('#wrapper').append(mainBoxElem);
});