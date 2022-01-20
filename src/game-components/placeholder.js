"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placeholder = void 0;
class Placeholder {
    HasBead() {
        return this.IsFilled;
    }
    Draw() {
        this._elem = $(`<div class='placeholder'></div>`);
        return this._elem;
    }
}
exports.Placeholder = Placeholder;
