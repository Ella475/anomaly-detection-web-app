import React, { Component } from "react";

import { Line } from 'react-chartjs-2'
import "./Charts.css"

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

//global variables
var feature = "";
var anomaly = false;
var spanIdx = 0;

/** display an empty line chart (before a file is uploaded) */
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

/** parse the uploaded file data and create the features list */
function LineChartHelper(){
    var jsonInfo = JSON.parse(window.localStorage.getItem("json_info"));
    var keys = Object.keys(jsonInfo);
    var arr = Array.from(Array(jsonInfo[keys[0]].length).keys());
    //temporarily empty line chart data
    var data = {
      labels: arr,
      datasets: [
        {
          label: "Line Chart",
          data: [],
        },
      ],
    };

    //initialize the keys list
    const myNode = document.getElementsByClassName("features")[0].getElementsByClassName("simplebar-content")[0];
    myNode.textContent = '';
    //add all keys to keys list
    keys.forEach((key) => {
        // set the feature-list in the variable 'feature_list_element'
        var feature_list_element = myNode;
        var new_feature_name_element = document.createElement("a");
        new_feature_name_element.href = "#";
        new_feature_name_element.text = key;
        // handel choosing something from the features list
        new_feature_name_element.onclick = function (e) {
            e.preventDefault();
            // change featurebtn-id to feature's name
            document.getElementsByClassName("featurebtn")[0].id = key;
            //save the key in global variable 'feature'
            feature = key;
            //add a new event when the user clicks to change the feature
            var newFeatureEvent = new CustomEvent("chartChanged");
            window.dispatchEvent(newFeatureEvent);
        };  
        // add the feature to the list
        feature_list_element.appendChild(new_feature_name_element);
    });
    return <Line data={data}></Line>    
}

/** 
 * helper function for NewFeatureLineChart and NewFeatureTable.
 * return a string that describes the reason for the anomaly.
 */
function displayReason(spanIndex) {
    var jsonAnomalies = JSON.parse(
      window.localStorage.getItem("detected_anomalies_json")
    );
    return (
      "anomaly reason: " +
      "\ncorrelated_feature: " +
      jsonAnomalies["reason"][feature][spanIndex]["correlated_feature"] +
      "\ncorrelation: " +
      jsonAnomalies["reason"][feature][spanIndex]["correlation"] +
      "\ncorrelation_type: " +
      jsonAnomalies["reason"][feature][spanIndex]["correlation_type"] +
      "\nspan_starting_deviation: " +
      jsonAnomalies["reason"][feature][spanIndex]["span_starting_deviation"]
    );
}

