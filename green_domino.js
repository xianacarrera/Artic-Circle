// Horizontal domino whose left tile is green (odd parity)
class GreenDomino extends HorizontalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "green";
    }   

    move(){     // Moves down
        if (this.hasMoved) return;          // The domino has already moved in this iteration

        this.y += 1;
        super.move();   // Register that the domino has moved in this iteration
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}