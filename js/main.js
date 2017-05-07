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

var dropZone;
var dragPosition;

var currInput;
var result;
var enemy;

var win;
var loss;


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
Main = function () {},
gameOptions = {
	playSound: true,
	playMusic: true
},
musicPlayer;

Main.prototype = {
	preload: function() {
		game.load.crossOrigin = 'anonymous';
		game.load.image('background', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-background.png');
		game.load.image('buffer-gate', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-buffer-gate.png');
		game.load.image('not-gate', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-not-gate.png');
		game.load.image('white-block', 'https://storage.googleapis.com/bytehunter_images/testfiles/white.png');

		game.load.image('kl-zero', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-zero.png');
		game.load.image('kl-one', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-one.png');

		game.load.image('white-knight', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-white-knight.png');
		game.load.image('black-knight', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-black-knight.png');

		game.load.image('white-dragon', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-white-dragon.png');
		game.load.image('black-dragon', 'https://storage.googleapis.com/bytehunter_images/testfiles/kl-black-dragon.png');

		game.load.image('win', 'https://storage.googleapis.com/bytehunter_images/testfiles/win-msg.png');
		game.load.image('loss', 'https://storage.googleapis.com/bytehunter_images/testfiles/loss-msg.png');

		// next level
		game.load.script('level2', 'js/level2.js');
	},
	
	create: function () {
		background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		dropZone = game.add.sprite(350, 250, 'white-block');
		dropZone.width = blkWidth;
		dropZone.height = blkHeight;

		notGate = game.add.sprite(50, 50, 'not-gate');
		notGate.width = blkWidth;
		notGate.height = blkHeight;

		bufGate = game.add.sprite(175, 50, 'buffer-gate');
		bufGate.width = blkWidth;
		bufGate.height = blkHeight;

		bufGate.inputEnabled = true;
		bufGate.events.onInputDown.add(this.onGateClick, this);

		notGate.inputEnabled = true;
		notGate.events.onInputDown.add(this.onGateClick, this);

		currInput = game.add.sprite(175, 250, 'white-knight');
		currInput.width = 100;
		currInput.height = 100;

		enemy = game.add.sprite(650, 250, 'black-dragon');
		enemy.width = 100;
		enemy.height = 100;
		
		game.state.add("level2", level2);
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
		if (sprite.overlap(dropZone)) {
			sprite.x = dropZone.x;
			sprite.y = dropZone.y;
			this.showResult(sprite);
			this.judgment();
		} else {
			sprite.kill();
		}
	},

	nextLevel:function(event){
		game.state.start("level2");	
	},
	
	setToDragable:function(sprite) {
		sprite.inputEnabled = true;
		sprite.input.enableDrag();

		sprite.events.onInputOver.add(this.onOver, this);
		sprite.events.onInputOut.add(this.onOut, this);
		sprite.events.onDragStart.add(this.onDragStart, this);
		sprite.events.onDragStop.add(this.onDragStop, this);

		dragPosition = new Phaser.Point(sprite.x, sprite.y);
	},

	judgment: function() {
		if ((result.key == "white-knight" && enemy.key == "white-dragon") || (result.key == "black-knight" && enemy.key == "black-dragon")) {
			win = game.add.sprite(400, 300, 'win');
			win.anchor.setTo(0.5, 0.5);
			
			game.input.onDown.add(this.nextLevel, this);
		} else {
			loss = game.add.sprite(400, 300, 'loss');
			loss.anchor.setTo(0.5, 0.5);
		}
	},

	showResult: function(sprite) {
		if (sprite.key == "not-gate") {
			if (currInput.key == "white-knight") {
				result = game.add.sprite(525, 250, 'black-knight');
				result.width = 100;
				result.height = 100;
			} else if (currInput.key == "black-knight") {
				result = game.add.sprite(525, 250, 'white-knight');
				result.width = 100;
				result.height = 100;
			}
		} else if (sprite.key == "buffer-gate") {
			if (currInput.key == "white-knight") {
				result = game.add.sprite(525, 250, 'white-knight');
				result.width = 100;
				result.height = 100;
			} else if (currInput.key == "black-knight") {
				result = game.add.sprite(525, 250, 'black-knight');
				result.width = 100;
				result.height = 100;
			}
		}
	},

	update: function() {

	}
};

game.state.add("Main",Main);
game.state.start("Main");
