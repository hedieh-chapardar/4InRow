var Placeholder = /** @class */ (function () {
    function Placeholder() {
    }
    Placeholder.prototype.HasBead = function () {
        return this.IsFilled;
    };
    Placeholder.prototype.Draw = function () {
        this._elem = $("<div class='placeholder'></div>");
        return this._elem;
    };
    return Placeholder;
}());
export { Placeholder };
