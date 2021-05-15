import React from "react";
import DropZone from "./dropzone/DropZone";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
    function handleClick(e) {
        e.preventDefault();
        document.getElementsByClassName("detector_buttons").id =
            e.target.innerText.toLowerCase();
    }

    return (
        <div>
            <p className="title">Upload CSV files</p>
            <div className="content">
                <div className="row">
                    <div className="column">
                        <p id="train" className="drop-box-title">
                            Train File
                        </p>
                        <DropZone id={"train"} />
                        <div className="detector_buttons" id="">
                            <Button variant="primary" onClick={handleClick}>
                                Regression
                            </Button>{" "}
                            <Button variant="primary" onClick={handleClick}>
                                Hybrid
                            </Button>{" "}
                        </div>
                    </div>
                    <div className="column">
                        <p className="drop-box-title">Anomaly File</p>
                        <DropZone id={"anomaly"} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;
