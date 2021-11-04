function hexHeuristic(startRow, startCol, endRow, endCol) {

    var x = endRow - startRow;
    var y = endCol - startCol;

    var a
    var b = 0.75 * y * y;

    if (x * y < 0 || y == 0) {
        a = Math.pow((x + y / 2), 2);

    } else {
        a = Math.pow((x - y / 2), 2);
    }

    return (Math.sqrt(a + b)).toFixed(1);
}

function Position(){
    this.x;
    this.y;
    this.equals = function (other) {
        return this.x == other.x &&
            this.y == other.y;
    }
}

function convertedHexagon(row, column) {
    var position = new Position();
    position.y = Math.sqrt(3) / 2 * column;

    if(row * column < 0 || column == 0){

        position.x  = (row - column / 2);
    }else{

        position.x  = (row + column / 2);
    }

    position.x = position.x.toFixed(1);
    position.y = position.y.toFixed(1);

    return position;
}
