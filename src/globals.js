export class Globals {
    static #camX = 0;
    static #camY = 0;
    static #dt;
    static #fps;
    static #zoomFactor = 1;
    static #cubeWidth = 50;
    static #widthFactor = 1;
    static #selectedCube;
    static #angle = 0
    static #color = "red"

    static get color() {return this.#color}
    static set color(value) {return this.#color = value}

    static get dt() {return this.#dt}
    static set dt(value) {this.#dt = value}

    static get fps() {return this.#fps}
    static set fps(value) {this.#fps = 1/this.#dt}

    static get camX() {return this.#camX}
    static set camX(value) {this.#camX = value}
    
    static get camY() {return this.#camY}
    static set camY(value) {this.#camY = value}

    static get cubeWidth() {return this.#cubeWidth}
    static set cubeWidth(value) {this.#cubeWidth = value}

    static get zoomFactor() {return this.#zoomFactor}
    static set zoomFactor(value) {this.#zoomFactor = value}

    static get widthFactor() {return (this.#cubeWidth * this.#zoomFactor)}
    static set widthFactor(value) {this.#widthFactor = value}

    static get selectedCube() {return this.#selectedCube}
    static set selectedCube(value) {this.#selectedCube = value}

    static get angle() {return this.#angle}
    static set angle(value) {this.#angle = value}

    static get props() {
        return ({
                fps: Math.round(1/this.dt),
                camX: this.camX,
                camY: this.camY,
                zoomFactor: this.zoomFactor
            }
        )
    }
}