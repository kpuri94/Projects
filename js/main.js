const snakeInterval = 100;
const canvasBorderColor = 'blue';
const canvasBackgroundColor = "white";
const colorOfSnakeHead = 'black';
const colorOfSnakeBody = 'blue';
const colorOfSnakeBorder = 'darkblue';
const colorOfFood = 'blue';
const colorOfFoodBorder = 'darkblue';
const unitOfCell = 16;
const defaultWidthOfCanvas = 800;
const defaultHeightOfCanvas = 800;
const shrinkCanvasBy = 113;
const specialFoodSize = 28;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

let widthOfCanvas = defaultWidthOfCanvas;
let heightOfCanvas = defaultHeightOfCanvas;
let previousScore;

// The player's score
let score = 0;
// Flag used to track the change in direction of the snake
let isDirectionChanging = false;
// xCoordinate for food
let foodXCoordinate;
// yCoordinate for food
let foodYCoordinate;
// xCoordinate for special special food
let specialFoodXCoordinate;
// yCoordinate for food
let specialFoodYCoordinate;
// Delta for horizontal movement of snake
let deltaX = unitOfCell;
// Delta for vertical movement of snake
let deltaY = 0;
let timeoutId;
let otherTimeoutId;
let specialFoodColor;

const specialFoodColors = [
  'green', 'brown', 'red',
  'purple', 'yellow', 'pink'
];

const generateDefaultSnakeDimension = () => {
  const defaultSnakeLength = 5;
  const defaultSnake = [];

  for (let i = 0; i < defaultSnakeLength; i++) {
    defaultSnake.push({ xCoordinate: (widthOfCanvas / 2) - (unitOfCell * i), yCoordinate: heightOfCanvas / 2 });
  }

  return defaultSnake;
};

let snake = generateDefaultSnakeDimension();

