export class Bead {
    color: ColorEnum;

    Draw(): JQuery<HTMLElement> {
        return $(`<div class='bead bg-red'></div>`);
    }
}

enum ColorEnum {
    Blue = 1,
    Red = 2
}