let GRID_SIZE = 20;
let tick = 120;
let snake = [{x: 10, y: 10}];
let food = createFood();
let dir = 'right';
let nextdir = 'right';
let interval_Of_Game;
let score_ = 0;
let is_paused = false;

const Game_Board = document.getElementById("game-board");
const DisplayScore = document.getElementById("score");
const DisplayEatenApples = document.getElementById("apples");
const DisplayMaxRecord = document.getElementById("high-score");


let hight_score = localStorage.getItem('snakeHighScore') || 0;
hight_score = parseInt(hight_score);
DisplayMaxRecord.textContent = hight_score;

let Apples_eaten = 0;



function start(){
    createGameBoard();
    Draww_skins();
    document.addEventListener('keydown', handKeyPress);
    interval_Of_Game = setInterval(gameFunction, tick);
    
}

function togglePause(){
    is_paused = !is_paused;
}

function handKeyPress(e){
    if (e.key === ' ') {
        togglePause();
        return;
    }

    if(is_paused) return;

    switch(e.key){
        case 'ArrowUp':
            if(dir !== 'down') nextdir = 'up';
            break;
        case 'ArrowDown':
            if(dir !== 'up') nextdir = 'down';
            break;
        case 'ArrowRight':
            if(dir !== 'left') nextdir = 'right';
            break;
        case 'ArrowLeft':
            if(dir !== 'right') nextdir = 'left';
            break;
    }
}

function gameFunction(){
    if(is_paused) return;

    dir = nextdir;
    moving_snake();
    if(HaveColision()){
        Game_over();
        return;
    }
    Draww_skins();
}

function Game_over(){
    clearInterval(interval_Of_Game);
    if(score_ > hight_score){
        hight_score = score_;
        localStorage.setItem('snakeHighScore', hight_score);
        DisplayMaxRecord.textContent = hight_score;
    }

    alert(`Игра окончена!\nВаш счёт: ${score_}\nЯблок съедено: ${Apples_eaten}`);
    if (confirm('Начать заново?')) {
        restartGame();
    }
}

function restartGame(){
    snake = [{ x: 10, y: 10 }];
    food = createFood();
    dir = 'right';
    nextdir = 'right';
    score_ = 0;
    Apples_eaten = 0;
    DisplayScore.textContent = score_;
    DisplayEatenApples.textContent = Apples_eaten;
    interval_Of_Game = setInterval(gameFunction, tick);
}

function HaveColision(){
    const head = snake[0];

    // if(head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE){
    //     return true;
    // }

    for(let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            return true
        }
    }
    return false;
}

function moving_snake(){
    const head_ = {...snake[0]};
    switch(dir){
        case 'up': head_.y--; break;
        case 'down': head_.y++; break;
        case 'left': head_.x--; break;
        case 'right': head_.x++; break;
    }

    head_.x = ((head_.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
    head_.y = ((head_.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;

    snake.unshift(head_);

    if(head_.x === food.x && head_.y === food.y){
        food = createFood();
        score_ += 10;
        Apples_eaten++;
        DisplayScore.textContent = score_;
        DisplayEatenApples.textContent = Apples_eaten;
    }
    else{
        snake.pop();
    }
}

function Draww_skins(){
    const cells = document.querySelectorAll(".cell");
    cells.forEach(segment => {
        segment.textContent = '';
    });

    // Рисуем тело (все сегменты, кроме головы)
  for (let i = 1; i < snake.length; i++) {
    const segment = snake[i];
    const index = segment.y * GRID_SIZE + segment.x;
    if (cells[index]) {
      cells[index].textContent = '🟩'; // светло-зелёный (тело)
    }
  }

  // Рисуем голову отдельно
  const head = snake[0];
  const headIndex = head.y * GRID_SIZE + head.x;
  if (cells[headIndex]) {
    cells[headIndex].textContent = '🐍'; // тёмно-зелёный (голова)
  }

    const foodIndex = food.y * GRID_SIZE + food.x;
    if (cells[foodIndex]) cells[foodIndex].textContent = '🍎';
}

function createGameBoard(){
    Game_Board.innerHTML = '';
    for(let i = 0; i < GRID_SIZE * GRID_SIZE; i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        Game_Board.appendChild(cell);
    }
}

function createFood(){
    let NewFood;
    do{
        NewFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while(snake.some(segment => segment.x === NewFood.x && segment.y === NewFood.y));
    return NewFood;
}

start();

