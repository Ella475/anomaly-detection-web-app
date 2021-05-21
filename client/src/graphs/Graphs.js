import React, { Component } from "react";

function createGraphData() {
    var anomaly_json = JSON.parse(window.localStorage.getItem("anomaly_json"));
    var detected_anomalies_json = JSON.parse(window.localStorage.getItem("detected_anomalies_json"));
    // More code :)
    // Parse anomalies data
    alert("Hello from graphs!");
}

class Graphs extends Component {
    render() {
        window.addEventListener("anomaliesDetected", createGraphData);

        return (
            <div>
                {/* 
                Add graph HTML
                 */}
            </div>
        )
    }
}

export default Graphs;
