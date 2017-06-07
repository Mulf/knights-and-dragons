// the block size of this level
var blkWidth = 100;
var blkHeight = 100;

var zoneFilled = [false, false, false, false];	// indicates whether some zone has been filled
var dropZones = [];								// the list of dragZones
var dragPosition;

var currInputs = [];				// an empty array for the inputs

// several results
var result1;				
var result2;
var result3;
var finalRes;
var enemies = [];					// the enemies list

var win;							// the win text
var loss;							// the loss text
var retry;							// the retry button	

var currLevelScore = 100;			// the current level score
var timerCount = 110;				// leave 10 more seconds to operate
var timer;							// the timer of the game
var timing = [];					// the timeing of each gate

level2 = function(game) {};

level2.prototype = {
	preload: function() {
		
	},
	
	create: function() {
		// load the background
		var background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		// load the home button
		var gamehomeBt = game.add.button(720, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		gamehomeBt.scale.setTo(0.3, 0.3);
		gamehomeBt.anchor.setTo(0.5, 0.5);

		// set up the drapzones
		dropZones[0] = game.add.sprite(150, 200, 'dropzone-2');
		dropZones[1] = game.add.sprite(150, 200, 'dropzone-2');
		dropZones[2] = game.add.sprite(150, 200, 'dropzone-2');
		dropZones[3] = game.add.sprite(150, 200, 'dropzone-1');

		for (i = 0; i < 4; i++) {
			dropZones[i].width = blkWidth;
			dropZones[i].height = blkHeight;
		}

		dropZones[0].x = 125;
		dropZones[0].y = 200;

		dropZones[1].x = 125;
		dropZones[1].y = 400;

		dropZones[2].x = 300;
		dropZones[2].y = 300;

		dropZones[3].x = 500;
		dropZones[3].y = 300;

		// set up the not and buffer gate
		var notGate = game.add.sprite(10, 15, 'not-gate');
		notGate.width = blkWidth;
		notGate.height = blkHeight;

		var bufGate = game.add.sprite(110, 15, 'buffer-gate');
		bufGate.width = blkWidth;
		bufGate.height = blkHeight;

		andGate = game.add.sprite(210, 15, 'and-gate');
		andGate.width = blkWidth;
		andGate.height = blkHeight;

		orGate = game.add.sprite(310, 15, 'or-gate');
		orGate.width = blkWidth;
		orGate.height = blkHeight;

		notGate.inputEnabled = true;
		notGate.events.onInputDown.add(this.onGateClick, this);

		bufGate.inputEnabled = true;
		bufGate.events.onInputDown.add(this.onGateClick, this);

		andGate.inputEnabled = true;
		andGate.events.onInputDown.add(this.onGateClick, this);

		orGate.inputEnabled = true;
		orGate.events.onInputDown.add(this.onGateClick, this);

		// set up timing, inputs, and enemies
		this.randomTimingGenerator(4);
		this.putTimingOnGame(4);

		this.randomInputGenerator(4);
		for (i = 0; i < 4; i++) {
			this.setSpriteParams(currInputs[i], 0, 150 + i * 100, 100, 100);
		}

		this.randomEnemiesGenerator(1);
		this.setSpriteParams(enemies[0], 700, 300, 100, 100);

		// set the timer
		currLevelScore = 100;
		timerCount = 110;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
	},

	// put a timing delay to each gate
	putTimingOnGame: function(num) {
		for (i = 0; i < num; i++) {
			switch(timing[i]) {
				case 1:
					var timingText = game.add.sprite(10 + i * 100, 75, '1-text');
					break;
				case 2:
					var timingText = game.add.sprite(10 + i * 100, 75, '2-text');
					break;
				case 3:
					var timingText = game.add.sprite(10 + i * 100, 75, '3-text');
					break;
				case 4:
					var timingText = game.add.sprite(10 + i * 100, 75, '4-text');
					break;
				case 5:
					var timingText = game.add.sprite(10 + i * 100, 75, '5-text');
					break;
				case 6:
					var timingText = game.add.sprite(10 + i * 100, 75, '6-text');
					break;
				case 7:
					var timingText = game.add.sprite(10 + i * 100, 75, '7-text');
					break;
				case 8:
					var timingText = game.add.sprite(10 + i * 100, 75, '8-text');
					break;
				case 9:
					var timingText = game.add.sprite(10 + i * 100, 75, '9-text');
					break;
			}
		}
	},

	// click the home button
	clickHome: function() {
		game.state.start("menu");
	},

	// deduct the score for each second after 100 seconds
	deductScore: function() {
		timerCount--;				// deduct timercount every second
		if (timerCount <= 100) {
			// when timercount less than 100, deduct current score
			currLevelScore--;
		}
		// when the current score reaches 0, game over
		if (currLevelScore <= 0) {
			currLevelScore = 0;
			timer.stop();
			this.gameOver;
		}
	},

	// when game oevr, display loss msg and retry
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
			if (ranNum == 0) {
				currInputs[i] = game.add.sprite(0, 0, 'red-knight-sheet');
			} else {
				currInputs[i] = game.add.sprite(0, 0, 'yellow-knight-sheet');
			}
		}
	},

	// generate randomly colored enemies
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

	// generate randomly timing from 1-9
	randomTimingGenerator: function(num) {
		var ranNum;
		for (i = 0; i < num; i++) {
			ranNum = Math.floor((Math.random() * 8) + 1)	// 1-9
			timing[i] = ranNum;
		}
	},

	// the effect of gates
	onOver: function(sprite, pointer) {
		sprite.tint = 0xff7777;
	},

	onOut: function(sprite, pointer) {
		sprite.tint = 0xffffff;
	},

	// when click the gate, generate a duplicate gate and set it to dragable
	onGateClick: function(sprite) {
		var spriteDup = game.add.sprite(sprite.x + 10, sprite.y + 10, sprite.key, sprite.frame);
		spriteDup.width = blkWidth;
		spriteDup.height = blkHeight;
		this.setToDragable(spriteDup);
	},

	// when the dragging start, change the pos accordingly
	onDragStart: function(sprite, pointer) {
		dragPosition.set(sprite.x, sprite.y);
	},

	// when the user drap the gate, if the gate is overlapped with the door, place it onto, otherwise killed
	onDragStop: function(sprite, pointer) {
		// Note: dropZone 0, 1, 2 accepts or/and, 3 accepts not/buffer
		if (sprite.overlap(dropZones[0])) {
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

				movein1.onComplete.add(function() {this.showResult(sprite, 1)}, this);
			}
		} else if (sprite.overlap(dropZones[1])) {
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[1].x;
				sprite.y = dropZones[1].y;
				zoneFilled[1] = true;

				var movein2 = game.add.tween(currInputs[2]).to({x: 125, y: 400}, 1000, Phaser.Easing.Linear.None, true);
				movein2.onStart.add(function() {this.startAnimation(currInputs[2])}, this);
				var movein3 = game.add.tween(currInputs[3]).to({x: 125, y: 400}, 1000, Phaser.Easing.Linear.None, true);
				movein3.onStart.add(function() {this.startAnimation(currInputs[3])}, this);

				movein3.onComplete.add(function() {this.showResult(sprite, 2)}, this);
			}
		} else if (sprite.overlap(dropZones[2])) {
			// disabled until dropzone 0, 1 are filled
			if (zoneFilled[0] && zoneFilled[1]) {
				if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
					sprite.kill();
				} else {
					sprite.x = dropZones[2].x;
					sprite.y = dropZones[2].y;
					zoneFilled[2] = true;

					var movein4 = game.add.tween(result1).to({x: 300, y: 300}, 1000, Phaser.Easing.Linear.None, true);
					movein4.onStart.add(function() {this.startAnimation(result1)}, this);
					var movein5 = game.add.tween(result2).to({x: 300, y: 300}, 1000, Phaser.Easing.Linear.None, true);
					movein5.onStart.add(function() {this.startAnimation(result2)}, this);

					movein5.onComplete.add(function() {this.showResult(sprite, 3)}, this);
				}
			} else {
				sprite.kill();
			}
		} else if (sprite.overlap(dropZones[3])) {
			// disabled until drapzone[2] is filled
			if (zoneFilled[2] && (sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[3].x;
				sprite.y = dropZones[3].y;

				var movein6 = game.add.tween(result3).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);
				movein6.onStart.add(function() {this.startAnimation(result3)}, this);

				movein6.onComplete.add(function() {this.showResult(sprite, 4)}, this);
			} else {
				sprite.kill();
			}
		} else {
			sprite.kill();
		}
	},

	// two methods that control the animations
	startAnimation: function(sprite) {
		sprite.animations.add('walk');
		sprite.animations.play('walk', 500, true);
	},

	stopAnimation: function(sprite) {
		sprite.animations.stop(null, true);
	},

	// start the next level on click
	nextLevel: function(event) {
		game.state.start("level3");	
	},
	
	// set the gate as draggable
	setToDragable: function(sprite) {
		sprite.inputEnabled = true;
		sprite.input.enableDrag();

		sprite.events.onInputOver.add(this.onOver, this);
		sprite.events.onInputOut.add(this.onOut, this);
		sprite.events.onDragStart.add(this.onDragStart, this);
		sprite.events.onDragStop.add(this.onDragStop, this);

		dragPosition = new Phaser.Point(sprite.x, sprite.y);
	},

	// judge whether the final result matches, display win/loss accordingly
	judgment: function() {
		timer.stop();
		this.stopAnimation(finalRes);
		if ((finalRes.key == "red-knight-sheet" && enemies[0].key == "red-dragon-sheet") || (finalRes.key == "yellow-knight-sheet" && enemies[0].key == "yellow-dragon-sheet")) {
			var kill = game.add.sprite(700, 300, 'kill-sheet');
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

	// game won, display the score
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

	// save the game to the byte hunter system
	saveGameScore: function() {
		window.saveScore(currLevelScore);
	},

	// place the number to the desigated place
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
		game.state.start("level2");
	},

	// set the params of a sprite
	setSpriteParams: function(sprite, x, y, width, height) {
		sprite.x = x;
		sprite.y = y;
		sprite.width = width;
		sprite.height = height;
	},

	// generate the output of buffer gate
	bufferGateOutput: function(sprite) {
		// accepts a sprite and pass it
		var bufRes;
		if (sprite.key == "red-knight-sheet")
			bufRes = game.add.sprite(0, 0, 'red-knight-sheet');
		else if (sprite.key == "yellow-knight-sheet")
			bufRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		return bufRes;
	},

	// generate the output of not gate
	notGateOutput: function(sprite) {
		// accepts a sprite and revert it
		var notRes;
		if (sprite.key == "red-knight-sheet")
			notRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		else if (sprite.key == "yellow-knight-sheet")
			notRes = game.add.sprite(0, 0, 'red-knight-sheet');
		return notRes;
	},

	// generate the output of and gate
	andGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var andRes;
		for (i = 0; i < sprites.length; i++) {
			// and gates return a white knight when all the items in the array are white
			if (sprites[i].key != "red-knight-sheet") {
				// return a grey knight
				andRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
				return andRes;
			}
		}
		andRes = game.add.sprite(0, 0, 'red-knight-sheet');
		return andRes;
	},

	// generate the output of or gate
	orGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var orRes;
		for (i = 0; i < sprites.length; i++) {
			// or gates return a grey knight when all the items in the array are grey
			if (sprites[i].key != "yellow-knight-sheet") {
				// return a white knight
				orRes = game.add.sprite(0, 0, 'red-knight-sheet');
				return orRes;
			}
		}
		orRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		return orRes;
	},

	// show the result once the gate is placed
	showResult: function(sprite, num) {
		var inputArray = [];
		if (sprite.key == "and-gate") {
			currLevelScore -= timing[2];
	        // only produce white when both are white
	        if (num == 1) {
	            // curr1 and curr2
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            currInputs[0].kill();
	            currInputs[1].kill();
	            result1 = this.andGateOutput(inputArray);
	            this.setSpriteParams(result1, 125, 200, 100, 100);
	            var moveout1 = game.add.tween(result1).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result1)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result1)}, this);
	        } else if (num == 2) {
	            // curr3 and curr4
	            inputArray[0] = currInputs[2];
	            inputArray[1] = currInputs[3];
	            currInputs[2].kill();
	            currInputs[3].kill();
	            result2 = this.andGateOutput(inputArray);
	            this.setSpriteParams(result2, 125, 400, 100, 100);
	            var moveout2 = game.add.tween(result2).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(result2)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(result2)}, this);
	        } else if (num == 3) {
	            // result1 and result2
	            inputArray[0] = result1;
	            inputArray[1] = result2;
	            result1.kill();
	            result2.kill();
	            result3 = this.andGateOutput(inputArray);
	            this.setSpriteParams(result3, 300, 300, 100, 100);
	            var moveout3 = game.add.tween(result3).to({x: 400}, 1000, Phaser.Easing.Linear.None, true);
				moveout3.onStart.add(function() {this.startAnimation(result3)}, this);
				moveout3.onComplete.add(function() {this.stopAnimation(result3)}, this);
	        }
	    } else if (sprite.key == "or-gate") {
	    	currLevelScore -= timing[3];
	        // only produce white when both are white
	        if (num == 1) {
	            // curr1 and curr2
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            currInputs[0].kill();
	            currInputs[1].kill();
	            result1 = this.orGateOutput(inputArray);
	            this.setSpriteParams(result1, 125, 200, 100, 100);
	            var moveout1 = game.add.tween(result1).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result1)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result1)}, this);
	        } else if (num == 2) {
	            // curr3 and curr4
	            inputArray[0] = currInputs[2];
	            inputArray[1] = currInputs[3];
	            currInputs[2].kill();
	            currInputs[3].kill();
	            result2 = this.orGateOutput(inputArray);
	            this.setSpriteParams(result2, 125, 400, 100, 100);
	            var moveout2 = game.add.tween(result2).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(result2)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(result2)}, this);
	        } else if (num == 3) {
	            // result1 and result2
	            inputArray[0] = result1;
	            inputArray[1] = result2;
	            result1.kill();
	            result2.kill();
	            result3 = this.orGateOutput(inputArray);
	            this.setSpriteParams(result3, 300, 300, 100, 100);
	            var moveout3 = game.add.tween(result3).to({x: 400}, 1000, Phaser.Easing.Linear.None, true);
				moveout3.onStart.add(function() {this.startAnimation(result3)}, this);
				moveout3.onComplete.add(function() {this.stopAnimation(result3)}, this);
	        }
	    } else if (sprite.key == "buffer-gate") {
	    	currLevelScore -= timing[1];
	    	finalRes = this.bufferGateOutput(result3);
	    	result3.kill();
	        this.setSpriteParams(finalRes, 500, 300, 100, 100);
	        var moveout4 = game.add.tween(finalRes).to({x: 600}, 1000, Phaser.Easing.Linear.None, true);
			moveout4.onStart.add(function() {this.startAnimation(finalRes)}, this);
			moveout4.onComplete.add(function() {this.judgment()}, this);
	    } else if (sprite.key == "not-gate") {
	    	currLevelScore -= timing[0];
	    	finalRes = this.notGateOutput(result3);
	    	result3.kill();
	        this.setSpriteParams(finalRes, 500, 300, 100, 100);
	        var moveout5 = game.add.tween(finalRes).to({x: 600}, 1000, Phaser.Easing.Linear.None, true);
			moveout5.onStart.add(function() {this.startAnimation(finalRes)}, this);
			moveout5.onComplete.add(function() {this.judgment()}, this);
	    }
	},

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + currLevelScore, 600, 550);
	}
};
