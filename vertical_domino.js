// Abstract class
class VerticalDomino extends Domino {
    orientation = "vertical";

    constructor(x, y) {
        super(x, y);

        if (this.constructor == VerticalDomino) {
            throw new Error("The abstract class VerticalDomino can't be instantiated");
        }
    }

    // coordinates of the second square of the domino
    get square2() {
        return [this.x, this.y + 1];
    }

    // Returns the coordinates of the domino that are not [z, w]
    getOtherCoordinates(z, w) {
        let [x2, y2] = this.square2;
        if (this.x === z && this.y === w) {
            return this.square2;
        } else if (x2 === z && y2 === w) {
            return [this.x, this.y];
        }
    }

    draw() {
        // Position relative to the center of the canvas (canvas.width/2, canvas.height/2)
        context.fillRect(canvas.width / 2 + this.x * dominoScale, canvas.height / 2 + this.y * dominoScale,
            dominoScale, 2 * dominoScale);
    }
}