const board_border = 'black';
const board_background = "white";
let snake_color = 'lightblue';
const snake_border = 'darkblue';
const difficulty_multiplier = 1.06;

let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
]

document.getElementById("texture").hidden = true;
let score = 0;
highscore = Number(localStorage.getItem("highscore"));
let highscoreTag = document.getElementById('highscore');
highscoreTag.hidden = true;
displayHighScore();
let difficulty = 1;
// True if changing direction
let changing_direction = false;
let food_x;
let food_y;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;
//Special snake skin
let texture = document.getElementById("texture");

// Get the canvas element
const snakeboard = document.getElementById("snakeboard");
// Return a two dimensional drawing context
const snakeboardContext = snakeboard.getContext("2d");
let image = snakeboardContext.createPattern(texture, "repeat");
// Start game
main();

genFood();

document.addEventListener("keydown", changeDirection);

// main function called repeatedly to keep the game running
function main() {

    if(score >= 5 && score <=24)
        snake_color = 'red';
    else if(score > 24){
        snake_color = image;
    }

    if (hasGameEnded()){
        if(score > highscore) {
            localStorage.setItem("highscore", String(score));
            highscore = score;
            displayHighScore();
        }
        highscoreTag.hidden = false;
        window.alert("Game over!");
        return;
    }

    changing_direction = false;
    setTimeout(function onTick() {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        // Repeat
        main();
    }, 60 / difficulty)
}

function displayHighScore(){
    highscoreTag.innerHTML = "Highscore:" + highscore;
}

// draw a border around the canvas
function clearBoard() {
    //  Select the colour to fill the drawing
    snakeboardContext.fillStyle = board_background;
    //  Select the colour for the border of the canvas
    snakeboardContext.strokestyle = board_border;
    // Draw a "filled" rectangle to cover the entire canvas
    snakeboardContext.fillRect(0, 0, snakeboard.width, snakeboard.height);
    // Draw a "border" around the entire canvas
    snakeboardContext.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// Draw the snake on the canvas
function drawSnake() {
    // Draw each part
    snake.forEach(drawSnakePart)
}

function drawFood() {
    snakeboardContext.fillStyle = 'lightgreen';
    snakeboardContext.strokestyle = 'darkgreen';
    snakeboardContext.fillRect(food_x, food_y, 10, 10);
    snakeboardContext.strokeRect(food_x, food_y, 10, 10);
}

// Draw one snake part
function drawSnakePart(snakePart) {

    // Set the colour of the snake part
    snakeboardContext.fillStyle = snake_color;
    // Set the border colour of the snake part
    snakeboardContext.strokestyle = snake_border;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    snakeboardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
    // Draw a border around the snake part
    snakeboardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function genFood() {
    // Generate a random number the food x-coordinate
    food_x = randomFood(0, snakeboard.width - 10);
    // Generate a random number for the food y-coordinate
    food_y = randomFood(0, snakeboard.height - 10);
    // if the new food location is where the snake currently is, generate a new food location
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x === food_x && part.y === food_y;
        if (has_eaten) genFood();
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Prevent the snake from reversing

    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function moveSnake() {
    // Create the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head to the beginning of snake body
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
        // Increase score
        score += 1;
        //Increase difficulty
        difficulty *= difficulty_multiplier;
        // Display score on screen
        document.getElementById('score').innerHTML = score;
        // Generate new food location
        genFood();
    } else {
        // Remove the last part of snake body
        snake.pop();
    }
}