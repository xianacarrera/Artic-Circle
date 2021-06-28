// Vertical domino whose upper tile is black (even parity)
class YellowDomino extends VerticalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "yellow";
    }   

    move(){     // Moves left
        grid[this.y + gridSide/2][this.x + gridSide/2] = 0;
        grid[this.y + gridSide/2 + 1][this.x + gridSide/2] = 0;

        this.x += -1;
        
        grid[this.y + gridSide/2][this.x + gridSide/2] = this;
        grid[this.y + gridSide/2 + 1][this.x + gridSide/2] = this;
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}