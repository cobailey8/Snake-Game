import { Sounds} from './sounds.js'
import { ls, score, reloadGame, discoModeActivated, toggleDiscoMode } from './game.js'
import { toggleSettingsUI } from './settings.js'
import { keyboardDisabled, toggleDisableKeyboard } from './input.js'

export const modalBG = document.getElementById('modalBG')
export const gameModal = document.getElementById('game-modal')
export let uiTraversal = []

export function introModal() {
    if(!keyboardDisabled) toggleDisableKeyboard()   // Disable Keyboard
    if(discoModeActivated) toggleDiscoMode()                  // Turn discoMode off 
    modalBG.style.display = 'flex'                  // Display modal

    gameModal.style.height = '60vmin'   // Re-size the gameModal div to fit the settings UI
    var greetText = ls.highScore ? 'WELCOME BACK!' : 'WELCOME!'    // Custom greeting
    gameModal.innerHTML =               // HTML markup for settings modal
    `
        <h1 class="headText">${greetText}</h1>

        <div class="subText1">
            How to Play:
        </div>
        <div class="subText2 centerText">
            Use the arrow keys to move the snake 
            (square) around the board, collecting 
            food (circle) as you go!
        </div>
        <div class="subText2 centerText">
            To pause, simply press the 'p' button 
            on your keyboard. 
        </div>
        <div class="subText2 centerText">
            You can also adjust sound, snake 
            speed, and other settings by visiting
            the settings menu below.
        </div>
        <div class="subText2 centerText">
            Have fun, and enjoy the game!
        </div>
        <div class="inputGroup">
            <input type="button" value="PLAY" class="basicButton" id="playBtn">
            <img class="settingsBtn" id="settingsImg" src="./images/settings.svg"">
        </div>
    `

    // Form Elements
    let playBtn = document.getElementById('playBtn')
    let settingsBtn = document.getElementById('settingsImg')

    // Event Listeners
    playBtn.addEventListener("click", () => {
        sessionStorage.setItem('greet', false)
        modalBG.style.display = 'none'                  // Display modal
        if(keyboardDisabled == true) toggleDisableKeyboard()
    })

    settingsBtn.addEventListener("click", () => {
        Sounds.buttonClick()   // Plays button press audio
        uiTraversal.unshift(introModal)
        toggleSettingsUI()          // Display the settings UI to the user
    })

}

/*
    FUNCION: Displays the Game Over screen/modal/UI for the user
    
    This UI is intended to be self contained within this function since the background and modal
    are being used for multiple screens.
*/
export function gameOverUI(isHighScore) {
    if(!keyboardDisabled) toggleDisableKeyboard()   // Disable Keyboard
    if(discoModeActivated) toggleDiscoMode()                  // Turn discoMode off 
    modalBG.style.display = 'flex'                  // Display modal

    if (isHighScore) {
        modalBG.style.background = "rgba(128, 128, 128, 0.438) url('./images/confetti.gif') no-repeat center"  // Replace background with confetti.png 
        Sounds.highScore()    // Plays a highscore.mp3 sound
    }

    gameModal.style.height = '30vmin'   // Re-size the gameModal div to fit the settings UI
    gameModal.innerHTML =   // HTML markup for settings modal
    `
        <h1 class="headText"> GAME OVER! </h1>

        <div class="subText1">High Score: ${ls.highScore || score}</div>

        <div class="subText1">Score: ${score}</div>

        <div class="inputGroup">
            <input type="button" value="Play Again" class="basicButton" id="gameOverReloadBtn">
            <img class="settingsBtn" id="settingsImg" src="./images/settings.svg"">
        </div>  
    `

    // Form Elements
    let settingsBtn = document.getElementById('settingsImg')
    let playAgainBtn = document.getElementById('gameOverReloadBtn')

    // Event Listeners
    settingsBtn.addEventListener("click", () => {
        Sounds.buttonClick()   // Plays button press audio
        uiTraversal.unshift(gameOverUI)
        toggleSettingsUI()          // Display the settings UI to the user
    })

    playAgainBtn.addEventListener("click", () => {
        Sounds.buttonClick()   // Plays button press audio
        reloadGame()                // Navigate '/' (reload)
    })

}

export function pauseUI() {
    if(!keyboardDisabled) toggleDisableKeyboard()   // Disable Keyboard
    if(discoModeActivated) disco()                  // Turn discoMode off 
    modalBG.style.display = 'flex'                  // Display modal

    gameModal.style.height = '20vmin'   // Re-size the gameModal div to fit the settings UI
    gameModal.innerHTML =               // HTML markup for settings modal
    `
        <h1 class="headText"> Game Paused </h1>

        <div class="inputGroup">
            <input type="button" value="Restart" class="basicButton" id="reloadBtn">
            <input type="button" value="Resume" class="basicButton" id="resumeBtn">
            <img class="settingsBtn" id="settingsImg" src="./images/settings.svg"">
        </div>
    `

    // Form Elements
    let playAgainBtn = document.getElementById('reloadBtn')
    let resumeBtn = document.getElementById('resumeBtn')
    let settingsBtn = document.getElementById('settingsImg')

    // Event Listeners
    playAgainBtn.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        reloadGame()                // Navigate '/' (reload)
    })

    resumeBtn.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        modalBG.style.display = 'none'                  // Display modal
        if(keyboardDisabled == true) toggleDisableKeyboard()
    })

    settingsBtn.addEventListener("click", () => {
        Sounds.buttonClick()   // Plays button press audio
        uiTraversal.unshift(pauseUI)
        toggleSettingsUI()          // Display the settings UI to the user
    })
}

export function confirmUI(action, textinfo) {
    if(!keyboardDisabled) toggleDisableKeyboard()   // Disable Keyboard
    if(discoModeActivated) disco()                  // Turn discoMode off 
    modalBG.style.display = 'flex'                  // Display modal

    gameModal.style.height = '25vmin'
    gameModal.innerHTML = 
    `
        <h1 class="headText"> WAIT! </h1>
        <div class="subText2 centerText">${textinfo}</div>
        <div class="inputGroup">
            <input type="button" value="I UNDERSTAND" class="basicButton" id="continueBtn">
            <input type="button" value="CANCEL" class="basicButton" id="cancelBtn">
        </div>
    `

    let continueBtn = document.getElementById('continueBtn')
    let cancelBtn = document.getElementById('cancelBtn')
    
    continueBtn.addEventListener("click", () => {
        Sounds.buttonClick() 
        action()
        var last = uiTraversal[0]
        uiTraversal.shift()
        last()
    })

    cancelBtn.addEventListener("click", () => {
        Sounds.buttonClick()
        var last = uiTraversal[0]
        uiTraversal.shift()
        last()
    })
}