# Snake-Game

## The classic game "Snake" developed using vanilla Javascript:exclamation:


### **:speaker: AUDIO:**
  - **All audio acquired from: :link:** [ZapSplat](https://www.zapsplat.com/)
  - **Only optimized for Chrome Browser at the moment.**
  - **:warning:_DOMException_ encountered durring runtime is due to the browser requiring user interaction for audio.play() actions. _This does not affect gameplay_.**

  **Since the free-tier audio files from zapsplat havent been equalized, certian sounds are louder than others. 
For now, audio is equalized using the the Audio object's `.volume` property. In the future, I plan to equalize the .mp3 files. For now though, this solution is adequate.**


### **:black_square_button: MODAL CONTROL:**

  - **DOM manipulation was done in JS in order to clean up the HTML.**
      - **"Why didnt you just use a framework like React, Angular, Vue, etc.???"**
          - Well, that wouldnt be vanilla JS anymore, would it?
          - I also have plans to add a seperate version using React, but the goal was to try to see what I could do with strictly vanilla JS.
  - **settings.js contains controls for settings modal, and modal.js holds all other modal types (settings modal function was getting bulky, so I moved it to its own file.).**
     - modal.js: `introModal()`, `gameOverUI()`, `pauseUI()`, `confirmUI()`
     - settings.js: `toggleSettingsUI()`, `accessibilityUI()`, `changeUIColors()`
  - **Modal paging controlled by the `uiTraversal` array.**
      - This allows for a cleaner DOM by reusing the same element and changing modal content depending on user actions.
  - **All modals share the same DOM parents in the markup which are modified when a modal is requested by the user:**
      - ```
          <div id="modalBG"> 
            <div id="game-modal"></div> 
          </div>
        ```
      
      
### **:space_invader: GAME MECHANICS:**

  - **Game Loop:**
      - Code for the game loop was pulled from a YouTube video by the user :link:[Web Dev Simplified](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw). I have modified the game loop to my needs, but for the most part, the mechanics are the same.
      - Each time the game loop runs, several key components are updated:
          - The gameOver var is checked 
          - Disco Mode strobing affect is controlled if the user has activated it.
          - The main function is called by requesting an animation frame (continuing the game loop)
          - The game board is updated using the `update()` function and displayed using the `draw()` function.



### **:globe_with_meridians: SETTINGS & Accessibility:**
  - **Settings accessible from `introModal()`, `gameOverUI()`, and `pauseUI()`**
  - **Available Settings:**
      - Volume (default = 30%)
      - Scoreboard: (default = true) show/hide scoreboard
      - Snake Speed: causes the snake to move every x game loops (default = 7).
      - Expansion Rate: How many blocks are added to the snake each time the user collects food (default = 1 block per food eaten).
      - Set Defaults: clears local storage `localStorage.clear()` and sets all settings to default settings.
      - Accessibility: Opens accessibility pannel where the user can choose from 4 other color palates depending on what type of colorblindness they have.


### **:gem: Easter Eggs:**

  - **Disco Mode:**
      - Activated by pressing the 'd' button on your keyboard durring gameplay. 
      - **DISCLAIMER: EPILEPSY WARNING!** Causes the game board and game pieces to rapidly change colors which may be disorienting to some users.
      - :musical_note: by [ZapSplat](https://www.zapsplat.com/)


### **:mailbox: Memory/Storage:**

  - **localStorage:**
      - **_DISCLAIMER:_ For now, localStorage is extremely basic and is NOT stored as a JSON object. This was for testing purposes and I haven't gotten around to bundling it.**
      - **Local storage may contain the following values:**
          - 'accessibility' : holds a value that represents what color mode the user has set. Current values that are reflected as settings are 'dColor', 'pColor', 'aColor', and 'tColor' 
          - 'highScore' : Holds a value representing the highest score the user has achieved in game that the user has saved in settings.
          - 'showScoreboard' : boolean value for whether or not the scoreboard is shown in game that the user has saved in settings.
          - 'snakeExpansionRate' : Holds a numerical value representing the snake's expansion rate that the user has saved in settings.
          - 'snakeSpeed' : Holds a numberical value representing the number of ticks per second the snake will move that the user has saved in settings.
          - 'volume' : Holds a numerical value representing the volume divided by 100 that the user has saved in settings.
  - **sessionStorage**
      - *Mostly used to keep track of modals and improve HCI.*
      - *Session Storage may contain the following values:*
        - 'greet' : Boolean value used for the system to decide wether or not to display the greeting modal on page load.






