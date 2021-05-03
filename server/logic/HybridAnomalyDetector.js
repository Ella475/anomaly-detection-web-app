const enclosingCircle = require('smallest-enclosing-circle')
const SimpleAnomalyDetector = require('./SimpleAnomalyDetector');
 
class HybridAnomalyDetector extends SimpleAnomalyDetector{
    constructor () {
        super();
    }
    
    learnHelper(ts,p/*pearson*/,f1, f2, ps){
        super.learnHelper(ts,p,f1,f2,ps);
        if(p>0.5 && p<this.threshold){
            let cl = enclosingCircle(ps);
            let c = new Object;
            c.feature1=f1;
            c.feature2=f2;
            c.corrlation=p;
            c.threshold=cl.r*1.1; // 10% increase
            c.cx=cl.x;
            c.cy=cl.y;
            this.cf.push(c);
        }
    }
    
    isAnomalous(x,y,c){
        return (c.corrlation>=this.threshold && super.isAnomalous(x,y,c)) ||
                (c.corrlation>0.5 && c.corrlation<this.threshold && Math.hypot(c.cx-x, c.cy-y)>c.threshold);
    }
}

module.exports = HybridAnomalyDetector;