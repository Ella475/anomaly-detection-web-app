import React from "react";
import DropZone from "./dropzone/DropZone";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import "./App.css";
import Charts from "./charts/Charts";

function App() {
    function handleClick(e) {
        e.preventDefault();
        document.getElementsByClassName("detector_buttons").id =
            e.target.innerText.toLowerCase();
    }

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:9876/api/models", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
        xhr.setRequestHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }

            var response_json = JSON.parse(xhr.response);
            var model_list_element =
                document.getElementsByClassName("dropdown")[0].getElementsByClassName("simplebar-content")[0];
            for (var i = 0; i < model_list_element.children.length; i++) {
                var text =
                    model_list_element.children[i].innerText.split(" - ")[0];
                var model_id = parseInt(
                    model_list_element.children[i].innerText.split(" ")[1]
                );

                for (var j = 0; j < response_json["models"].length; j++) {
                    if (response_json["models"][j]["model_id"] === model_id) {
                        text += " - " + response_json["models"][j]["status"];
                        break;
                    }
                }

                model_list_element.children[i].innerText = text;
            }

            document.getElementById("myDropdown").classList.toggle("show");
        };
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

                                <SimpleBar
                                    id="myDropdown"
                                    className="dropdown-content"
                                >
                                    {/* 
                                    This empty div MUST be here, otherwise inner divs of SimpleBar
                                    Are not created.
                                     */}
                                    <div></div>
                                </SimpleBar>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <Charts />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;
