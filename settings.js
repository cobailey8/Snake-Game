import { Sounds, DEFAULT_VOLUME} from './sounds.js'
import { DEFAULT_SNAKE_SPEED, setSnakeSpeed } from './snake.js'
import { DEFAULT_EXPANSION_RATE, setExpansionRate } from './food.js'
import { ls, scoreBoard, discoModeActivated, toggleDiscoMode } from './game.js'
import { modalBG, gameModal, uiTraversal, confirmUI } from './modal.js'
import { keyboardDisabled, toggleDisableKeyboard } from './input.js'

var settingsModalOpen = false

export function toggleSettingsUI() {
    if(!keyboardDisabled) toggleDisableKeyboard()   // Disable Keyboard
    if(discoModeActivated) toggleDiscoMode()                  // Turn discoMode off 
    modalBG.style.display = 'flex'                  // Display modal
    settingsModalOpen = true

    // Grab pre-set values from localStorage if they exist there, otherwise use default values
    var vol = Math.round((ls.volume || DEFAULT_VOLUME) * 100)
    var sb = ls.showScoreboard || 'true'
    var speed = ls.snakeSpeed || DEFAULT_SNAKE_SPEED
    var expansionRate = ls.snakeExpansionRate || DEFAULT_EXPANSION_RATE

    // Game Modal markup/DOM modification for settings UI
    gameModal.style.height = '70vmin'   // Re-size the gameModal div to fit the settings UI
    gameModal.innerHTML =   // HTML markup for settings modal
    `
        <div class="inputGroupCol">
            <h1 class="headText"> Settings </h1>
            <input type="button" value="Accessibility" class="basicButtonSm" id="accessBtn">
        </div>

        <div class="subText1"> 
            Game Volume:
            <div class="subText2" id="volumeDispl">${ vol }</div> 
            <div class="inputGroup">
                <input type="checkbox" id="volumeCB" class="settingsCB" ${ vol === 0 ? 'checked' : ''}>
                <input type="range" class="settingsRangeSlider" id="volumeSlider" min="0" max="100" value="${ vol }">
            </div>
        </div>

        <div class="inputGroup">
            <div class="subText1"> Scoreboard: </div>
            <input type="checkbox" id="toggleScoreboardCB" class="settingsCB" ${ sb == 'false' ? '' : 'checked' }>
        </div>

        <div class="subText1"> 
            Snake Speed: 
            <div class="subText2" id="speedDispl">${ speed } ticks per second</div> 
            <input type="range" class="settingsRangeSlider" id="snakeSpeedSlider" min="2" max="25" value="${ speed }">
        </div>
        
        <div class="subText1">
            Expansion Rate:
            <div class="subText2" id="expansionDispl">${ expansionRate } blocks per food</div> 
            <input type="range" class="settingsRangeSlider" id="expansionRateSlider" min="1" max="10" value="${ expansionRate }">
        </div>


        <div class="inputGroup">
            <input type="button" value="Set Defaults" class="basicButton" id="defaultBtn">
            <input type="button" value="Done" class="basicButton" id="backBtn"> 
        </div>
    `
    // End Markup

    // Form elements
    const accessBtn = document.getElementById("accessBtn")
    const volumeEle = document.getElementById("volumeSlider")
    const volumeDispl = document.getElementById("volumeDispl")
    const volumeCB = document.getElementById("volumeCB")
    const scoreboardCB = document.getElementById("toggleScoreboardCB")
    const snakeSpeedDispl = document.getElementById("speedDispl")
    const snakeSpeedEle = document.getElementById("snakeSpeedSlider")
    const expansionDispl = document.getElementById("expansionDispl")
    const expansionRateEle = document.getElementById("expansionRateSlider")
    const backBtn = document.getElementById("backBtn")
    const defaultBtn = document.getElementById("defaultBtn")

    // Event Listeners
    accessBtn.addEventListener("click", () => {
        Sounds.buttonClick()
        uiTraversal.unshift(toggleSettingsUI)
        accessibilityUI()
    })

    volumeEle.addEventListener("change", () => {
        setVolumeUI(volumeEle.value)                                        // Set volume
    })

    volumeCB.addEventListener("click", () => {

        if (volumeCB.checked) {
            volumeEle.value = 0
            setVolumeUI(volumeEle.value)
        } else{
            if (vol === 0){
                volumeEle.value = 30
                setVolumeUI(volumeEle.value)
            }else {
                volumeEle.value = vol
                setVolumeUI(volumeEle.value)
            }
        }
    })

    scoreboardCB.addEventListener("click", () => {

        Sounds.buttonClick()
        
        if(scoreboardCB.checked) {
            localStorage.setItem('showScoreboard', true)
            scoreBoard.style.display = "flex"
        }else{
            localStorage.setItem('showScoreboard', false)
            scoreBoard.style.display = "none"
        }

    })

    snakeSpeedEle.addEventListener("change", () => {
        Sounds.buttonClick()
        snakeSpeedDispl.innerHTML = `${snakeSpeedEle.value} ticks/second`   // Display change to UI
        localStorage.setItem('snakeSpeed', snakeSpeedEle.value)             // Set value for reference in localStorage
        setSnakeSpeed(snakeSpeedEle.value)                                  // Sets snake speed for current game
    })

    expansionRateEle.addEventListener("change", () => {
        Sounds.buttonClick()
        expansionDispl.innerHTML = `${expansionRateEle.value} ticks/second` // Display change to UI
        localStorage.setItem('snakeExpansionRate', expansionRateEle.value)  // Set value for reference in localStorage
        setExpansionRate(expansionRateEle.value)    // Sets expansion rate for current game
    })

    backBtn.addEventListener("click", () => {
        Sounds.buttonClick()      // Plays button press audio
        toggleDisableKeyboard()
        settingsModalOpen = false
        var last = uiTraversal[0]
        uiTraversal.shift()
        last()
    })

    defaultBtn.addEventListener("click", () => {
        Sounds.buttonClick()                                     // Plays button press audio
        uiTraversal.unshift(toggleSettingsUI)
        confirmUI(setDefaultSettings, 'Are you sure you want to remove all user-defined settings?')
        // setDefaultSettings()                                                // Triggers function to set all settings to default
    })

    /*  FUNCTION: setVolumeUI()     Coordinates both localStorage, and UI actions to act in unison

        This function is necessary to ensure the proper operation of all volume interfaces including 
        the slider, checkbox, and localStorage functionality. Due to the larger than normal number of 
        possible states that can occur between these interfaces, this function was created to standardize
        volume controls.

    */
    function setVolumeUI(sliderVal) {
        // Checkbox display change
        volumeCB.checked = sliderVal == 0 ? true : false

        Sounds.setGameVolume(sliderVal/100 || 0)

        // Volume Text display change
        volumeDispl.innerHTML = `${ sliderVal }`

        // Play audio to test volume
        Sounds.soundTest(sliderVal/100 || 0)
        
        // Store new user-defined volume setting in localStorage
        localStorage.setItem('volume', sliderVal/100)

    }

    /*  FUNCTION: setDefaultSettings()      Resets all settings to their default values.

        This can be done in a number of ways, but since we already have DEFAULTs set, we can just call 
        those defaults from the code whenever there's no pre-set values set in localStorage.

        Since that is the case, removing all of those pre-set values from localStorage will cause the
        defaults to trigger when the game is loaded.

    */
    function setDefaultSettings() {

        // Reset volume to default
        volumeEle.value = DEFAULT_VOLUME * 100   // Just for the user's display
        volumeCB.checked = volumeEle.value > 0 ? false : true
        volumeDispl.innerHTML = `${DEFAULT_VOLUME*100}` // Just for the user's display
        Sounds.setGameVolume(DEFAULT_VOLUME)

        // Reset scoreboard visibility
        scoreboardCB.checked = true
        scoreBoard.style.display = 'flex'
    
        // Reset snake speed to default
        snakeSpeedEle.value = DEFAULT_SNAKE_SPEED   // Just for the user's display
        snakeSpeedDispl.innerHTML = `${DEFAULT_SNAKE_SPEED} ticks per second` // Just for the user's display
        setSnakeSpeed(DEFAULT_SNAKE_SPEED)

        // Reset snake expansion rate to default
        expansionRateEle.value = DEFAULT_EXPANSION_RATE   // Just for the user's display
        expansionDispl.innerHTML = `${DEFAULT_EXPANSION_RATE} blocks per food` // Just for the user's display
        setExpansionRate(DEFAULT_EXPANSION_RATE)

        changeUIColors({ 
            bg: '#3f3f44', 
            gb: '#f7f7f7', 
            snake: '#fca356', 
            food: '#cceabb', 
            hTxt: 'firebrick', 
            sTxt: '#3f3f44', 
            btnTxt: 'white', 
            border: '#3f3f44', 
            btnBG: 'linear-gradient(270deg, rgba(169,91,219,1) 0%, rgba(219,91,91,1) 24%, rgba(213,219,91,1) 50%, rgba(91,219,106,1) 76%, rgba(91,158,219,1) 100%)'
        })
    
        localStorage.removeItem('volume')
        localStorage.removeItem('showScoreboard')
        localStorage.removeItem('snakeSpeed')
        localStorage.removeItem('snakeExpansionRate')
        localStorage.removeItem('accessibility')
    }
}

