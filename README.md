# Anomaly Detection WebApp

## Installation
1. Clone the repository
```bash
git clone https://github.com/Ella475/anomaly-detection-web-app.git
```

2. Install nodejs
```bash
sudo apt install nodejs
```

3. Install npm package manager
```bash
sudo apt install npm
```

4. Install all of the dependencies (inside directory of package.json)
```bash
pushd server; npm install; popd
pushd client; npm install; popd
```

5. Install yarn
```bash
sudo npm install -g yarn
```

## Client

### Training And Detecting

In order to train a model, first choose a type of anomaly-detector (Regression \ Hybrid).<br />
Then, drag and drop off your file into the left box. You can see the status of your request
inside - according to the picture.<br /> Finally, in order to run the anomaly detection, choose a
model from the model list (which is arranged in numerical order) and then upload your anomaly-file
to the right box.

### Graphs And Tables

## Running The Application
# In two different terminals:
Run the server
```bash
cd server; npm start
```

Run the client
```bash
cd client; yarn start
```