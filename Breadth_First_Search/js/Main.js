var game = new Phaser.Game(800, 800, Phaser.AUTO, "", this);
var openList = [];
var closedList = [];
var iterationID = 0;
var startNode;
var endNode;
var path;

function breadthFirstSearch() {
	this.currentNode = openList[0];
	console.log(this.currentNode.x+' '+this.currentNode.y);
	Grid.set(this.currentNode.x, this.currentNode.y, GridState.Path);
	if (this.currentNode == endNode ) {
		return findPath(this.currentNode);
	}
	for (var i = 0; i < this.currentNode.neighbourList.length; i++) {
		if (openList.includes(currentNode.neighbourList[i]) || closedList.includes(currentNode.neighbourList[i])) {
			continue;
		}
		openList.push(this.currentNode.neighbourList[i]);
		currentNode.neighbourList[i].setParent(this.currentNode);
	}
	closedList.push(openList[0]);
	openList.shift();
	return null;
}

function toLocation (x, y) {
	return x.toString()+y.toString();
}

function getNeighbour (Node) {
	this.Node = Node;
	if (Grid.get(this.Node.x, this.Node.y) == GridState.Blocked) {
		return;
	}
	for (var i = this.Node.x - 1; i <= this.Node.x + 1; i++ ) {
		for (var j = this.Node.y - 1; j <= this.Node.y + 1; j++) {
			if (i >= 0 && i < xAxis && j >= 0 && j < yAxis) {
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
	let gridState;
	for (var i = 0; i < Grid.columnSize; i++)	{
		for (var j = 0; j < Grid.rowSize; j++) {
			gridState = Grid.get(i,j);
			switch(gridState){
				case GridState.Empty : game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', gridState); break;
				case GridState.Blocked : game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', gridState); break;
				case GridState.Path : game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', gridState); break;
				case GridState.Checked : game.add.sprite( 175 + 45* i, 50 + 45 * j, 'state', gridState); break;
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

function setStart (Grid,x1,y1) {
	openList.push(Grid.getNode(x1,y1));
	startNode = Grid.getNode(x1,y1);
	Grid.set(x1, y1, GridState.Path);

}
function setEnd (Grid,x2, y2) {
	endNode = Grid.getNode(x2,y2);
	Grid.set(x2, y2, GridState.Path);
}
function create() {
	game.stage.backgroundColor = 0xffffff;
	
	//Basic Settings
	Grid = new Grid (xAxis, yAxis);
	Grid.block(1,2);Grid.block(1,0);Grid.block(2,3);Grid.block(4,4);Grid.block(5,5);Grid.block(5,4);Grid.block(4,5);
	Grid.block(3,3);Grid.block(2,4);Grid.block(3,10);Grid.block(8,9);Grid.block(7,6);Grid.block(6,4);Grid.block(4,7);
	visualize(Grid);
	
	//Initializing
	getNeighbourList(Grid);
	setStart(Grid,0,0);
	setEnd(Grid,7,8);


	button = game.add.button(140, 520, 'button', actionOnClick, this);
		
}

function actionOnClick () {
	try {
		console.log(breadthFirstSearch());
		iterationID++;
	} catch (TypeError) {
		alert("No Existing Path!");
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

function render() {
	game.debug.text("Iteration ID:"+ iterationID, 175,20,'1','70');
}
