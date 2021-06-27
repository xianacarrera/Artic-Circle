// Abstract class
class HorizontalDomino extends Domino {
    orientation = "horizontal";

    constructor(x,y){
        super(x,y);
        if (this.constructor == HorizontalDomino){
            throw new Error("The abstract class HorizontalDomino can't be instantiated");
        }
    }

    // coordinates of the second square of the domino
    get square2(){
        return [this.x + 1, this.y];
    }

    move(){
        super.move();
    }

    draw(){
        // Position relative to the center of the canvas (canvas.width/2, canvas.height/2)
        context.fillRect(canvas.width/2 + this.x * dominoScale, canvas.height/2 + this.y * dominoScale,
             2 * dominoScale, dominoScale);
    }
}