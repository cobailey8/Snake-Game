import { getInputDirection } from "./input.js";
import { Sounds } from "./sounds.js"

export const DEFAULT_SNAKE_SPEED = 7
export var snakeSpeed = parseInt(localStorage.getItem('snakeSpeed')) || DEFAULT_SNAKE_SPEED // Block speed the snake travels per second
const snakeBody = [{ x: 11, y: 11 }]
let newSegments = 0
export let isSnakeMoving = false

export function update(shouldUpdate) {
   if(shouldUpdate) {
    addSegments()

    const inputDirection = getInputDirection()
    if(isSnakeMoving) Sounds.move() 
    
    for(let i = snakeBody.length - 2; i >= 0; i--){
        snakeBody[i+1] = { ...snakeBody[i] }
    }
    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
    }
}

export function draw(gameBoard) {
    
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
    })
}

export function expandSnake(amount) {
    newSegments += amount
}

export function onSnake(position, { ignoreHead = false } = {}) {
    
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPositions(segment, position)
    })
}

export function getSnakeHead() {
    return snakeBody[0]
}

export function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }
    newSegments = 0
}

export function setSnakeMoving(bool) {
    isSnakeMoving = bool
}

export function setSnakeSpeed(speed) {
    snakeSpeed = speed
}