class TimeSeries {
    constructor(data) {
        this.data = data;
    }

    // get data of specific column
    getAttributeData(name) {
        return this.data[name];
    }

    // get all the names of the columns
    getAttributes() {
        return Object.keys(this.data);
    }

    // return the number of rows in the data
    getRowSize() {
        return this.data[this.getAttributes()[0]].length;
    }
}

module.exports = TimeSeries;
