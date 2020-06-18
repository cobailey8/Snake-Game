import { onSnake, expandSnake } from './snake.js'
import { randomGridPosition } from './grid.js'
import { updateScore, score } from './game.js'
import { Sounds } from './sounds.js'
let food = getRandomFoodPosition()

export const DEFAULT_EXPANSION_RATE = 1    // Default amount the snake grows when food is eaten
export var expansionRate = parseInt(localStorage.getItem('snakeExpansionRate')) || DEFAULT_EXPANSION_RATE   // How much the snake grows when food is eaten

export function update() {
    if (onSnake(food)){
        expandSnake(expansionRate)
        food = getRandomFoodPosition()
        updateScore()   // replaced updateScore(expansionRate) because it was over powered
        score > 1 ? Sounds.eat() : 0
    }
}

export function draw(gameBoard) {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition
    while(newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}

export function setExpansionRate(rate) {
    expansionRate = rate
}