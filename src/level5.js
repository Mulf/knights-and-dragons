var smallBlkSize = 50;

var zoneFilled = [false, false, false, false];
var dropZones = [];
var dragPosition;

var currInputs = [];		// an empty array for the inputs
var result1;
var result2;
var result3;
var result4;
var finalRes;
var enemies = [];

var win;							// the win text
var loss;							// the loss text
var retry;							// the retry button	

var currLevelScore = 100;			// the current level score
var timerCount = 110;				// leave 10 more seconds to operate
var timer;							// the timer of the game
var timing = [];					// the timeing of each gate

level5 = function(game) {};

level5.prototype = {

	preload: function() {
		
	},
	
	create: function() {
		// load the background
		var background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		var gamehomeBt = game.add.button(720, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		gamehomeBt.scale.setTo(0.3, 0.3);
		gamehomeBt.anchor.setTo(0.5, 0.5);

		dropZones[0] = game.add.sprite(0, 0, 'dropzone-3');
		dropZones[1] = game.add.sprite(0, 0, 'dropzone-3');
		dropZones[2] = game.add.sprite(0, 0, 'dropzone-2');
		dropZones[3] = game.add.sprite(0, 0, 'dropzone-3');
		dropZones[4] = game.add.sprite(0, 0, 'dropzone-1');

		for (i = 0; i < 5; i++) {
			dropZones[i].width = smallBlkSize;
			dropZones[i].height = smallBlkSize;
		}

		// drop zone for input 0, 1, 2  -> result 1 (accepts nor, xnor)
		dropZones[0].x = 125;
		dropZones[0].y = 200;

		// drop zone for input 3, 4, 5  -> result 2 (accepts nor, xnor)
		dropZones[1].x = 125;
		dropZones[1].y = 350;

		// drop zone for input 6, 7 	-> result 3 (accepts nor, xnor)
		dropZones[2].x = 125;
		dropZones[2].y = 475;

		// drop zone for result 1, 2, 3	-> result 4 (accepts nor, xnor) 
		dropZones[3].x = 250;
		dropZones[3].y = 342;

		// drop zone for result 4, 		-> finalRes (accepts not, buffer)
		dropZones[4].x = 450;
		dropZones[4].y = 342;

		var notGate = game.add.sprite(10, 15, 'not-gate');
		notGate.width = smallBlkSize;
		notGate.height = smallBlkSize;

		var bufGate = game.add.sprite(110, 15, 'buffer-gate');
		bufGate.width = smallBlkSize;
		bufGate.height = smallBlkSize;

		var norGate = game.add.sprite(210, 15, 'nor-gate');
		norGate.width = smallBlkSize;
		norGate.height = smallBlkSize;

		var xnorGate = game.add.sprite(310, 15, 'xnor-gate');
		xnorGate.width = smallBlkSize;
		xnorGate.height = smallBlkSize;

		notGate.inputEnabled = true;
		notGate.events.onInputDown.add(this.onGateClick, this);

		bufGate.inputEnabled = true;
		bufGate.events.onInputDown.add(this.onGateClick, this);

		norGate.inputEnabled = true;
		norGate.events.onInputDown.add(this.onGateClick, this);

		xnorGate.inputEnabled = true;
		xnorGate.events.onInputDown.add(this.onGateClick, this);

		this.randomTimingGenerator(4);
		this.putTimingOnGame(4);

		this.randomInputGenerator(8);
		for (i = 0; i < 8; i++) {
			this.setSpriteParams(currInputs[i], 0, 150 + i * 50, smallBlkSize, smallBlkSize);
		}

		this.randomEnemiesGenerator(1);
		this.setSpriteParams(enemies[0], 700, 342, smallBlkSize, smallBlkSize);

		// timer
		currLevelScore = 100;
		timerCount = 110;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
	},

	putTimingOnGame: function(num) {
		for (i = 0; i < num; i++) {
			var timingText;
			switch(timing[i]) {
				case 1:
					timingText = game.add.sprite(10 + i * 100, 75, '1-text');
					break;
				case 2:
					timingText = game.add.sprite(10 + i * 100, 75, '2-text');
					break;
				case 3:
					timingText = game.add.sprite(10 + i * 100, 75, '3-text');
					break;
				case 4:
					timingText = game.add.sprite(10 + i * 100, 75, '4-text');
					break;
				case 5:
					timingText = game.add.sprite(10 + i * 100, 75, '5-text');
					break;
				case 6:
					timingText = game.add.sprite(10 + i * 100, 75, '6-text');
					break;
				case 7:
					timingText = game.add.sprite(10 + i * 100, 75, '7-text');
					break;
				case 8:
					timingText = game.add.sprite(10 + i * 100, 75, '8-text');
					break;
				case 9:
					timingText = game.add.sprite(10 + i * 100, 75, '9-text');
					break;
			}
		}
		timingText.width = smallBlkSize;
		timingText.height = smallBlkSize;
	},

	clickHome: function() {
		game.state.start("menu");
	},

	deductScore: function() {
		timerCount--;				// deduct timercount every second
		if (timerCount <= 100) {
			// when timercount less than 100, deduct curr score
			currLevelScore--;
		}

		if (currLevelScore <= 0) {
			currLevelScore = 0;
			timer.stop();
			this.gameOver;
		}
	},

	gameOver: function() {
		loss = game.add.sprite(400, 200, 'loss');
		loss.anchor.setTo(0.5, 0.5);

		var retryBt = this.add.button(400, 400, 'retryBt', this.clickRetry, this, 2, 1, 0);
		retryBt.anchor.setTo(0.5, 0.5);
	},

	// creates a list of random inputs
	randomInputGenerator: function(num) {
		var ranNum;
		for (i = 0; i < num; i++) {
			ranNum = Math.floor((Math.random() * 2))	// either 0 or 1
			console.log(ranNum);
			if (ranNum == 0) {
				currInputs[i] = game.add.sprite(0, 0, 'red-knight-sheet');
			} else {
				currInputs[i] = game.add.sprite(0, 0, 'yellow-knight-sheet');
			}
		}
	},

	randomEnemiesGenerator: function(num) {
		var ranNum;
		for (i = 0; i < num; i++) {
			ranNum = Math.floor((Math.random() * 2))	// either 0 or 1
			if (ranNum == 0) {
				enemies[i] = game.add.sprite(0, 0, 'red-dragon-sheet');
			} else {
				enemies[i] = game.add.sprite(0, 0, 'yellow-dragon-sheet');
			}
			enemies[i].animations.add('fly');
			enemies[i].animations.play('fly', 1000, true);
		}
	},

	randomTimingGenerator: function(num) {
		var ranNum;
		for (i = 0; i < num; i++) {
			ranNum = Math.floor((Math.random() * 8) + 1)	// 1-9
			timing[i] = ranNum;
		}
	},

	onOver: function(sprite, pointer) {
		sprite.tint = 0xff7777;
	},

	onOut: function(sprite, pointer) {
		sprite.tint = 0xffffff;
	},

	onGateClick: function(sprite) {
		var spriteDup = game.add.sprite(sprite.x + 10, sprite.y + 10, sprite.key, sprite.frame);
		spriteDup.width = smallBlkSize;
		spriteDup.height = smallBlkSize;
		this.setToDragable(spriteDup);
	},

	onDragStart: function(sprite, pointer) {
		dragPosition.set(sprite.x, sprite.y);
	},

	onDragStop: function(sprite, pointer) {
		// Note: dropZone 0, 2 accepts xor/nand, 1, 3 accepts not/buffer
		if (sprite.overlap(dropZones[0])) {
			// drop zone for input 0, 1, 2  -> result 1 (accepts nor, xnor)
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[0].x;
				sprite.y = dropZones[0].y;
				zoneFilled[0] = true;

				var movein0 = game.add.tween(currInputs[0]).to({x: 125, y: 200}, 1000, Phaser.Easing.Linear.None, true);
				movein0.onStart.add(function() {this.startAnimation(currInputs[0])}, this);
				var movein1 = game.add.tween(currInputs[1]).to({x: 125, y: 200}, 1000, Phaser.Easing.Linear.None, true);
				movein1.onStart.add(function() {this.startAnimation(currInputs[1])}, this);
				var movein2 = game.add.tween(currInputs[2]).to({x: 125, y: 200}, 1000, Phaser.Easing.Linear.None, true);
				movein2.onStart.add(function() {this.startAnimation(currInputs[2])}, this);

				movein2.onComplete.add(function() {this.showResult(sprite, 1)}, this);
				//this.showResult(sprite, 1);
			}
		} else if (sprite.overlap(dropZones[1])) {
			// drop zone for input 3, 4, 5  -> result 2 (accepts nor, xnor)
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[1].x;
				sprite.y = dropZones[1].y;
				zoneFilled[1] = true;

				var movein0 = game.add.tween(currInputs[3]).to({x: 125, y: 350}, 1000, Phaser.Easing.Linear.None, true);
				movein0.onStart.add(function() {this.startAnimation(currInputs[3])}, this);
				var movein1 = game.add.tween(currInputs[4]).to({x: 125, y: 350}, 1000, Phaser.Easing.Linear.None, true);
				movein1.onStart.add(function() {this.startAnimation(currInputs[4])}, this);
				var movein2 = game.add.tween(currInputs[5]).to({x: 125, y: 350}, 1000, Phaser.Easing.Linear.None, true);
				movein2.onStart.add(function() {this.startAnimation(currInputs[5])}, this);

				movein2.onComplete.add(function() {this.showResult(sprite, 2)}, this);
				//this.showResult(sprite, 2);
			}
		} else if (sprite.overlap(dropZones[2])) {
			// drop zone for input 6, 7 	-> result 3 (accepts nor, xnor)
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[2].x;
				sprite.y = dropZones[2].y;
				zoneFilled[2] = true;

				var movein0 = game.add.tween(currInputs[6]).to({x: 125, y: 475}, 1000, Phaser.Easing.Linear.None, true);
				movein0.onStart.add(function() {this.startAnimation(currInputs[6])}, this);
				var movein1 = game.add.tween(currInputs[7]).to({x: 125, y: 475}, 1000, Phaser.Easing.Linear.None, true);
				movein1.onStart.add(function() {this.startAnimation(currInputs[7])}, this);

				movein1.onComplete.add(function() {this.showResult(sprite, 3)}, this);
				//this.showResult(sprite, 3);
			}
		} else if (sprite.overlap(dropZones[3])) {
			// drop zone for result 1, 2, 3	-> result 4 (accepts nor, xnor) 
			// disabled until 1, 2, 3 is filled
			if (zoneFilled[0] && zoneFilled[1] && zoneFilled[2] && !(sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[3].x;
				sprite.y = dropZones[3].y;
				zoneFilled[3] = true;

				var movein0 = game.add.tween(result1).to({x: 250, y: 342}, 1000, Phaser.Easing.Linear.None, true);
				movein0.onStart.add(function() {this.startAnimation(result1)}, this);
				var movein1 = game.add.tween(result2).to({x: 250, y: 342}, 1000, Phaser.Easing.Linear.None, true);
				movein1.onStart.add(function() {this.startAnimation(result2)}, this);
				var movein2 = game.add.tween(result3).to({x: 250, y: 342}, 1000, Phaser.Easing.Linear.None, true);
				movein2.onStart.add(function() {this.startAnimation(result3)}, this);

				movein2.onComplete.add(function() {this.showResult(sprite, 4)}, this);
				//this.showResult(sprite, 4);
			} else {
				sprite.kill();
			}
		} else if (sprite.overlap(dropZones[4])) {
			if (zoneFilled[3] && (sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[4].x;
				sprite.y = dropZones[4].y;

				var movein2 = game.add.tween(result4).to({x: 450, y: 342}, 1000, Phaser.Easing.Linear.None, true);
				movein2.onStart.add(function() {this.startAnimation(result4)}, this);

				movein2.onComplete.add(function() {this.showResult(sprite, 5)}, this);
				//this.showResult(sprite, 5);
				//this.judgment();
			} else {
				sprite.kill();
			}
		} else {
			sprite.kill();
		}
	},

	startAnimation: function(sprite) {
		sprite.animations.add('walk');
		sprite.animations.play('walk', 500, true);
	},

	stopAnimation: function(sprite) {
		sprite.animations.stop(null, true);
	},

	nextLevel: function(event) {
		game.state.start("level6");	
	},
	
	setToDragable: function(sprite) {
		sprite.inputEnabled = true;
		sprite.input.enableDrag();

		sprite.events.onInputOver.add(this.onOver, this);
		sprite.events.onInputOut.add(this.onOut, this);
		sprite.events.onDragStart.add(this.onDragStart, this);
		sprite.events.onDragStop.add(this.onDragStop, this);

		dragPosition = new Phaser.Point(sprite.x, sprite.y);
	},

	judgment: function() {
		timer.stop();
		if ((finalRes.key == "red-knight-sheet" && enemies[0].key == "red-dragon-sheet") || (finalRes.key == "yellow-knight-sheet" && enemies[0].key == "yellow-dragon-sheet")) {
			var kill = game.add.sprite(700, 342, 'kill-sheet');
			kill.width = 100;
			kill.height = 100;
			kill.animations.add('kill');
			kill.animations.play('kill', 50, false);
			enemies[0].kill();
			kill.animations.currentAnim.onComplete.add(function() {this.gameWon()}, this);
		} else {
			loss = game.add.sprite(400, 200, 'loss');
			loss.anchor.setTo(0.5, 0.5);

			var retryBt = this.add.button(400, 400, 'retryBt', this.clickRetry, this, 2, 1, 0);
			retryBt.anchor.setTo(0.5, 0.5);
		}
	},

	gameWon: function() {
		win = game.add.sprite(400, 100, 'win');
		win.anchor.setTo(0.5, 0.5);
		// if win, show the score and go to the next level
		if (currLevelScore == 100) {
			this.placeNumSprite(1, 340, 300);
			this.placeNumSprite(0, 380, 300);
			this.placeNumSprite(0, 430, 300);
		} else if (currLevelScore >= 10) {
			var num1 = currLevelScore % 10;
			var num2 = Math.floor(currLevelScore / 10);
			this.placeNumSprite(num2, 355, 300);
			this.placeNumSprite(num1, 415, 300);
		} else {
			this.placeNumSprite(currLevelScore, 350, 300);
		}
		var saveBt = game.add.button(400, 500, 'saveBt', this.saveGameScore, this, 0, 1, 2);
		saveBt.anchor.setTo(0.5, 0.5);
	},

	saveGameScore: function() {
		window.saveScore(currLevelScore);
	},

	placeNumSprite: function(num, x, y) {
		if (num == 0)
			var numText = game.add.sprite(x, y, '0-text');
		else if (num == 1)
			var numText = game.add.sprite(x, y, '1-text');
		else if (num == 2)
			var numText = game.add.sprite(x, y, '2-text');
		else if (num == 3)
			var numText = game.add.sprite(x, y, '3-text');
		else if (num == 4)
			var numText = game.add.sprite(x, y, '4-text');
		else if (num == 5)
			var numText = game.add.sprite(x, y, '5-text');
		else if (num == 6)
			var numText = game.add.sprite(x, y, '6-text');
		else if (num == 7)
			var numText = game.add.sprite(x, y, '7-text');
		else if (num == 8)
			var numText = game.add.sprite(x, y, '8-text');
		else if (num == 9)
			var numText = game.add.sprite(x, y, '9-text');
		numText.anchor.setTo(0.5, 0.5);
	},

	clickRetry: function() {
		game.state.start("level5");
	},

	setSpriteParams: function(sprite, x, y, width, height) {
		sprite.x = x;
		sprite.y = y;
		sprite.width = width;
		sprite.height = height;
	},

	bufferGateOutput: function(sprite) {
		// accepts a sprite and pass it
		var bufRes;
		if (sprite.key == "red-knight-sheet")
			bufRes = game.add.sprite(0, 0, 'red-knight-sheet');
		else if (sprite.key == "yellow-knight-sheet")
			bufRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		return bufRes;
	},

	notGateOutput: function(sprite) {
		// accepts a sprite and revert it
		var notRes;
		if (sprite.key == "red-knight-sheet")
			notRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		else if (sprite.key == "yellow-knight-sheet")
			notRes = game.add.sprite(0, 0, 'red-knight-sheet');
		return notRes;
	},

	orGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var orRes;
		for (i = 0; i < sprites[0].length; i++) {
			// or gates return a grey knight when all the items in the array are grey
			if (sprites.key != "yellow-knight-sheet") {
				// return a white knight
				orRes = game.add.sprite(0, 0, 'red-knight-sheet');
				return orRes;
			}
		}
		orRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		return orRes;
	},

	norGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var norRes;
		for (i = 0; i < sprites[0].length; i++) {
			// or gates return a grey knight when all the items in the array are grey
			if (sprites.key != "yellow-knight-sheet") {
				// return a white knight
				norRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
				return norRes;
			}
		}
		norRes = game.add.sprite(0, 0, 'red-knight-sheet');
		return norRes;
	},

	xnorGateOutput: function(sprites) {
		if (sprites.length == 2) {
			// the last call
			if (sprites[0].key == sprites[1].key)
				return game.add.sprite(0, 0, 'red-knight-sheet');
			else
				return game.add.sprite(0, 0, 'yellow-knight-sheet');
		}

		var rtSprite = this.xnorGateOutput(sprites.slice(1));
		if (sprites[0].key == rtSprite.key) {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'red-knight-sheet');
		} else {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'yellow-knight-sheet');
		}
	},

	showResult: function(sprite, num) {
		var inputArray = [];
		if (sprite.key == "nor-gate") {
			currLevelScore -= timing[2];
	        // only produce white when both are white
	        if (num == 1) {
	            // input 0, 1, 2
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.norGateOutput(inputArray);
	            for (i = 0; i < 3; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result1, 125, 200, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result1).to({x: 200}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result1)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result1)}, this);
	        } else if (num == 2) {
	            // input 3, 4, 5
	            inputArray[0] = currInputs[3];
	            inputArray[1] = currInputs[4];
	            inputArray[2] = currInputs[5];
	            result2 = this.norGateOutput(inputArray);
	            for (i = 3; i < 6; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result2, 125, 350, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result2).to({x: 200}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result2)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result2)}, this);
	        } else if (num == 3) {
	        	// input 6, 7
	        	inputArray[0] = currInputs[6];
	            inputArray[1] = currInputs[7];
	            result3 = this.norGateOutput(inputArray);
	            for (i = 6; i < 8; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result3, 125, 475, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result3).to({x: 200}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result3)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result3)}, this);
	        } else if (num == 4) {
	        	// result 1, 2, 3
	        	inputArray[0] = result1;
	            inputArray[1] = result2;
	            inputArray[2] = result3;
	            result4 = this.norGateOutput(inputArray);
	            result1.kill();
	            result2.kill();
	            result3.kill();
	            this.setSpriteParams(result4, 250, 342, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result4).to({x: 350}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result4)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result4)}, this);
	        }
	    } else if (sprite.key == "xnor-gate") {
	    	currLevelScore -= timing[3];
	        if (num == 1) {
	            // input 0, 1, 2
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.xnorGateOutput(inputArray);
	            for (i = 0; i < 3; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result1, 125, 200, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result1).to({x: 200}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result1)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result1)}, this);
	        } else if (num == 2) {
	            // input 3, 4, 5
	            inputArray[0] = currInputs[3];
	            inputArray[1] = currInputs[4];
	            inputArray[2] = currInputs[5];
	            result2 = this.xnorGateOutput(inputArray);
	            for (i = 3; i < 6; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result2, 125, 350, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result2).to({x: 200}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result2)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result2)}, this);
	        } else if (num == 3) {
	        	// input 6, 7
	        	inputArray[0] = currInputs[6];
	            inputArray[1] = currInputs[7];
	            result3 = this.xnorGateOutput(inputArray);
	            for (i = 6; i < 8; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result3, 125, 475, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result3).to({x: 200}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result3)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result3)}, this);
	        } else if (num == 4) {
	        	// result 1, 2, 3
	        	inputArray[0] = result1;
	            inputArray[1] = result2;
	            inputArray[2] = result3;
	            result4 = this.xnorGateOutput(inputArray);
	            result1.kill();
	            result2.kill();
	            result3.kill();
	            this.setSpriteParams(result4, 250, 342, smallBlkSize, smallBlkSize);

	            var moveout1 = game.add.tween(result4).to({x: 350}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result4)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result4)}, this);
	        }
	    } else if (sprite.key == "buffer-gate" && num == 5) {
	    	currLevelScore -= timing[1];
            finalRes = this.bufferGateOutput(result4);
            result4.kill();
            this.setSpriteParams(finalRes, 450, 342, smallBlkSize, smallBlkSize);
            var moveout1 = game.add.tween(finalRes).to({x: 550}, 1000, Phaser.Easing.Linear.None, true);
			moveout1.onStart.add(function() {this.startAnimation(finalRes)}, this);
			moveout1.onComplete.add(function() {this.stopAnimation(finalRes)}, this);
			moveout1.onComplete.add(function() {this.judgment()}, this);
	    } else if (sprite.key == "not-gate" && num == 5) {
	    	currLevelScore -= timing[0];
            finalRes = this.notGateOutput(result4);
            result4.kill();
            this.setSpriteParams(finalRes, 450, 342, smallBlkSize, smallBlkSize);
            var moveout1 = game.add.tween(finalRes).to({x: 550}, 1000, Phaser.Easing.Linear.None, true);
			moveout1.onStart.add(function() {this.startAnimation(finalRes)}, this);
			moveout1.onComplete.add(function() {this.stopAnimation(finalRes)}, this);
			moveout1.onComplete.add(function() {this.judgment()}, this);
	    }
	},

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + currLevelScore, 600, 550);
	}
};
