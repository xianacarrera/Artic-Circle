// Horizontal domino whose left tile is black (even parity)
class BlueDomino extends HorizontalDomino {
    static color = "blue";

    constructor(x, y) {
        super(x, y);
    }

    get color() {
        return BlueDomino.color;
    }

    move() {
        // Moves up
        this.dy = -0.02;
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
            this.drawGrid(this.x, this.y + 1);

            // Draw the domino in the ending position
            this.draw();

            // Redraw the borders of the ending squares
            this.drawBorders();
        }
    }

    moveAnimation(){
        this.erase(this.varX, this.varY); // Erase the current position and redraw the borders of the inital squares

        // Redraw the borders
        this.drawGrid(this.x, this.y + 1);

        // Redraw the borders of the two squares of the ending position, too, in case the domino was in the middle of both
        this.drawGrid(this.x, this.y);

        this.varY += this.dy;
        context.fillStyle = BlueDomino.color;
        this.drawWithoutAnimation(this.varX, this.varY);

        // When the domino has moved 1 position, stop
        // this.y has already been updated in updateGridPosition()
        if (Math.abs(this.y - this.varY) <= 0.01){
            cancelAnimationFrame(this.rAF);
            return;
        }

        this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
    }

    updateGridPosition() {
        // Moves up
        let a = this.x + gridSide / 2;
        let b = this.y + gridSide / 2;

        // Erase the reference from the grid only if another domino had not already occupied the positions
        if (grid[b][a] === this) grid[b][a] = 0;
        if (grid[b][a + 1] === this) grid[b][a + 1] = 0;

        this.y += -1;
        b += -1;

        grid[b][a] = this;
        grid[b][a + 1] = this;
    }

    draw(x = this.x, y = this.y) {
        context.fillStyle = BlueDomino.color;
        if (showAnimations){
            super.draw(x, y);
            return;
        }

        super.drawWithoutAnimation(x, y);
        this.drawBorders(x, y);
    }
}
