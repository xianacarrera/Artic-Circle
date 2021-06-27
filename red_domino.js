// Vertical domino whose upper tile is green (odd parity)
class RedDomino extends VerticalDomino {
    constructor(x, y){
        super(x,y);

        this.color = "red";
    }   

    move(){     // Moves right
        if (this.hasMoved) return;          // The domino has already moved in this iteration

        this.x += 1;
        super.move();   // Register that the domino has moved in this iteration
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}