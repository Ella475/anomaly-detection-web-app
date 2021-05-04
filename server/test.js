const TimeSeries = require('./logic/timeseries');
const SimpleAnomalyDetector = require('./logic/SimpleAnomalyDetector');
const HybridAnomalyDetector = require('./logic/HybridAnomalyDetector');
const enclosingCircle = require('smallest-enclosing-circle')

data = {time: [1, 2, 3, 4], speed: [20, 23, 23, 29], air: [1, 2, 3, 5], roll: [15, 20, 15, 21]};
let ts = new TimeSeries(data);
// let sad = new SimpleAnomalyDetector();
// sad.learnNormal(ts);

data2 = {time: [1, 2, 3, 4], speed: [20, 23, 50, 29], air: [1, 2, 3, 300], roll: [15, 100, 15, 21], pitch: [15, 100, 15, 21]};
let ts2 = new TimeSeries(data2);
// sad.detect(ts2);
// console.log(sad.cf);

// console.log(enclosingCircle([{x: 0, y: 0}, {x: 10, y: 10}, {x: 20, y: 20}, {x: 40, y: 40}]));
let had = new HybridAnomalyDetector();
had.learnNormal(ts);
had.detect(ts2);
console.log('hi');
