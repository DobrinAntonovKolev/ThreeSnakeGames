let bigdiv = document.getElementById("game-container");


let columns = 8;
let rows = 8;
let speed = 800;

let snakegamedirection = "right";

class Box {
	constructor(row, column, snake, div) {
		this.row = row;
		this.col = column;
		this.snake = snake;
		this.div = div;
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = null;
	}
	
	setHead() {
		this.head = true;
		this.snake = true;
		this.div.style.backgroundColor = "DarkSeaGreen";
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = false;
	}
	
	setEmpty() {
		this.head = false;
		this.snake = false;
		this.div.style.backgroundColor = "White";
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = false;
	}
	
	setSnake() {
		this.head = false;
		this.snake = true;
		this.div.style.backgroundColor = "Chartreuse";
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = false;
	}
	
	setApple() {
		this.head = false;
		this.snake = false;
		this.div.style.backgroundColor = "Red";
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;	
		this.apple = true;
	}
	
	setAll(array) {
		this.row = array[0];
		this.col = array[1];
		this.head = array[2];
		this.snake = array[3];
		this.div.style.backgroundColor = array[4];
		this.setFollowBox(array[5],array[6]);
	}
	
	getAll() {
		let arr = [];
		arr.push(this.row);
		arr.push(this.col);
		arr.push(this.head);
		arr.push(this.snake);
		arr.push(this.div.style.backgroundColor);
		arr.push(this.folRow);
		arr.push(this.folCol);
		return arr;
	}
	
	setFollowBox(row,col) {
		this.folRow = row;
		this.folCol = col;
	}
		
}

