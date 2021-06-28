// Horizontal domino whose left tile is green (odd parity)
class GreenDomino extends HorizontalDomino {
    constructor(x, y) {
        super(x, y);

        this.color = "green";
    }

    move() {     // Moves down
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

    draw() {
        context.fillStyle = this.color;
        super.draw();
    }
}