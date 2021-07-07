// Abstract class
class HorizontalDomino extends Domino {
    orientation = "horizontal";

    constructor(x, y) {
        super(x, y);
        if (this.constructor == HorizontalDomino) {
            throw new Error(
                "The abstract class HorizontalDomino can't be instantiated"
            );
        }
    }

    // coordinates of the second square of the domino
    get square2() {
        return [this.x + 1, this.y];
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
        animateAppearingRect(
            canvas.width / 2 + this.x * dominoScale,
            canvas.height / 2 + this.y * dominoScale,
            2 * dominoScale,
            dominoScale,
            0,
            context.fillStyle
        );
    }

    drawWithoutAnimation(x = this.x, y = this.y) {
        context.fillRect(
            canvas.width / 2 + x * dominoScale,
            canvas.height / 2 + y * dominoScale,
            2 * dominoScale,
            dominoScale
        );
    }

    drawBorders(x = this.x, y = this.y) {
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(
            canvas.width / 2 + x * dominoScale,
            canvas.height / 2 + y * dominoScale,
            2 * dominoScale,
            dominoScale
        );
    }

    drawGrid(x = this.x, y = this.y){
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(
            canvas.width / 2 + x * dominoScale,
            canvas.height / 2 + y * dominoScale,
            dominoScale,
            dominoScale
        );
        context.strokeRect(
            canvas.width / 2 + (x + 1) * dominoScale,
            canvas.height / 2 + y * dominoScale,
            dominoScale,
            dominoScale
        );
    }

    erase(x = this.x, y = this.y) {
        // Clear the space and redraw borders
        // Stretch the domino a little to account for precision errors
        context.clearRect(
            canvas.width / 2 + x * dominoScale - 0.5,
            canvas.height / 2 + y * dominoScale - 0.5,
            2 * dominoScale + 1,
            dominoScale + 1
        );
    }
}
