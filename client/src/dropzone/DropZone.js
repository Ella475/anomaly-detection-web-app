import React, { Component } from "react";
import approve from "../images/approve.png";
import error from "../images/error.png";
import loading from "../images/loading.png";

import "./DropZone.css";

// parse csv to json format
function parse_csv(csv_data) {
    // get lines
    var lines = csv_data.split("\r\n");
    // get headers
    var headers = lines[0].split(",");
    // get the columns and save them with a number in the beginning in order to indicate duplicate headers
    var result = {};
    for (var j = 0; j < headers.length; j++) {
        result[j.toString() + "_" + headers[j]] = [];
    }

    for (var i = 1; i < lines.length-1; i++) {
        var current_line = lines[i].split(",").map(x=>parseFloat(x));
        for (var k = 0; k < headers.length; k++) {
            result[k.toString() + "_" + headers[k]].push(current_line[k]);
        }
    }

    return result;
}

const dragOver = (e) => {
    e.preventDefault();
};

const dragEnter = (e) => {
    e.preventDefault();
};

const dragLeave = (e) => {
    e.preventDefault();
};

const fileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = ReadSuccess;
    function ReadSuccess(event) {
        var body = "";
        var params = "";
        var api_req = "";
        // get the icon
        var icon = e.target.getElementsByClassName("upload-icon")[0];
        if (!icon) {
            return;
        }
        // if the request was to the train flight
        if (e.target.id === "train") {
            var model_type =
                document.getElementsByClassName("detector_buttons").id;
            params = new URLSearchParams({ model_type: model_type });
            body = JSON.stringify({ train_data: parse_csv(reader.result) });
            api_req = "model";
        } else if (e.target.id === "anomaly") { // if the file is for anomaly
            var model_id = document.getElementsByClassName("dropbtn")[0].id;
            // set request details
            params = new URLSearchParams({ model_id: model_id });
            // convert to json file
            body = JSON.stringify({ predict_data: parse_csv(reader.result) });
            api_req = "anomaly";
        } else {
            return;
        }
        //add global item
        var json =  JSON.stringify(parse_csv(reader.result));
        window.localStorage.setItem("json_info", json);
        // Notify charts that we got new file
        var newFileevent = new CustomEvent("newFileEvent");
        window.dispatchEvent(newFileevent);
        // set loading image
        icon.style.background = "url(" + loading + ") no-repeat center center";
        icon.style.backgroundSize = "100%";

        // connect and send queries to the server
        var xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "http://localhost:9876/api/" + api_req + "?" + params,
            true
        );
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
        xhr.send(body);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // if the status is success is 200 ok
                var success = xhr.status === 200;
                // set image according to the request status
                if (success) {
                    icon.style.background =
                        "url(" + approve + ") no-repeat center center";
                } else {
                    icon.style.background =
                        "url(" + error + ") no-repeat center center";
                }

                // anyway
                icon.style.backgroundSize = "100%";

                var response_json = JSON.parse(xhr.response);
                if (e.target.id === "train") {
                    // Add model_id to model_list
                    var model_list_element =
                        document.getElementsByClassName("simplebar-content")[0];
                    var new_model_id_element = document.createElement("a");
                    new_model_id_element.href = "#";
                    new_model_id_element.text =
                        document.getElementsByClassName("detector_buttons").id +
                        ": " +
                        response_json["model"]["model_id"] + " - pending";
                        // handel choosing something from the list of the models
                    new_model_id_element.onclick = function (e) {
                        e.preventDefault();
                        // change dropbtn-id according to the model that chosen in order to save it
                        document.getElementsByClassName("dropbtn")[0].id =
                            response_json["model"]["model_id"];
                    };
                    // add to list
                    model_list_element.appendChild(new_model_id_element);
                } else if (e.target.id === "anomaly") {
                    // Save result in local storage
                    window.localStorage.setItem("detected_anomalies_json", JSON.stringify(response_json["res"]));

                    // Notify graphs that we got the anomalies
                    var event = new CustomEvent("anomaliesDetected");
                    window.dispatchEvent(event);
                }
            }
        };
    }
    reader.readAsText(file);
};
// Define drag and drop area
class DropZone extends Component {
    render() {
        return (
            <div className="container">
                <div
                    className="drop-container"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                >
                    <div id={this.props.id} className="drop-message">
                        <div className="upload-icon" />
                        Drag & Drop files here
                    </div>
                </div>
            </div>
        );
    }
}

export default DropZone;