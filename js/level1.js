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
var cumulateScore = 0;
var timer;

level1 = function(game) {};

level1.prototype = {
	preload: function() {
		
	},
	
	create: function() {
		background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		dropZone = game.add.sprite(350, 250, 'dropzone-1');
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
		totalScore = 10;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
	},

	deductScore: function() {
		totalScore--;
		if (totalScore <= 0) {
			timer.stop();
			this.gameOver;
		}
	},

	gameOver: function() {
		cumulateScore += totalScore;
		
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
		if (sprite.overlap(dropZone)) {
			sprite.x = dropZone.x;
			sprite.y = dropZone.y;

			//currInputs[0].animations.add('walk');
			//currInputs[0].animations.play('walk', 500, true);
			var movein = game.add.tween(currInputs[0]).to({x: 350}, 1000, Phaser.Easing.Linear.None, true);
			movein.onStart.add(function() {this.startAnimation(currInputs[0])}, this);
			//movein.onComplete.add(this.tweenAction, sprite);
			var gate = sprite;
			movein.onComplete.add(function() {this.showResult(sprite)}, this);
			//this.showResult(sprite);
			//this.judgment();
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

	clickRetry: function() {
		game.state.start("level1");
	},

	showResult: function(sprite) {
		console.log('here111');
		currInputs[0].kill();
		if (sprite.key == "not-gate") {
			console.log('not-gate');
			if (currInputs[0].key == "red-knight-sheet") {
				result = game.add.sprite(350, 250, 'yellow-knight-sheet');
				result.width = 100;
				result.height = 100;
			} else {
				result = game.add.sprite(350, 250, 'red-knight-sheet');
				result.width = 100;
				result.height = 100;
			}
		} else {
			if (currInputs[0].key == "red-knight-sheet") {
				result = game.add.sprite(350, 250, 'red-knight-sheet');
				result.width = 100;
				result.height = 100;
			} else {
				result = game.add.sprite(350, 250, 'yellow-knight-sheet');
				result.width = 100;
				result.height = 100;
			}
		}
		//result.animations.add('walk');
		//result.animations.play('walk', 500, true);
		var moveout = game.add.tween(result).to({x: 525}, 1000, Phaser.Easing.Linear.None, true);
		moveout.onStart.add(function() {this.startAnimation(result)}, this);
		moveout.onComplete.add(function() {this.judgment()}, this);
		//movein.chain(moveout);
	},

	startAnimation: function(sprite) {
		sprite.animations.add('walk');
		sprite.animations.play('walk', 500, true);
	},

	stopAnimation: function(sprite) {
		sprite.animations.stop(null, true);
	},

	judgment: function() {
		this.stopAnimation(result);
		if ((result.key == "red-knight-sheet" && enemies[0].key == "red-dragon-sheet") || (result.key == "yellow-knight-sheet" && enemies[0].key == "yellow-dragon-sheet")) {
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

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + totalScore, 600, 550);
	}
};
