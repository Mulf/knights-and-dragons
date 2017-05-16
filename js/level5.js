var notGate;
var bufGate;
var whiteBlk;
var background;
var blkWidth = 100;
var blkHeight = 100;

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

var win;
var loss;

level5 = function(game) {};

level5.prototype = {

	preload: function() {
		
	},
	
	create: function() {
		// load the background
		background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

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

		notGate = game.add.sprite(10, 15, 'not-gate');
		notGate.width = smallBlkSize;
		notGate.height = smallBlkSize;

		bufGate = game.add.sprite(110, 15, 'buffer-gate');
		bufGate.width = smallBlkSize;
		bufGate.height = smallBlkSize;

		norGate = game.add.sprite(210, 15, 'nor-gate');
		norGate.width = smallBlkSize;
		norGate.height = smallBlkSize;

		xnorGate = game.add.sprite(310, 15, 'xnor-gate');
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

		this.randomInputGenerator(8);
		for (i = 0; i < 8; i++) {
			this.setSpriteParams(currInputs[i], 0, 150 + i * 50, smallBlkSize, smallBlkSize);
		}

		this.randomEnemiesGenerator(1);
		this.setSpriteParams(enemies[0], 700, 342, smallBlkSize, smallBlkSize);

		// timer
		totalScore = 100;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
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
				currInputs[i] = game.add.sprite(0, 0, 'red-knight');
			} else {
				currInputs[i] = game.add.sprite(0, 0, 'yellow-knight');
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
				this.showResult(sprite, 1);
			}
		} else if (sprite.overlap(dropZones[1])) {
			// drop zone for input 3, 4, 5  -> result 2 (accepts nor, xnor)
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[1].x;
				sprite.y = dropZones[1].y;
				zoneFilled[1] = true;
				this.showResult(sprite, 2);
			}
		} else if (sprite.overlap(dropZones[2])) {
			// drop zone for input 6, 7 	-> result 3 (accepts nor, xnor)
			if (sprite.key == 'not-gate' || sprite.key == 'buffer-gate') {
				sprite.kill();
			} else {
				sprite.x = dropZones[2].x;
				sprite.y = dropZones[2].y;
				zoneFilled[2] = true;
				this.showResult(sprite, 3);
			}
		} else if (sprite.overlap(dropZones[3])) {
			// drop zone for result 1, 2, 3	-> result 4 (accepts nor, xnor) 
			// disabled until 1, 2, 3 is filled
			if (zoneFilled[0] && zoneFilled[1] && zoneFilled[2] && !(sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[3].x;
				sprite.y = dropZones[3].y;
				zoneFilled[3] = true;
				this.showResult(sprite, 4);
			} else {
				sprite.kill();
			}
		} else if (sprite.overlap(dropZones[4])) {
			if (zoneFilled[3] && (sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[4].x;
				sprite.y = dropZones[4].y;
				this.showResult(sprite, 5);
				this.judgment();
			} else {
				sprite.kill();
			}
		} else {
			sprite.kill();
		}
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
		if ((finalRes.key == "red-knight" && enemies[0].key == "red-dragon-sheet") || (finalRes.key == "yellow-knight" && enemies[0].key == "yellow-dragon-sheet")) {
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
		if (sprite.key == "red-knight")
			bufRes = game.add.sprite(0, 0, 'red-knight');
		else if (sprite.key == "yellow-knight")
			bufRes = game.add.sprite(0, 0, 'yellow-knight');
		return bufRes;
	},

	notGateOutput: function(sprite) {
		// accepts a sprite and revert it
		var notRes;
		if (sprite.key == "red-knight")
			notRes = game.add.sprite(0, 0, 'yellow-knight');
		else if (sprite.key == "yellow-knight")
			notRes = game.add.sprite(0, 0, 'red-knight');
		return notRes;
	},

	orGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var orRes;
		for (i = 0; i < sprites.length; i++) {
			// or gates return a grey knight when all the items in the array are grey
			if (sprites.key != "yellow-knight") {
				// return a white knight
				orRes = game.add.sprite(0, 0, 'red-knight');
				return orRes;
			}
		}
		orRes = game.add.sprite(0, 0, 'yellow-knight');
		return orRes;
	},

	norGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var norRes;
		for (i = 0; i < sprites.length; i++) {
			// or gates return a grey knight when all the items in the array are grey
			if (sprites.key != "yellow-knight") {
				// return a white knight
				norRes = game.add.sprite(0, 0, 'yellow-knight');
				return norRes;
			}
		}
		norRes = game.add.sprite(0, 0, 'red-knight');
		return norRes;
	},

	xnorGateOutput: function(sprites) {
		if (sprites.length == 2) {
			// the last call
			if (sprites[0].key == sprites[1].key)
				return game.add.sprite(0, 0, 'red-knight');
			else
				return game.add.sprite(0, 0, 'yellow-knight');
		}

		var rtSprite = this.xnorGateOutput(sprites.slice(1));
		if (sprites[0].key == rtSprite.key) {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'red-knight');
		} else {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'yellow-knight');
		}
	},

	showResult: function(sprite, num) {
		var inputArray = [];
		if (sprite.key == "nor-gate") {
	        // only produce white when both are white
	        if (num == 1) {
	            // input 0, 1, 2
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.norGateOutput(inputArray);
	            this.setSpriteParams(result1, 200, 200, smallBlkSize, smallBlkSize);
	        } else if (num == 2) {
	            // input 3, 4, 5
	            inputArray[0] = currInputs[3];
	            inputArray[1] = currInputs[4];
	            inputArray[2] = currInputs[5];
	            result2 = this.norGateOutput(inputArray);
	            this.setSpriteParams(result2, 200, 350, smallBlkSize, smallBlkSize);
	        } else if (num == 3) {
	        	// input 6, 7
	        	inputArray[0] = currInputs[6];
	            inputArray[1] = currInputs[7];
	            result3 = this.norGateOutput(inputArray);
	            this.setSpriteParams(result3, 200, 475, smallBlkSize, smallBlkSize);
	        } else if (num == 4) {
	        	// result 1, 2, 3
	        	inputArray[0] = result1;
	            inputArray[1] = result2;
	            inputArray[2] = result3;
	            result4 = this.norGateOutput(inputArray);
	            this.setSpriteParams(result4, 350, 342, smallBlkSize, smallBlkSize);
	        }
	    } else if (sprite.key == "xnor-gate") {
	        if (num == 1) {
	            // input 0, 1, 2
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.xnorGateOutput(inputArray);
	            this.setSpriteParams(result1, 200, 200, smallBlkSize, smallBlkSize);
	        } else if (num == 2) {
	            // input 3, 4, 5
	            inputArray[0] = currInputs[3];
	            inputArray[1] = currInputs[4];
	            inputArray[2] = currInputs[5];
	            result2 = this.xnorGateOutput(inputArray);
	            this.setSpriteParams(result2, 200, 350, smallBlkSize, smallBlkSize);
	        } else if (num == 3) {
	        	// input 6, 7
	        	inputArray[0] = currInputs[6];
	            inputArray[1] = currInputs[7];
	            result3 = this.xnorGateOutput(inputArray);
	            this.setSpriteParams(result3, 200, 475, smallBlkSize, smallBlkSize);
	        } else if (num == 4) {
	        	// result 1, 2, 3
	        	inputArray[0] = result1;
	            inputArray[1] = result2;
	            inputArray[2] = result3;
	            result4 = this.xnorGateOutput(inputArray);
	            this.setSpriteParams(result4, 350, 342, smallBlkSize, smallBlkSize);
	        }
	    } else if (sprite.key == "buffer-gate" && num == 5) {
            finalRes = this.bufferGateOutput(result4);
            this.setSpriteParams(finalRes, 550, 342, smallBlkSize, smallBlkSize);
	    } else if (sprite.key == "not-gate" && num == 5) {
            finalRes = this.notGateOutput(result4);
            this.setSpriteParams(finalRes, 550, 342, smallBlkSize, smallBlkSize);
	    }
	},

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + totalScore, 600, 550);
	}
};
