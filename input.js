import { isSnakeMoving, setSnakeMoving } from './snake.js'
import { Sounds } from './sounds.js'
import { pause, toggleDiscoMode, gameOver, reloadGame, checkSettingsState } from './game.js'

let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }
export let keyboardDisabled = false

window.addEventListener('keydown', e => {
    if(keyboardDisabled) {
        switch(e.key) {
            case 'Enter':
                if(!gameOver && checkSettingsState() === false) {

                    sessionStorage.setItem('greet', false)

                    modalBG.style.display = 'none'                  // Display modal

                    if(keyboardDisabled == true) toggleDisableKeyboard()

                } else if(checkSettingsState() === true) {

                    Sounds.error()

                } else {

                    Sounds.buttonClick()   // Plays button press audio

                    reloadGame()                // Navigate '/' (reload)

                }

                break

            default:

                Sounds.error()

                break
        }
    } else {
        switch (e.key) {
            case 'ArrowUp':
                
                if(lastInputDirection.y !== 0) break

                isSnakeMoving ? Sounds.turn() : setSnakeMoving(true)

                inputDirection = { x: 0, y: -1 }
                
                break

            case 'ArrowDown':

                if(lastInputDirection.y !== 0) break

                isSnakeMoving ? Sounds.turn() : setSnakeMoving(true)

                inputDirection = { x: 0, y: 1 }

                break

            case 'ArrowLeft':

                if(lastInputDirection.x !== 0) break

                isSnakeMoving ? Sounds.turn() : setSnakeMoving(true)

                inputDirection = { x: -1, y: 0 }

                break

            case 'ArrowRight': 

                if(lastInputDirection.x !== 0) break

                isSnakeMoving ? Sounds.turn() : setSnakeMoving(true)

                inputDirection = { x: 1, y: 0 }

                break
            case 'p':

                pause()

                break

            case 'd':

                toggleDiscoMode()

                break
            default:

                Sounds.error()

                console.log("User Pressed: " + e.key + " key, which isnt mapped")
                
                break
        }
    }
})

export function getInputDirection() {

    lastInputDirection = inputDirection

    return inputDirection
}

export function getLastDirection() {

    return lastInputDirection

}

export function toggleDisableKeyboard(){

    keyboardDisabled = !keyboardDisabled

}