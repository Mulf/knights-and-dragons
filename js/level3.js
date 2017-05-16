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

var zoneFilled = [false, false, false, false];
var dropZones = [];
var dragPosition;

var currInputs = [];		// an empty array for the inputs
var result1;
var finalRes;
var enemies = [];

var win;
var loss;

level3 = function(game) {};

level3.prototype = {
	preload: function() {
		
	},
	
	create: function() {
		// load the background
		background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		
		dropZones[0] = game.add.sprite(150, 200, 'dropzone-4');
		dropZones[1] = game.add.sprite(150, 200, 'dropzone-1');

		for (i = 0; i < 2; i++) {
			dropZones[i].width = blkWidth;
			dropZones[i].height = blkHeight;
		}

		dropZones[0].x = 250;
		dropZones[0].y = 300;

		dropZones[1].x = 450;
		dropZones[1].y = 300;

		notGate = game.add.sprite(50, 25, 'not-gate');
		notGate.width = blkWidth;
		notGate.height = blkHeight;

		bufGate = game.add.sprite(175, 25, 'buffer-gate');
		bufGate.width = blkWidth;
		bufGate.height = blkHeight;

		andGate = game.add.sprite(300, 25, 'and-gate');
		andGate.width = blkWidth;
		andGate.height = blkHeight;

		orGate = game.add.sprite(425, 25, 'or-gate');
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

		this.randomInputGenerator(4);
		for (i = 0; i < 4; i++) {
			this.setSpriteParams(currInputs[i], 0, 150 + i * 100, 100, 100);
		}

		this.randomEnemiesGenerator(1);
		this.setSpriteParams(enemies[0], 700, 300, 100, 100);

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
		spriteDup.width = blkWidth;
		spriteDup.height = blkHeight;
		this.setToDragable(spriteDup);
	},

	onDragStart: function(sprite, pointer) {
		dragPosition.set(sprite.x, sprite.y);
	},

	onDragStop: function(sprite, pointer) {
		// Note: dropZone 0 accepts or/and, 1 accepts not/buffer
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
			// disabled until drapzone[0] is filled
			if (zoneFilled[0] && (sprite.key == 'not-gate' || sprite.key == 'buffer-gate')) {
				sprite.x = dropZones[1].x;
				sprite.y = dropZones[1].y;
				this.showResult(sprite, 2);
				this.judgment();
			} else {
				sprite.kill();
			}
		} else {
			sprite.kill();
		}
	},

	nextLevel: function(event) {
		game.state.start("level4");	
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
		game.state.start("level3");
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

	andGateOutput: function(sprites) {
		// accepts an array of sprites and return a result, the params of the result is up-to the game
		var andRes;
		for (i = 0; i < sprites.length; i++) {
			// and gates return a white knight when all the items in the array are white
			if (sprites.key != "red-knight") {
				// return a grey knight
				andRes = game.add.sprite(0, 0, 'yellow-knight');
				return andRes;
			}
		}
		andRes = game.add.sprite(0, 0, 'red-knight');
		return andRes;
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

	showResult: function(sprite, num) {
		var inputArray = [];
		for (i = 0; i < 4; i++)
	        inputArray[i] = currInputs[i];

		if (sprite.key == "and-gate" && num == 1) {
	        // only produce white when all are white
	        result1 = this.andGateOutput(inputArray);
	        this.setSpriteParams(result1, 350, 300, 100, 100);
	    } else if (sprite.key == "or-gate" && num == 1) {
	        // only produce white when both are white
	        result1 = this.orGateOutput(inputArray);
	        this.setSpriteParams(result1, 350, 300, 100, 100);
	    } else if (sprite.key == "buffer-gate") {
	    	finalRes = this.bufferGateOutput(result1);
	        this.setSpriteParams(finalRes, 600, 300, 100, 100);
	    } else if (sprite.key == "not-gate") {
	    	finalRes = this.notGateOutput(result1);
	        this.setSpriteParams(finalRes, 600, 300, 100, 100);
	    }
	},

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + totalScore, 600, 550);
	}
};
