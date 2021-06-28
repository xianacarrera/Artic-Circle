// Abstract class
class Domino {
    constructor(x, y){
        this.x = x;
        this.y = y;/* 
        this.hasMoved = 0;     // 0 if the domino has not moved in this iteration, 1 if it has */
        
        if (this.constructor == Domino){
            throw new Error("The abstract class Domino can't be instantiated");
        }
    }

    getOtherCoordinates(z, w){
        throw new Error("This method is abstract and is yet to be implemented");
    }

    move(){
        throw new Error("This method is abstract and is yet to be implemented");
    }

    draw(){
        context.fillStyle = this.color;
        super.draw();
    }
}