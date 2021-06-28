// Horizontal domino whose left tile is green (odd parity)
class GreenDomino extends HorizontalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "green";
    }   

    move(){     // Moves down
        a = this.x + gridSide/2;
        b = this.y + gridSide/2;

        grid[b][a] = 0;
        grid[b][a + 1] = 0;

        this.y += 1;
        b += 1;

        grid[b][a] = this;
        grid[b][a + 1] = this;
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}