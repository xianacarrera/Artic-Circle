// Vertical domino whose upper tile is black (even parity)
class YellowDomino extends VerticalDomino {
    constructor(x, y) {
        super(x, y);

        this.color = "yellow";
    }

    move() {
        // Moves left
        this.dx = -0.02;
        this.varX = this.x;
        this.varY = this.y;
        this.rAF;

        this.updateGridPosition();

        // Animate the movement
        this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
    }

    moveAnimation() {
        this.erase(this.varX, this.varY); // Erase the current position and redraw the borders of the inital squares

        // Redraw the border of the initial squares
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(
            canvas.width / 2 + (this.x + 1) * dominoScale,
            canvas.height / 2 + this.y * dominoScale,
            dominoScale,
            dominoScale
        );
        context.strokeRect(
            canvas.width / 2 + (this.x + 1) * dominoScale,
            canvas.height / 2 + (this.y + 1) * dominoScale,
            dominoScale,
            dominoScale
        );

        // Redraw the borders of the ending squares
        context.strokeRect(
            canvas.width / 2 + this.x * dominoScale,
            canvas.height / 2 + this.y * dominoScale,
            dominoScale,
            dominoScale
        );
        context.strokeRect(
            canvas.width / 2 + this.x * dominoScale,
            canvas.height / 2 + (this.y + 1) * dominoScale,
            dominoScale,
            dominoScale
        );

        this.varX += this.dx;
        context.fillStyle = this.color;
        this.drawWithoutAnimation(this.varX, this.varY);

        // When the domino has moved 1 position, stop
        // this.x has already been updated in updateGridPosition
        if (Math.abs(this.x - this.varX) <= 0.01){
            cancelAnimationFrame(this.rAF);
            return;
        }

        this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
    }

    updateGridPosition() {
        // Moves left
        let a = this.x + gridSide / 2;
        let b = this.y + gridSide / 2;

        // Erase the reference from the grid only if another domino had not already occupied the positions
        if (grid[b][a] === this) grid[b][a] = 0;
        if (grid[b + 1][a] === this) grid[b + 1][a] = 0;

        this.x += -1;
        a += -1;

        grid[b][a] = this;
        grid[b + 1][a] = this;
    }

    draw(x = this.x, y = this.y) {
        context.fillStyle = this.color;
        super.draw(x, y);
    }
}
