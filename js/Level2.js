var notGate;
var bufGate;
var whiteBlk;
var background;
var knight;

var one;
var zero;

var blkWidth = 100;
var blkHeight = 100;
var characterWidth = 30;
var characterHeight = 30;

var dropZone1;
var dropZone2;
var dropZone3;
var dragPosition;

var currInputs = [];		// an empty array for the inputs
var result1;
var result2;
var finalRes;
var enemies = [];

var win;
var loss;

level2 = function(game) {};

level2.prototype = {
	preload: function() {
		
	},
	
	create: function() {
		// load the background
		background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		dropZone1 = game.add.sprite(150, 200, 'white-block');
		dropZone1.width = blkWidth;
		dropZone1.height = blkHeight;

		dropZone2 = game.add.sprite(150, 400, 'white-block');
		dropZone2.width = blkWidth;
		dropZone2.height = blkHeight;

		dropZone3 = game.add.sprite(400, 300, 'white-block');
		dropZone3.width = blkWidth;
		dropZone3.height = blkHeight;

		andGate = game.add.sprite(300, 25, 'and-gate');
		andGate.width = blkWidth;
		andGate.height = blkHeight;

		orGate = game.add.sprite(425, 25, 'or-gate');
		orGate.width = blkWidth;
		orGate.height = blkHeight;

		andGate.inputEnabled = true;
		andGate.events.onInputDown.add(this.onGateClick, this);

		orGate.inputEnabled = true;
		orGate.events.onInputDown.add(this.onGateClick, this);

		this.randomInputGenerator(4);
		for (i = 0; i < 4; i++) {
			currInputs[i].x = 25;
			currInputs[i].y = 150 + i * 100;
			currInputs[i].width = 100;
			currInputs[i].height = 100;
		}

		this.randomEnemiesGenerator(1);
		enemies[0].x = 650;
		enemies[0].y = 300;
		enemies[0].width = 100;
		enemies[0].height = 100;
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
		if (sprite.overlap(dropZone1)) {
			sprite.x = dropZone1.x;
			sprite.y = dropZone1.y;
			this.showResult(sprite, 1);
		} else if (sprite.overlap(dropZone2)) {
			sprite.x = dropZone2.x;
			sprite.y = dropZone2.y;
			this.showResult(sprite, 2);
		} else if (sprite.overlap(dropZone3)) {
			// TODO: disabled until drapzone 1 and 2 are filled
			sprite.x = dropZone3.x;
			sprite.y = dropZone3.y;
			this.showResult(sprite, 3);
			this.judgment();
		} else {
			sprite.kill();
		}
	},

	nextLevel: function(event) {
		game.state.start("level3");	
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
			loss = game.add.sprite(400, 300, 'loss');
			loss.anchor.setTo(0.5, 0.5);
		}
	},

	showResult: function(sprite, num) {
		if (sprite.key == "and-gate") {
	        // only produce white when both are white
	        if (num == 1) {
	            // curr1 and curr2
	            if (currInputs[0].key == "white-knight" && currInputs[1].key == "white-knight") {
	            	result1 = game.add.sprite(225, 200, 'white-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            } else {
	            	result1 = game.add.sprite(225, 200, 'grey-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            }
	        } else if (num == 2) {
	            // curr3 and curr4 
	            if (currInputs[2].key == "white-knight" && currInputs[3].key == "white-knight") {
	            	result2 = game.add.sprite(225, 400, 'white-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            } else {
	            	result2 = game.add.sprite(225, 400, 'grey-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            }
	        } else if (num == 3) {
	            // result1 and result2
	            if (result1.key == "white-knight" && result2.key == "white-knight") {
	            	finalRes = game.add.sprite(500, 300, 'white-knight');
	            	finalRes.width = 100;
	            	finalRes.height = 100;
	            } else {
	            	finalRes = game.add.sprite(500, 300, 'grey-knight');
	            	finalRes.width = 100;
	            	finalRes.height = 100;
	            }
	        }
	    } else if (sprite.key == "or-gate") {
	        // only produce grey when both are grey
	        if (num == 1) {
	            // curr1 and curr2
	            if (currInputs[0].key == "grey-knight" && currInputs[1].key == "grey-knight") {
	            	result1 = game.add.sprite(225, 200, 'grey-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            } else {
	            	result1 = game.add.sprite(225, 200, 'white-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            }
	        } else if (num == 2) {
	            // curr3 and curr4 
	            if (currInputs[2].key == "grey-knight" && currInputs[3].key == "grey-knight") {
	            	result2 = game.add.sprite(225, 400, 'grey-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            } else {
	            	result2 = game.add.sprite(225, 400, 'white-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            }
	        } else if (num == 3) {
	            // result1 and result2
	            if (result1.key == "grey-knight" && result2.key == "balck-knight") {
	            	finalRes = game.add.sprite(500, 300, 'grey-knight');
	            	finalRes.width = 100;
	            	finalRes.height = 100;
	            } else {
	            	finalRes = game.add.sprite(500, 300, 'white-knight');
	            	finalRes.width = 100;
	            	finalRes.height = 100;
	            }
	        }
	    }
	},

	update: function() {

	}
};
