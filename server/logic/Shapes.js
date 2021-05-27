// create a line
class Line {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    // return y value at point x
    f(x) {
        return this.a * x + this.b;
    }
}

module.exports = Line;