export function accessibilityUI() {
    if(!keyboardDisabled) toggleDisableKeyboard()   // Disable Keyboard
    modalBG.style.display = 'flex'                  // Display modal

    gameModal.style.height = '50vmin'   // Re-size the gameModal div to fit the settings UI
    gameModal.innerHTML =               // HTML markup for settings modal
    `
        <h1 class="headText"> Accessibility Settings </h1>
        
            <div class="subText1">Color Blindness</div>
            <div class="inputGroup">
                <input type="button" id="dColor" value="Deuteranopia" class="basicButtonSm ${ls.accessibility == 'dColor' ? 'selectedSm' : ''}">
                <input type="button" id="pColor" value="Protanopia" class="basicButtonSm ${ls.accessibility == 'pColor' ? 'selectedSm' : ''}">
            </div>
            <div class="inputGroup">
                <input type="button" id="aColor" value="Achromatopsia" class="basicButtonSm ${ls.accessibility == 'aColor' ? 'selectedSm' : ''}">
                <input type="button" id="tColor" value="Tritanopia" class="basicButtonSm ${ls.accessibility == 'tColor' ? 'selectedSm' : ''}">
            </div>
            <div class="inputGroup">
                <input type="button" id="defaultColor" value="Default Colors" class="basicButtonSm ${!ls.accessibility ? 'selectedSm' : ''}">
            </div>
        <div class="inputGroup">
            <input type="button" id="doneBtn" value="Done" class="basicButton">
        </div>
    `

    var doneBtn = document.getElementById("doneBtn")
    var dColor = document.getElementById("dColor")
    var pColor = document.getElementById("pColor")
    var aColor = document.getElementById("aColor")
    var tColor = document.getElementById("tColor")
    var defaultColor = document.getElementById("defaultColor")

    doneBtn.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        var last = uiTraversal[0]
        uiTraversal.shift()
        last()
    })

    dColor.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        localStorage.setItem('accessibility', 'dColor')
        dColor.classList.add('selectedSm')
        pColor.classList.remove('selectedSm')
        aColor.classList.remove('selectedSm')
        tColor.classList.remove('selectedSm')
        defaultColor.classList.remove('selectedSm')
        changeUIColors({ snake: '#1b6ca8', food: '#f3c623', hTxt: '#fb7813', btnBG: 'linear-gradient(270deg, #f3904f 0%, #3b4371 77%)', sliderTrack: '#1b6ca8' })
    })

    pColor.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        localStorage.setItem('accessibility', 'pColor')
        dColor.classList.remove('selectedSm')
        pColor.classList.add('selectedSm')
        aColor.classList.remove('selectedSm')
        tColor.classList.remove('selectedSm')
        defaultColor.classList.remove('selectedSm')
        changeUIColors({snake: '#10375c', food: '#f3c623', hTxt: '#127681', btnBG: 'linear-gradient(90deg, #52ACFF 25%, #FFE32C 100%)', sliderTrack: '#1b6ca8' })
    })

    aColor.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        localStorage.setItem('accessibility', 'aColor')
        dColor.classList.remove('selectedSm')
        pColor.classList.remove('selectedSm')
        aColor.classList.add('selectedSm')
        tColor.classList.remove('selectedSm')
        defaultColor.classList.remove('selectedSm')
        changeUIColors({ bg: 'black', gb: 'white', snake: 'gray', food: 'white', hTxt: 'black', sTxt: 'black', btnTxt: 'white', border: 'black', btnBG: 'linear-gradient(270deg, #000000 0%, #ffffff 50%, #000000 100%)', sliderTrack: 'black', sliderThumb: 'gray' })
    })

    tColor.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        localStorage.setItem('accessibility', 'tColor')
        dColor.classList.remove('selectedSm')
        pColor.classList.remove('selectedSm')
        aColor.classList.remove('selectedSm')
        tColor.classList.add('selectedSm')
        defaultColor.classList.remove('selectedSm')
        //Unable to perceive blue (cannot distinguish between blue and yellow)
        changeUIColors({btnBG: 'linear-gradient(270deg, #fa5436 0%, #65ff79 100%)'})
    })

    defaultColor.addEventListener("click", () => {
        Sounds.buttonClick()        // Plays button press audio
        localStorage.removeItem('accessibility')
        dColor.classList.remove('selectedSm')
        pColor.classList.remove('selectedSm')
        aColor.classList.remove('selectedSm')
        tColor.classList.remove('selectedSm')
        defaultColor.classList.add('selectedSm')
        changeUIColors({})
    })
    
}

