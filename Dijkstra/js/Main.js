var game = new Phaser.Game(800, 800, Phaser.AUTO, "", this);
var openList = [];
var closedList = [];
var iterationID = 0;
var startNode;
var endNode;
var path;
var iterationID = 0;
function Grid(xAxis, yAxis) {
	//-1blocked  0avaliable      起始点 终点 最终路径同色  当前点         2openlist中 3closelist中 目标点
	var dataStore = new Array();
	this.blockList = new Array();
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
	
	this.set = function (x, y, value)	{
		try {
			dataStore[x][y].state = value;
		}catch(typeError){
			return false;//this does nothing, just to be beautiful;
		}
	};
	
	this.block = function (x, y) {
		this.blockList.push(toLocation(x,y));
		this.set(x, y, -1);
		//这里应该有一个函数this.set(x,y,1)或者别的，能够让让它设置为block的状态
	};
	this.blocked= function (x, y) {
		return this.blockList.includes(toLocation(x,y));
	};
	this.setCost = function (x, y, value) {
		dataStore[x][y].givenCost = value;
	};
}

function toLocation (x, y) {
	return x.toString()+y.toString();
}
function myNode(x,y) {
	this.x = x;
	this.y = y;
	this.state = 0;
	this.parentNode = null;
	this.setParent = function (Node1) {
		this.parentNode = Node1;
	};
	this.getParent = function () {
			return this.parentNode;
	};
	this.neighbourList = [];
	this.givenCost = 1;
	this.totalCost = 0;
}



function dijkstraSearch() {
	this.currentNode = openList[0];	
	
	console.log(this.currentNode.x+' '+this.currentNode.y);
	Grid.set(this.currentNode.x, this.currentNode.y, 2);
	
	if (this.currentNode == endNode ) {
		return findPath(this.currentNode);
	}
	
	for (var i = 0; i < this.currentNode.neighbourList.length; i++) {
		var neighbourNode = this.currentNode.neighbourList[i];
		var newTotalCost = this.currentNode.totalCost + neighbourNode.givenCost;
		
		if (openList.includes(neighbourNode)) {
			if (newTotalCost < neighbourNode.totalCost) {
				neighbourNode.setParent(this.currentNode);
				neighbourNode.totalCost = newTotalCost;
			}
			continue;
		}
		
		
		if (closedList.includes(neighbourNode)) {
			if (newTotalCost < neighbourNode.totalCost) {
				neighbourNode.setParent(this.currentNode);
				neighbourNode.totalCost = newTotalCost;
				openList.push(neighbourNode);
			}
			continue;
		}
		
		openList.push(neighbourNode);
		neighbourNode.totalCost = neighbourNode.givenCost + currentNode.totalCost;
		neighbourNode.setParent(this.currentNode);
	}
	closedList.push(this.currentNode);
	openList.shift();
	openList.sort(function(Node1,Node2){return Node1.givenCost-Node2.givenCost;});
	return null;
}

function getNeighbour (Node) {
	this.Node = Node;
	if (Grid.get(this.Node.x, this.Node.y) == -1) {
		return;
	}
	for (var i = this.Node.x - 1; i <= this.Node.x + 1; i++ ) {
		for (var j = this.Node.y - 1; j <= this.Node.y + 1; j++) {
			if (i >= 0 && i < Grid.columnSize && j >= 0 && j < Grid.rowSize) {
				if (i == this.Node.x && j == this.Node.y) {				
					continue;
				}
				if (!Grid.blocked(i,j)) {
					this.Node.neighbourList.push(Grid.getNode(i,j));
				}
				else {
					continue;
				}
			}
			continue;
		}
	}
}

function getNeighbourList (Grid) {
	for (var i = 0; i < Grid.columnSize; i++) {
		for (var j = 0; j < Grid.rowSize; j++) {
			getNeighbour(Grid.getNode(i,j));
		}
	}
}

function init() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
}

function visualize(Grid) {
	for (var i = 0; i < Grid.columnSize; i++)	{
		for (var j = 0; j < Grid.rowSize; j++) {
			if (Grid.get(i,j) == -1)	{
				game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', 0);
			}
			if (Grid.get(i,j) == 0)	{
				game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', 1);
			}
			if (Grid.get(i,j) == 1)	{
				game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', 2);
			}
			if (Grid.get(i,j) == 2)	{
				game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', 3);
			}
		}
	}
}
function preload() {
	game.load.spritesheet('state', 'assets/images/statespritesheet.png', 30, 30);
	game.load.image('button', 'assets/images/button.png');
}

function findPath(Node) {
	this.path = [];
	this.Node = Node;
	while(true){
		if (this.Node.getParent() != null) {
			this.path.push(this.Node);
			this.Node = this.Node.getParent();
		}
		else {
			break;
		}
	}
	return path;
}

function setStart (x1,y1) {
	openList.push(Grid.getNode(x1,y1));
	startNode = Grid.getNode(x1,y1);
	Grid.set(x1, y1, 1);
	
}
function setEnd (x2, y2) {
	endNode = Grid.getNode(x2,y2);
	Grid.set(x2, y2, 1);
}
function create() {
	game.stage.backgroundColor = 0xffffff;
	
	//Basic Settings
	Grid = new Grid (9, 9);
	Grid.block(1,0);Grid.block(2,0);Grid.block(5,0);Grid.block(8,0);Grid.block(0,1);
	Grid.block(6,1);Grid.block(3,2);Grid.block(4,2);Grid.block(1,3);Grid.block(4,3);
	Grid.block(6,3);Grid.block(8,3);Grid.block(1,4);Grid.block(2,5);Grid.block(3,5);
	Grid.block(4,5);Grid.block(5,5);Grid.block(6,5);Grid.block(7,5);Grid.block(1,6);
	Grid.block(2,6);Grid.block(4,6);Grid.block(7,6);Grid.block(2,7);Grid.block(4,7)
	Grid.block(6,7);Grid.block(7,7);Grid.block(8,7);Grid.block(0,8);Grid.block(8,8);

	Grid.setCost(2,1,3);Grid.setCost(3,1,3);Grid.setCost(2,2,3);
	Grid.setCost(4,4,3);Grid.setCost(5,4,3);Grid.setCost(8,4,3);
	Grid.setCost(4,8,3);

	Grid.setCost(2,3,5);Grid.setCost(3,3,5);Grid.setCost(5,3,5);
	Grid.setCost(6,2,5);Grid.setCost(0,6,5);Grid.setCost(8,6,5);
	Grid.setCost(3,7,5);Grid.setCost(5,7,5);
	visualize(Grid);
	
	//Initializing
	getNeighbourList(Grid);
	setStart(6,6);
	setEnd(6,0);

	
	button = game.add.button(140, 520, 'button', actionOnClick, this);
		
}

function actionOnClick () {
	try {
		console.log(dijkstraSearch());
	} catch (TypeError) {
		alert("No Existing Path!");
	}
	if (path == null) {
		iterationID++;
	}
	if (path != null) {
		path.unshift(startNode);
		for (var i = 0; i < path.length; i++) {
			Grid.set(path[i].x, path[i].y,1);
		}
	}
}


function update() {
	visualize(Grid);
}

function visualizeCost(Grid) {
	for (var i = 0; i < Grid.columnSize; i++)	{
		for (var j = 0; j < Grid.rowSize; j++) {
			game.debug.text(Grid.getNode(i,j).givenCost,175 + 45* i, 50 + 45 * j,'1','70');
		}
	}
}

function render() {
	visualizeCost(Grid);
	game.debug.text("Iteration ID:"+ iterationID, 175,20,'1','70');
}
