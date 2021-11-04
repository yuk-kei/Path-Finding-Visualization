function myNode(x,y) {
    this.x = x;
    this.y = y;
    this.state = GridState.Empty;
    this.parentNode = null;
    this.neighbourList = [];
    this.setParent = function (Node1) {
        this.parentNode = Node1;
    };
    this.getParent = function () {
        try {
            return this.parentNode;

        }
        catch (referenceError) {
            return null;
        }
    };
}