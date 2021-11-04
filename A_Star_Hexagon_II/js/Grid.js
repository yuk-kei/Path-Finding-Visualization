function Grid(xAxis, yAxis) {

    var dataStore = [];
    this.rowSize = xAxis;
    this.columnSize = yAxis;
    var init = function () {

        for (var i = 0; i < xAxis; i++) {
            var bufLine = [];
            for (var j = 0; j < yAxis; j++) {
                bufLine[j] = new MyNode(i, j);
                bufLine[j].setGivenCost(1);
            }
            dataStore[i] = bufLine;
        }
    };
    init();

    this.block = function (x, y) {
        this.setState(x, y, NodeState.BLOCK);
    };

    this.getState = function (x, y) {
        try {
            return dataStore[x][y].state;
        } catch (typeError) {
            return false;//this does nothing, just to be beautiful;
        }
    };

    this.getNode = function (x, y) {
        try {
            return dataStore[x][y];
        } catch (typeError) {
            return false;//this does nothing, just to be beautiful;
        }
    };

    this.setState = function (x, y, value) {
        try {
            dataStore[x][y].state = value;
        } catch (typeError) {
            return false;//this does nothing, just to be beautiful;
        }
    };

    this.setCost = function (x, y, value) {
        dataStore[x][y].setGivenCost(value);
    };
}