let grid = new Array(10);
const colours = ["#000000", "#00FFFF", "#000080", "#FFA500", "#FFFF00", "#008000", "#800080", "#FF0000"];
const tetrominos = [
	[[[0, 2], [0, 1], [0, 0], [0, -1]], [[-1, 0], [0, 0], [1, 0], [2, 0]], [[1, -1], [1, 0], [1, 1], [1, 2]], [[-1, -1], [0, -1], [1, -1], [2, -1]]], // I
	[[[-1, -1], [1, 0], [0, 0], [-1, 0]], [[0, -1], [0, 0], [0, 1], [1, -1]], [[-1, 0], [0, 0], [1, 0], [1, 1]], [[0, -1], [0, 0], [0, 1], [-1, 1]]], // J
	[[[-1, 0], [0, 0], [1, 0], [1, -1]], [[0, -1], [0, 0], [0, 1], [1, 1]], [[-1, 0], [0, 0], [1, 0], [-1, 1]], [[0, 1], [0, 0], [0, -1], [-1, -1]]], // L
	[[[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 0], [1, 1]]], // O
	[[[0, 0], [0, -1], [1, -1], [-1, 0]], [[0, 0], [0, -1], [1, 0], [1, 1]], [[0, 0], [0, 1], [-1, 1], [1, 0]], [[-1, -1], [-1, 0], [0, 1], [0, 0]]], // S
	[[[0, 0], [0, -1], [-1, 0], [1, 0]], [[0, 0], [0, 1], [1, 0], [0, -1]], [[0, 0], [1, 0], [-1, 0], [0, 1]], [[0, 0], [0, -1], [0, 1], [-1, 0]]], // T
	[[[0, 0], [0, -1], [1, 0], [-1, -1]], [[0, 0], [0, 1], [1, 0], [1, -1]], [[-1, 0], [0, 0], [0, 1], [1, 1]], [[-1, 1], [-1, 0], [0, 0], [0, -1]]] // Z
];
let nextBlock = Array(3);
let timer = 500;
let dropping = false;
let curTetromino, curRot, curPos, score = 0, lost=false;

function init() {
	// Initialize grid array
	for(let i=0; i<10; i++) {
		grid[i] = new Array(20);
		for(let j=0; j<20; j++) {
			grid[i][j] = 0;
		}
	}
	for(let i=0; i<3; i++) {
		nextBlock[i] = Math.floor(Math.random()*7);
	}
	spawnNext();
}

function resetGame() {
	score = 0;
	timer = 500;
	lost = false;
	for(let i=0; i<10; i++)
		for(let j=0; j<20; j++)
			grid[i][j] = 0;
	spawnNext();
	setTimeout(drop.bind(null, true), 500);
}

function start() {
	init();
	setTimeout(drop.bind(null, true), 500);
}

// Input handling
window.onkeydown = function (e) {
	var code = e.keyCode ? e.keyCode : e.which;
	if(code == 37) { // Left arrow key
		move(-1);
	} else if(code == 38) { // Right arrow key
		rotateRight();
	} else if(code == 39) { // Right arrow key
		move(1);
	} else if(code == 40) { // Down arrow key
		drop(false);
	}
}

function spawnNext() {
	timer -= 1;
	lost = false;
	curPos = [5, 0];
	curRot = 0;
	curTetromino = nextBlock[0];
	dropping = true;
	for(let i=1; i<3; i++) {
		nextBlock[i-1] = nextBlock[i];
	}

	for(let i=0; i<4; i++) {
		x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
		y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
		if(x < 10 && y < 20 && x >= 0 && y >= 0 && grid[x][y] > 0) {
			lose();
			dropping = false;
			return;
		}
	}
	
	nextBlock[2] = Math.floor(Math.random()*7);
	drawGrid();
}

function rotateRight() {
	if(dropping) {
		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			grid[x][y] = 0;
		}

		curRot--;
		if(curRot == -1)
			curRot = 3;

		let overlaps = false;
		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			if(x >= 10 || y >= 20 || x < 0 || y < 0 || grid[x][y] > 0) {
				overlaps = true;
				break;
			}
		}

		if(overlaps) {
			curRot++;
			if(curRot == 4)
				curRot = 0;
		} 

		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			grid[x][y] = curTetromino+1;
		}

		drawGrid();
	}
}

function lock() { // Count cleared rows
	let clearedRows = 0;
	for(let i=0; i<20; i++) {
		let cnt = 0;
		for(let j=0; j<10; j++) {
			if(grid[j][i])
				cnt++;
		
		}
		if(cnt == 10) {
			// Drop all rows above the cleared row
			for(let k=i; k>0; k--) {
				for(let j=0; j<10; j++) {
					grid[j][k] = grid[j][k-1];
				}
			}
			clearedRows++;
		}
	}
	if(clearedRows == 1)
		score += 100;
	else if(clearedRows == 2)
		score += 200;
	else if(clearedRows == 3)
		score += 400;
	else if(clearedRows == 4)
		score += 800;

}

function checkLosing() {
	for(let i=0; i<10; i++)
		if(grid[i][0])
			return true;
	return false;
}

function lose() {
	console.log("Lost");
	lost = true;
	drawGrid();
	setTimeout(resetGame, 3500);
}

function drop(repeat) {
	if(dropping) {
		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			grid[x][y] = 0;
		}
		curPos[1]++;
	
		let overlaps = false;
		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			if(x >= 10 || y >= 20 || x < 0 || y < 0 || grid[x][y] > 0) {
				overlaps = true;
				break;
			}
		}

		if(overlaps)
			curPos[1]--;

		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			grid[x][y] = curTetromino+1;
		}
		drawGrid();
		if(overlaps) {
			dropping = false;
			lock();
			if(checkLosing()) {
				lose();
				return;
			}
			spawnNext();
		}
	}
	if(repeat && !lost)
		setTimeout(drop.bind(null, true), timer);
}

// 1 = right, -1 = left
function move(direction) {
	if(dropping) {
		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			grid[x][y] = 0;
		}
		curPos[0] += direction;
	
		let overlaps = false;
		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			if(x >= 10 || x < 0 || grid[x][y] > 0) {
				overlaps = true;
				break;
			}
		}

		if(overlaps)
			curPos[0] -= direction;

		for(let i=0; i<4; i++) {
			x = tetrominos[curTetromino][curRot][i][0]+curPos[0];
			y = tetrominos[curTetromino][curRot][i][1]+curPos[1];
			grid[x][y] = curTetromino+1;
		}
		drawGrid();
	}
}

function drawGrid() {
	const canvas = document.getElementById("mainCanvas");
	const ctx = canvas.getContext("2d");
	for(let i=0; i<10; i++) {
		for(let j=0; j<20; j++) {
			ctx.fillStyle = colours[grid[i][j]];
			ctx.fillRect(i*25, j*25, 25, 25);
		}
	}
	ctx.fillStyle = "#0d0d0d";
	for(let i=0; i<10; i++) {
		ctx.fillRect(i*25, 0, 1, 600);
		for(let j=0; j<20; j++) {
			ctx.fillRect(0, j*25, 250, 1);
		}
	}
	ctx.fillStyle = "White";
	ctx.textAlign = "left";
	ctx.font="14px 'Roboto Mono'";
	ctx.fillText("Score: " + score, 10, 14);
	if(lost) {
		ctx.textAlign = "center";
		ctx.fillStyle = "White";
		ctx.font="42px 'Roboto Mono'";
		ctx.fillText("YOU LOST!", canvas.width/2, canvas.height/2);
	}
}
