const { pearson, linear_reg } = require("./anomaly_detection_utils");

class SimpleAnomalyDetector {
    constructor() {
        this.cf = [];
        this.threshold = 0.9;
        this.attributes;
    }

    toPoints(x, y) {
        let ps = [];
        for (let i = 0; i < x.length; i++) {
            ps.push({ x: x[i], y: y[i] });
        }
        return ps;
    }

    findThreshold(ps, len, rl) {
        let max = 0;
        for (let i = 0; i < len; i++) {
            let d = Math.abs(ps[i].y - rl.f(ps[i].x));
            if (d > max) max = d;
        }
        return max;
    }

    learnNormal(ts) {
        this.attributes = ts.getAttributes();
        let atts = this.attributes;
        let len = ts.getRowSize();
        let vals = Array.from(Array(atts.length), () => new Array(len));
        for (let i = 0; i < atts.length; i++) {
            let x = ts.getAttributeData(atts[i]);
            for (let j = 0; j < len; j++) {
                vals[i][j] = x[j];
            }
        }

        for (let i = 0; i < atts.length; i++) {
            let f1 = atts[i];
            let max = 0;
            let jmax = 0;
            for (let j = i + 1; j < atts.length; j++) {
                let p = Math.abs(pearson(vals[i], vals[j], len));
                if (p > max) {
                    max = p;
                    jmax = j;
                }
            }
            let f2 = atts[jmax];
            let ps = this.toPoints(
                ts.getAttributeData(f1),
                ts.getAttributeData(f2)
            );
            this.learnHelper(ts, max, f1, f2, ps);
        }
    }

    learnHelper(ts, p /*pearson*/, f1, f2, ps) {
        if (p > this.threshold) {
            let len = ts.getRowSize();
            let c = new Object();
            c.feature1 = f1;
            c.feature2 = f2;
            c.corrlation = p;
            c.lin_reg = linear_reg(ps, len);
            c.threshold = this.findThreshold(ps, len, c.lin_reg) * 1.1; // 10% increase
            this.cf.push(c);
        }
    }

    arToSpan(ar) {
        let startTimes = [];
        let endTimes = [];
        let descriptions = [];
        let description;

        let prevTimeStep;
        let sequence = false;
        for (const anomaly of ar) {
            if (!sequence) {
                startTimes.push(anomaly.timeStep);
                description = anomaly.description;
                descriptions.push(description);
                sequence = true;
            } else if (
                anomaly.description != description ||
                anomaly.timeStep != prevTimeStep + 1
            ) {
                startTimes.push(anomaly.timeStep);
                description = anomaly.description;
                descriptions.push(description);
                endTimes.push(prevTimeStep + 1);
            }
            prevTimeStep = anomaly.timeStep;
        }
        endTimes.push(prevTimeStep + 1);

        let anomalies = {};
        let reason = {};

        for (const attr of this.attributes) {
            anomalies[attr] = [];
            reason[attr] = [];
        }

        for (let i = 0; i < startTimes.length; i++) {
            description = descriptions[i];
            let f1 = description.f1;
            let f2 = description.f2;

            let span = [startTimes[i], endTimes[i]];

            anomalies[f1].push(span);
            reason[f1].push({
                correlated_feature: f2,
                correlation: description.correlation,
                correlation_type: description.type,
                span_starting_deviation: description.deviation + "%",
            });

            anomalies[f2].push(span);
            reason[f2].push({
                correlated_feature: f1,
                correlation: description.correlation,
                correlation_type: description.type,
                span_starting_deviation: description.deviation + "%",
            });
        }
        return { anomalies: anomalies, reason: reason };
    }

    detect(ts) {
        let v = [];
        for (const c of this.cf) {
            let x = ts.getAttributeData(c.feature1);
            let y = ts.getAttributeData(c.feature2);

            let type;
            if (c.hasOwnProperty("lin_reg")) {
                type = "linear";
            } else {
                type = "scatter";
            }

            for (let i = 0; i < x.length; i++) {
                if (this.isAnomalous(x[i], y[i], c)) {
                    let d = {
                        f1: c.feature1,
                        f2: c.feature2,
                        type: type,
                        correlation: c.correlation,
                        deviation: this.deviation(x[i], y[i], c),
                    };
                    v.push({ description: d, timeStep: i + 1 });
                }
            }
        }
        return this.arToSpan(v);
    }

    isAnomalous(x, y, c) {
        return Math.abs(y - c.lin_reg.f(x)) > c.threshold;
    }

    deviation(x, y, c) {
        return Math.round(100 * (Math.abs(y - c.lin_reg.f(x)) / c.threshold));
    }
}

module.exports = SimpleAnomalyDetector;
