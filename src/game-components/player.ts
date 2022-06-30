import { ColorEnum } from "../enums/color-enum";
import { v4 as uuid } from 'uuid';

export class Player {
    id: string;
    name: string;
    color: ColorEnum;
    isActive: boolean;

    constructor(name: string, color: ColorEnum, isActive: boolean) {
        this.id = uuid();
        this.name = name;
        this.color = color;
        this.isActive = isActive;        
    }
}