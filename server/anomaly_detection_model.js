const TimeSeries = require("./logic/timeseries");
const SimpleAnomalyDetector = require("./logic/SimpleAnomalyDetector");
const HybridAnomalyDetector = require("./logic/HybridAnomalyDetector");

class anomaly_detection_model {
  constructor() {
    this.models = {};
    this.model_descriptors = {};
    this.pending_detections = {};
  }

  canOpenNewReq() {
    try {
      let counter = 0;
      for (let key in this.model_descriptors) {
        if (this.model_descriptors[key].status == "pending") {
          counter++;
        }
      }
      counter += Object.keys(this.pending_detections).length;
      if (counter >= 20) {
        return false;
      }
      return true;
    } catch (error) {
      return true;
    }
  }

  getTimezoneOffset() {
    function z(n) {
      return (n < 10 ? "0" : "") + n;
    }
    var offset = new Date().getTimezoneOffset();
    var sign = offset < 0 ? "+" : "-";
    offset = Math.abs(offset);
    return sign + z((offset / 60) | 0) + "." + z(offset % 60);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async learn_async(model_id, ts) {
    // this.sleep(10000);
    this.models[model_id].learnNormal(ts);
  }

  get_available_id() {
    if (Object.keys(this.models).length == 0) {
      return 0;
    }
    let max_key = Object.keys(this.models).reduce(function (a, b) {
      return a > b ? a : b;
    });
    return parseInt(max_key) + 1;
  }

  train_model(model_type, data) {
    let ts = new TimeSeries(data);
    let model;
    if (model_type == "hybrid") {
      model = new HybridAnomalyDetector();
    } else {
      model = new SimpleAnomalyDetector();
    }
    let model_id = this.get_available_id();
    let d = new Date();
    let model_date = d.toISOString().split(".", 1) + this.getTimezoneOffset();
    let status = "pending";
    this.model_descriptors[model_id] = {
      model_id: model_id,
      upload_time: model_date,
      status: status,
    };
    this.models[model_id] = model;

    this.learn_async(model_id, ts).then(() => {
      this.model_descriptors[model_id].status = "ready";
    });

    return this.model_descriptors[model_id];
  }

  get_model(model_id) {
    if (!(model_id in this.models)) {
      return null;
    }
    return this.model_descriptors[model_id];
  }

  delete_model(model_id) {
    if (!(model_id in this.models)) {
      return 0;
    }
    delete this.models[model_id];
    delete this.model_descriptors[model_id];
    return 1;
  }

  get_models() {
    let v = [];
    for (let key in this.model_descriptors) {
      v.push(this.model_descriptors[key]);
    }
    return v;
  }

  training_finished(model_id) {
    if (this.model_descriptors[model_id].status == "ready") return 1;
    return 0;
  }

  async detect_async(model_id, ts, detect_id) {
    // this.sleep(10000);
    this.pending_detections[detect_id] = this.models[model_id].detect(ts);
  }

  get_anomaly(model_id, predict_data, res) {
    let ts = new TimeSeries(predict_data);

    if (
      !this.models[model_id].attributes.every((val) =>
        ts.getAttributes().includes(val)
      )
    ) {
      return res.status(400).json({
        error: true,
        msg: `Can't match all attributes of train data`,
      });
    }

    let detect_id = Object.keys(this.pending_detections).length;
    this.pending_detections[detect_id] = 1;

    this.detect_async(model_id, ts, detect_id).then(() => {
      let result = this.pending_detections[detect_id];
      delete this.pending_detections[detect_id];
      res.status(200).json({ error: false, res: result });
    });
  }
}

module.exports = anomaly_detection_model;
