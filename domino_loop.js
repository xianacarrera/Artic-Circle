let gridSide = 2;
let grid = [
    [0, 0],
    [0, 0],
]; // Iniatially there are no dominoes

/*
 * The matrix will store:
 *    0 -> for empty squares
 *    -1 -> square outside grid limits
 *    reference to domino in squares occupied by that domino
 */

// Dominoes that are present in the grid
let dominoes = [];

// Upper-left tiles of the orange 2x2 blocks to be filled
let tilesToFill = [];

let randomGenerator = {
    bias: 0.5, // No bias initially

    generateBiasedBinary() {
        // Math.random gives a float in the range [0,1)
        return Math.random() >= this.bias ? 1 : 0;
    },

    // Given the upper-left square of a 2x2 grid, randomly generates two dominoes that fill it
    // Vertical -> yellow and red
    // Horizontal -> blue and green
    generateDominoes(x, y) {
        if (this.generateBiasedBinary()) {
            // Vertical dominoes
            const yellowDomino = new YellowDomino(y, x);
            const redDomino = new RedDomino(y + 1, x);
            return [yellowDomino, redDomino];
        }

        // Horizontal dominoes
        const blueDomino = new BlueDomino(y, x);
        const greenDomino = new GreenDomino(y, x + 1);
        return [blueDomino, greenDomino];
    },
};




// Iterates through the grid filling 2x2 gaps with new, random dominoes
function fillGapsRandomly() {
    let checked = []; // Tiles already checked
    for (let i = 0; i < gridSide; i++) {
        checked.push(new Array(gridSide).fill(0));
    }

    // The last row and column do not have to be analyzed
    for (let i = -gridSide / 2; i < gridSide / 2 - 1; i++) {
        for (let j = -gridSide / 2; j < gridSide / 2 - 1; j++) {
            let a = i + gridSide / 2;
            let b = j + gridSide / 2;

            if (grid[a][b] === 0 && checked[a][b] === 0) {
                // Empty and not checked
                /*
                 * To generate new dominoes we will need the coordinates (in  *the system that ranges from -gridSide/2 to gridSide/2 - 1, so
                 * we save i and j.
                 */
                tilesToFill.push([i, j]);

                // Mark the rest of the tiles of the 2x2 square as checked
                checked[a][b + 1] =
                    checked[a + 1][b + 1] =
                    checked[a + 1][b] =
                    1;

                // Create an orange square of size 2x2
                if (showAnimations) {
                    animateAppearingRect(
                        canvas.width / 2 + j * dominoScale,
                        canvas.height / 2 + i * dominoScale,
                        2 * dominoScale,
                        2 * dominoScale,
                        0,
                        "orange"
                    );
                } else {
                    drawSquareNoAnimation(canvas.width / 2 + j * dominoScale,
                        canvas.height / 2 + i * dominoScale, "orange");
                }
            }
        }
    }
}


