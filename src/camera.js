import { Globals } from "./globals.js"

export class Camera {
    static init() {
        window.addEventListener("keydown", this.onKeyDown)
        window.addEventListener("keyup", this.onKeyUp)
        window.addEventListener("wheel", this.onWheel)
    }

    static onKeyDown = (e) => {
        switch (e.key) {
            case "ArrowRight":
                Globals.camX = -10
                break;

            case "ArrowLeft":
                Globals.camX = 10
                break;

            case "ArrowDown":
                Globals.camY = -10
                break;

            case "ArrowUp":
                Globals.camY = 10
                break;
            case "q":
                Globals.angle = 1
                break;
            case "e":
                Globals.angle = -1
                break;
        }
    }
    
    static onKeyUp = (e) => {
        switch (e.key) {
            case "ArrowRight":
                Globals.camX = 0 
                break;

            case "ArrowLeft":
                Globals.camX = 0
                break;

            case "ArrowDown":
                Globals.camY = 0
                break;

            case "ArrowUp":
                Globals.camY = 0
                break;
            case "q":
                Globals.angle = 0
                break;
            case "e":
                Globals.angle = 0
                break;
        }
    }

    static onWheel = (e) => {
        if(e.deltaY > 0 && Globals.zoomFactor > 0.25) {
            Globals.zoomFactor -= 0.25
        } else if (e.deltaY < 0 && Globals.zoomFactor < 2) {
            Globals.zoomFactor += 0.25
        } 
    }
}