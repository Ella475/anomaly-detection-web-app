# Anomaly Detection WebApp

Our web-based application provides anomaly detection algorithms for different consumers who want to test their data.

## Client

### Training And Detecting

In order to train a model, first choose a type of anomaly-detector (Regression \ Hybrid).<br />
Then, drag and drop off your file into the left box. You can see the status of your request
inside - according to the picture.<br /> Finally, in order to run the anomaly detection, choose a
model from the model list (which is arranged in numerical order) and then upload your anomaly-file
to the right box.

### Graphical Representation

When you upload a train file the features list is updated. You can choose a feature from the list, and the graph and the table will display its data.<br />
After uploading an anomaly file the feature's data will be updated according to the new file, if anomalies were detected they will be marked in red.<br />
In order to see the reason for the anomalies, drag the mouse over the red points or look at the last row of the table.

### Main Files
the "src" folder contains two main folders - dropZone and charts, and additional files such as app.js, app.css and package.json. 

## Server
The server implements a RESTful api. <br/>
more details on the api can be found in:
[api](server/images/api.PNG)<br/>
[api-data-types](server/images/api2.png)<br/>

### Main Files
app.js contains the implementation of the api.<br/>
the folder "logic" conatains the code for the the algorithm that learns a new model, and detect anomalies on it.<br/>
anomaly_detection_model.js connects the api to the logic and creates an asyncrnoic functions for learning and detecting animalies.


## Installations

1. Clone the repository
```bash
git clone https://github.com/Ella475/anomaly-detection-web-app.git .
```

2. Install nodejs <br/>[click to download](https://nodejs.org/en/)<br/>

3. Install yarn
```bash
npm install -g yarn
```

4. Install all of the dependencies (inside directory of package.json)
```bash
pushd server; npm install; popd
pushd client; yarn install; popd
``` 


## Running The Application
### In two different terminals

Run the server
```bash
cd server; npm start
```

Run the client
```bash
cd client; yarn start
```

## Links

[uml diagram](https://github.com/Ella475/anomaly-detection-web-app/blob/master/uml.png)<br/>
[a short video that shows how to use the app](https://streamable.com/rl07wj)<br/>
