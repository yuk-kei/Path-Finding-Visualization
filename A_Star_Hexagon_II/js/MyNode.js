var NodeState = {
    GOAL  : 0,
    NEW   : 1,
    OPEN  : 2,
    BLOCK : 3,
    PATH  : 4,
    CLOSE : 5,
    START : 6
};

function MyNode(x, y) {
    this.x = x;
    this.y = y;
    this.h = 0;
    this.state = NodeState.NEW;
    this.parentNode = null;
    this.givenCost = 1;
    this.totalCost = 0;
    this.heuristic = 0;
    this.finalCost = 0;

    this.neighbours = [];

    this.setParent = function (Node) {
        this.parentNode = Node;
    };
    this.getParent = function () {
        return this.parentNode;
    };

    this.getRow = function () {
        return this.x;
    }

    this.getColumn = function () {
        return this.y;
    }

    this.getState = function () {
        return this.state;
    }

    this.setState = function (state) {
        this.state = state;
    }

    this.setGivenCost = function (cost) {
        this.givenCost = cost;
    }

    this.getGivenCost = function () {
        return this.givenCost;
    }

    this.equals = function (other) {
        return this.node.getRow() == other.node.getRow() &&
            this.node.getColumn() == other.node.getColumn();
    }

    this.calTotalCost = function (newTotalCost)  {

        return newTotalCost + this.givenCost;
    }

    this.getFinalCost = function (factor){
        this.heuristic = factor * hexHeuristic(this.x,this.y,GOAL_ROW,GOAL_COL);
        this.finalCost = this.heuristic + this.totalCost;
        return this.finalCost;
    }

    this.getNeighbours = function (grid) {

        if (this.neighbours.length != 0) {
            return this.neighbours;
        }
        var list = getHexNeighbours(grid, x, y);

        for (var i = 0; i < list.length; i++) {
            list[i].getState() == NodeState.BLOCK ? "" : this.neighbours.push(list[i]);
        }
        return this.neighbours;
    }
}

function getHexNeighbours(grid, row, col) {
    var neighbours = [];

    for(var i = row - 1; i <= row + 1; i++){
        for(var j = col - 1; j <= col + 1; j++){
            // exclude boundary cell
            if(i != -1 && j != -1 && i != ROW && j != COLUMN
                // exclude nonadjacent diagonal
                && !(i == (row + 1) && j == (col + 1))  && !(i == (row - 1) && j == (col - 1))
                //exclude itself
                && !(i == row && j == col)
            ){
                neighbours.push(grid.getNode(i,j));
            }
        }
    }
    return neighbours;

}
