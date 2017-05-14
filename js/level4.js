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

		for (i = 0; i < 4; i++) {
			dropZones[i] = game.add.sprite(150, 200, 'white-block');
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
	},

	// creates a list of random inputs
	randomInputGenerator: function(num) {
		var ranNum;
		for (i = 0; i < num; i++) {
			ranNum = Math.floor((Math.random() * 2))	// either 0 or 1
			console.log(ranNum);
			if (ranNum == 0) {
				currInputs[i] = game.add.sprite(0, 0, 'white-knight');
			} else {
				currInputs[i] = game.add.sprite(0, 0, 'grey-knight');
			}
		}
	},

	randomEnemiesGenerator: function(num) {
		var ranNum;
		for (i = 0; i < num; i++) {
			ranNum = Math.floor((Math.random() * 2))	// either 0 or 1
			if (ranNum == 0) {
				enemies[i] = game.add.sprite(0, 0, 'white-dragon');
			} else {
				enemies[i] = game.add.sprite(0, 0, 'grey-dragon');
			}
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
				this.showResult(sprite, 1);
			}
		} else if (sprite.overlap(dropZones[1])) {
			if (!(sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.kill();
			} else {
				sprite.x = dropZones[1].x;
				sprite.y = dropZones[1].y;
				zoneFilled[1] = true;
				this.showResult(sprite, 2);
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
					this.showResult(sprite, 3);
				}
			} else {
				sprite.kill();
			}
		} else if (sprite.overlap(dropZones[3])) {
			// disabled until drapzone[2] is filled
			if (zoneFilled[2] && (sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[3].x;
				sprite.y = dropZones[3].y;
				this.showResult(sprite, 4);
				this.judgment();
			} else {
				sprite.kill();
			}
		} else {
			sprite.kill();
		}
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
		if ((finalRes.key == "white-knight" && enemies[0].key == "white-dragon") || (finalRes.key == "grey-knight" && enemies[0].key == "grey-dragon")) {
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
		if (sprite.key == "white-knight")
			bufRes = game.add.sprite(0, 0, 'white-knight');
		else if (sprite.key == "grey-knight")
			bufRes = game.add.sprite(0, 0, 'grey-knight');
		return bufRes;
	},

	notGateOutput: function(sprite) {
		// accepts a sprite and revert it
		var notRes;
		if (sprite.key == "white-knight")
			notRes = game.add.sprite(0, 0, 'grey-knight');
		else if (sprite.key == "grey-knight")
			notRes = game.add.sprite(0, 0, 'white-knight');
		return notRes;
	},

	andGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var andRes;
		for (i = 0; i < sprites.length; i++) {
			// and gates return a white knight when all the items in the array are white
			if (sprites.key != "white-knight") {
				// return a grey knight
				andRes = game.add.sprite(0, 0, 'grey-knight');
				return andRes;
			}
		}
		andRes = game.add.sprite(0, 0, 'white-knight');
		return andRes;
	},

	nandGateOutput: function(sprites) {
		return this.andGateOutput(sprites);
	},

	xorGateOutput: function(sprites) {
		if (sprites.length == 2) {
			// the last call
			if (sprites[0].key == sprites[1].key)
				return game.add.sprite(0, 0, 'grey-knight');
			else
				return game.add.sprite(0, 0, 'white-knight');
		}

		var rtSprite = this.xorGateOutput(sprites.slice(1));
		if (sprites[0].key == rtSprite.key) {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'grey-knight');
		} else {
			rtSprite.kill();
			return game.add.sprite(0, 0, 'white-knight');
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
	            this.setSpriteParams(result1, 225, 250, 100, 100);
	        } else if (num == 3) {
	            // result1 and result2
	            inputArray[0] = result1;
	            inputArray[1] = result2;
	            result3 = this.nandGateOutput(inputArray);
	            this.setSpriteParams(result3, 400, 350, 100, 100);
	        }
	    } else if (sprite.key == "xor-gate") {
	        if (num == 1) {
	            // curr1, curr2 and curr3
	            inputArray[0] = currInputs[0];
	            inputArray[1] = currInputs[1];
	            inputArray[2] = currInputs[2];
	            result1 = this.xorGateOutput(inputArray);
	            this.setSpriteParams(result1, 225, 250, 100, 100);
	        } else if (num == 3) {
	            // result1 and result2
	            inputArray[0] = result1;
	            inputArray[1] = result2;
	            result3 = this.xorGateOutput(inputArray);
	            this.setSpriteParams(result3, 400, 350, 100, 100);
	        }
	    } else if (sprite.key == "buffer-gate") {
	    	if (num == 2) {
	            result2 = this.bufferGateOutput(currInputs[3]);
	            this.setSpriteParams(result2, 225, 450, 100, 100);
	        } else if (num == 4) {
	            finalRes = this.bufferGateOutput(result3);
	            this.setSpriteParams(finalRes, 600, 350, 100, 100);
	        }
	    } else if (sprite.key == "not-gate") {
	    	if (num == 2) {
	            result2 = this.notGateOutput(currInputs[3]);
	            this.setSpriteParams(result2, 225, 450, 100, 100);
	        } else if (num == 4) {
	            finalRes = this.notGateOutput(result3);
	            this.setSpriteParams(finalRes, 600, 350, 100, 100);
	        }
	    }
	},

	update: function() {

	}
};