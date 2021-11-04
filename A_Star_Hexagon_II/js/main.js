// The size and padding of each cell
var NODE_SIZE = 50; //px
var NODE_PAD = 5; //px
var LOGIC_FRAME = 30;
var ROW = 9;
var COLUMN = 9;
var START_ROW = 6;
var START_COL = 6;
var GOAL_ROW = 6;
var GOAL_COL = 0;
var H_FACTOR = 0;


var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create,update: update, render: render});

var hasPath = false;
var currentNode
// var closeList = [];
var grid;
var iterationID = 0;

var openList =[];
var closeList;
var visualTable;
var frameCounter = 0;
var path = [];
function preload() {

	game.load.image('traversable', 'assets/images/hexagon_(blue).png');
	game.load.image('block', 'assets/images/hexagon_(grey_frame).png');
	game.load.image('search', 'assets/images/hexagon_(orange).png');
	game.load.image('goal', 'assets/images/hexagon_(red).png');
    game.load.image('path', 'assets/images/hexagon_(purple).png');
	game.load.image('button', 'assets/images/button.png');

}

function create() {
    grid = new Grid(ROW,COLUMN);
    loadMap(grid);
    visualTable = new hashTable(ROW,COLUMN);
    closeList = new hashTable(ROW,COLUMN);
    visualize(grid);

    var startNode = grid.getNode(START_ROW,START_COL);
    currentNode = startNode;
    startNode.parent = null;
    openList.push(startNode);
}

function update() {
    if (frameCounter > 0) {
        frameCounter--;
        return;
    } else {
        frameCounter = LOGIC_FRAME;

    }
    iterate();
    displayNode();
}

function render() {
    visualizeCost(grid);
    for(var i = 0; i < openList.length;i++){
        game.debug.text("Open List : " + openList[i].x + ", " + openList[i].y +"    "+ openList[i].finalCost, 60,  i*30+500)
    }

    game.debug.text("Current Node : " + currentNode.x + ", " + currentNode.y　+　"     heuristicWeight = " + H_FACTOR,200,20);
    game.debug.text("Iteration ID:"+ iterationID, 10, 20);
}

function loadMap(grid) {
    grid.setState(START_ROW,START_COL,NodeState.START);
    grid.setState(GOAL_ROW,GOAL_COL,NodeState.GOAL);
    grid.block(1,0);grid.block(2,0);grid.block(5,0);grid.block(8,0);grid.block(0,1);
    grid.block(6,1);grid.block(3,2);grid.block(4,2);grid.block(1,3);grid.block(4,3);
    grid.block(6,3);grid.block(8,3);grid.block(1,4);grid.block(2,5);grid.block(3,5);
    grid.block(4,5);grid.block(5,5);grid.block(6,5);grid.block(7,5);grid.block(1,6);
    grid.block(2,6);grid.block(4,6);grid.block(7,6);grid.block(2,7);grid.block(4,7)
    grid.block(6,7);grid.block(7,7);grid.block(8,7);grid.block(0,8);grid.block(8,8);

    grid.setCost(2,1,3);grid.setCost(3,1,3);grid.setCost(2,2,3);
    grid.setCost(4,4,3);grid.setCost(5,4,3);grid.setCost(8,4,3);
    grid.setCost(4,8,3);

    grid.setCost(2,3,5);grid.setCost(3,3,5);grid.setCost(5,3,5);
    grid.setCost(6,2,5);grid.setCost(0,6,5);grid.setCost(8,6,5);
    grid.setCost(3,7,5);grid.setCost(5,7,5);
}

function visualize(grid) {
    for (var i = 0; i < COLUMN; i++) {
        for (var j = 0; j < ROW; j++) {
            //  Note: alphaIncSpeed is a new property we're adding to Phaser.Sprite, not a pre-existing one
            var position = convertedHexagon(i, j);

            var node = grid.getNode(i,j);
            var state = node.getState();
            var display;
            switch (state){
                case NodeState.BLOCK:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'block');
                    break;
                case NodeState.OPEN:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'search');
                    break;
                case NodeState.PATH:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'path');
                    break;
                case NodeState.CLOSE:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'goal');
                    break;
                case NodeState.NEW:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'traversable');
                    break;
                case NodeState.GOAL:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'goal');
                    break;
                case NodeState.START:
                    display = game.add.sprite(50 + (NODE_SIZE + NODE_PAD) * position.x, 50 + (NODE_SIZE + NODE_PAD) * position.y, 'goal');
                    break;

            }
            visualTable.setValue(i,j,display);


        }
    }
}

