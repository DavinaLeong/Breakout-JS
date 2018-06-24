'use strict';
//#region Variables
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const gameStates = { ERROR: "ERROR", PLAYING: "PLAYING", LOSE: "LOSE", WIN: "WIN" };
let currentGameState = gameStates.PLAYING;

const brickStates = { ERROR: "ERROR", NOT_HIT: "NOT_HIT", HIT: "HIT" };


//properties
const keyPressed = { LEFT: false, RIGHT: false };
const ballProps = {
    radius: 10,
    x: 240,
    y: 290,
    speed: 2,
    dx: 2,
    dy: -2,
    colour: "#CD3837"
};
const paddleProps = {
    width: 75,
    height: 10,
    x: 202.5,
    y: 310,
    speed: 7,
    colour: "#0095DD"
};
const brickProps = {
    rows: 5,
    columns: 3,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30,
    colour: "#517789"
};
const score = {
    x: 8,
    y: 20,
    font: "16px Verdana",
    colour: "#000000",
    value: 0,
    multiplier: 10
}
score.max = brickProps.rows * brickProps.columns * score.multiplier;
console.log(score);

let brickArr = [];
for (let c = 0; c < brickProps.columns; ++c) {
    brickArr[c] = [];
    for (let r = 0; r < brickProps.rows; ++r) {
        brickArr[c][r] = { x: 0, y: 0, state: brickStates.NOT_HIT };
    }
}
//#endregion

//#region Events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(event) {
    switch (event.keyCode) {
        case 39:
            keyPressed.RIGHT = true;
            break;

        case 37:
            keyPressed.LEFT = true;
            break;

        default:
            console.warn(`keyCode ${event.keyCode} not in use.`);
            break;
    }
}

function keyUpHandler(event) {
    switch (event.keyCode) {
        case 39:
            keyPressed.RIGHT = false;
            break;

        case 37:
            keyPressed.LEFT = false;
            break;

        default:
            console.warn(`keyCode ${event.keyCode} not in use.`);
            break;
    }
}

function updateGameState(gameState, alertMessage) {
    currentGameState = gameState;
    if(gameState != gameStates.PLAYING) {
        ballProps.dx = 0;
        ballProps.dy = 0;
        alert(alertMessage);
        document.location.reload();
    }
}
//#endregion

//#region Physics
function collisionDetection() {
    for (let c = 0; c < brickProps.columns; ++c) {
        for (let r = 0; r < brickProps.rows; ++r) {
            let thisBrick = brickArr[c][r];

            if (thisBrick.state == brickStates.NOT_HIT) {
                if (ballProps.x > thisBrick.x && ballProps.x < thisBrick.x + brickProps.width &&
                    ballProps.y > thisBrick.y && ballProps.y < thisBrick.y + brickProps.height) {
                    
                    ballProps.dy = -ballProps.dy;
                    thisBrick.state = brickStates.HIT;
                    score.value += score.multiplier;

                    if(score.value == score.max) {
                        updateGameState(gameStates.WIN, "CONGRATULATIONS, YOU WIN!")
                    }
                }
            }
        }
    }
}
//#endregion

//#region Graphics
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballProps.x, ballProps.y, ballProps.radius, 0, Math.PI * 2);
    ctx.fillStyle = ballProps.colour;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleProps.x, paddleProps.y, paddleProps.width, paddleProps.height);
    ctx.fillStyle = paddleProps.colour;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickProps.columns; ++c) {
        for (let r = 0; r < brickProps.rows; ++r) {
            if (brickArr[c][r].state == brickStates.NOT_HIT) {
                brickArr[c][r].x = (r * (brickProps.width + brickProps.padding)) + brickProps.offsetLeft;
                brickArr[c][r].y = (c * (brickProps.height + brickProps.padding)) + brickProps.offsetTop;

                ctx.beginPath();
                ctx.rect(brickArr[c][r].x, brickArr[c][r].y, brickProps.width, brickProps.height);
                ctx.fillStyle = brickProps.colour;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = score.font;
    ctx.fillStyle = score.colour;
    ctx.fillText(`Score: ${score.value}`, score.x, score.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (ballProps.x + ballProps.dx > canvas.width - ballProps.radius ||
        ballProps.x + ballProps.dx < ballProps.radius) {
        ballProps.dx = -ballProps.dx;
    }
    if (ballProps.y + ballProps.dy < ballProps.radius) {
        ballProps.dy = -ballProps.dy;
    }
    else if (ballProps.y + ballProps.dy > canvas.height + ballProps.radius) {
        if (ballProps.x > paddleProps.x && ballProps.x < paddleProps.x + paddleProps.width) {
            ballProps.dy = -ballProps.dy;
        }
        else {
            updateGameState(gameStates.LOSE, "GAME OVER!");
        }
    }

    if (keyPressed.RIGHT && paddleProps.x < canvas.width - paddleProps.width) {
        paddleProps.x += 7;
    }
    else if (keyPressed.LEFT && paddleProps.x > 0) {
        paddleProps.x -= 7;
    }

    ballProps.x += ballProps.dx;
    ballProps.y += ballProps.dy;
}
//#endregion

if(currentGameState == gameStates.PLAYING) setInterval(draw, 10);