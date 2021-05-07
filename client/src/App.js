import React from 'react';
import DropZone from "./dropzone/DropZone";

import './App.css';

function App() {
  return (
    <div>
        <p className="title">Upload CSV files</p>
        <div className="content">
          <div className="row">
            <div className="column">
              <p id="train" className="drop-box-title">Train File</p>
              <DropZone />
            </div>
            <div className="column">
              <p className="drop-box-title">Anomaly File</p>
              <DropZone />
            </div>
          </div>
        </div>
    </div>
  );
}
export default App;
