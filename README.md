# Anomaly Detection WebApp

## Server

## Client

### Training And Detecting

In order to train a model, first choose a type of anomaly-detector (Regression \ Hybrid).<br />
Then, drag and drop off your file into the left box. You can see the status of your request
inside - according to the picture.<br /> Finally, in order to run the anomaly detection, choose a
model from the model list (which is arranged in numerical order) and then upload your anomaly-file
to the right box.

### Graphical representation

When you upload a train file the features list is updated. You can choose a feature from the list, and the graph and the table will display its data.<br />
After uploading an anomaly file the feature's data will be updated according to the new file, if anomalies were detected they will be marked in red.<br />
In order to see the reason for the anomalies, drag the mouse over the red points or look at the last row of the table.

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
