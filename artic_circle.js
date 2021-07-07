/**** Settings ****/
let biasSlider;
let biasText;

let delaySlider;
let delayText;
let stepDelay = 0;

let colorToggle;

let showAnimations = false;

/**** Loop controls  ****/
let stop = false;                  // User chooses to stop
let isWorking = false;             // Controls concurrent behaviour

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
        // Wait for everything to stop, then do the iteration
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


    drawSquareGrid(gridSide); // Draw initial 2x2 grid
    play();
});