// Generate random dominoes for the current iteration and put them in the grid
function generateNewDominoes() {
    for (let [x, y] of tilesToFill) {
        let [d1, d2] = randomGenerator.generateDominoes(x, y);
        addDominoes(d1, d2);

        d1.draw();
        d2.draw();
    }

    // All tiles have been processed
    tilesToFill = [];
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
            let a = i + gridSide / 2;
            let b = j + gridSide / 2;

            grid[a][b] = 0;

            if (
                Math.abs(i + j + 1) === gridSide / 2 ||
                Math.abs(i - j) === gridSide / 2
            ) {
                if (showAnimations) {
                    animateAppearingRect(
                        canvas.width / 2 + j * dominoScale,
                        canvas.height / 2 + i * dominoScale,
                        dominoScale,
                        dominoScale,
                        0,
                        "white"
                    );
                } else {
                    context.lineWidth = 1.5;
                    context.strokeRect(
                        canvas.width / 2 + j * dominoScale,
                        canvas.height / 2 + i * dominoScale,
                        dominoScale,
                        dominoScale
                    );
                }
            } else if (
                Math.abs(i + j + 1) > gridSide / 2 ||
                Math.abs(i - j) > gridSide / 2
            ) {
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
}

function addDominoes(d1, d2) {
    // Calculate the right positions in the grid and save references to the dominoes there
    allocateDomino(d1);
    allocateDomino(d2);

    // Store the dominoes
    dominoes.push(d1);
    dominoes.push(d2);
}

function allocateDomino(d) {
    // A reference to d is stored at the position that it occupies in the grid matrix.
    // The dominoes' coordinates range from -gridSide/2 to gridSide/2 - 1
    grid[d.y + gridSide / 2][d.x + gridSide / 2] = d;

    // Store another reference in the other square that it occupies
    const [x, y] = d.square2;
    grid[y + gridSide / 2][x + gridSide / 2] = d;
}


function fitToCanvas() {
    // Resize the picture if necessary
    if (
        (gridSide + 2) * dominoScale >=
        (4 / 5) * Math.min(canvas.width, canvas.height)
    ) {
        // The new length will be (4/7) * the smallest side
        const l = (4 / 7) * Math.min(canvas.width, canvas.height);

        // Calculate the new size for the squares given length l
        // Create space for 10 iterations
        dominoScale = l / (gridSide + 12);

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Recreate the inner grid
        if (showAnimations)
            animateAppearingGrid(Math.floor((gridSide + 2) / 4) * 2, 0);
        else drawSquareGrid(Math.floor((gridSide + 2) / 4) * 2);

        // Draw all the dominoes
        for (let d of dominoes) {
            d.draw();
        }
        // The rest of the grid will appear when the function expandGrid() executes

        // Wait for 1 s to return while the dominoes are being drawn
        return new Promise(
            (resolve, reject) => setTimeout(() => resolve("Resize")),
            1000
        );
    }
    // Return without waiting
    return new Promise((resolve, reject) => resolve("Valid size"));
}

// Before making moves, check for dominoes that collide and get rid of them
function checkCollisions() {
    function getSecondCoordinatesAsIndexes(i, j) {
        // Calculate the second coordinates of the domino
        // Revert the order to change coordinates into indexes
        let [y, x] = grid[i][j].getOtherCoordinates(
            j - gridSide / 2,
            i - gridSide / 2
        );

        // Convert x and y into positive indexes
        x += gridSide / 2;
        y += gridSide / 2;

        return [x, y];
    }

    /*
     * Collisions take place in two situations:
     *   a) There's a red domino to the left of a yellow domino
     *   b) There's a green domino on top of a blue domino
     * In those cases, the dominoes' arrows would clash.
     *
     * Since this function is executed after expandGrid(), but before moveDominoes(), the first and last rows and columns do not have to be studied.
     */

    let collisionsTookPlace = false;

    for (let i = 1; i < gridSide - 1; i++) {
        for (let j = 1; j < gridSide - 1; j++) {
            // Check the domino which the arrow is pointing to
            // If there's a collision, delete both dominoes from the grid
            if (grid[i][j] instanceof YellowDomino) {
                if (grid[i][j - 1] instanceof RedDomino) {
                    collisionsTookPlace = true;

                    // Get the second indexes of the first domino
                    let [x, y] = getSecondCoordinatesAsIndexes(i, j);

                    // Eliminate the dominoes from the grid
                    dominoes.splice(dominoes.indexOf(grid[i][j]), 1);
                    dominoes.splice(dominoes.indexOf(grid[i][j - 1]), 1);
                    grid[i][j] =
                        grid[x][y] =
                        grid[i][j - 1] =
                        grid[x][y - 1] =
                        0;

                    // Redraw without the deleted dominoes
                    // We pass the coordinates of the up-left tile of the square to be erased
                    if (showAnimations) {
                        animateDisappearingSquare(
                            j - 1 - gridSide / 2,
                            Math.min(i, x) - gridSide / 2,
                            0
                        );
                    } else {
                        clearSquareNoAnimation(
                            j - 1 - gridSide / 2,
                            Math.min(i, x) - gridSide / 2,
                        );
                    }
                }
            } else if (grid[i][j] instanceof RedDomino) {
                if (grid[i][j + 1] instanceof YellowDomino) {
                    collisionsTookPlace = true;

                    // Get the second indexes of the first domino
                    let [x, y] = getSecondCoordinatesAsIndexes(i, j);

                    // Eliminate the dominoes from the grid
                    dominoes.splice(dominoes.indexOf(grid[i][j]), 1);
                    dominoes.splice(dominoes.indexOf(grid[i][j + 1]), 1);
                    grid[i][j] =
                        grid[x][y] =
                        grid[i][j + 1] =
                        grid[x][y + 1] =
                        0;

                    // Redraw without the deleted dominoes
                    // We pass the coordinates of the up-left tile of the square to be erased
                    if (showAnimations) {
                        animateDisappearingSquare(
                            j - gridSide / 2,
                            Math.min(i, x) - gridSide / 2,
                            0
                        );
                    } else {
                        clearSquareNoAnimation(
                            j - gridSide / 2,
                            Math.min(i, x) - gridSide / 2,
                        );
                    }
                }
            } else if (grid[i][j] instanceof BlueDomino) {
                if (grid[i - 1][j] instanceof GreenDomino) {
                    collisionsTookPlace = true;

                    // Get the second indexes of the first domino
                    let [x, y] = getSecondCoordinatesAsIndexes(i, j);

                    // Eliminate the dominoes from the grid
                    dominoes.splice(dominoes.indexOf(grid[i][j]), 1);
                    dominoes.splice(dominoes.indexOf(grid[i - 1][j]), 1);
                    grid[i][j] =
                        grid[x][y] =
                        grid[i - 1][j] =
                        grid[x - 1][y] =
                        0;

                    // Redraw without the deleted dominoes
                    // We pass the coordinates of the up-left tile of the square to be erased
                    if (showAnimations) {
                        animateDisappearingSquare(
                            Math.min(j, y) - gridSide / 2,
                            i - 1 - gridSide / 2,
                            0
                        );
                    } else {
                        clearSquareNoAnimation(
                            Math.min(j, y) - gridSide / 2,
                            i - 1 - gridSide / 2,
                        );
                    }
                }
            } else if (grid[i][j] instanceof GreenDomino) {
                if (grid[i + 1][j] instanceof BlueDomino) {
                    collisionsTookPlace = true;

                    // Get the second indexes of the first domino
                    let [x, y] = getSecondCoordinatesAsIndexes(i, j);

                    // Eliminate the dominoes from the grid
                    dominoes.splice(dominoes.indexOf(grid[i][j]), 1);
                    dominoes.splice(dominoes.indexOf(grid[i + 1][j]), 1);
                    grid[i][j] =
                        grid[x][y] =
                        grid[i + 1][j] =
                        grid[x + 1][y] =
                        0;

                    // Redraw without the deleted dominoes
                    // We pass the coordinates of the up-left tile of the square to be erased
                    if (showAnimations) {
                        animateDisappearingSquare(
                            Math.min(j, y) - gridSide / 2,
                            i - gridSide / 2,
                            0
                        );
                    } else {
                        clearSquareNoAnimation(
                            Math.min(j, y) - gridSide / 2,
                            i - gridSide / 2,
                        );
                    }
                }
            }
        }
    }

    return collisionsTookPlace;
}

async function dance() {
    if (!showAnimations) {
        for (let d of dominoes){
            // Erase all the dominoes first so that no overlapping occurs
            d.erase();
            d.drawGrid();
            d.updateGridPosition();
        }
        setTimeout(() => {
            for (let d of dominoes) {
                context.fillStyle = d.color;
                d.drawWithoutAnimation();
                d.drawBorders();
            }}, 40);
        return;
    }

    await new Promise((resolve, reject) => {
        for (let d of dominoes) {
            d.move();
        }
        setTimeout(resolve, 1000);
    });
    for (let d of dominoes) {
        context.fillStyle = d.color;
        d.drawWithoutAnimation();
        d.drawBorders();
    }
}
