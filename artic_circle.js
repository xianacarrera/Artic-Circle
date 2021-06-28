let canvas;
let context;
let dominoScale = 50;

let gridSide = 2;
let grid = [[0, 0], [0, 0]];   // Iniatially there are no dominoes    
/*
 * The matrix will store:
 *    0 -> for empty squares
 *    -1 -> square outside grid limits
 *    reference to domino in squares occupied by that domino
 */


let dominoes = [];


function addDominoes(d1, d2) {
    // Calculate the right positions in the grid and save references to the dominoes there
    allocateDomino(d1);
    allocateDomino(d2);

    // Store the dominoes
    dominoes.push(d1);
    dominoes.push(d2);
};

function allocateDomino(d) {
    // A reference to d is stored at the position that it occupies in the grid matrix.
    // The dominoes' coordinates range from -gridSide/2 to gridSide/2 - 1
    grid[d.y + gridSide / 2][d.x + gridSide / 2] = d;

    // Store another reference in the other square that it occupies
    [x, y] = d.square2;
    grid[y + gridSide / 2][x + gridSide / 2] = d;
}

function moveDominoes() {
    for (let d of dominoes) {
        d.move();
    }
};

// Before making moves, check for dominoes that collide and get rid of them
function checkCollisions() {
    /*
     * Collisions take place in two situations:
     *   a) There's a red domino to the left of a yellow domino
     *   b) There's a green domino on top of a blue domino
     * In those cases, the dominoes' arrows would clash.
     * 
     * First of all, we can limit the search to the inner square grid 
     * (discarding all borders), since it's the only place where
     * collisions can take place. The side of that grid follows the sequence
     * 2, 2, 4, 4, 6...
     * 
     * Secondly, we do not have to check all squares. If the divide the square
     * grid into 2x2 blocks, it's sufficient to check the upper-left square of 
     * each block with the implementation that follows.
     */

    n = Math.floor((gridSide + 2) / 4) * 2;
    for (i = (gridSide - n) / 2; i < (gridSide + n) / 2; i += 2) {
        for (j = (gridSide - n) / 2; j < (gridSide + n) / 2; j += 2) {
            // Check the domino which the arrow is pointing to
            // If there's a collision, delete both dominoes from the grid
            if (grid[i][j] instanceof YellowDomino) {
                if (grid[i][j - 1] instanceof RedDomino) {
                    [y, x] = grid[i][j]
                        .getOtherCoordinates(j - gridSide / 2, i - gridSide / 2);
                    grid[i][j] = grid[y][x] = grid[i][j - 1] = grid[y][x - 1] = 0;
                }
            } else if (grid[i][j] instanceof RedDomino) {
                if (grid[i][j + 1] instanceof YellowDomino) {
                    [y, x] = grid[i][j]
                        .getOtherCoordinates(j - gridSide / 2, i - gridSide / 2);
                    grid[i][j] = grid[y][x] = grid[i][j + 1] = grid[y][x + 1] = 0;
                }
            } else if (grid[i][j] instanceof BlueDomino) {
                if (grid[i + 1][j] instanceof GreenDomino) {
                    [y, x] = grid[i][j]
                        .getOtherCoordinates(j - gridSide / 2, i - gridSide / 2);
                    grid[i][j] = grid[y][x] = grid[i + 1][j] = grid[y + 1][x] = 0;
                }
            } else if (grid[i][j] instanceof GreenDomino) {
                if (grid[i - 1][j] instanceof BlueDomino) {
                    [y, x] = grid[i][j]
                        .getOtherCoordinates(j - gridSide / 2, i - gridSide / 2);
                    grid[i][j] = grid[y][x] = grid[i - 1][j] = grid[y - 1][x] = 0;
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
    // Note that this method works with coordinates in the matrix (ranging from 0 to gridSide - 1) and those relative to the canvas (-gridSide/2 to gridSide/2 - 1)
    generateDominoes(x, y) {
        if (this.generateBiasedBinary()) {               // Vertical dominoes
            if ((x + y) % 2 === 0) {  // The upper-left square is black
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
        if ((x + y) % 2 === 0) {   // The upper-left square is black
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


window.addEventListener("load", () => {
    // When the window is created, get the reference to the canvas and its context
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');

    // Resize the canvas
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;


    drawSquareGrid(gridSide);          // Draw 2x2 grid

    [domino1, domino2] = randomGenerator.generateDominoes(-1, -1);
    /*    domino1.draw();
        domino2.draw(); */
    addDominoes(domino1, domino2);
    domino1.draw();
    domino2.draw();

    expandGrid();

    moveDominoes();


    // Clear the inner grid
    // Note that this grid has side grid.side - 2, since expandGrid() has increased grid.side by 2
    context.clearRect(canvas.width / 2 - (gridSide - 2) / 2 * dominoScale,
        canvas.height / 2 - (gridSide - 2) / 2 * dominoScale,
        (gridSide - 2) * dominoScale, (gridSide - 2) * dominoScale);
    // Redraw the inner grid without dominoes
    drawSquareGrid(gridSide - 2);
    domino1.draw();
    domino2.draw();

    fillGapsRandomly();

    /*     domino1.move();
    domino1.draw();
    domino2.move();
    domino2.draw(); */
    //context.strokeRect(200, 200, 200, 200);
    context.strokeStyle = "red";
    context.lineWidth = 5;
    //// 4 parameters: x, y, width, height
});

function drawInitialGrid() {
    // Draw a 2x2 grid at the center of the canvas
    context.strokeRect(canvas.width / 2 - dominoScale, canvas.height / 2 - dominoScale,
        dominoScale, dominoScale);      // Up-left 
    context.strokeRect(canvas.width / 2 - dominoScale, canvas.height / 2, dominoScale, dominoScale);           // Down-left 
    context.strokeRect(canvas.width / 2, canvas.height / 2 - dominoScale, dominoScale, dominoScale);           // Up-right
    context.strokeRect(canvas.width / 2, canvas.height / 2, dominoScale, dominoScale);                // Down-right
}

// Draws a square grid of side length n
function drawSquareGrid(n) {
    context.strokeStyle = "black";

    // For simplicity purposes, the matrix rows and columns range between -n/2 and n/2 -1
    for (let i = -n / 2; i < n / 2; i++) {
        for (let j = -n / 2; j < n / 2; j++) {
            context.strokeRect(canvas.width / 2 + j * dominoScale, canvas.height / 2 + i * dominoScale,
                dominoScale, dominoScale);
        }
    }
}


function nextIteration() {
    // Increase the size of the grid
    expandGrid();

    // Move all the dominoes
    for (let d of dominoes) {
        // The order in which the dominoes of the current iteration move does not matter
        // It is certain that there will be no collisions when all have moved
        d.move();
    }

    // Generate the new dominoes
}

function expandGrid() {
    // The grids must be squared and their sides must have even lenghts
    gridSide += 2;
    // Two new rows of length gridSide will be needed
    grid.push(new Array(gridSide).fill(0));
    grid.push(new Array(gridSide).fill(0));

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
    for (let i = -gridSide / 2; i < gridSide / 2; i++) {
        for (let j = -gridSide / 2; j < gridSide / 2; j++) {

            a = i + gridSide / 2;
            b = j + gridSide / 2;

            grid[a][b] = 0;

            /*             // Delete previous border marks (-1)
                        // Fill the previous rows in the new columns with 0s
                        if (grid[a][b] === -1 || grid[a][b] === undefined)
                            grid[a][b] = 0;*/

            // TODO: THIS FDKSJFLKDSJFSKLJFSKLJFSLKJFSLKFJSL
            if (Math.abs(i + j + 1) === gridSide / 2 || Math.abs(i - j) === gridSide / 2) {
                context.strokeRect(canvas.width / 2 + j * dominoScale,
                    canvas.height / 2 + i * dominoScale,
                    dominoScale, dominoScale);

                // Mark the grid as empty in these squares
                grid[a][b] = 0;

            } else if (Math.abs(i + j + 1) > gridSide / 2 || Math.abs(i - j) > gridSide / 2) {
                // Mark the grid as non-existant in these squares
                grid[a][b] = -1;
            }

            if (Math.abs(i + j + 1) > gridSide / 2 || Math.abs(i - j) > gridSide / 2) {
                // Mark the grid as non-existant in these squares
                grid[a][b] = -1;
            }
        }
    }


    // The dominoes have to be reallocated
    // Each one has to move 1 row down and 1 column right
    for (let d of dominoes) {
        allocateDomino(d);
    }

};

// Iterates through the grid filling 2x2 gaps with new, random dominoes
function fillGapsRandomly() {
    // It's sufficient to check the upper-left tiles of the 2x2 blocks
    // that compose the inner grid
    n = Math.floor((gridSide + 2) / 4) * 2;
    for (i = (gridSide - n) / 2; i < (gridSide + n) / 2; i += 2) {
        for (j = (gridSide - n) / 2; j < (gridSide + n) / 2; j += 2) {
            if (grid[i][j] === 0){   // Empty
                // Create an orange square of size 2x2
                context.fillStyle = "orange";
                context.fillRect(canvas.width / 2 + (j + gridSide/2) * dominoScale, canvas.height / 2 + (i + gridSide/2) * dominoScale,
                    2 * dominoScale, 2 * dominoScale);

                //[d1, d2] = randomGenerator.generateDominoes(i, j);
            }
        }
    }
}