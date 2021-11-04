function Grid(xAxis, yAxis) {
    //-1 for blocked  0 for available      起始点 终点 最终路径同色  当前点         2openlist中 3closelist中 目标点
    var dataStore = [];
    this.blockList = [];
    this.columnSize = xAxis;
    this.rowSize = yAxis;
    var init = function() {
        for (var i = 0; i < xAxis; i++)	{
            dataStore.push(new Array(yAxis - 1));
        }
        for (var i = 0; i < xAxis; i++)	{
            for (var j = 0; j < yAxis; j++)	{
                dataStore[i][j] = new myNode(i, j);
            }
        }
    };
    init();

    this.get = function(x, y) {
        try {
            return dataStore[x][y].state;
        }catch (typeError) {
            return false;//this does nothing, just to be beautiful;
        }
    };
    this.getNode = function (x, y) {
        try {
            return dataStore[x][y];
        }catch (typeError) {
            return false;//this does nothing, just to be beautiful;
        }
    };

    this.set = function (x, y, state)	{
        try {
            dataStore[x][y].state = state;
        }catch(typeError){
            return false;//this does nothing, just to be beautiful;
        }
    };

    this.block = function (x, y) {
        this.blockList.push(toLocation(x,y));
        this.set(x, y, GridState.Blocked);
        //这里应该有一个函数this.set(x,y,1)或者别的，能够让让它设置为block的状态
    };
    this.blocked= function (x, y) {
        return this.blockList.includes(toLocation(x,y));
    };
}