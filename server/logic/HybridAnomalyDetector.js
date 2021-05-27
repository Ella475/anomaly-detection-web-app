const enclosingCircle = require("smallest-enclosing-circle");
const SimpleAnomalyDetector = require("./SimpleAnomalyDetector");

class HybridAnomalyDetector extends SimpleAnomalyDetector {
    constructor() {
        super();
    }

    // helper function for learning
    learnHelper(ts, p /*pearson*/, f1, f2, ps) {
        super.learnHelper(ts, p, f1, f2, ps);
        if (p > 0.5 && p < this.threshold) {
            let cl = enclosingCircle(ps);
            let c = new Object();
            c.feature1 = f1;
            c.feature2 = f2;
            c.correlation = p;
            c.threshold = cl.r * 1.1; // 10% increase
            c.cx = cl.x;
            c.cy = cl.y;
            this.cf.push(c);
        }
    }

    // is the new point an anomaly
    isAnomalous(x, y, c) {
        return (
            (c.correlation >= this.threshold && super.isAnomalous(x, y, c)) ||
            (c.correlation > 0.5 &&
                c.correlation < this.threshold &&
                Math.hypot(c.cx - x, c.cy - y) > c.threshold)
        );
    }

    // check deviation from line or circle
    deviation(x, y, c) {
        if (c.correlation >= this.threshold) return super.deviation(x, y, c);
        return Math.round(100 * (Math.hypot(c.cx - x, c.cy - y) / c.threshold));
    }
}

module.exports = HybridAnomalyDetector;
