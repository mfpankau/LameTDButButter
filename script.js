/////////////
// GLOBALS //
/////////////
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mapPath = [
	// [x1, y1, x2, y2]
	[130, 0, 198, 325], // vert 1
	[268, 68, 333, 497], // vert 2
	[724, 130, 790, 390], // vert 3
	[130, 325, 789, 390], // hor 1
	[268, 67, 790, 132] // hor 2

];
var mouseX = -1000;
var mouseY = -1000;
// var tag = -1;

// for(var i = 0; i < mapPath.length; i++) {
//     ctx.fillStyle = 'green';
//     ctx.fillRect(mapPath[i][0] - 21, mapPath[i][1] - 21, 21 + mapPath[i][2] - mapPath[i][0], 21 + mapPath[i][3] - mapPath[i][1]);
// }


///////////
// SETUP //
///////////
const game = new Game();
setBackgroundImage(backgroundImage);

var elems = document.getElementsByClassName('button-img');
for (let i = 0; i <= 5; i++) {
	elems[i].src = towerImageMap[i];
}
game.setMoney(29809325);
printLog("=== Welcome to LameTD but butter ===");


///////////
// UTILS //
///////////
function printLog(msg, caret = false) {
	let elem = document.getElementById('log');
	elem.value += '> ' + msg + '\n';
	elem.scrollTop = elem.scrollHeight;
}

function setBackgroundImage(url) {
	var t = true;
	if (t) {
		let background = new Image();
		background.src = url;

		background.onload = function() {
			ctx.drawImage(background, 0, 0);
		};
	}
}

function isBetween(num, min, max) {
	return num >= min && num <= max;
}

function isPointInRects(x, y) {
	for (let i = 0; i < mapPath.length; i++) {
		var x1 = mapPath[i][0] - 10;
		var y1 = mapPath[i][1] - 15;
		var x2 = mapPath[i][2] + 10;
		var y2 = mapPath[i][3] + 15;

		if (isBetween(x, x1, x2) && isBetween(y, y1, y2)) {
			return true;
		}
	}
	return false;
}

function rebuild() {
	setBackgroundImage(backgroundImage);

	// reconstruct the placed towers on the map
	for (var i = 0; i < game.placedTowers.length; i++) {
		let tower = game.placedTowers[i];

		let img = new Image();
		img.src = towerImageMap[tower.type];
		img.onload = function() {
			ctx.drawImage(img, tower.x, tower.y);
		}
	}

	
	for (var i = 0; i < game.aliveEnemies.length; i++) {
        let enemy = game.aliveEnemies[i];

        let img = new Image();
        img.src = enemyImageMap[enemy.type];
        img.onload = function() {
            ctx.drawImage(img, enemy.x, enemy.y);
        }
	}

	if (!game.isPlacingTower) return;
	var radius = towerData[game.selectedTowerType].range;
	var towerImage = towerImageMap[game.selectedTowerType];
	var previewTower = new Image();
	previewTower.src = towerImage;
	previewTower.onload = function() {
		ctx.drawImage(previewTower, mouseX - 15, mouseY - 15);
	};
	ctx.beginPath();
	ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
	ctx.fillStyle = game.canPlaceTower ? "rgba(138, 138, 138, 0.5)" : "rgba(255, 0, 0, 0.5)";
	ctx.fill();

	requestAnimationFrame(rebuild);

	console.log("Rebuilt");
}

rebuild();

function updateButtons(enabled) {
	for (var i = 0; i <= 5; i++) {
		document.getElementById(`${i}`).disabled = !enabled;
		document.getElementById(`${i}`).style.color = enabled ? "#3c4043" : "rgba(255, 99, 99, 0.6)";

		document.getElementById('wave-button').disabled = !enabled;
	}
}

function canAfford(cost) {
	return (parseInt(game.money) >= parseInt(cost));
}

function rand(max) {
	return Math.floor(Math.random() * (max + 1));
}

function inRadius(pointX, pointY, centerX, centerY, radius) {
    return (pointX - centerX) * (pointX - centerX) + (pointY - centerY) * (pointY - centerY) < radius * radius;
}




////////////////////
// game functions //
////////////////////
function buyTower(id) {
	let tower = towerData[id];
	if (!canAfford(tower.cost)) {
		printLog("You can't afford that!");
		return;
	}
	game.setMoney(game.money - tower.cost);
	printLog(`You bought tower ${parseInt(tower.type) + 1}!`);
	game.setIsPlacingTower(true);
	game.setSelectedTowerType(parseInt(id));
	updateButtons(false);
	rebuild();
}

////////////
// events //
////////////
canvas.addEventListener('mousedown', function(e) {
	if (game.canPlaceTower && game.isPlacingTower) {
		const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

		let tower = new Tower(game.selectedTowerType, mouseX - 15, mouseY - 15);
		tower.build(true);

		game.setIsPlacingTower(false);
		game.setSelectedTowerType(-1);
		updateButtons(true);
	}

	if (!game.canPlaceTower && game.isPlacingTower) printLog("You can't place a tower here!");
});


canvas.addEventListener('mouseleave', function(e) {
	mouseX = -1000;
	mouseY = -1000;
});


canvas.addEventListener('mousemove', function(e) {
	const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // mouseX = e.clientX;
	// mouseY = e.clientY;
	game.setCanPlaceTower(game.isPlacingTower && !isPointInRects(mouseX, mouseY) && mouseX > 0 && mouseY > 0);

    for (var i = 0; i < game.placedTowers.length; i++) {
        var tower = game.placedTowers[i];
        

        if (inRadius(mouseX, mouseY, tower.x, tower.y, tower.range)) {
            
        }
    }
});




function startWave() {
	printLog("Wave " + (parseInt(game.wave) + 1) + " started!");
	game.setWave(game.wave + 1);
	updateButtons(false);


    // spawn enemies
    for (var i = 0; i < game.wave * 10 / 2; i++) {
        let enemy = new Enemy(0);
        enemy.setX(150);
        enemy.setY(-2 * (i * 20));

        enemy.spawn(true);
    }

	moveEnemies();
}


function moveEnemies() {
	for(var i = 0; i < game.aliveEnemies.length; i++) {
		let enemy = game.aliveEnemies[i];
		if(enemy == undefined) return;


		if(isBetween(enemy.y, -2000, 330) && isBetween(enemy.x, 130, 200) && !enemy.shouldFinish) {
			enemy.move(0, 10);
		} else if(isBetween(enemy.x, 130, 735) && isBetween(enemy.y, 325, 390) && !enemy.shouldFinish) {
			enemy.move(10, 0);
		} else if(isBetween(enemy.y, 95, 390) && isBetween(enemy.x, 724, 790) && !enemy.shouldFinish) {
			enemy.move(0, -10);
		} else if(isBetween(enemy.x, 300, 790) && isBetween(enemy.y, 0, 95) && !enemy.shouldFinish) {
			enemy.move(-10, 0);
		} else if(isBetween(enemy.x, 268, 302) && isBetween(enemy.y, 69, 500)) {
			enemy.shouldFinish = true;
		}
		if(enemy.shouldFinish) {
			enemy.move(0, 10);
		}

		if(enemy.y > 500) {
			enemy.die();
		}
	}

	if(game.aliveEnemies.length >= 1) {
		setTimeout(moveEnemies, 1);
	} else {
		if(game.health > 0) { 
			printLog(`Wave ${game.wave} finished!`);
			updateButtons(true);
		}
		return;
	}

}