class BoxTracker {
	constructor(maindiv, rows, columns) {
		this.maindiv = maindiv;
		this.boxesArray = [];
		this.rows = rows;
		this.cols = columns;
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < columns; col++) {
				let newDiv = document.createElement("div");
				newDiv.classList.add("basic-box");
				maindiv.appendChild(newDiv);
				let box = new Box(row,col,false,newDiv);
				this.boxesArray.push(box);
			}
		}
		let snakeBox = this.getBox(Math.floor(rows/2)-1,Math.floor(columns/2)-1);
		snakeBox.setSnake();
		this.head = this.getBox(Math.floor(rows/2)-1,Math.floor(columns/2));
		this.head.setHead();
		this.head.setFollowBox(snakeBox.row,snakeBox.col);
		let snakeBox2 = this.getBox(snakeBox.row,snakeBox.col-1);
		snakeBox2.setSnake();
		snakeBox.setFollowBox(snakeBox2.row,snakeBox2.col);
		this.setRandomApple();
	}
	
	setRandomApple() {
		let apple;
		console.log(getRandomInt(0,this.rows-1),getRandomInt(0,this.cols-1));
		apple = this.getBox(getRandomInt(0,this.rows-1),getRandomInt(0,this.cols-1));
		while (apple.snake) {
			apple = this.getBox(getRandomInt(0,this.rows-1),getRandomInt(0,this.cols-1));		
		}
		apple.setApple();
	}
	
	getLast() {
		let curr = this.head;
		while (curr.folRow != null) {
			curr = this.getBox(curr.folRow,curr.folCol);
		}
		return curr;
	}
	
	getBox(row,col) {
		for (let i = 0; i < this.boxesArray.length; i++) {
			let currBox = this.boxesArray[i];
			if (currBox.row==row && currBox.col==col) {
				return currBox;
			}
		}
		return undefined;
	}
	
	swapBoxes(box1,box2) {
		let arr1 = box1.getAll();
		let arr2 = box2.getAll();
		box1.setAll(arr2);
		box2.setAll(arr1);
	}
	
	startGame() {
		this.gameInterval = setInterval(this.nextTick,speed,this);
	}
	
	stopGame() {
		clearInterval(this.gameInterval);
	}
	
	nextTick(tracker) {
		console.log("Direction:",snakegamedirection);
		// Set the next box to the head.
		// Get the prevHead followBox as variable "fbox".
		// set prevHead to empty.
		// swap empty and fbox.
		// set head's followbox to fbox coordinates.
		// set fbox to fbox's follow box.
		// swap empty coords and fbox.
		// repeat
		let newRow;
		let newCol;
		let oldRow = tracker.head.row;
		let oldCol = tracker.head.col;
		switch (snakegamedirection) {
			case "right" :
				if (tracker.head.col+1 >= tracker.cols || tracker.getBox(tracker.head.row,tracker.head.col+1).snake) {
					alert("Game Over.");
					tracker.stopGame();
					return;
				} else {
					newRow = tracker.head.row;
					newCol = tracker.head.col+1;
				}
				break;
			case "left" :
				if (tracker.head.col-1 < 0 || tracker.getBox(tracker.head.row,tracker.head.col-1).snake) {
					alert("Game Over.");
					tracker.stopGame();
					return;
				} else {
					newRow = tracker.head.row;
					newCol = tracker.head.col-1;
				}
				break;
			case "up" :
				if (tracker.head.row-1 < 0 || tracker.getBox(tracker.head.row-1,tracker.head.col).snake) {
					alert("Game Over.");
					tracker.stopGame();
					return;
				} else {
					newRow = tracker.head.row-1;
					newCol = tracker.head.col;
				}
				break;
			case "down" :
				if (tracker.head.row+1 >= tracker.rows || tracker.getBox(tracker.head.row+1,tracker.head.col).snake) {
					alert("Game Over.");
					tracker.stopGame();
					return;
				} else {
					newRow = tracker.head.row+1;
					newCol = tracker.head.col;
				}
				break;
		}
		if (!tracker.getBox(newRow,newCol).apple) {
			tracker.getBox(newRow,newCol).setHead();
			tracker.getBox(newRow,newCol).setFollowBox(tracker.head.folRow,tracker.head.folCol);
			tracker.head.setEmpty();
			let emptyBox = tracker.head;
			tracker.head = tracker.getBox(newRow,newCol);
			let currentSwap = tracker.getBox(tracker.head.folRow,tracker.head.folCol);
			let previous = tracker.head;
			try {
				while (currentSwap.snake === true) {
				emptyBox.setSnake();
				emptyBox.setFollowBox(currentSwap.folRow,currentSwap.folCol);
				currentSwap.setEmpty();
				previous.setFollowBox(emptyBox.row,emptyBox.col);
				let folRow = emptyBox.folRow;
				let folCol = emptyBox.folCol;
				previous = emptyBox;
				emptyBox = currentSwap;
				currentSwap = tracker.getBox(folRow,folCol);
				}
			} catch (e) {
			}
		} else {
			tracker.getBox(newRow,newCol).setHead();
			tracker.getBox(newRow,newCol).setFollowBox(tracker.head.row,tracker.head.col);
			let currFolRow = tracker.head.folRow;
			let currFolCol = tracker.head.folCol;
			tracker.head.setSnake();
			tracker.head.setFollowBox(currFolRow,currFolCol);
			tracker.head = tracker.getBox(newRow,newCol);
			tracker.setRandomApple();
		}
	}
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let previousDirection = "right";

document.body.onkeydown = function(e){
	switch (e.key) {
		case 'w':
			if (previousDirection != "down") {
				snakegamedirection = "up";
			}
			break;
		case 'a':
			if (previousDirection != "right") {
				snakegamedirection = "left";
			}
			break;
		case 's':
			if (previousDirection != "up") {
				snakegamedirection = "down";
			}
			break;
		case 'd':
			if (previousDirection != "left") {
				snakegamedirection = "right";
			}
			break;
		case 'ArrowUp':
			if (previousDirection != "down") {
				snakegamedirection = "up";
			}
			break;
		case 'ArrowDown':
			if (previousDirection != "up") {
				snakegamedirection = "down";
			}
			break;
		case 'ArrowLeft':
			if (previousDirection != "right") {
				snakegamedirection = "left";
			}
			break;
		case 'ArrowRight':
			if (previousDirection != "left") {
				snakegamedirection = "right";
			}
			break;	
	}
	previousDirection=snakegamedirection;
};

