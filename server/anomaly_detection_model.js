const TimeSeries = require("./logic/timeseries");
const SimpleAnomalyDetector = require("./logic/SimpleAnomalyDetector");
const HybridAnomalyDetector = require("./logic/HybridAnomalyDetector");

class anomaly_detection_model {
  constructor() {
    // dict of all the models
    this.models = {};
    // dict of descriptions of the models
    this.model_descriptors = {};
    // list of anomaly requests that are still running
    this.pending_detections = {};
  }

  // check if the number of open requests (train and detection) is less than 20
  canOpenNewReq() {
    try {
      let counter = 0;
      // check number of models that are still learning
      for (let key in this.model_descriptors) {
        if (this.model_descriptors[key].status == "pending") {
          counter++;
        }
      }
      // check number of detection requests still running
      counter += Object.keys(this.pending_detections).length;
      if (counter >= 20) {
        return false;
      }
      return true;
    } catch (error) {
      // if no running requests return true
      return true;
    }
  }

  // return the reqiured time in the reqiured format
  getTimezoneOffset() {
    function z(n) {
      return (n < 10 ? "0" : "") + n;
    }
    var offset = new Date().getTimezoneOffset();
    var sign = offset < 0 ? "+" : "-";
    offset = Math.abs(offset);
    return sign + z((offset / 60) | 0) + "." + z(offset % 60);
  }

  // run the program for ms miliseconds
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // learn asyncronicly a model
  async learn_async(model_id, ts) {
    // await this.sleep(5000);
    this.models[model_id].learnNormal(ts);
  }

  // check next available id for a model
  get_available_id() {
    if (Object.keys(this.models).length == 0) {
      return 0;
    }
    // find current max id
    let max_key = Object.keys(this.models).reduce(function (a, b) {
      return a > b ? a : b;
    });
    return parseInt(max_key) + 1;
  }

  // train a new model
  train_model(model_type, data) {
    // turn data to timeseries
    let ts = new TimeSeries(data);
    let model;
    // create model
    if (model_type == "hybrid") {
      model = new HybridAnomalyDetector();
    } else {
      model = new SimpleAnomalyDetector();
    }
    // get id
    let model_id = this.get_available_id();
    let d = new Date();
    let model_date = d.toISOString().split(".", 1) + this.getTimezoneOffset();
    let status = "pending";
    // create a new description for the model
    this.model_descriptors[model_id] = {
      model_id: model_id,
      upload_time: model_date,
      status: status,
    };
    this.models[model_id] = model;

    // after finishing training change status to ready
    this.learn_async(model_id, ts).then(() => {
      this.model_descriptors[model_id].status = "ready";
    });

    return this.model_descriptors[model_id];
  }

  // return model by model id
  get_model(model_id) {
    if (!(model_id in this.models)) {
      return null;
    }
    return this.model_descriptors[model_id];
  }

  // delete model from models dict
  delete_model(model_id) {
    if (!(model_id in this.models)) {
      return 0;
    }
    delete this.models[model_id];
    delete this.model_descriptors[model_id];
    return 1;
  }

  // return list of all models
  get_models() {
    let v = [];
    for (let key in this.model_descriptors) {
      v.push(this.model_descriptors[key]);
    }
    return v;
  }

  // check if model finished training
  training_finished(model_id) {
    if (this.model_descriptors[model_id].status == "ready") return 1;
    return 0;
  }

  // detect asyncronicaly to allow other requests to be answered by the server
  async detect_async(model_id, ts, detect_id) {
    // await this.sleep(5000);
    this.pending_detections[detect_id] = this.models[model_id].detect(ts);
  }

  // find anomalies in new data
  get_anomaly(model_id, predict_data, res) {
    let ts = new TimeSeries(predict_data);

    // check all attributes of train are in test
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

    // after detection return anomalies
    this.detect_async(model_id, ts, detect_id).then(() => {
      let result = this.pending_detections[detect_id];
      delete this.pending_detections[detect_id];
      res.status(200).json({ error: false, res: result });
    });
  }
}

module.exports = anomaly_detection_model;
