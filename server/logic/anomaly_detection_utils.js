const Line = require("./Shapes");

function avg(x, size) {
    let sum = 0;
    for (let i = 0; i < size; sum += x[i], i++);
    return sum / size;
}

// returns the variance of X and Y
function variance(x, size) {
    let av = avg(x, size);
    let sum = 0;
    for (let i = 0; i < size; i++) {
        sum += x[i] * x[i];
    }
    return sum / size - av * av;
}

// returns the covariance of X and Y
function cov(x, y, size) {
    let sum = 0;
    for (let i = 0; i < size; i++) {
        sum += x[i] * y[i];
    }
    sum /= size;

    return sum - avg(x, size) * avg(y, size);
}

// returns the Pearson correlation coefficient of X and Y
exports.pearson = function (x, y, size) {
    return (
        cov(x, y, size) /
        (Math.sqrt(variance(x, size)) * Math.sqrt(variance(y, size)))
    );
};

// performs a linear regression and returns the line equation
exports.linear_reg = function (points, size) {
    let x = [];
    let y = [];
    for (let i = 0; i < size; i++) {
        x[i] = points[i].x;
        y[i] = points[i].y;
    }
    let a = cov(x, y, size) / variance(x, size);
    let b = avg(y, size) - a * avg(x, size);

    return new Line(a, b);
};

// returns the deviation between point p and the line equation of the points
exports.dev = function (p, points, size) {
    let l = linear_reg(points, size);
    return dev(p, l);
};

// returns the deviation between point p and the line
exports.dev = function (p, l) {
    return abs(p.y - l.f(p.x));
};
