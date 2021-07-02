// Vertical domino whose upper tile is green (odd parity)
class RedDomino extends VerticalDomino {
    static color = "red";

    constructor(x, y) {
        super(x, y);
    }

    get color() {
        return RedDomino.color;
    }

    move() {
        // Moves right
        this.dx = 0.02;
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
            context.strokeStyle = "black";
            context.lineWidth = 1.5;
            context.strokeRect(
                canvas.width / 2 + (this.x - 1) * dominoScale,
                canvas.height / 2 + this.y * dominoScale,
                dominoScale,
                dominoScale
            );
            context.strokeRect(
                canvas.width / 2 + (this.x - 1) * dominoScale,
                canvas.height / 2 + (this.y + 1) * dominoScale,
                dominoScale,
                dominoScale
            );

            // Draw the domino in the ending position
            this.draw();

            // Redraw the borders of the ending squares
            this.drawBorders();
        }
    }

    updateGridPosition(){
        // Moves right
        let a = this.x + gridSide / 2;
        let b = this.y + gridSide / 2;

        // Erase the reference from the grid only if another domino had not already occupied the positions
        if (grid[b][a] === this) grid[b][a] = 0;
        if (grid[b + 1][a] === this) grid[b + 1][a] = 0;

        this.x += 1;
        a += 1;

        grid[b][a] = this;
        grid[b + 1][a] = this;
    }

    moveAnimation(){
        this.erase(this.varX, this.varY); // Erase the current position and redraw the borders of the inital squares

        // Redraw the border of the initial squares
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(
            canvas.width / 2 + (this.x - 1) * dominoScale,
            canvas.height / 2 + this.y * dominoScale,
            dominoScale,
            dominoScale
        );
        context.strokeRect(
            canvas.width / 2 + (this.x - 1) * dominoScale,
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
        context.fillStyle = RedDomino.color;
        this.drawWithoutAnimation(this.varX, this.varY);

        // When the domino has moved 1 position, stop
        // this.x has already been updated in updateGridPosition
        if (Math.abs(this.varX - this.x) <= 0.01){
            cancelAnimationFrame(this.rAF);
            return;
        }

        this.rAF = requestAnimationFrame(this.moveAnimation.bind(this));
    }

    draw(x = this.x, y = this.y) {
        context.fillStyle = RedDomino.color;
        if (showAnimations){
            super.draw(x, y);
            return;
        }

        super.drawWithoutAnimation(x, y);
        this.drawBorders(x, y);
    }
}
