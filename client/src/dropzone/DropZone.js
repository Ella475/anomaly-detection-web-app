import React from 'react';
import approve from "../images/approve.png"
import error from "../images/error.png";

import './DropZone.css'

const dragOver = (e) => {
    e.preventDefault();
}

const dragEnter = (e) => {
    e.preventDefault();
}

const dragLeave = (e) => {
    e.preventDefault();
}

const fileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    var reader = new FileReader();
    reader.onload = readSuccess;                                            
    function readSuccess(event) {
        var icon = e.target.getElementsByClassName("upload-icon")[0];
        if (!icon) {
            return;
        }

        // Send to server 
        var success = true; // TODO: Receive status from server
        if (success) {
            icon.style.background = "url(" + approve + ") no-repeat center center";
        } else {
            icon.style.background = "url(" + error + ") no-repeat center center";
        }

        // anyway
        icon.style.backgroundSize = "100%";
    };
    reader.readAsText(file);
}

const DropZone = () => {
    return (
        <div className="container">
            <div className="drop-container"
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
            >
                <div className="drop-message">
                    <div className="upload-icon"/>
                    Drag & Drop files here or click to upload
                </div>
            </div>
        </div>
    )
}

export default DropZone;