/** create a new line chart for the selected feature */
function NewFeatureLineChart() {
    var jsonInfo = JSON.parse(window.localStorage.getItem("json_info"));
    //set the data for the line chart
    let data = {
        labels: Array.from(Array(jsonInfo[feature].length).keys()),
        datasets: [
            {
                label: feature,
                data: jsonInfo[feature],
                backgroundColor: "rgba(0,123,255)",
                pointRadius: 0.7, 
                //set point color to red if an anomaly was detected and blue otherwise
                pointBackgroundColor: function(context) {
                    var index = context.dataIndex;
                    var b = false;
                    //if we got response from the server about potential anomalies
                    if (anomaly === true) {
                        var jsonAnomalies = JSON.parse(window.localStorage.getItem("detected_anomalies_json"));
                        var arr=jsonAnomalies["anomalies"][feature];
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
                    //if we got response from the server about potential anomalies
                    if (anomaly === true) {
                        var jsonAnomalies = JSON.parse(window.localStorage.getItem("detected_anomalies_json"));
                        var arr=jsonAnomalies["anomalies"][feature];
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
    //set the options for the line chart
    let options = {
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        tooltip: {
          usePointStyle: true,
          callbacks: {
            //if an anomaly was detected display the reason for the anomaly
            footer: (tooltipItems) => {
              var index = tooltipItems[0].parsed.x;
              return anomaly && checkIndex(index) ? displayReason(spanIdx) : "";
            },
          },
        },
      },
    };
    return <Line data={data} options={options}></Line>
}

/** display an empty table (before a file is uploaded) */
function EmptyTable() {
    return(
        <SimpleBar style={{ maxHeight: 200, maxWidth: 850 }}>
        <table>
            <tbody>
                <tr>
                    <th>time step</th>
                    <td></td>
                </tr>
                <tr>
                    <th>feature</th>
                    <td></td>
                </tr>
            </tbody>
        </table>
      </SimpleBar>
    )
}

/** 
 * helper arrow function for the NewFeatureTable function
 * check if the index is in the range of the detected anomalies
 */
const checkIndex = (index) => {
    var bool = false;
    var i = 0;
    if (anomaly === true) {
        var jsonAnomalies = JSON.parse(window.localStorage.getItem("detected_anomalies_json"));
        var arr = jsonAnomalies["anomalies"][feature];
        arr.forEach((val) => {
            if (index >= val[0] && index < val[1]) {
                bool = true;
                spanIdx = i;
            }
            i++;
        })
    }
    return bool;
}

/** create a new table for the selected feature */
function NewFeatureTable() {
    var jsonInfo = JSON.parse(window.localStorage.getItem("json_info"));
    return(
        <SimpleBar style={{ maxHeight: 200, maxWidth: 850 }}>
        <table>
            <tbody>
            <tr>
                <th>time step</th>
                {Array.from({ length: jsonInfo[feature].length - 1 }).map((_, index) => (
                    <td>{index}</td> 
                ))}
            </tr>
            <tr>
                <th>{feature}</th>
                    {Array.from({ length: jsonInfo[feature].length - 1 }).map((_, index) => (
                    checkIndex(index) ? <td className="td_anomaly">{jsonInfo[feature][index]}</td> :
                    <td>{jsonInfo[feature][index]}</td>
                ))}
                </tr>
                 {anomaly ? <tr>
                    <th>reason</th>
                        {Array.from({ length: jsonInfo[feature].length - 1 }).map((_, index) => (
                            checkIndex(index) ? <td> {displayReason(spanIdx)}</td>:<td></td>
                        ))}
            </tr> : <tr></tr> } 
            </tbody>
        </table>
      </SimpleBar>
    )
}

/* When the user clicks on the button,
    toggle between hiding and showing the features */
function ToggleFeaturesButton() {
    document.getElementById("myFeature").classList.toggle("show");
}

// Close the features list if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches(".featurebtn")) {
        var dropdowns = document.getElementsByClassName("feature-content");
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

    //when new file is uploaded
    newFile = () => {
        anomaly = false;
        this.setState({
            isNewFile: true,
            isChange: false
        })
    }

    //when the server returns an answer about the detected anomalies
    anomaly = () => {
        anomaly = true;
    }

    //when a feature is selected
    change = () => {
        this.setState({
            isChange: true,
            isNewFile: false,
        })
    }


    render() {
        const {isNewFile, isChange} = this.state;
        //add event listeners
        window.addEventListener("newFileEvent", this.newFile);
        window.addEventListener("anomaliesDetected", this.anomaly);
        window.addEventListener("chartChanged", this.change);
        return (
          <div>
            <div className="line_chart">
              {!isNewFile && !isChange && <EmptyLineChart />}
              {isNewFile && <LineChartHelper />}
              {isChange && <NewFeatureLineChart />}

              <div className="features_list">
                <div className="features">
                  <button onClick={ToggleFeaturesButton} className="featurebtn">
                    Features List
                  </button>
                  <SimpleBar id="myFeature" className="feature-content">
                    <div></div>
                  </SimpleBar>
                </div>
              </div>
            </div>
            <div className="table">
                {((!isNewFile && !isChange) || isNewFile) && <EmptyTable />}
                {isChange && <NewFeatureTable />}
            </div>
          </div>
        );
    }
}

export default Charts