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

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches(".dropbtn")) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    };

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
                        <div className="model_list">
                            <div className="dropdown">
                                <button
                                    onClick={myFunction}
                                    className="dropbtn"
                                >
                                    Model List
                                </button>
                                <div
                                    id="myDropdown"
                                    className="dropdown-content"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;
