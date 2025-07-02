import { Setup } from "./setup.js"
import { Globals } from "./globals.js"

class Game {

    constructor() {
        this.setup = new Setup()
        this.previousTime = performance.now()
        this.run()
    }
    
    run = () => {
        const currentTime = performance.now()
        Globals.dt = (currentTime - this.previousTime) / 1000
        this.previousTime = currentTime
        this.setup.run()
        requestAnimationFrame(this.run)
    }   
}

window.addEventListener("DOMContentLoaded", () => {new Game()})