let gameToPlay = "regular";

let inactive1 = document.getElementsByClassName("inactive-button").item(0);
let inactive2 = document.getElementsByClassName("inactive-button").item(1);
let active = document.getElementsByClassName("active-button").item(0);

inactive1.onclick = inactive1Func;
inactive2.onclick = inactive2Func;
active.onclick = activeFunc;

function activeFunc() {
	active.classList.remove("inactive-button");
	active.classList.add("active-button");
	inactive1.classList.remove("active-button");
	inactive1.classList.add("inactive-button");
	inactive2.classList.remove("active-button");
	inactive2.classList.add("inactive-button");
	gameToPlay = "regular";
}

function inactive1Func() {
	inactive1.classList.remove("inactive-button");
	inactive1.classList.add("active-button");
	active.classList.remove("active-button");
	active.classList.add("inactive-button");
	inactive2.classList.remove("active-button");
	inactive2.classList.add("inactive-button");
	gameToPlay = "4x";
}

function inactive2Func() {
	inactive2.classList.remove("inactive-button");
	inactive2.classList.add("active-button");
	active.classList.remove("active-button");
	active.classList.add("inactive-button");
	inactive1.classList.remove("active-button");
	inactive1.classList.add("inactive-button");
	gameToPlay = "2-snake";
}

function goStart() {
	document.getElementById("button-div").style.display = "none";
	let textbox = document.getElementsByClassName("input-box");
	let rowsColsBox = textbox[0].value;
	let speedBox = textbox[1].value;
	console.log("is null:",rowsColsBox == false || speed == false,"is '',",rowsColsBox == "" || speedBox == ""); 
	if (!(rowsColsBox == null || rowsColsBox == "" || speedBox == null || speedBox == "")) {
		rows = parseInt(rowsColsBox);
		columns = rows;
		speed = parseInt(speedBox);
	} else {
		rows = 8;
		columns = 8;
		speed = 600;
	}

	console.log(textbox.value);
	let btracker;
	let lengthString = "";
	console.log("rows",rows,"columns",columns,"speed",speed);
	for (let i = 0; i < rows; i++) {
		lengthString = lengthString + " 1fr";
	}
	switch (gameToPlay) {
		case "regular":
			bigdiv.style.gridTemplateColumns = lengthString;
			bigdiv.style.gridTemplateRows = lengthString;
			bigdiv.style.marginTop = "5px";
			btracker = new BoxTracker(bigdiv,rows,columns);
			btracker.startGame();
			break;
		case "4x":
			bigdiv.style.gridTemplateColumns = "1fr 1fr";
			bigdiv.style.gridTemplateRows = "1fr 1fr";
			bigdiv.style.margin = "auto";
			for (let i = 0; i < 4; i++) {
				let maindiv = document.createElement("div");
				maindiv.classList.add("main-div");
				maindiv.style.height = "100%";
				maindiv.style.width = "100%";
				maindiv.style.marginTop = "0px";
				maindiv.style.gridTemplateColumns = lengthString;
				maindiv.style.gridTemplateRows = lengthString;
				bigdiv.appendChild(maindiv);
				let btrackergame = new BoxTracker(maindiv,rows,columns);
				btrackergame.startGame();
			}
			break;
		case "2-snake":
			bigdiv.style.gridTemplateColumns = lengthString;
			bigdiv.style.gridTemplateRows = lengthString;		
			bigdiv.style.marginTop = "5px";			
			btracker = new BoxTrackerTwo(bigdiv,rows,columns);
			btracker.startGame();			
			break;
	}
}

class BoxTwo {
	constructor(row, column, snake, div) {
		this.row = row;
		this.col = column;
		this.snake = snake;
		this.div = div;
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = null;
		this.color = null;
	}
	
	setHead(color) {
		this.color = color;
		this.head = true;
		this.snake = true;
		if (color === "green") {
			this.div.style.backgroundColor = "DarkSeaGreen";
		} else {
			this.div.style.backgroundColor = "DarkCyan";
		}
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = false;
	}
	