function iterate() {

    if (!hasPath) {
        iterationID++;
    }
    if (hasPath || (openList == null)) {

        return;
    }
    currentNode = openList[0];
    openList.shift();
    aStarSearch(currentNode);
}

function displayPath(endNode) {
    endNode.setState(NodeState.PATH);
    var current = endNode.getParent();
    while (current != null && current.getState() != NodeState.START) {
        current.setState(NodeState.PATH);
        current = current.getParent();
    }
}

function aStarSearch(currentNode) {

    var neighbours = currentNode.getNeighbours(grid);//list of gird nodes

    for (var i = 0; i < neighbours.length; i++) {

        var neighbourNode = neighbours[i];
        var state = neighbourNode.getState();
        var neighbourRow = neighbourNode.getRow();
        var neighbourColumn = neighbourNode.getColumn();

        switch (state) {
            case NodeState.NEW:
                neighbourNode.setParent(currentNode);
                toOpenList(neighbourNode);
                break;
            case NodeState.CLOSE:
                if (closeList.get(neighbourNode.x, neighbourNode.y) != null &&  neighbourNode.calTotalCost(currentNode.totalCost) < closeList.get(neighbourNode.x, neighbourNode.y).totalCost) {
                    neighbourNode.setParent(currentNode);
                    toOpenList(neighbourNode);
                    closeList.setValue(neighbourRow, neighbourColumn, null);
                }
                break;
            case NodeState.OPEN:
                if (closeList.get(neighbourNode.x, neighbourNode.y) != null && neighbourNode.calTotalCost(currentNode.totalCost) < neighbourNode.totalCost) {
                    neighbourNode.totalCost = neighbourNode.calTotalCost();
                    neighbourNode.setParent(currentNode);
                }
                break;
            case NodeState.GOAL:

                hasPath = true;
                neighbourNode.setParent(currentNode);
                displayPath(neighbourNode);
                return;
        }

    }
    closeList.setValue(neighbourRow,neighbourColumn,currentNode);
    currentNode.setState(NodeState.CLOSE);
    openList.sort(function(Node1,Node2){return Node1.getFinalCost(H_FACTOR)-Node2.getFinalCost(H_FACTOR)});
}


function toOpenList(node) {
    openList.push(node);
    node.setState(NodeState.OPEN);
}


function displayNode() {

    for (var i = 0; i < grid.rowSize; i++) {
        for (var j = 0; j < grid.columnSize; j++) {
            var node = grid.getNode(i,j);
            var state = node.getState();

            switch (state) {
                case NodeState.OPEN: visualTable.get(i, j).loadTexture('search');break;
                case NodeState.CLOSE: visualTable.get(i, j).loadTexture('goal');break;
                case NodeState.PATH: visualTable.get(i, j).loadTexture('path');break;
                case NodeState.NEW: visualTable.get(i, j).loadTexture('traversable');break;
                case NodeState.GOAL: visualTable.get(i, j).loadTexture('goal');break;
                case NodeState.START: visualTable.get(i, j).loadTexture('goal');break;

                // default: alert("Accident value"); break;
            }
        }
    }
}

function hashTable(xAxis,yAxis) {
    var dataStore = [];
    this.column= xAxis;
    this.rowSize = yAxis;
    var init = function() {
        for (var i = 0; i < xAxis; i++)	{
            dataStore.push(new Array(yAxis - 1));
        }
        for (var i = 0; i < xAxis; i++)	{
            for (var j = 0; j < yAxis; j++)	{
                dataStore[j][i] = null;
            }
        }
    };

    init();
    this.get = function (x, y) {
        return dataStore[x][y];
    };
    this.setValue = function (x, y, value) {
        dataStore [x][y] = value;
    };
}

function visualizeCost(grid) {
    for (var i = 0; i < ROW; i++)	{
        for (var j = 0; j < COLUMN; j++) {
            var position = convertedHexagon(i, j);
            game.debug.text(grid.getNode(i,j).givenCost,50 + (NODE_SIZE + NODE_PAD) * position.x, 65 + (NODE_SIZE + NODE_PAD) * position.y);
        }

    }
}

