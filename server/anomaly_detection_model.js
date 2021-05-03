const TimeSeries = require('./logic/timeseries');
const SimpleAnomalyDetector = require('./logic/SimpleAnomalyDetector');
const HybridAnomalyDetector = require('./logic/HybridAnomalyDetector');

class anomaly_detection_model{
    constructor() {
        this.models = {};
        this.model_descriptors = {};
        this.pids = [];
    }

    getTimezoneOffset() {
        function z(n){return (n<10? '0' : '') + n}
        var offset = new Date().getTimezoneOffset();
        var sign = offset < 0? '+' : '-';
        offset = Math.abs(offset);
        return sign + z(offset/60 | 0)+ '.' + z(offset%60);
      }

    train_model(model_type, data) {
        let ts = new TimeSeries(data);
        let model;
        if (model_type == 'hybrid') {
            model = new HybridAnomalyDetector();
        }
        else {
            model = new SimpleAnomalyDetector();
        }
        model.learnNormal(ts);
        let model_id = Object.keys(this.models).length;
        let d = new Date();
        let model_date = d.toISOString().split('.', 1) + this.getTimezoneOffset();
        let status = 'ready';
        this.models[model_id] = model;
        this.model_descriptors[model_id] = {model_id: model_id, upload_time: model_date, status: status};
        return this.model_descriptors[model_id];
    };
    
    get_model(model_id) {
        if(!(model_id in this.models)) {
            return null;
        }
        return this.model_descriptors[model_id];
    };
    
    delete_model(model_id) {
        if(!(model_id in this.models)) {
            return 0;
        }
        delete this.models[model_id];
        delete this.model_descriptors[model_id];
        return 1;
    };
    
    get_models() {
        let v = [];
        for (let key in this.model_descriptors) {
            v.push(this.model_descriptors[key]);
        }
        return v;
    };
    
    training_finished(model_id) {
        return 1;
    };
    
    get_anomaly(model_id, predict_data) {
        let ts = new TimeSeries(predict_data);
        return this.models[model_id].detect(ts);
    };
}

module.exports = anomaly_detection_model;