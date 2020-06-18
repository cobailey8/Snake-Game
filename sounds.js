export const DEFAULT_VOLUME = .3
export const GAME_VOLUME = localStorage.getItem('volume') || DEFAULT_VOLUME

export let Sounds = {
    gameVolume: .3,

    /* Audio files from https://www.zapsplat.com/ 

        Since the free-tier audio files from zapsplat havent been equalized, certian sounds
        are louder than others. 

        The temporary solution implemented here was to set the .volume attribute to the gameVolume
        attribute divided by some constant number depending on how much louder the sound was.
            
            example: 'eatAud.volume = this.gameVolume/2 || 0' would cut the max volume in half

        In the future, plan to take the .mp3 files and put them through an equalizer. For now 
        though, this solution is adequate.

    */
    eatAud: new Audio('./audioFiles/coin.mp3'),
    gameOverAud: new Audio('./audioFiles/gameOver.mp3'),
    highScoreAud: new Audio('./audioFiles/highScore.mp3'),
    moveAud: new Audio('./audioFiles/move.mp3'),
    startAud: new Audio('./audioFiles/start.mp3'),
    turnAud: new Audio('./audioFiles/turn.mp3'),
    btnClickAud: new Audio('./audioFiles/buttonClick.mp3'),
    errorAud: new Audio('./audioFiles/error.mp3'),
    discoMusicAud: new Audio('./audioFiles/discoMusic.mp3'),

    eat() {
        this.eatAud.volume = this.gameVolume/2 || 0     // Equalized by 1/2
        this.eatAud.play()
    },

    gameOver() {
        this.gameOverAud.volume = this.gameVolume
        this.gameOverAud.play()
    },

    highScore() { 
        this.highScoreAud.volume = this.gameVolume
        this.highScoreAud.play()
    },

    move() { 
        this.moveAud.playbackRate = 4
        this.moveAud.volume = this.gameVolume/4 || 0    // Equalized by 1/4
        this.moveAud.play()
    },

    start() { 
        this.startAud.volume = this.gameVolume
        this.startAud.play()
    },

    turn() { 
        this.turnAud.playbackRate = 4
        this.turnAud.volume = this.gameVolume/3 || 0    // Equalized by 1/3
        this.turnAud.play()
    },

    buttonClick() { 
        this.btnClickAud.volume = this.gameVolume/2 || 0    // Equalized by 1/2
        this.btnClickAud.play()
    },

    error() { 
        this.errorAud.volume = this.gameVolume
        this.errorAud.play()
    },

    soundTest(vol){ 
        var test = new Audio('./audioFiles/volumeTest.mp3')
        test.volume = vol;
        test.play()
    },

    discoMusic() {
        this.discoMusicAud.play()
        this.discoMusicAud.loop = true
    },

    discoMusicPause() {
        this.discoMusicAud.pause()
    },

    setGameVolume(vol){
        
        this.gameVolume = vol
        
    }
    
}