export function changeUIColors(palette) {
    palette.bg ? 
        document.documentElement.style.setProperty(`--backgroundColor`, palette.bg) : 
        document.documentElement.style.setProperty(`--backgroundColor`, '#3f3f44')

    palette.gb ? 
        document.documentElement.style.setProperty(`--gameBoardColor`, palette.gb) : 
        document.documentElement.style.setProperty(`--gameBoardColor`, '#f7f7f7')

    palette.snake ? 
        document.documentElement.style.setProperty(`--snakeColor`, palette.snake) : 
        document.documentElement.style.setProperty(`--snakeColor`, '#fca356')

    palette.food ? 
        document.documentElement.style.setProperty(`--foodColor`, palette.food) :
        document.documentElement.style.setProperty(`--foodColor`, '#cceabb')

    palette.hTxt ? 
        document.documentElement.style.setProperty(`--headingTextColor`, palette.hTxt) :
        document.documentElement.style.setProperty(`--headingTextColor`, 'firebrick')

    palette.sTxt ? 
        document.documentElement.style.setProperty(`--subTextColor`, palette.sTxt) : 
        document.documentElement.style.setProperty(`--subTextColor`, '#3f3f44')

    palette.btnTxt ? 
        document.documentElement.style.setProperty(`--buttonTextColor`, palette.btnTxt) : 
        document.documentElement.style.setProperty(`--buttonTextColor`, 'white')

    palette.border ? 
        document.documentElement.style.setProperty(`--borderColor`, palette.border) : 
        document.documentElement.style.setProperty(`--borderColor`, '#3f3f44')

    palette.btnBG ? 
        document.documentElement.style.setProperty(`--btnBackgroundColor`, palette.btnBG) :
        document.documentElement.style.setProperty(`--btnBackgroundColor`, 'linear-gradient(270deg, rgba(169,91,219,1) 0%, rgba(219,91,91,1) 24%, rgba(213,219,91,1) 50%, rgba(91,219,106,1) 76%, rgba(91,158,219,1) 100%)')

    palette.sliderThumb ? 
        document.documentElement.style.setProperty(`--sliderThumbColor`, palette.sliderThumb) : 
        document.documentElement.style.setProperty(`--sliderThumbColor`, 'black')

    palette.sliderTrack ? 
        document.documentElement.style.setProperty(`--sliderTrackColor`, palette.sliderTrack) : 
        document.documentElement.style.setProperty(`--sliderTrackColor`, '#30a98b')

}

