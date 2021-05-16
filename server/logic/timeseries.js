class TimeSeries {
    constructor(data) {
        this.data = data;
    }

    getAttributeData(name) {
        return this.data[name];
    }

    getAttributes() {
        return Object.keys(this.data);
    }

    getRowSize() {
        return this.data[this.getAttributes()[0]].length;
    }
}

module.exports = TimeSeries;