	setEmpty() {
		this.head = false;
		this.snake = false;
		this.div.style.backgroundColor = "White";
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = false;
		this.color = null;
	}
	
	setSnake(color) {
		this.color = color;
		this.head = false;
		this.snake = true;
		if (color === "green") {
			this.div.style.backgroundColor = "Chartreuse";
		} else {
			this.div.style.backgroundColor = "CadetBlue";
		}
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;
		this.apple = false;
	}
	
	setApple() {
		this.head = false;
		this.snake = false;
		this.color = null;
		this.div.style.backgroundColor = "Red";
		this.followBox = null;
		this.folRow = null;
		this.folCol = null;	
		this.apple = true;
	}
	
	setAll(array) {
		this.row = array[0];
		this.col = array[1];
		this.head = array[2];
		this.snake = array[3];
		this.div.style.backgroundColor = array[4];
		this.setFollowBox(array[5],array[6]);
		this.color = array[7];
	}
	
	getAll() {
		let arr = [];
		arr.push(this.row);
		arr.push(this.col);
		arr.push(this.head);
		arr.push(this.snake);
		arr.push(this.div.style.backgroundColor);
		arr.push(this.folRow);
		arr.push(this.folCol);
		arr.push(this.color);
		return arr;
	}
	
	setFollowBox(row,col) {
		this.folRow = row;
		this.folCol = col;
	}
		
}

previousDirectionGreen = "right";
snakegamedirectionGreen = "right";

previousDirectionBlue = "right";
snakegamedirectionBlue = "right";

