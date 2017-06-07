var blkWidth = 100;					// the block size
var blkHeight = 100;

var dropZone;						// dragzone
var dragPosition;

var currInputs = [];				// an empty array for the inputs
var result;							// the final result
var enemies = [];					// the enemies list

var win;							// the win text
var loss;							// the loss text
var retry;							// the retry button	

var currLevelScore = 100;			// the current level score
var timerCount = 110;				// leave 10 more seconds to operate
var timer;							// the timer of the game

var level1 = function(game) {};

level1.prototype = {
	preload: function() {
		
	},
	
	create: function() {
		// place the background
		var background = game.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		// place the game home button to the upper right corner
		var gamehomeBt = game.add.button(720, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		gamehomeBt.scale.setTo(0.3, 0.3);
		gamehomeBt.anchor.setTo(0.5, 0.5);

		// place the drag zone
		dropZone = game.add.sprite(350, 250, 'dropzone-1');
		dropZone.width = blkWidth;
		dropZone.height = blkHeight;

		// place the two gates, not and buffer gates
		var notGate = game.add.sprite(50, 50, 'not-gate');
		notGate.width = blkWidth;
		notGate.height = blkHeight;

		var bufGate = game.add.sprite(175, 50, 'buffer-gate');
		bufGate.width = blkWidth;
		bufGate.height = blkHeight;

		bufGate.inputEnabled = true;
		bufGate.events.onInputDown.add(this.onGateClick, this);

		notGate.inputEnabled = true;
		notGate.events.onInputDown.add(this.onGateClick, this);

		// randomly generate inputs and enemy
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
		currLevelScore = 100;
		timerCount = 110;
		timer = game.time.create(false);
		timer.loop(1000, this.deductScore, this);
		timer.start();
	},

	// check home button to return to the menu
	clickHome: function() {
		game.state.start("menu");
	},

	// deduct current level score every one second after the initial 10 seconds
	deductScore: function() {
		timerCount--;				// deduct timercount every second
		if (timerCount <= 100) {
			// when timercount less than 100, deduct curr score
			currLevelScore--;
		}
		// when the score reaches 0, stop the timer and call game over
		if (currLevelScore <= 0) {
			currLevelScore = 0;
			timer.stop();
			this.gameOver;
		}
	},

	// Game over: display the loss text and retry button 
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

	// create a list of random enemies
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

	// the effects of the gates
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
		if (sprite.overlap(dropZone)) {
			sprite.x = dropZone.x;
			sprite.y = dropZone.y;

			var movein = game.add.tween(currInputs[0]).to({x: 350}, 1000, Phaser.Easing.Linear.None, true);
			movein.onStart.add(function() {this.startAnimation(currInputs[0])}, this);
			movein.onComplete.add(function() {this.showResult(sprite)}, this);
		} else {
			sprite.kill();
		}
	},

	// start the next level on click
	nextLevel: function(event) {
		game.state.start("level2");	
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

	// retry the game state on click
	clickRetry: function() {
		game.state.start("level1");
	},

	// show the result once the gate is placed
	showResult: function(sprite) {
		currInputs[0].kill();					// kill the input after the input pass the door
		if (sprite.key == "not-gate") {
			// if it's a NOT gate, reverse the color
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
			// if it's a buffer gate, just pass it without changing the color
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
		var moveout = game.add.tween(result).to({x: 525}, 1000, Phaser.Easing.Linear.None, true);
		moveout.onStart.add(function() {this.startAnimation(result)}, this);
		moveout.onComplete.add(function() {this.judgment()}, this);
	},

	// animation functions
	startAnimation: function(sprite) {
		sprite.animations.add('walk');
		sprite.animations.play('walk', 500, true);
	},

	stopAnimation: function(sprite) {
		sprite.animations.stop(null, true);
	},

	// judge whether the final result matches, display win/loss accordingly
	judgment: function() {
		timer.stop();							// stop the timer
		this.stopAnimation(result);				// stop the animation
		if ((result.key == "red-knight-sheet" && enemies[0].key == "red-dragon-sheet") || (result.key == "yellow-knight-sheet" && enemies[0].key == "yellow-dragon-sheet")) {
			// color matches, kill the enemy and display win
			var kill = game.add.sprite(650, 250, 'kill-sheet');
			kill.width = 100;
			kill.height = 100;
			kill.animations.add('kill');
			kill.animations.play('kill', 50, false);
			enemies[0].kill();
			kill.animations.currentAnim.onComplete.add(function() {this.gameWon()}, this);
		} else {
			// otherwise loss
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

	update: function() {

	},

	render: function() {
		game.debug.text('Your score: ' + currLevelScore, 600, 550);
	}
};
