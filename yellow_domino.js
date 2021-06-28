// Vertical domino whose upper tile is black (even parity)
class YellowDomino extends VerticalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "yellow";
    }   

    move(){     // Moves left
        let a = this.x + gridSide/2;
        let b = this.y + gridSide/2;

        // Erase the reference from the grid only if another domino had not already occupied the positions
        if (grid[b][a] === this) grid[b][a] = 0;
        if (grid[b + 1][a] === this) grid[b + 1][a] = 0;        

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