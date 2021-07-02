// Abstract class
class Domino {
    constructor(x, y){
        this.x = x;
        this.y = y;
        
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
}