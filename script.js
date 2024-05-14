const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let score = 0;
let snake = [];
let food = {
  x: Math.floor(Math.random() * (canvasWidth / box)) * box,
  y: Math.floor(Math.random() * (canvasHeight / box)) * box
};
let d = 'right';
let gameInterval;
let speed = 150; // Initial speed
let gamePaused = false;

snake[0] = { x: 10 * box, y: 10 * box };

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('stopButton').addEventListener('click', stopGame);

document.addEventListener('keydown', function(event) {
  const key = event.keyCode;
  if (!gamePaused && key >= 37 && key <= 40) {
    if (key === 37 && d !== 'right') d = 'left';
    else if (key === 38 && d !== 'down') d = 'up';
    else if (key === 39 && d !== 'left') d = 'right';
    else if (key === 40 && d !== 'up') d = 'down';
  }
});

function startGame() {
  clearInterval(gameInterval); // Clear previous interval if any
  if (!gamePaused) {
    snake = []; // Reset snake array
    snake[0] = { x: 10 * box, y: 10 * box }; // Initialize snake position
    d = 'right'; // Initialize direction
    score = 0; // Reset score
    speed = 150; // Reset speed
  }
  gameInterval = setInterval(draw, speed); // Start new interval
  gamePaused = false;
}

function stopGame() {
  clearInterval(gameInterval);
  gamePaused = true;
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'green' : 'white';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Direction
  if (d === 'left') snakeX -= box;
  if (d === 'up') snakeY -= box;
  if (d === 'right') snakeX += box;
  if (d === 'down') snakeY += box;

  // If snake eats the food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvasWidth / box)) * box,
      y: Math.floor(Math.random() * (canvasHeight / box)) * box
    };
    // Increase speed after eating food
    clearInterval(gameInterval);
    speed -= 5; // Decrease speed
    gameInterval = setInterval(draw, speed);
  } else {
    // Remove the tail
    snake.pop();
  }

  // Add new head
  const newHead = {
    x: snakeX,
    y: snakeY
  };

  // Game over conditions
  if (
    snakeX < 0 || snakeX >= canvasWidth ||
    snakeY < 0 || snakeY >= canvasHeight ||
    collision(newHead, snake)
  ) {
    clearInterval(gameInterval);
  }

  snake.unshift(newHead);

  // Score display
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, box, box);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}
