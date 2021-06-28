// Vertical domino whose upper tile is black (even parity)
class YellowDomino extends VerticalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "yellow";
    }   

    move(){     // Moves left
        a = this.x + gridSide/2;
        b = this.y + gridSide/2;

        grid[b][a] = 0;
        grid[b + 1][a] = 0;

        this.x += -1;
        a += -1;
        
        grid[b][a] = this;
        grid[b + 1][a] = this;
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}