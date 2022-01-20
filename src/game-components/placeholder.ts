export class Placeholder {
    private _elem: JQuery<HTMLElement>;

    Size: number;
    RowNo: number;
    ColumnNo: number;
    IsFilled: boolean;

    HasBead() {
        return this.IsFilled;
    }

    Draw(): JQuery<HTMLElement> {
        this._elem = $(`<div class='placeholder'></div>`);
        return this._elem;
    }
}