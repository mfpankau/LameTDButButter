class Tower {
	constructor(type, x, y) { // range = range of the tower, damage = damage of the tower, cost = cost of the tower, reload = reload time of the tower
		this.type = type;
		this.x = x;
		this.y = y;
        
        if(this.type >= 0 && this.type <= 5) {
            this.range = towerData[type].range;
            this.damage = towerData[type].damage;
            this.cost = towerData[type].cost;
            this.reload = towerData[type].speed;
        } else {
            this.range = null;
            this.damage = null;
            this.cost = null;
            this.reload = null;
        }
	}

	x() {
		return this.x;
	}
	setX(x) {
		this.x = x;
	}

	y() {
		return this.y;
	}
	setY(y) {
		this.y = y;
	}


	range() {
		return this.range;
	}
	setRange(range) {
		this.range = range;
	}

	damage() {
		return this.damage;
	}
	setDamage(damage) {
		this.damage = damage;
	}

	cost() {
		return this.cost;
	}
	setCost(cost) {
		this.cost = cost;
	}

	reload() {
		return this.reload;
	}
	setReload(reload) {
		this.reload = reload;
	}

	build(backup = false) {
		let img = new Image();
		img.src = towerImageMap[this.type];
		let x = this.x;
		let y = this.y;
		img.onload = function() {
			ctx.drawImage(img, x, y);
		}
		if (backup) {
			mapPath.push([x, y, x + 30, y + 32]);
			game.placedTowers.push(this);
		}
	}
}

class Enemy {
    constructor(type) {
        this.type = type;
        this.x = null;
        this.y = null;
        
        this.reward = (this.type + 1) * 10;
        this.speed = enemyData[this.type].speed;
        this.health = enemyData[this.type].health;
        this.damage = enemyData[this.type].damage;
        
        this.tag = -1;

        this.shouldFinish = false;
    }

    x() {
		return this.x;
	}
	setX(x) {
		this.x = x;
	}

	y() {
		return this.y;
	}
	setY(y) {
		this.y = y;
	}

    reward() {
        return this.reward;
    }
    setReward(reward) {
        this.reward = reward;
    }

    speed() {
        return this.speed;
    }
    setSpeed(speed) {
        this.speed = speed;
    }

    health() {
        return this.health;
    }
    setHealth(health) {
        this.health = health;
    }

    damage() {
        return this.damage;
    }
    setDamage(damage) {
        this.damage = damage;
    }

    tag() {
        return this.tag;
    }

    setTag(tag) {
        this.tag = tag;
    }

    shouldFinish() {
        return this.shouldFinish;
    } 

    setShouldFinish(shouldFinish) {
        this.shouldFinish = shouldFinish;
    }


    move(x, y) {
        this.x += x;
        this.y += y;
        requestAnimationFrame(rebuild);
    }

    spawn(backup = false) {
        let img = new Image();
        img.src = enemyImageMap[this.type];
        let x = this.x;
        let y = this.y;
        img.onload = function() {
            ctx.drawImage(img, x, y);
        }

        if (backup) {
			// mapPath.push([x, y, x + 30, y + 32]);
			game.aliveEnemies.push(this);
		}
    }

    die(wasKilled=false) {
        game.aliveEnemies.splice(game.aliveEnemies.indexOf(this), 1);
        if(!wasKilled) {
            game.setHealth(game.health - this.damage);
        }
    }
}

class Game {
	constructor() {
		this.health = 10;
		this.money = 150;
		this.wave = 0;

		this.isPlacingTower = false;
		this.selectedTowerType = NaN;
		this.canPlaceTower = false;

		this.placedTowers = [];
        this.aliveEnemies = [];

	}

	health() {
		return this.health;
	}
	setHealth(health) {
        if(health <= 0) {
            this.health = 0;
            printLog("Game Over! Haha you succ");
        }
		this.health = health;
		document.getElementById('health').innerHTML = this.health;
	}

	money() {
		return this.money;
	}
	setMoney(money) {
		this.money = money;
		document.getElementById('cash').innerHTML = this.money;
	}

	wave() {
		return this.wave;
	}
	setWave(wave) {
		this.wave = wave;
		document.getElementById('wave').innerHTML = this.wave;
	}


	isPlacingTower() {
		return this.isPlacingTower;
	}
	setIsPlacingTower(isPlacingTower) {
		this.isPlacingTower = isPlacingTower;
	}

	selectedTowerType() {
		return this.selectedTowerType;
	}
	setSelectedTowerType(selectedTowerType) {
		this.selectedTowerType = selectedTowerType;
	}

	canPlaceTower() {
		return this.canPlaceTower;
	}
	setCanPlaceTower(canPlaceTower) {
		this.canPlaceTower = canPlaceTower;
	}

	placedTowers() {
		return this.placedTowers;
	}
	setPlacedTowers(placedTowers) {
		this.placedTowers = placedTowers;
	}
}