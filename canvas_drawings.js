let canvas;
let context;
let dominoScale = 50;

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