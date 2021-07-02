let canvas;
let context;
let dominoScale = 50;

let biasSlider;
let biasText;

let delaySlider;
let delayText;
let stepDelay = 0;

let colorToggle;

let stop = false;
let isWorking = false;
let showAnimations = false;

// Sequence of functions that are executed in an iteration, along with the
// time each one takes
let sequence = [
    [fillGapsRandomly, 1000],
    [generateNewDominoes, 1000],
    [fitToCanvas, 0],
    [expandGrid, 1000],
    [checkCollisions, 1000],
    // If there are none collisions, checkCollisions takes 0 s
    [dance, 1300]
];

let step = 0;

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

// Takes 1 s in total
function animateAppearingRect(x, y, width, height, alpha, color) {
    // To assure that exactly 10 iterations are performed, check precision
    if (Math.abs(1 - alpha) <= 0.01) {
        context.globalAlpha = 1;
        return;
    }

    context.globalAlpha = alpha;

    context.fillStyle = color;
    context.fillRect(x, y, width, height);

    // Draw border
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    context.strokeRect(x, y, width, height);

    // Increase opacity
    alpha += 0.1;

    // Recursive calls
    setTimeout(
        animateAppearingRect.bind(null, x, y, width, height, alpha, color),
        100
    );
}

// Animates a 2x2 squared region disappearing
function animateDisappearingSquare(x, y, alpha) {
    // To assure that exactly 10 iterations are performed, check precision
    if (Math.abs(1 - alpha) <= 0.01) {
        context.globalAlpha = 1;
        return;
    }

    context.globalAlpha = alpha;

    context.fillStyle = "white";
    context.fillRect(
        canvas.width / 2 + x * dominoScale,
        canvas.height / 2 + y * dominoScale,
        2 * dominoScale,
        2 * dominoScale
    );

    // Draw the borders of the 4 tiles
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            context.strokeRect(
                canvas.width / 2 + (x + i) * dominoScale,
                canvas.height / 2 + (y + j) * dominoScale,
                dominoScale,
                dominoScale
            );
        }
    }

    // Increase opacity
    alpha += 0.1;

    // Recursive calls
    setTimeout(animateDisappearingSquare.bind(null, x, y, alpha), 100);
}

function drawSquareNoAnimation(x, y, color) {
    context.fillStyle = color;
    context.fillRect(
        x, y,
        2 * dominoScale,
        2 * dominoScale
    );

    // Draw the border
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    context.strokeRect(x, y,
        2 * dominoScale, 2 * dominoScale);
}

