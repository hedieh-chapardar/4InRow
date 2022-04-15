export class Bead {
    color: ColorEnum;

    draw(): JQuery<HTMLElement> {
        return $(`<div class='bead real-bead bg-red'></div>`);
    }
}

enum ColorEnum {
    Blue = 1,
    Red = 2
}