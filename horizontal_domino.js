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

    // Returns the coordinates of the domino that are not [z, w]
    getOtherCoordinates(z, w){
        let [x2, y2] = this.square2;
        if (this.x === z && this.y === w){
            return this.square2;
        } else if (x2 === z && y2 === w){
            return [this.x, this.y];
        }
    }

    async draw(){
        // Position relative to the center of the canvas (canvas.width/2, canvas.height/2)
        await animateRect(canvas.width/2 + this.x * dominoScale, canvas.height/2 + this.y * dominoScale,
            2 * dominoScale, dominoScale, 0, context.fillStyle);
/*         context.fillRect(canvas.width/2 + this.x * dominoScale, canvas.height/2 + this.y * dominoScale,
             2 * dominoScale, dominoScale);

        // Draw the border of the rectangle
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(canvas.width/2 + this.x * dominoScale, canvas.height/2 + this.y * dominoScale,
            2 * dominoScale, dominoScale); */
    }

    async erase(){
        // Clear the space and redraw borders
        await animateRect(canvas.width/2 + this.x * dominoScale, canvas.height/2 + this.y * dominoScale,
            2 * dominoScale, dominoScale, 0, "white");

/*         context.clearRect(canvas.width/2 + this.x * dominoScale, 
            canvas.height/2 + this.y * dominoScale,
            2 * dominoScale, dominoScale);*/

        // Draw the border of the squares
        context.strokeStyle = "black";
        context.lineWidth = 1.5;
        context.strokeRect(canvas.width/2 + this.x * dominoScale, 
            canvas.height/2 + this.y * dominoScale,
            dominoScale, dominoScale);
        context.strokeRect(canvas.width/2 + (this.x + 1) * dominoScale, canvas.height/2 + this.y * dominoScale,
            dominoScale, dominoScale);        
    }
}