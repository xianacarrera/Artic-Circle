// Horizontal domino whose left tile is green (odd parity)
class GreenDomino extends HorizontalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "green";
    }   

    move(){     // Moves down
        grid[this.y + gridSide/2][this.x + gridSide/2] = 0;
        grid[this.y + gridSide/2][this.x + gridSide/2 + 1] = 0;

        this.y += 1;

        grid[this.y + gridSide/2][this.x + gridSide/2] = this;
        grid[this.y + gridSide/2][this.x + gridSide/2 + 1] = this;
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}