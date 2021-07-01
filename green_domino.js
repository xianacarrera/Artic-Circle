// Horizontal domino whose left tile is green (odd parity)
class GreenDomino extends HorizontalDomino {
    constructor(x, y) {
        super(x, y);

        this.color = "green";
    }

    move() {
        // Moves down
        this.dy = 0.02;
        this.varX = this.x;
        this.varY = this.y;

        this.updateGridPosition();

        // Animate the movement
        this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
    }

    moveAnimation(){
        this.erase(this.varX, this.varY); // Erase the current position and redraw the borders of the inital squares

        // Redraw the borders
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(
            canvas.width / 2 + this.x * dominoScale,
            canvas.height / 2 + (this.y - 1) * dominoScale,
            dominoScale,
            dominoScale
        );
        context.strokeRect(
            canvas.width / 2 + (this.x + 1) * dominoScale,
            canvas.height / 2 + (this.y - 1) * dominoScale,
            dominoScale,
            dominoScale
        );

        // Redraw the borders of the two squares of the ending position, too, in case the domino was in the middle of both
        context.strokeRect(
            canvas.width / 2 + this.x * dominoScale,
            canvas.height / 2 + this.y * dominoScale,
            dominoScale,
            dominoScale
        );
        context.strokeRect(
            canvas.width / 2 + (this.x + 1) * dominoScale,
            canvas.height / 2 + this.y * dominoScale,
            dominoScale,
            dominoScale
        );

        this.varY += this.dy;
        context.fillStyle = this.color;
        this.drawWithoutAnimation(this.varX, this.varY);

        // When the domino has moved 1 position, stop
        // this.y has already been updated in updateGridPosition()
        if (Math.abs(this.varY - this.y) <= 0.01){
            cancelAnimationFrame(this.rAF);
            return;
        }

        this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
    }

    updateGridPosition() {
        // Moves down
        let a = this.x + gridSide / 2;
        let b = this.y + gridSide / 2;

        // Erase the reference from the grid only if another domino had not already occupied the positions
        if (grid[b][a] === this) grid[b][a] = 0;
        if (grid[b][a + 1] === this) grid[b][a + 1] = 0;

        this.y += 1;
        b += 1;

        grid[b][a] = this;
        grid[b][a + 1] = this;
    }

    draw(x = this.x, y = this.y) {
        context.fillStyle = this.color;
        super.draw(x, y);
    }
}
