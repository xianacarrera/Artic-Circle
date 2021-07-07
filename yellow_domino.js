// Vertical domino whose upper tile is black (even parity)
class YellowDomino extends VerticalDomino {
    static color = "yellow";

    constructor(x, y) {
        super(x, y);
    }

    get color() {
        return YellowDomino.color;
    }

    move() {
        // Moves left
        this.dx = -0.02;
        this.varX = this.x;
        this.varY = this.y;

        this.updateGridPosition();

        if (showAnimations) {
            // Animate the movement
            this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
        } else {
            // Erase the current position
            this.erase(this.varX, this.varY);
            // Redraw the border of the initial squares
            this.drawGrid(this.x + 1, this.y);

            // Draw the domino in the ending position
            this.draw();

            // Redraw the borders of the ending squares
            this.drawBorders();
        }
    }

    moveAnimation() {
        this.erase(this.varX, this.varY); // Erase the current position

        // Redraw the border of the initial squares
        this.drawGrid(this.x + 1, this.y);

        // Redraw the borders of the ending squares
        this.drawGrid(this.x, this.y);

        this.varX += this.dx;
        context.fillStyle = YellowDomino.color;
        this.drawWithoutAnimation(this.varX, this.varY);

        // When the domino has moved 1 position, stop
        // this.x has already been updated in updateGridPosition
        if (Math.abs(this.x - this.varX) <= 0.01) {
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
        context.fillStyle = YellowDomino.color;
        if (showAnimations){
            super.draw(x, y);
            return;
        }

        super.drawWithoutAnimation(x, y);
        this.drawBorders(x, y);
    }
}
