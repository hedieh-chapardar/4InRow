import { ColorEnum } from "../enums/color-enum";

export class Player {
    name: string;
    color: ColorEnum;
    isActive: boolean;

    constructor(name: string, color: ColorEnum, isActive: boolean) {
        this.name = name;
        this.color = color;
        this.isActive = isActive;
    }
}