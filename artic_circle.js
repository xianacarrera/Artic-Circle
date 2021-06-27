let canvas;
let context;
let dominoScale = 50;

let grid = {
    side: 2,
    matrix: [[0,0], [0,0]],      // Iniatially there are no dominoes
    /*
     * The matrix will store:
     *    0 -> for empty squares
     *    -1 -> square outside grid limits
     *    reference to domino in squares occupied by that domino
     */


    addDominoes(d1, d2){
        // References to d1 and d2 are stored at the positions that they occupy in the matrix
        // The dominoes' coordinates range from -grid.side/2 to grid.side/2 - 1
        this.matrix[d1.y + grid.side/2][d1.x + grid.side/2] = d1;
        this.matrix[d2.y + grid.side/2][d2.x + grid.side/2] = d2;

        // Store another reference in the other square that they occupy
        [x, y] = d1.square2;            // Coordinates of d1's 2nd square
        this.matrix[y + grid.side/2][x + grid.side/2] = d1;
        [x, y] = d2.square2;            // Coordinates of d2's 2nd square
        this.matrix[y + grid.side/2][x + grid.side/2] = d2;
    },

    moveDominoes(){
        for (let row of this.matrix){
            for (let d of row){
                if (!(typeof d === "number")){      // It's a domino
                    d.move();           // Internally checks that dominoes don't move twice in one iteration
                }
            }
        }
    }
};

let randomGenerator = {
    bias: 0.5,   // No bias initially

    generateBiasedBinary() { 
        // Math.random gives a float in the range [0,1)
        return Math.random() >= this.bias ? 1 : 0;
    },

    // Given the upper-left square of a 2x2 grid, randomly generates two dominoes that fill it
    // Vertical -> yellow and red
    // Horizontal -> blue and green
    generateDominoes(x, y){
        if (this.generateBiasedBinary()){               // Vertical dominoes
            if ((x + y) % 2 === 0){  // The upper-left square is black
                yellowDomino = new YellowDomino(x, y);
                redDomino = new RedDomino(x + 1, y);
                return [yellowDomino, redDomino]; 
            }

            // The upper-left square is green
            redDomino = new RedDomino(x, y);
            yellowDomino = new YellowDomino(x + 1, y);
            return [yellowDomino, redDomino]; 
        }

        // Horizontal dominoes
        if ((x + y) % 2 === 0){   // The upper-left square is black
            blueDomino = new BlueDomino(x, y);
            greenDomino = new GreenDomino(x, y + 1);
            return [blueDomino, greenDomino];
        }

        // The upper-left square is green
        greenDomino = new GreenDomino(x, y);
        blueDomino = new BlueDomino(x, y + 1);
        return [greenDomino, blueDomino];
    }
};

let dominoes = [];


window.addEventListener("load", () => {
    // When the window is created, get the reference to the canvas and its context
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');

    // Resize the canvas
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;


    drawSquareGrid(grid.side);          // Draw 2x2 grid

     [domino1, domino2] = randomGenerator.generateDominoes(-1, -1);
/*    domino1.draw();
    domino2.draw(); */
    grid.addDominoes(domino1, domino2);
    domino1.draw();
    domino2.draw();
    grid.moveDominoes();

    expandGrid();

    // Clear the inner grid
    // Note that this grid has side grid.side - 2, since expandGrid() has increased grid.side by 2
     context.clearRect(canvas.width/2 - (grid.side - 2)/2 * dominoScale, 
                     canvas.height/2 - (grid.side - 2)/2 * dominoScale, 
                     (grid.side - 2) * dominoScale, (grid.side - 2) * dominoScale);
    // Redraw the inner grid without dominoes
    drawSquareGrid(grid.side - 2); 
    domino1.draw();
    domino2.draw();

/*     domino1.move();
    domino1.draw();
    domino2.move();
    domino2.draw(); */
    context.strokeStyle = "red";
    context.lineWidth = 5;
    //// 4 parameters: x, y, width, height
    //context.strokeRect(200, 200, 200, 200);
});

function drawInitialGrid(){
    // Draw a 2x2 grid at the center of the canvas
    context.strokeRect(canvas.width/2 - dominoScale, canvas.height/2 - dominoScale, 
        dominoScale, dominoScale);      // Up-left 
    context.strokeRect(canvas.width/2 - dominoScale, canvas.height/2, dominoScale, dominoScale);           // Down-left 
    context.strokeRect(canvas.width/2, canvas.height/2 - dominoScale, dominoScale, dominoScale);           // Up-right
    context.strokeRect(canvas.width/2, canvas.height/2, dominoScale, dominoScale);                // Down-right
}

// Draws a square grid of side length n
function drawSquareGrid(n){
    context.strokeStyle = "black";

    // For simplicity purposes, the matrix rows and columns range between -n/2 and n/2 -1
    for (let i = -n/2; i < n/2; i++){
        for (let j = -n/2; j < n/2; j++){
            context.strokeRect(canvas.width/2 + j * dominoScale, canvas.height/2 + i * dominoScale,
                dominoScale, dominoScale);
        }
    }
}


function nextIteration(){
    // Increase the size of the grid
    expandGrid();

    // Move all the dominoes
    for (let d of dominoes){
        // The order in which the dominoes of the current iteration move does not matter
        // It is certain that there will be no collisions when all have moved
        d.move();
    }

    // Generate the new dominoes
}

function expandGrid(){
    // The grids must be squared and their sides must have even lenghts
    grid.side += 2;

    // Draw the new grid
    /*
     * Let N = grid.side for this explanation.
     * The matrix rows and columns are numbered from -N/2 to N/2 - 1 to simplify positioning.
     * 
     * 4 new diagonals lines have to be added:
     *  ** Down-left to up-right line above the half point
     *      Draw if -i - j === N/2 + 1 <=> i + j === -N/2 - 1
     *  ** Down-left to up-right line below the half point
     *      Draw if i + j === N/2 - 1
     *  ** Up-left to down-right line below the half point
     *      Draw if i - j === N/2
     *  ** Up-left to down-right line above the half point
     *      Draw if j - i == N/2
     */
    for (let i = -grid.side/2; i < grid.side/2; i++){
        for (let j = -grid.side/2; j < grid.side/2; j++){
            if (Math.abs(i + j + 1) === grid.side/2 || Math.abs(i - j) === grid.side/2){                      
                context.strokeRect(canvas.width/2 + j * dominoScale, 
                                    canvas.height/2 + i * dominoScale,
                                    dominoScale, dominoScale);
            }
        }
    }
}