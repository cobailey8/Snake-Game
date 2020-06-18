import { update as updateSnake, draw as drawSnake, snakeSpeed, getSnakeHead, snakeIntersection } from './snake.js'
import { update as updateFood, draw as drawFood } from './food.js'
import { outsideGrid } from './grid.js'
import { Sounds, GAME_VOLUME } from './sounds.js'
import { introModal, gameOverUI, pauseUI } from './modal.js'
import { setUserColors, discoMode, isSettingsModalOpen } from './settings.js'
import { keyboardDisabled } from './input.js'

let lastRenderTime = 0

export let discoModeActivated = false
const discoDelay = 2
var discoCounter = 0

export let gameOver = false
export let score = 0
export var reloadGame = () => window.location = '/'
export const ls = localStorage
export const scoreBoard = document.getElementById('score-board')
const gameBoard = document.getElementById('game-board')


setup() // RUN AUTOMATICALLY ON PAGE LOAD

function main(currentTime) {
    if(gameOver) {  // Check for a game over state

        discoModeActivated ? toggleDiscoMode() : 0

        Sounds.gameOver()            // Play game over .mp3 audio

        gameOverUI(checkHighScores())   // Open gameOver modal

        return

    }

    window.requestAnimationFrame(main)

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000

    if(secondsSinceLastRender < 1 / snakeSpeed) return

    lastRenderTime = currentTime

    // DiscoMode 
    if(discoCounter == discoDelay){
        if(discoModeActivated) discoMode()
        discoCounter = 0
    }else{
        discoCounter++
    }

    update()
    draw()
    
}

window.requestAnimationFrame(main)

function setup() {  
    // sessionStorage.clear()  // TEMP

    // Set user-defined settings if any exist
    Sounds.setGameVolume(GAME_VOLUME)
    setUserColors(ls.accessibility)
    scoreBoard.style.display = ls.showScoreboard ? 'flex' : 'none'
    
    if(ls.showScoreboard == 'false'){
        scoreBoard.style.display = 'none'
    } else {
        scoreBoard.style.display = 'flex'
    }

    // Greet the user if it's their first time, or are returning to the site
    !sessionStorage.greet ? 
        introModal() : 0
        // Sounds.start()

    // Initialize and display score board
    updateScore()

}

function update() {

    keyboardDisabled ? updateSnake(false) : updateSnake(true)

    updateFood()

    checkDeath()

}

function draw() {

    gameBoard.innerHTML = ''

    drawSnake(gameBoard)

    drawFood(gameBoard)

}

function checkDeath() {

    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()

}

export function updateScore(x) {

    score += x || 1

    scoreBoard.innerHTML = `<div id="points">POINTS: ${score} </div>`

}

function checkHighScores() {
    // Best real score so far is 94... (Just so i remember after debugging localStorage)
    if ( !ls.highScore ) {  // triggered if the user has no highscore recorded in localStorage

        localStorage.setItem("highScore", score)

        return false    // Set to false so that the 'highscore' animation isnt triggered

    }
    
    var hs = parseInt(ls.highScore)
    
    if ( score > hs ) {

        localStorage.setItem('highScore', `${score}`)

        return true

    }

    return false

}

export function pause() {
    pauseUI()
}

export function toggleDiscoMode() {
        discoModeActivated = !discoModeActivated

        if(!discoModeActivated) {
            Sounds.discoMusicPause()
            setUserColors(ls.accessibility)
        } else {
            Sounds.discoMusic()
        }
}

export function checkSettingsState() {
    return isSettingsModalOpen()
}