class BoxTrackerTwo {
	constructor(maindiv, rows, columns) {
		this.maindiv = maindiv;
		this.boxesArray = [];
		this.rows = rows;
		this.cols = columns;
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < columns; col++) {
				let newDiv = document.createElement("div");
				newDiv.classList.add("basic-box");
				maindiv.appendChild(newDiv);
				let box = new BoxTwo(row,col,false,newDiv);
				this.boxesArray.push(box);
			}
		}
		let snakeBox = this.getBox(Math.floor(rows/2)-1,Math.floor(columns/2)-1);
		snakeBox.setSnake("green");
		this.headGreen = this.getBox(Math.floor(rows/2)-1,Math.floor(columns/2));
		this.headGreen.setHead("green");
		this.headGreen.setFollowBox(snakeBox.row,snakeBox.col);
		let snakeBox2 = this.getBox(snakeBox.row,snakeBox.col-1);
		snakeBox2.setSnake("green");
		snakeBox.setFollowBox(snakeBox2.row,snakeBox2.col);
		
		let snakeBoxBlue = this.getBox(Math.floor(rows/2)-3,Math.floor(columns/2));
		snakeBoxBlue.setSnake("blue");
		this.headBlue = this.getBox(Math.floor(rows/2)-3,Math.floor(columns/2)+1);
		this.headBlue.setHead("blue");
		this.headBlue.setFollowBox(snakeBoxBlue.row,snakeBoxBlue.col);
		let snakeBoxBlue2 = this.getBox(snakeBoxBlue.row,snakeBoxBlue.col-1);
		snakeBoxBlue2.setSnake("blue");
		snakeBoxBlue.setFollowBox(snakeBoxBlue2.row,snakeBoxBlue2.col);
		
		document.body.onkeydown = function(e) {
			console.log("WORKED");
			switch (e.key) {
				case 'w':
					if (previousDirectionBlue != "down") {
						snakegamedirectionBlue = "up";
					}
					break;
				case 'a':
					if (previousDirectionBlue != "right") {
						snakegamedirectionBlue = "left";
					}
					break;
				case 's':
					if (previousDirectionBlue != "up") {
						snakegamedirectionBlue = "down";
					}
					break;
				case 'd':
					if (previousDirectionBlue != "left") {
						snakegamedirectionBlue = "right";
					}
					break;
				case 'ArrowUp':
					if (previousDirectionGreen != "down") {
						snakegamedirectionGreen = "up";
					}
					break;
				case 'ArrowDown':
					if (previousDirectionGreen != "up") {
						snakegamedirectionGreen = "down";
					}
					break;
				case 'ArrowLeft':
					if (previousDirectionGreen != "right") {
						snakegamedirectionGreen = "left";
					}
					break;
				case 'ArrowRight':
					if (previousDirectionGreen != "left") {
						snakegamedirectionGreen = "right";
					}
					break;	
			}
			previousDirectionBlue= snakegamedirectionBlue;
			previousDirectionGreen = snakegamedirectionGreen;
		};
		
		this.setRandomApple();
		this.setRandomApple();
	}
	
	setRandomApple() {
		let apple;
		console.log(getRandomInt(0,this.rows-1),getRandomInt(0,this.cols-1));
		apple = this.getBox(getRandomInt(0,this.rows-1),getRandomInt(0,this.cols-1));
		while (apple.snake || apple.apple) {
			apple = this.getBox(getRandomInt(0,this.rows-1),getRandomInt(0,this.cols-1));		
		}
		apple.setApple();
	}
	
	getLast(color) {
		if (color === "green") {
			let curr = this.headGreen;
			while (curr.folRow != null) {
				curr = this.getBox(curr.folRow,curr.folCol);
			}
			return curr;
		} else {
			let curr = this.headBlue;
			while (curr.folRow != null) {
				curr = this.getBox(curr.folRow,curr.folCol);
			}
			return curr;
		}
		
	}
	
	getBox(row,col) {
		for (let i = 0; i < this.boxesArray.length; i++) {
			let currBox = this.boxesArray[i];
			if (currBox.row==row && currBox.col==col) {
				return currBox;
			}
		}
		return undefined;
	}
	
	swapBoxes(box1,box2) {
		let arr1 = box1.getAll();
		let arr2 = box2.getAll();
		box1.setAll(arr2);
		box2.setAll(arr1);
	}
	
	startGame() {
		this.gameIntervalGreen = setInterval(this.nextTick,speed,this,"green");
		
	}
	
	stopGame() {
		clearInterval(this.gameIntervalGreen);
	}
	
	nextTick(tracker,color) {
		console.log("DirectionGreen:",snakegamedirectionGreen,"DirectionBlue:",snakegamedirectionBlue,"Color:",color);
		if (color === "green") {
			let newRow;
			let newCol;
			let oldRow = tracker.headGreen.row;
			let oldCol = tracker.headGreen.col;
			switch (snakegamedirectionGreen) {
				case "right" :
					if (tracker.headGreen.col+1 >= tracker.cols || tracker.getBox(tracker.headGreen.row,tracker.headGreen.col+1).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headGreen.row;
						newCol = tracker.headGreen.col+1;
					}
					break;
				case "left" :
					if (tracker.headGreen.col-1 < 0 || tracker.getBox(tracker.headGreen.row,tracker.headGreen.col-1).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headGreen.row;
						newCol = tracker.headGreen.col-1;
					}
					break;
				case "up" :
					if (tracker.headGreen.row-1 < 0 || tracker.getBox(tracker.headGreen.row-1,tracker.headGreen.col).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headGreen.row-1;
						newCol = tracker.headGreen.col;
					}
					break;
				case "down" :
					if (tracker.headGreen.row+1 >= tracker.rows || tracker.getBox(tracker.headGreen.row+1,tracker.headGreen.col).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headGreen.row+1;
						newCol = tracker.headGreen.col;
					}
					break;
			}
			if (!tracker.getBox(newRow,newCol).apple) {
				tracker.getBox(newRow,newCol).setHead("green");
				tracker.getBox(newRow,newCol).setFollowBox(tracker.headGreen.folRow,tracker.headGreen.folCol);
				tracker.headGreen.setEmpty();
				let emptyBox = tracker.headGreen;
				tracker.headGreen = tracker.getBox(newRow,newCol);
				let currentSwap = tracker.getBox(tracker.headGreen.folRow,tracker.headGreen.folCol);
				let previous = tracker.headGreen;
				try {
					while (currentSwap.snake === true) {
						emptyBox.setSnake("green");
						emptyBox.setFollowBox(currentSwap.folRow,currentSwap.folCol);
						currentSwap.setEmpty();
						previous.setFollowBox(emptyBox.row,emptyBox.col);
						let folRow = emptyBox.folRow;
						let folCol = emptyBox.folCol;
						previous = emptyBox;
						emptyBox = currentSwap;
						currentSwap = tracker.getBox(folRow,folCol);
					}
				} catch (e) {
				}
			} else {
				tracker.getBox(newRow,newCol).setHead("green");
				tracker.getBox(newRow,newCol).setFollowBox(tracker.headGreen.row,tracker.headGreen.col);
				let currFolRow = tracker.headGreen.folRow;
				let currFolCol = tracker.headGreen.folCol;
				tracker.headGreen.setSnake("green");
				tracker.headGreen.setFollowBox(currFolRow,currFolCol);
				tracker.headGreen = tracker.getBox(newRow,newCol);
				tracker.setRandomApple();
			}
			tracker.nextTick(tracker,"blue");
		} else {
			let newRow;
			let newCol;
			let oldRow = tracker.headBlue.row;
			let oldCol = tracker.headBlue.col;
			switch (snakegamedirectionBlue) {
				case "right" :
					if (tracker.headBlue.col+1 >= tracker.cols || tracker.getBox(tracker.headBlue.row,tracker.headBlue.col+1).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headBlue.row;
						newCol = tracker.headBlue.col+1;
					}
					break;
				case "left" :
					if (tracker.headBlue.col-1 < 0 || tracker.getBox(tracker.headBlue.row,tracker.headBlue.col-1).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headBlue.row;
						newCol = tracker.headBlue.col-1;
					}
					break;
				case "up" :
					if (tracker.headBlue.row-1 < 0 || tracker.getBox(tracker.headBlue.row-1,tracker.headBlue.col).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headBlue.row-1;
						newCol = tracker.headBlue.col;
					}
					break;
				case "down" :
					if (tracker.headBlue.row+1 >= tracker.rows || tracker.getBox(tracker.headBlue.row+1,tracker.headBlue.col).snake) {
						alert("Game Over.");
						tracker.stopGame();
						return;
					} else {
						newRow = tracker.headBlue.row+1;
						newCol = tracker.headBlue.col;
					}
					break;
			}
			if (!tracker.getBox(newRow,newCol).apple) {
				tracker.getBox(newRow,newCol).setHead("blue");
				tracker.getBox(newRow,newCol).setFollowBox(tracker.headBlue.folRow,tracker.headBlue.folCol);
				tracker.headBlue.setEmpty();
				let emptyBox = tracker.headBlue;
				tracker.headBlue = tracker.getBox(newRow,newCol);
				let currentSwap = tracker.getBox(tracker.headBlue.folRow,tracker.headBlue.folCol);
				let previous = tracker.headBlue;
				try {
					while (currentSwap.snake === true) {
						emptyBox.setSnake("blue");
						emptyBox.setFollowBox(currentSwap.folRow,currentSwap.folCol);
						currentSwap.setEmpty();
						previous.setFollowBox(emptyBox.row,emptyBox.col);
						let folRow = emptyBox.folRow;
						let folCol = emptyBox.folCol;
						previous = emptyBox;
						emptyBox = currentSwap;
						currentSwap = tracker.getBox(folRow,folCol);
					}
				} catch (e) {
				}
			} else {
				tracker.getBox(newRow,newCol).setHead("Blue");
				tracker.getBox(newRow,newCol).setFollowBox(tracker.headBlue.row,tracker.headBlue.col);
				let currFolRow = tracker.headBlue.folRow;
				let currFolCol = tracker.headBlue.folCol;
				tracker.headBlue.setSnake("Blue");
				tracker.headBlue.setFollowBox(currFolRow,currFolCol);
				tracker.headBlue = tracker.getBox(newRow,newCol);
				tracker.setRandomApple();
			}		
		}
	}
}

