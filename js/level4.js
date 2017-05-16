var notGate;
var bufGate;
var whiteBlk;
var background;
var blkWidth = 100;
var blkHeight = 100;

var zoneFilled = [false, false, false, false];
var dropZones = [];
var dragPosition;

var currInputs = [];		// an empty array for the inputs
var result1;
var result2;
var result3;
var finalRes;
var enemies = [];

var win;
var loss;

level4 = function(game) {};

level4.prototype = {
	preload: function() {
		
	},
	
	create: function() {
		// load the background
		background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		var gamehomeBt = game.add.button(720, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		gamehomeBt.scale.setTo(0.3, 0.3);
		gamehomeBt.anchor.setTo(0.5, 0.5);

		dropZones[0] = game.add.sprite(150, 200, 'dropzone-3');
		dropZones[1] = game.add.sprite(150, 200, 'dropzone-1');
		dropZones[2] = game.add.sprite(150, 200, 'dropzone-2');
		dropZones[3] = game.add.sprite(150, 200, 'dropzone-1');

		for (i = 0; i < 4; i++) {
			dropZones[i].width = blkWidth;
			dropZones[i].height = blkHeight;
		}

		dropZones[0].x = 125;
		dropZones[0].y = 250;

		dropZones[1].x = 125;
		dropZones[1].y = 450;

		dropZones[2].x = 300;
		dropZones[2].y = 350;

		dropZones[3].x = 500;
		dropZones[3].y = 350;

		notGate = game.add.sprite(10, 15, 'not-gate');
		notGate.width = blkWidth;
		notGate.height = blkHeight;

		bufGate = game.add.sprite(110, 15, 'buffer-gate');
		bufGate.width = blkWidth;
		bufGate.height = blkHeight;

		xorGate = game.add.sprite(210, 15, 'xor-gate');
		xorGate.width = blkWidth;
		xorGate.height = blkHeight;

		nandGate = game.add.sprite(310, 15, 'nand-gate');
		nandGate.width = blkWidth;
		nandGate.height = blkHeight;

		notGate.inputEnabled = true;
		notGate.events.onInputDown.add(this.onGateClick, this);

		bufGate.inputEnabled = true;
		bufGate.events.onInputDown.add(this.onGateClick, this);

		xorGate.inputEnabled = true;
		xorGate.events.onInputDown.add(this.onGateClick, this);

		nandGate.inputEnabled = true;
		nandGate.events.onInputDown.add(this.onGateClick, this);

		this.randomInputGenerator(4);
		for (i = 0; i < 4; i++) {
			this.setSpriteParams(currInputs[i], 0, 150 + i * 100, 100, 100);
		}

		this.randomEnemiesGenerator(1);
		this.setSpriteParams(enemies[0], 700, 350, 100, 100);

		// timer
		totalScore = 100;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
	},

	clickHome: function() {
		game.state.start("menu");
	},

	deductScore: function() {
		totalScore--;
		if (totalScore <= 0) {
			timer.stop();
			loss = game.add.sprite(400, 200, 'loss');
			loss.anchor.setTo(0.5, 0.5);

			var retryBt = this.add.button(400, 400, 'retryBt', this.clickRetry, this, 2, 1, 0);
			retryBt.anchor.setTo(0.5, 0.5);
		}
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

	onOver: function(sprite, pointer) {
		sprite.tint = 0xff7777;
	},

	onOut: function(sprite, pointer) {
		sprite.tint = 0xffffff;
	},

	onGateClick: function(sprite) {
		var spriteDup = game.add.sprite(sprite.x + 10, sprite.y + 10, sprite.key, sprite.frame);
		spriteDup.width = blkWidth;
		spriteDup.height = blkHeight;
		this.setToDragable(spriteDup);
	},

	onDragStart: function(sprite, pointer) {
		dragPosition.set(sprite.x, sprite.y);
	},

	onDragStop: function(sprite, pointer) {
		// Note: dropZone 0, 2 accepts xor/nand, 1, 3 accepts not/buffer
		if (sprite.overlap(dropZones[0])) {
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[0].x;
				sprite.y = dropZones[0].y;
				zoneFilled[0] = true;

				var movein0 = game.add.tween(currInputs[0]).to({x: 125, y: 250}, 1000, Phaser.Easing.Linear.None, true);
				movein0.onStart.add(function() {this.startAnimation(currInputs[0])}, this);
				var movein1 = game.add.tween(currInputs[1]).to({x: 125, y: 250}, 1000, Phaser.Easing.Linear.None, true);
				movein1.onStart.add(function() {this.startAnimation(currInputs[1])}, this);
				var movein2 = game.add.tween(currInputs[2]).to({x: 125, y: 250}, 1000, Phaser.Easing.Linear.None, true);
				movein2.onStart.add(function() {this.startAnimation(currInputs[2])}, this);

				movein2.onComplete.add(function() {this.showResult(sprite, 1)}, this);
				//this.showResult(sprite, 1);
			}
		} else if (sprite.overlap(dropZones[1])) {
			if (!(sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.kill();
			} else {
				sprite.x = dropZones[1].x;
				sprite.y = dropZones[1].y;
				zoneFilled[1] = true;

				var movein3 = game.add.tween(currInputs[3]).to({x: 125, y: 450}, 1000, Phaser.Easing.Linear.None, true);
				movein3.onStart.add(function() {this.startAnimation(currInputs[3])}, this);

				movein3.onComplete.add(function() {this.showResult(sprite, 2)}, this);
				//this.showResult(sprite, 2);
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

					var movein4 = game.add.tween(result1).to({x: 300, y: 350}, 1000, Phaser.Easing.Linear.None, true);
					movein4.onStart.add(function() {this.startAnimation(result1)}, this);
					var movein5 = game.add.tween(result2).to({x: 300, y: 350}, 1000, Phaser.Easing.Linear.None, true);
					movein5.onStart.add(function() {this.startAnimation(result2)}, this);

					movein5.onComplete.add(function() {this.showResult(sprite, 3)}, this);
					//this.showResult(sprite, 3);
				}
			} else {
				sprite.kill();
			}
		} else if (sprite.overlap(dropZones[3])) {
			// disabled until drapzone[2] is filled
			if (zoneFilled[2] && (sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[3].x;
				sprite.y = dropZones[3].y;

				var movein6 = game.add.tween(result3).to({x: 500, y: 350}, 1000, Phaser.Easing.Linear.None, true);
				movein6.onStart.add(function() {this.startAnimation(result3)}, this);

				movein6.onComplete.add(function() {this.showResult(sprite, 4)}, this);
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
		game.state.start("level5");	
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
		if ((finalRes.key == "red-knight-sheet" && enemies[0].key == "red-dragon-sheet") || (finalRes.key == "yellow-knight-sheet" && enemies[0].key == "yellow-dragon-sheet")) {
			win = game.add.sprite(400, 300, 'win');
			win.anchor.setTo(0.5, 0.5);
			// if win, go to the next level
			game.input.onDown.add(this.nextLevel, this);
		} else {
			loss = game.add.sprite(400, 200, 'loss');
			loss.anchor.setTo(0.5, 0.5);

			var retryBt = this.add.button(400, 400, 'retryBt', this.clickRetry, this, 2, 1, 0);
			retryBt.anchor.setTo(0.5, 0.5);
		}
	},

	clickRetry: function() {
		game.state.start("level4");
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

	nandGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var nandRes;
		for (i = 0; i < sprites.length; i++) {
			// and gates return a white knight when all the items in the array are white
			if (sprites[i].key != "red-knight-sheet") {
				// return a grey knight
				nandRes = game.add.sprite(0, 0, 'red-knight-sheet');
				return nandRes;
			}
		}
		nandRes = game.add.sprite(0, 0, 'yellow-knight-sheet');
		return nandRes;
	},

	xorGateOutput: function(sprites) {
		if (sprites.length == 2) {
			// the last call
			if (sprites[0].key == sprites[1].key)
				return game.add.sprite(0, 0, 'yellow-knight-sheet');
			else
				return game.add.sprite(0, 0, 'red-knight-sheet');
		}

		var rtSprite = this.xorGateOutput(sprites.slice(1));
		if (sprites[0].key == rtSprite.key) {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'yellow-knight-sheet');
		} else {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'red-knight-sheet');
		}
	},

	showResult: function(sprite, num) {
		var inputArray = [];
		if (sprite.key == "nand-gate") {
	        // only produce white when both are white
	        if (num == 1) {
	            // curr1, curr2 and curr3
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.nandGateOutput(inputArray);
	            for (i = 0; i < 3; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result1, 125, 250, 100, 100);

	            var moveout1 = game.add.tween(result1).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result1)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result1)}, this);
	        } else if (num == 3) {
	            // result1 and result2
	            inputArray[0] = result1;
	            inputArray[1] = result2;
	            result3 = this.nandGateOutput(inputArray);
	            result1.kill();
	            result2.kill();
	            this.setSpriteParams(result3, 300, 350, 100, 100);

	            var moveout2 = game.add.tween(result3).to({x: 400}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(result3)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(result3)}, this);
	        }
	    } else if (sprite.key == "xor-gate") {
	        if (num == 1) {
	            // curr1, curr2 and curr3
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.xorGateOutput(inputArray);
	            for (i = 0; i < 3; i++)
	            	currInputs[i].kill();
	            this.setSpriteParams(result1, 125, 250, 100, 100);

	            var moveout1 = game.add.tween(result1).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout1.onStart.add(function() {this.startAnimation(result1)}, this);
				moveout1.onComplete.add(function() {this.stopAnimation(result1)}, this);
	        } else if (num == 3) {
	            // result1 and result2
	            inputArray[0] = result1;
	            inputArray[1] = result2;
	            result3 = this.xorGateOutput(inputArray);
	            result1.kill();
	            result2.kill();
	            this.setSpriteParams(result3, 300, 350, 100, 100);

	            var moveout2 = game.add.tween(result3).to({x: 400}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(result3)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(result3)}, this);
	        }
	    } else if (sprite.key == "buffer-gate") {
	    	if (num == 2) {
	            result2 = this.bufferGateOutput(currInputs[3]);
	            currInputs[3].kill();
	            this.setSpriteParams(result2, 125, 450, 100, 100);

	            var moveout2 = game.add.tween(result2).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(result2)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(result2)}, this);
	        } else if (num == 4) {
	            finalRes = this.bufferGateOutput(result3);
	            result3.kill();
	            this.setSpriteParams(finalRes, 500, 350, 100, 100);

	            var moveout2 = game.add.tween(finalRes).to({x: 600}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(finalRes)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(finalRes)}, this);
				moveout2.onComplete.add(function() {this.judgment()}, this);
	        }
	    } else if (sprite.key == "not-gate") {
	    	if (num == 2) {
	            result2 = this.notGateOutput(currInputs[3]);
	            currInputs[3].kill();
	            this.setSpriteParams(result2, 125, 450, 100, 100);

	            var moveout2 = game.add.tween(result2).to({x: 225}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(result2)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(result2)}, this);
	        } else if (num == 4) {
	            finalRes = this.notGateOutput(result3);
	            result3.kill();
	            this.setSpriteParams(finalRes, 500, 350, 100, 100);

	            var moveout2 = game.add.tween(finalRes).to({x: 600}, 1000, Phaser.Easing.Linear.None, true);
				moveout2.onStart.add(function() {this.startAnimation(finalRes)}, this);
				moveout2.onComplete.add(function() {this.stopAnimation(finalRes)}, this);
				moveout2.onComplete.add(function() {this.judgment()}, this);
	        }
	    }
	},

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + currLevelScore, 600, 550);
	}
};
