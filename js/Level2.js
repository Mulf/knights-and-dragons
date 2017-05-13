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

var currInput1;
var currInput2;
var currInput3;
var currInput4;

var result1;
var result2;
var result3;
var enemy;

var win;
var loss;

var level2 = function(game) {};

level2.prototype = {

	preload: function() {
		game.load.baseURL = 'https://storage.googleapis.com/bytehunter_images/testfiles/';
		game.load.crossOrigin = 'anonymous';

		game.load.image('background', 'kl-background.png');
		game.load.image('buffer-gate', 'kl-buffer-gate.png');
		game.load.image('not-gate', 'kl-not-gate.png');
		game.load.image('white-block', 'white.png');

		game.load.image('kl-zero', 'kl-zero.png');
		game.load.image('kl-one', 'kl-one.png');

		game.load.image('white-knight', 'kl-white-knight.png');
		game.load.image('black-knight', 'kl-black-knight.png');

		game.load.image('white-dragon', 'kl-white-dragon.png');
		game.load.image('black-dragon', 'kl-black-dragon.png');

		game.load.image('win', 'win-msg.png');
		game.load.image('loss', 'loss-msg.png');

		game.load.image('and-gate', 'kl-and-gate.png');
		game.load.image('or-gate', 'kl-or-gate.png');
	},

	create: function () {
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

		currInput1 = game.add.sprite(25, 150, 'white-knight');
		currInput1.width = 100;
		currInput1.height = 100;

		currInput2 = game.add.sprite(25, 250, 'black-knight');
		currInput2.width = 100;
		currInput2.height = 100;

		currInput3 = game.add.sprite(25, 350, 'black-knight');
		currInput3.width = 100;
		currInput3.height = 100;

		currInput4 = game.add.sprite(25, 450, 'white-knight');
		currInput4.width = 100;
		currInput4.height = 100;

		enemy = game.add.sprite(650, 300, 'white-dragon');
		enemy.width = 100;
		enemy.height = 100;
	},

	onOver: function(sprite, pointer) {
		sprite.tint = 0xff7777;
	},

	onOut: function(sprite, pointer) {
		sprite.tint = 0xffffff;
	},

	onGateClick:function (sprite) {
		var spriteDup = game.add.sprite(sprite.x + 10, sprite.y + 10, sprite.key, sprite.frame);
		spriteDup.width = blkWidth;
		spriteDup.height = blkHeight;
		this.setToDragable(spriteDup);
	},

	onDragStart: function (sprite, pointer) {
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
			sprite.x = dropZone3.x;
			sprite.y = dropZone3.y;
			this.showResult(sprite, 3);
			this.judgment();
		} else {
			sprite.kill();
		}
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
		if ((result3.key == "white-knight" && enemy.key == "white-dragon") || (result3.key == "black-knight" && enemy.key == "black-dragon")) {
			win = game.add.sprite(400, 300, 'win');
			win.anchor.setTo(0.5, 0.5);
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
	            if (currInput1.key == "white-knight" && currInput2.key == "white-knight") {
	            	result1 = game.add.sprite(225, 200, 'white-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            } else {
	            	result1 = game.add.sprite(225, 200, 'black-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            }
	        } else if (num == 2) {
	            // curr3 and curr4 
	            if (currInput3.key == "white-knight" && currInput4.key == "white-knight") {
	            	result2 = game.add.sprite(225, 400, 'white-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            } else {
	            	result2 = game.add.sprite(225, 400, 'black-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            }
	        } else if (num == 3) {
	            // result1 and result2
	            if (result1.key == "white-knight" && result2.key == "white-knight") {
	            	result3 = game.add.sprite(500, 300, 'white-knight');
	            	result3.width = 100;
	            	result3.height = 100;
	            } else {
	            	result3 = game.add.sprite(500, 300, 'black-knight');
	            	result3.width = 100;
	            	result3.height = 100;
	            }
	        }
	    } else if (sprite.key == "or-gate") {
	        // only produce black when both are black
	        if (num == 1) {
	            // curr1 and curr2
	            if (currInput1.key == "black-knight" && currInput2.key == "black-knight") {
	            	result1 = game.add.sprite(225, 200, 'black-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            } else {
	            	result1 = game.add.sprite(225, 200, 'white-knight');
	            	result1.width = 100;
	            	result1.height = 100;
	            }
	        } else if (num == 2) {
	            // curr3 and curr4 
	            if (currInput3.key == "black-knight" && currInput4.key == "black-knight") {
	            	result2 = game.add.sprite(225, 400, 'black-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            } else {
	            	result2 = game.add.sprite(225, 400, 'white-knight');
	            	result2.width = 100;
	            	result2.height = 100;
	            }
	        } else if (num == 3) {
	            // result1 and result2
	            if (result1.key == "black-knight" && result2.key == "balck-knight") {
	            	result3 = game.add.sprite(500, 300, 'black-knight');
	            	result3.width = 100;
	            	result3.height = 100;
	            } else {
	            	result3 = game.add.sprite(500, 300, 'white-knight');
	            	result3.width = 100;
	            	result3.height = 100;
	            }
	        }
	    }
	},

	update: function() {

	}
};