export function setUserColors(lsColorData) {
    lsColorData == 'dColor' ? changeUIColors({ snake: '#1b6ca8', food: '#f3c623', hTxt: '#fb7813', btnBG: 'linear-gradient(270deg, #f3904f 0%, #3b4371 77%)', sliderTrack: '#1b6ca8' }) : 
    lsColorData == 'pColor' ? changeUIColors({snake: '#10375c', food: '#f3c623', hTxt: '#127681', btnBG: 'linear-gradient(90deg, #52ACFF 25%, #FFE32C 100%)', sliderTrack: '#1b6ca8' }) : 
    lsColorData == 'aColor' ? changeUIColors({ bg: 'black', gb: 'white', snake: 'gray', food: 'white', hTxt: 'black', sTxt: 'black', btnTxt: 'white', border: 'black', btnBG: 'linear-gradient(270deg, #000000 0%, #ffffff 50%, #000000 100%)', sliderTrack: 'black', sliderThumb: 'gray' }) : 
    lsColorData == 'tColor' ? changeUIColors({btnBG: 'linear-gradient(270deg, #fa5436 0%, #65ff79 100%)'}) : 
    changeUIColors({})
}

export function discoMode() {
    var colors = ['#b51D05', '#ed7627', '#ffdc40', '#73bd37', '#1d808b', '#fc3756', '#81217c', '#d13189']
    var bgC = getRandomNumber(colors.length)
    var gbC = getRandomNumber(colors.length)
    var snakeC = getRandomNumber(colors.length)
    var foodC = getRandomNumber(colors.length)

    changeUIColors({
        bg: colors[bgC], 
        gb: colors[gbC], 
        snake: colors[snakeC], 
        food: colors[foodC]
    })

    bgC = ((bgC + 1) < colors.length) ? bgC+1 : 0
    gbC = ((gbC + 1) < colors.length) ? gbC+1 : 0
    snakeC = ((snakeC + 1) < colors.length) ? snakeC+1 : 0
    foodC = ((foodC + 1) < colors.length) ? foodC+1 : 0

    function getRandomNumber(limit) {
        var num
        while(num === bgC || num === gbC || num === snakeC || num === foodC){
            num = Math.floor(Math.random() * limit)
        }
        return num
    }
}

export function isSettingsModalOpen() {
    return settingsModalOpen
}