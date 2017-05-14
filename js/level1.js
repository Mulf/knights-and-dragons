var notGate;
var bufGate;
var whiteBlk;
var background;
var knight;

var one;
var zero;

var blkWidth = 100;
var blkHeight = 100;

var dropZone;
var dragPosition;

var currInputs = [];		// an empty array for the inputs
var result;
var enemies = [];

var win;
var loss;
var retry;
var totalScore = 100;
var timer;

level1 = function(game) {};

level1.prototype = {
	preload: function() {
		
	},
	
	create: function() {
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

		this.randomInputGenerator(1);
		currInputs[0].x = 175;
		currInputs[0].y = 250
		currInputs[0].width = 100;
		currInputs[0].height = 100;

		this.randomEnemiesGenerator(1);
		enemies[0].x = 650;
		enemies[0].y = 250;
		enemies[0].width = 100;
		enemies[0].height = 100;

		// timer
		totalScore = 100;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
	},

	deductScore: function() {
		totalScore--;
		if (totalScore <= 0) {
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
		if (sprite.overlap(dropZone)) {
			sprite.x = dropZone.x;
			sprite.y = dropZone.y;
			this.showResult(sprite);
			this.judgment();
		} else {
			sprite.kill();
		}
	},

	nextLevel: function(event) {
		game.state.start("level2");	
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
		if ((result.key == "white-knight" && enemies[0].key == "white-dragon") || (result.key == "grey-knight" && enemies[0].key == "grey-dragon")) {
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
		game.state.start("level1");
	},

	showResult: function(sprite) {
		if (sprite.key == "not-gate") {
			if (currInputs[0].key == "white-knight") {
				result = game.add.sprite(525, 250, 'grey-knight');
				result.width = 100;
				result.height = 100;
			} else if (currInputs[0].key == "grey-knight") {
				result = game.add.sprite(525, 250, 'white-knight');
				result.width = 100;
				result.height = 100;
			}
		} else if (sprite.key == "buffer-gate") {
			if (currInputs[0].key == "white-knight") {
				result = game.add.sprite(525, 250, 'white-knight');
				result.width = 100;
				result.height = 100;
			} else if (currInputs[0].key == "grey-knight") {
				result = game.add.sprite(525, 250, 'grey-knight');
				result.width = 100;
				result.height = 100;
			}
		}
	},

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + totalScore, 600, 550);
	}
};
