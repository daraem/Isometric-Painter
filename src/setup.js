import { Draw } from "./draw.js"
import { Mouse } from "./mouse.js"
import { Camera } from "./camera.js"
import { Globals } from "./globals.js"

export class Setup {
    constructor() {
        this.colors = ["black", "red", "green", "blue", "yellow", "white"]
        this.colorSelector = 0

        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext('2d')
        this.draw = new Draw(this.ctx)
        this.setup()
    }

    setup() {
        window.addEventListener("resize", () => {
            this.resizeWindow()
        })
        this.resizeWindow()
        Mouse.init()
        Camera.init(this.global)
    }

    resizeWindow() {
        let h = window.innerHeight
        let w = window.innerWidth
        this.canvas.width = w
        this.canvas.height = h
    }

    run() {
        Mouse.update()
        Globals.color = this.colors[this.colorSelector]
        if(Mouse.justPressed[0] && Mouse.justPressed[1]) {
            this.colorSelector += 1
            if(this.colorSelector >= this.colors.length) {
                this.colorSelector = 0
            }
        }
        this.draw.clearRect(this.canvas.width, this.canvas.height)
        this.draw.customShape(window.innerWidth, window.innerHeight)
        this.draw.drawRect((Mouse.justPressed[0] && !Mouse.justPressed[1]))
        this.draw.drawPosGrid(Mouse.x, Mouse.y)
    }
} 