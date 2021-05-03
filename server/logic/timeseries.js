class TimeSeries{
    constructor(data) {
        this.data = data;
    }

    getAttributeData(name) {
        return this.data[name];
    }

    gettAttributes() {
        return Object.keys(this.data);
    }

    getRowSize() {
        return this.data[this.gettAttributes()[0]].length;
    }
}

module.exports = TimeSeries;