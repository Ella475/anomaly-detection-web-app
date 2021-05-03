const express = require('express');
const bp = require('body-parser');

const anomaly_detection_model = require('./anomaly_detection_model.js');
const adm = new anomaly_detection_model();

const app = express();
app.use(bp.json());

app.get('/', (req, res) => {
    res.send('Hello')
})

app.post('/api/model', (req, res) => {
    const model_type = req.query.model_type;
    if (model_type != 'hybrid' && model_type != 'regression') {
        return res.status(400).json({error: true, msg: 'Please choose one of the following model types: hybrid/regression'});
    }

    const train_data = req.body.train_data;
    res.status(200).json({error: false, model: adm.train_model(model_type, train_data)});
})

app.get('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    let model = adm.get_model(model_id);
    if (model == null) {
        return res.status(404).json({error: true, msg: `Could'nt find model with id: ${model_id}`});
    }
    res.status(200).json({error: false, model: model});
})

app.delete('/api/model', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    if (!adm.delete_model(model_id)) {
        return res.status(404).json({error: true, msg: `Could'nt find model with id: ${model_id}`});
    }
    res.status(200).json({error: false});
})

app.get('/api/models', (req, res) => {
    res.status(200).json({error: false, models: adm.get_models()});
})

app.post('/api/anomaly', (req, res) => {
    const model_id = parseInt(req.query.model_id);
    const predict_data = req.body.predict_data;

    if (!adm.training_finished(model_id)) {
        return res.redirect(303, `/api/model?model_id=${model_id}`)
    }
    res.status(200).json({error: false, anomaly: adm.get_anomaly(model_id, predict_data)});
})



const port = 9876;
let server = app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`)
});