const getRandomFoodInterval = () => {
  const min = 4;
  const max = 10;
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

const getRandomSpecialFoodInterval = () => {
  const min = 1;
  const max = 5;
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

const getRandomSpecialFoodColor = () => {
  const color = specialFoodColors[Math.floor(Math.random() * specialFoodColors.length)];
  if (color === specialFoodColor) {
    return getRandomSpecialFoodColor();
  }
    
  return color;
}

const startGame = () => {
  document.getElementById("startBtn").disabled = true;
  resetGame();
  makeSnakeFood();
  makeSpecialSnakeFood();
  updateSnakeFood();
  updateSpecialSnakeFood();
  makeSnakeMove();
}

const updateSnakeFood = () => {
  if (!hasGameFinished()) {
    timeoutId = setTimeout(() => {
      makeSnakeFood();
      updateSnakeFood();
    }, getRandomFoodInterval());
  };
}

const updateSpecialSnakeFood = () => {
  if (!hasGameFinished()) {
    otherTimeoutId = setTimeout(() => {
      makeSpecialSnakeFood();
      updateSpecialSnakeFood();
    }, getRandomSpecialFoodInterval());
  };
}

const makeSnakeMove = () => {
  const gameEndMsg = hasGameFinished();
  if (!gameEndMsg) {
    updateCanvasDimensions();
    setTimeout(() => {
      isDirectionChanging = false;
      clearCanvas();
      drawSnakeFood();
      drawSpecialSnakeFood();
      moveSnakeForward();
      drawSnakeOnBoard();

      // Call game again
      makeSnakeMove();
    }, snakeInterval);
  } else {
    alert(gameEndMsg);
  }
}

const clearCanvas = () => {
  //  Select the colour to fill the drawing
  ctx.fillStyle = canvasBackgroundColor;
  //  Select the colour for the border of the canvas
  ctx.strokestyle = canvasBorderColor;

  // Draw a "filled" rectangle to cover the entire canvas
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  // Draw a "border" around the entire canvas
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Function to draw snake food on the board
const drawSnakeFood = () => {
  ctx.fillStyle = colorOfFood;
  ctx.strokestyle = colorOfFoodBorder;
  ctx.fillRect(foodXCoordinate, foodYCoordinate, unitOfCell, unitOfCell);
  ctx.strokeRect(foodXCoordinate, foodYCoordinate, unitOfCell, unitOfCell);
}

// A utility function to draw a rectangle with rounded corners.
const roundedRect = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

// Function to draw special snake food on the board
const drawSpecialSnakeFood = () => {
  ctx.fillStyle = specialFoodColor;
  ctx.strokestyle = colorOfFoodBorder;
  roundedRect(ctx, specialFoodXCoordinate, specialFoodYCoordinate, specialFoodSize / 2);
}

// The snake moves forward by advancing the x coordinate as per the horizontal velocity and
// the y coordinate as per the vertical velocity
const moveSnakeForward = () => {
  // Create the new head of the snake
  const head = { xCoordinate: snake[0].xCoordinate + deltaX, yCoordinate: snake[0].yCoordinate + deltaY };
  // Add the head to the starting of snake's body
  snake.unshift(head);
  // Flag to check if snake has eaten the food
  const didEatSpecialFood = (snake[0].xCoordinate === specialFoodXCoordinate && snake[0].yCoordinate === specialFoodYCoordinate) || ((snake[0].xCoordinate + unitOfCell) === specialFoodXCoordinate && snake[0].yCoordinate === specialFoodYCoordinate);
  const didEatFood = snake[0].xCoordinate === foodXCoordinate && snake[0].yCoordinate === foodYCoordinate;

  if (didEatSpecialFood) {
    const head = { xCoordinate: snake[0].xCoordinate + deltaX, yCoordinate: snake[0].yCoordinate + deltaY };
    snake.unshift(head);

    // increase the score by 9 point every time special food is eaten by snake
    score += 9;

    // Generate new food location for the snake on the game board
    clearTimeout(otherTimeoutId);
    makeSpecialSnakeFood();
    updateSpecialSnakeFood();
  }
  if (didEatFood) {
    // increase the score by 1 point every time food is eaten by snake
    score += 1;

    // Generate new food location for the snake on the game board
    clearTimeout(timeoutId);
    makeSnakeFood();
    updateSnakeFood();
  }
  if (didEatSpecialFood || didEatFood) {
    // current score is displayed on the screen
    document.getElementById('score').innerHTML = score;

    if (previousScore && score > previousScore) {
      document.getElementById('score').style.color = "green";
    }
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}

const resetGame = () => {
  // reset game score to 0
  document.getElementById("score").innerHTML = 0;
  document.getElementById("score").style.color = "black";

  // set width and height of canvas to default values
  widthOfCanvas = defaultWidthOfCanvas;
  heightOfCanvas = defaultHeightOfCanvas;

  gameCanvas.height = heightOfCanvas;
  gameCanvas.width = widthOfCanvas;

  snake = generateDefaultSnakeDimension();

  score = 0;
  isDirectionChanging = false;
  foodXCoordinate;
  foodYCoordinate;
  specialFoodXCoordinate;
  specialFoodYCoordinate;
  deltaX = unitOfCell;
  deltaY = 0;
}

// Function to check if game has ended
const hasGameFinished = () => {
  if ((Math.abs(snake[0].xCoordinate - snake[snake.length - 1].xCoordinate) + shrinkCanvasBy > gameCanvas.width) || (Math.abs(snake[0].yCoordinate - snake[snake.length - 1].yCoordinate) + shrinkCanvasBy > gameCanvas.height)) {
    document.getElementById("startBtn").disabled = false;
    document.getElementById("startBtn").innerText = "Play Again!";
    clearTimeout(timeoutId);
    clearTimeout(otherTimeoutId);
    previousScore = score;
    return "The game ended as the size of snake increased the canvas size.";
  }
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].xCoordinate === snake[0].xCoordinate && snake[i].yCoordinate === snake[0].yCoordinate) {
      document.getElementById("startBtn").disabled = false;
      document.getElementById("startBtn").innerText = "Play Again!";
      clearTimeout(timeoutId);
      clearTimeout(otherTimeoutId);
      previousScore = score;
      return "The game ended as the snake has bitten itself!";
    }
  }

  return false;
}

// Utility function to round off to unit of cell value
const roundToUnitOfCell = value => {
  return Math.round(value / unitOfCell) * unitOfCell;
}

// Function to reverse the snake if it hits the wall
const reverseSnake = (wallHit) => {
  if (wallHit === "leftWall" || wallHit === "rightWall") {
    // reverse the snake array to make sure tail becomes head and head becomes tail
    snake.reverse();

    // adjust snake dimensions by the factor by which the canvas has shrunk
    for (let i = 0; i < snake.length; i++) {
      snake[i].xCoordinate = roundToUnitOfCell(snake[i].xCoordinate - (wallHit === "leftWall" ? -shrinkCanvasBy : shrinkCanvasBy));
    }

    // reverse the direction of delta
    deltaX = -deltaX;

    // if snake was moving on bottom edge, it will be need to be pulled up
    const alterSnakePosition = factor => {
      if (snake[0].yCoordinate > gameCanvas.height - unitOfCell) {
        for (let i = 0; i < snake.length; i++) {
          snake[i].yCoordinate = roundToUnitOfCell(snake[i].yCoordinate - (unitOfCell * factor));
        }

        alterSnakePosition(factor + 1);
      }
    }

    alterSnakePosition(1);

    // if snake was moving on top edge, it will be need to be pulled down
    if (snake[0].yCoordinate <= 0) {
      for (let i = 0; i < snake.length; i++) {
        snake[i].yCoordinate = 0;
      }
    }
  } else if (wallHit === "topWall" || wallHit === "bottomWall") {
    // reverse the snake array to make sure tail becomes head and head becomes tail
    snake.reverse();

    // adjust snake dimensions by the factor by which the canvas has shrunk
    for (let i = 0; i < snake.length; i++) {
      snake[i].yCoordinate = roundToUnitOfCell(snake[i].yCoordinate - (wallHit === "topWall" ? -shrinkCanvasBy : shrinkCanvasBy));
    }

    // reverse the direction of delta
    deltaY = -deltaY;

    // if snake was moving on right edge, it will be need to be shifted to left
    const alterSnakePosition = factor => {
      if (snake[0].xCoordinate > gameCanvas.width - unitOfCell) {
        for (let i = 0; i < snake.length; i++) {
          snake[i].xCoordinate = roundToUnitOfCell(snake[i].xCoordinate - (unitOfCell * factor));
        }

        alterSnakePosition(factor + 1);
      }
    }

    alterSnakePosition(1);

    // if snake was moving on left edge, it will be need to be shifted to right
    if (snake[0].xCoordinate <= 0) {
      for (let i = 0; i < snake.length; i++) {
        snake[i].xCoordinate = 0;
      }
    }
  }
}

// Function to adjust the dimensions of the canvas/ game board whenever the snake hits any wall
const updateCanvasDimensions = () => {
  const wallHit = checkWallHit();
  if (wallHit) {
    heightOfCanvas = heightOfCanvas - shrinkCanvasBy;
    widthOfCanvas = widthOfCanvas - shrinkCanvasBy;

    gameCanvas.width = widthOfCanvas;
    gameCanvas.height = heightOfCanvas;

    clearTimeout(timeoutId);
    clearTimeout(otherTimeoutId);
    makeSnakeFood();
    makeSpecialSnakeFood();
    updateSnakeFood();
    updateSpecialSnakeFood();

    reverseSnake(wallHit);
  }
}

// Utility to get a random number
const generateRandomFoodLocation = (min, max, unit) => {
  return Math.round((Math.random() * (max - min) + min) / unit) * unit;
}

// Generates random regular food coordinates
const makeSnakeFood = () => {
  foodXCoordinate = generateRandomFoodLocation(0, gameCanvas.width - unitOfCell, unitOfCell);
  // Generate a random number for the y coordinate
  foodYCoordinate = generateRandomFoodLocation(0, gameCanvas.height - unitOfCell, unitOfCell);

  // if the new food location is equal to the snake's current position, then generate a new food location
  snake.forEach(part => {
    const foodIsOnSnake = part.xCoordinate == foodXCoordinate && part.yCoordinate == foodYCoordinate;
    if (foodIsOnSnake) {
      makeSnakeFood();
    }
  });
}

// Generates random special food coordinates
const makeSpecialSnakeFood = () => {
  specialFoodXCoordinate = generateRandomFoodLocation(0 + (specialFoodSize / 2), gameCanvas.width - unitOfCell - (specialFoodSize / 2), unitOfCell);
  // Generate a random number for the y coordinate
  specialFoodYCoordinate = generateRandomFoodLocation(0 + (specialFoodSize / 2), gameCanvas.height - unitOfCell - (specialFoodSize / 2), unitOfCell);

  // if the new food location is equal to the snake's current position, then generate a new special food location
  snake.forEach(part => {
    // const specialFoodIsOnSnake = part.xCoordinate == specialFoodXCoordinate && part.yCoordinate == specialFoodYCoordinate;
    const specialFoodIsOnSnake = part.xCoordinate == foodXCoordinate && part.yCoordinate == foodYCoordinate;
    if (specialFoodIsOnSnake) {
      makeSpecialSnakeFood();
    }
  });

  specialFoodColor = getRandomSpecialFoodColor();
}

// Changes the direction of the snake on the board as per the key pressed by the player
const changeDirection = (event) => {
  const LEFT_ARROW_KEY = 37;
  const RIGHT_ARROW_KEY = 39;
  const UP_ARROW_KEY = 38;
  const DOWN_ARROW_KEY = 40;
  if (isDirectionChanging) {
    return;
  }

  isDirectionChanging = true;

  const keyPressedByPlayer = event.keyCode;

  const movingUp = deltaY === -unitOfCell;
  const movingDown = deltaY === unitOfCell;
  const movingRight = deltaX === unitOfCell;
  const movingLeft = deltaX === -unitOfCell;

  if (keyPressedByPlayer === LEFT_ARROW_KEY && !movingRight) {
    deltaX = -unitOfCell;
    deltaY = 0;
  }
  if (keyPressedByPlayer === RIGHT_ARROW_KEY && !movingLeft) {
    deltaX = unitOfCell;
    deltaY = 0;
  }
  if (keyPressedByPlayer === DOWN_ARROW_KEY && !movingUp) {
    deltaX = 0;
    deltaY = unitOfCell;
  }
  if (keyPressedByPlayer === UP_ARROW_KEY && !movingDown) {
    deltaX = 0;
    deltaY = -unitOfCell;
  }
};

// Call changeDirection whenever an arrow key is pressed
document.addEventListener("keydown", changeDirection);

//Draws the snake on the board
const drawSnakeOnBoard = () => {
  snake.forEach(drawSnakePart)
}

//Draws all parts of the snake on the board
const drawSnakePart = (snakePart, index) => {
  ctx.fillStyle = index === 0 ? colorOfSnakeHead : colorOfSnakeBody;
  ctx.strokestyle = colorOfSnakeBorder;
  ctx.fillRect(snakePart.xCoordinate, snakePart.yCoordinate, unitOfCell, unitOfCell);
  ctx.strokeRect(snakePart.xCoordinate, snakePart.yCoordinate, unitOfCell, unitOfCell);
}

// To check which wall has been hit by the snake
const checkWallHit = () => {
  const hitLeftWall = snake[0].xCoordinate < 0;
  const hitRightWall = snake[0].xCoordinate > gameCanvas.width - unitOfCell;
  const hitToptWall = snake[0].yCoordinate < 0;
  const hitBottomWall = snake[0].yCoordinate > gameCanvas.height - unitOfCell;

  if (hitLeftWall) {
    return "leftWall";
  } else if (hitRightWall) {
    return "rightWall";
  } else if (hitToptWall) {
    return "topWall";
  } else if (hitBottomWall) {
    return "bottomWall";
  }

  return false;
}
