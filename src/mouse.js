export class Mouse {
    static x;
    static y;

    static _isDown = false;
    static _wasPressed = false;
    static _justPressed = false;
    static _isRight = false

    static init() {
        window.addEventListener("mousemove", this.mousemove)
        window.addEventListener("mousedown", this.mousedown)
        window.addEventListener("mouseup", this.mouseup)
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        })
    }

    static set pos({x, y}) {this.x = x; this.y = y}
    static get pos() { return {x:this.x, y:this.y}}

    static set isDown(b) {this._isDown = b}
    static get isDown() {return this._isDown}

    static set isRight(value) {this._isRight = value}
    static get isRight() {return this._isRight}

    static get justPressed() {return [this._justPressed, this._isRight]}

    static update() {
        this._justPressed = !this._wasPressed && this.isDown
        this._wasPressed = this.isDown
    }

    static mousemove = (e) => {
        this.pos = {x: e.pageX, y:e.pageY}
    }

    static mousedown = (e) => {
        if(!this._isDown && e.button != 2) {
            this._isDown = true
            this.isRight = false
        } else if (!this._isDown && e.button == 2) {
            this._isRight = true
            this._isDown = true
        }
    }

    static mouseup = () => {
        this._isDown = false
    }
}