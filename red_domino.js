// Vertical domino whose upper tile is green (odd parity)
class RedDomino extends VerticalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "red";
    }   

    move(){     // Moves right
        grid[this.y + gridSide/2][this.x + gridSide/2] = 0;
        grid[this.y + gridSide/2 + 1][this.x + gridSide/2] = 0;

        this.x += 1;

        grid[this.y + gridSide/2][this.x + gridSide/2] = this;
        grid[this.y + gridSide/2 + 1][this.x + gridSide/2] = this;
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}