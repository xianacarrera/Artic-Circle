// Horizontal domino whose left tile is black (even parity)
class BlueDomino extends HorizontalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "blue";
    }   

    move(){     // Moves up
        if (this.hasMoved) return;          // The domino has already moved in this iteration
        
        this.y += -1;
        super.move();   // Register that the domino has moved in this iteration
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}