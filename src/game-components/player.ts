import { ColorEnum } from "../enums/color-enum";

export class Player {
    name: string;
    color: ColorEnum;

    constructor(name: string, color: ColorEnum) {
        this.name = name;
        this.color = color;
    }
}