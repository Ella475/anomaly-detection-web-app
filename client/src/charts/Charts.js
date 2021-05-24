import React, { Component } from "react";

import { Line } from 'react-chartjs-2'

import "./Charts.css"

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

var exist = "0";
var feature = "";
var anomaly = false;

function EmptyLineChart(){
    const data = {
        labels: [],
        datasets: [
            {
                label: 'Line Chart',
                data: []
            }
        ]
    }
    return <Line data={data}></Line>
}

function LineChartHelper(){
    var jsonInfo = JSON.parse(window.localStorage.getItem("json_info"));
    var keys = Object.keys(jsonInfo);
    var arr = Array.from(Array(jsonInfo[keys[0]].length).keys());
    var data = {
      labels: arr,
      datasets: [
        {
          label: "Line Chart",
          data: [],
        },
      ],
    };
    var i=0;
    //add all keys to keys list
    if (exist === "0") {
        keys.forEach((key) => {
            var i = 0;
            // set model in model-list
            var key_list_element = document.getElementsByClassName("simplebar-content")[0];
            var new_key_name_element = document.createElement("a");
            new_key_name_element.href = "#";
            new_key_name_element.text = key;
            // handel choosing something from the list of the features
            new_key_name_element.onclick = function (e) {
                e.preventDefault();
                // change keybtn-id according to jsonInfo
                if (document.getElementsByClassName("keybtn")[0].id === jsonInfo[key]) {
                    i = 1;
                }
                document.getElementsByClassName("keybtn")[0].id = jsonInfo[key];
                feature = key;
                var newFileevent = new CustomEvent("chartChanged");
                window.dispatchEvent(newFileevent);
            };  
            // add to list
            key_list_element.appendChild(new_key_name_element);
        });
    }
    exist = "1";
    return <Line data={data}></Line>    
}

function LineChart() {
    var jsonInfo = JSON.parse(window.localStorage.getItem("json_info"));
    if (anomaly === true) {
        var jsonAnomalies = JSON.parse(window.localStorage.getItem("detected_anomalies_json"));
        var arr=jsonAnomalies["anomalies"][feature];
    }
    let data = {
        labels: Array.from(Array(jsonInfo[feature].length).keys()),
        datasets: [
            {
                label: feature,
                data: jsonInfo[feature],
                backgroundColor: "rgba(0,123,255)",
                pointRadius: 0.7, 
                pointBackgroundColor: function(context) {
                    var index = context.dataIndex;
                    var b = false;
                    if (anomaly === true) {
                        arr.forEach((val) => {
                            if (index >= val[0] && index < val[1]) {
                                b = true;
                            }
                        })
                    }
                    return b ? 'rgb(255, 99, 132)' : 'rgb(74, 161, 243)';
                         
                },
                pointBorderColor: function(context) {
                    var index = context.dataIndex;
                    var b = false;
                    if (anomaly === true) {
                        arr.forEach((val) => {
                            if (index >= val[0] && index < val[1]) {
                                b = true;
                            }
                        }) 
                    }
                    return b ? 'rgb(255, 99, 132)' : 'rgb(74, 161, 243)';
                            
                }

            }
        ]
    }
    let options = {
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        tooltip: {
          usePointStyle: true,
          callbacks: {
            footer: function (context) {
              if (anomaly) {
                return jsonAnomalies["reason"][feature];
              }
            },
          },
        },
      },
    };
    return <Line data={data} options={options}></Line>
}

function myFunction() {
    document.getElementById("myKey").classList.toggle("show");
}

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches(".keybtn")) {
            var dropdowns = document.getElementsByClassName("key-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    };

class Charts extends Component {

    constructor() {
        super();
        this.state = {
            isNewFile: false,
            isChange: false
        };
    }

    newFile = () =>{
        this.setState({
            isNewFile: true,
            isChange: false
        })
    }

    anomaly = () => {
        anomaly = true;
    }

    change = () =>{
        this.setState({
            isChange: true,
            isNewFile: false,
        })
    }


    render() {
        const {isNewFile, isChange} = this.state;
        window.addEventListener("newFileEvent", this.newFile);
        window.addEventListener("anomaliesDetected", this.anomaly);
        window.addEventListener("chartChanged", this.change);
        return (
            <div className = "line_chart">
                {!isNewFile && !isChange && <EmptyLineChart/>}
                { isNewFile && <LineChartHelper/>}
                { isChange && <LineChart/>}

                
                <div className="keys_list">
                    <div className="keys">
                        <button
                            onClick={myFunction}
                            className="keybtn"
                        >
                            Features List
                        </button>
                        <SimpleBar id="myKey"
                            className="key-content"
                        >
                            <div></div>
                        </SimpleBar>
                    </div>
                </div>
            </div>
        )
    }
}

export default Charts