function clearSquareNoAnimation(x, y) {
    context.clearRect(
        canvas.width / 2 + x * dominoScale,
        canvas.height / 2 + y * dominoScale,
        2 * dominoScale,
        2 * dominoScale
    );

    // Draw the borders of the 4 tiles
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            context.strokeRect(
                canvas.width / 2 + (x + i) * dominoScale,
                canvas.height / 2 + (y + j) * dominoScale,
                dominoScale,
                dominoScale
            );
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

// Draws a square grid of side length n
function drawSquareGrid(n) {
    context.strokeStyle = "black";
    context.lineWidth = 1.5;

    // For simplicity purposes, the matrix rows and columns range between -n/2 and n/2 -1
    for (let i = -n / 2; i < n / 2; i++) {
        for (let j = -n / 2; j < n / 2; j++) {
            context.strokeRect(
                canvas.width / 2 + j * dominoScale,
                canvas.height / 2 + i * dominoScale,
                dominoScale,
                dominoScale
            );
        }
    }
}

// Takes 1 s in total
function animateAppearingGrid(n, alpha) {
    // To assure that exactly 10 iterations are performed, check precision
    if (Math.abs(1 - alpha) <= 0.01) {
        context.globalAlpha = 1;
        return;
    }

    context.globalAlpha = alpha;

    // Draw border
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    // For simplicity purposes, the matrix rows and columns range between -n/2 and n/2 -1
    for (let i = -n / 2; i < n / 2; i++) {
        for (let j = -n / 2; j < n / 2; j++) {
            context.strokeRect(
                canvas.width / 2 + j * dominoScale,
                canvas.height / 2 + i * dominoScale,
                dominoScale,
                dominoScale
            );
        }
    }

    // Increase opacity
    alpha += 0.1;

    // Recursive calls
    setTimeout(animateAppearingGrid.bind(null, n, alpha), 100);
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

async function play() {
    if (isWorking) return;
    stop = false;
    isWorking = true;

    while (!stop) {         // The user has chosen to stop
        await doIteration(false);
    }
}

async function doIteration(user = true) {
    if (user && isWorking) {
        pause();      // Stop concurrent animations
        // Wait for everything to stop
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
    isWorking = true;
    stop = false;

    for (i = 0; i < sequence.length; i++) {
        await doStep(false);

        // Iterations can be stopped even if they have not finished
        if (stop) break;
    }

    if (user) isWorking = false;

    return new Promise((resolve, reject) => resolve("Step completed"));
}

// A step is an atomic movement and cannot be interrupted.
async function doStep(user = true) {
    if (user && isWorking) {
        pause();      // Stop concurrent animations
        // Wait for everything to stop
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        pause();      // In case the user has called again
    }
    isWorking = true;

    let areCollisions = false;

    await new Promise((resolve, reject) => {
        if (sequence[step][0] === checkCollisions) {
            areCollisions = checkCollisions();
            areCollisions ? setTimeout(resolve,
                (showAnimations ? sequence[step][1] : sequence[step][1] / 2) + stepDelay) : resolve("No collisions");
        } else {
            sequence[step][0]();
            // The standard delay can be altered by the user using the delaySlider
            setTimeout(resolve,
                (showAnimations ? sequence[step][1] : (sequence[step][1] / 2)) + stepDelay);
        }
    });

    // step + 1 (mod sequence.length)
    step = (step + 1) % sequence.length;

    if (user) {
        isWorking = false;
        // If the user called, perform automatically expandGrid after fitToCanvas
        if (sequence[step][0] === expandGrid) doStep();
        // If checkCollisions() was executed and there were none, do another step 
        if (sequence[step][0] === dance && !areCollisions) doStep();
    }

    return new Promise((resolve, reject) => resolve("Step completed"));
}

function pause() {
    stop = true;
    isWorking = false;
}

async function reset() {
    pause();
    // Wait for any animation to end completely
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    gridSide = 2;
    grid = [
        [0, 0],
        [0, 0],
    ];
    dominoScale = 50;
    step = 0;
    dominoes = [];
    tilesToFill = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSquareGrid(gridSide);
}

function changeBias() {
    randomGenerator.bias = parseInt(biasSlider.value) / 100;
    biasText.innerHTML = biasSlider.value;
}

function changeSpeed() {
    stepDelay = delaySlider.value * 1000;   // Save as milliseconds
    delayText.innerHTML = `${delaySlider.value} s`;
}

function changePalette() {
    reset();
    if (colorToggle.checked) {
        BlueDomino.color = "#0F2080";
        GreenDomino.color = "#85C0F9";
        YellowDomino.color = "#A95AA1";
        RedDomino.color = "#F5793A";

        return;
    }

    BlueDomino.color = "blue";
    GreenDomino.color = "green";
    YellowDomino.color = "yellow";
    RedDomino.color = "red";
}

function switchAnimations() {
    reset();
    showAnimations = !showAnimations;
}

window.addEventListener("load", () => {
    // When the window is created, get the reference to the canvas and its context
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    // Slider that controls horizontal/vertical bias in the domino generation
    biasSlider = document.getElementById("biasSlider");
    // Text showing the value of the bias
    biasText = document.getElementById("biasText");

    // Add listener
    biasSlider.oninput = changeBias;
    // Show 50% by default
    biasText.innerHTML = "50";

    // Slider that controls animation speed
    delaySlider = document.getElementById("delaySlider");
    // Text showing the value of the slider
    delayText = document.getElementById("delayText");

    // Add listener
    delaySlider.oninput = changeSpeed;
    // Show 100 by default
    delayText.innerHTML = "0 s";

    // Toggle switch for the color palette
    colorToggle = document.getElementById("toggleColor");
    // Add listener
    colorToggle.addEventListener("click", changePalette);

    // Toggle switch to turn on and off animations
    animationToggle = document.getElementById("toggleAnimations");
    // Add listener
    animationToggle.addEventListener("click", switchAnimations);


    drawSquareGrid(gridSide); // Draw 2x2 grid
    /*     for (let i = 0; i < 25; i++) {
              iterate();
          } */

    play();
});