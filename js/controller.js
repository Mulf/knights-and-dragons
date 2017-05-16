var baseURL = 'https://storage.googleapis.com/bytehunter_images/knights-and-dragons/';
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),

controller = function(game) {};

controller.prototype = {

	loadScripts: function () {
		game.load.script('menu', '../js/menu.js');
		game.load.script('level1', '../js/level1.js');
		game.load.script('level2', '../js/level2.js');
		game.load.script('level3', '../js/level3.js');
		game.load.script('level4', '../js/level4.js');
		game.load.script('level5', '../js/level5.js');
		game.load.script('help', '../js/help.js');
		game.load.script('settings', '../js/settings.js');
	},

	loadBGM: function() {
		game.load.crossOrigin = 'anonymous';
		game.load.audio('bgMusic', baseURL + 'My%20Little%20Adventure.mp3');
	},

	loadImages: function() {
		game.load.spritesheet('startBt', 'assets/button_sprite_sheet.png', 193, 71);
		game.load.spritesheet('settingButton', 'assets/settingButton.png', 193, 71);
		game.load.spritesheet('helpButton', 'assets/button_sprite_help.png', 193, 71);	
		game.load.spritesheet('continueButton', 'assets/Continue.png');
		game.load.spritesheet('restartButton', 'assets/Restart.png');
		game.load.spritesheet('homeButton', 'assets/Home.png');
		game.load.spritesheet('nextButton', 'assets/Next.png'); 
	},

	loadGameIMG: function() {
		// title, background and white block
		game.load.image('title', baseURL + 'kg-title.png');
		game.load.image('background', baseURL + 'kg-background.jpg');
		game.load.image('white-block', baseURL + 'kg-block.png');

		// load knight spritesheet
		game.load.image('red-knight', baseURL + 'kg-red-knight-idle.png');
		game.load.image('yellow-knight', baseURL + 'kg-yellow-knight-idle.png');
		game.load.spritesheet('red-knight-sheet', baseURL + 'kg-red-knight-spritesheet.png', 385, 385, 8);
		game.load.spritesheet('yellow-knight-sheet', baseURL + 'kg-yellow-knight-spritesheet.png', 385, 385, 8);

		// dragons
		game.load.spritesheet('red-dragon-sheet', baseURL + 'kg-red-dragon-spritesheet.png', 949, 688, 4);
		game.load.spritesheet('yellow-dragon-sheet', baseURL + 'kg-yellow-dragon-spritesheet.png', 949, 688, 4);

		// dragzones
		game.load.image('dropzone-1', baseURL + 'kg-block-1-input.png');
		game.load.image('dropzone-2', baseURL + 'kg-block-2-input.png');
		game.load.image('dropzone-3', baseURL + 'kg-block-3-input.png');
		game.load.image('dropzone-4', baseURL + 'kg-block-4-input.png');
		game.load.image('dropzone-5', baseURL + 'kg-block-5-input.png');

		// logic gates
		game.load.image('buffer-gate', baseURL + 'kg-buffer-gate.png');
		game.load.image('not-gate', baseURL + 'kg-not-gate.png');
		game.load.image('and-gate', baseURL + 'kg-and-gate.png');
		game.load.image('or-gate', baseURL + 'kg-or-gate.png');
		game.load.image('xor-gate', baseURL + 'kg-xor-gate.png');
		game.load.image('nand-gate', baseURL + 'kg-nand-gate.png');
		game.load.image('nor-gate', baseURL + 'kg-nor-gate.png');
		game.load.image('xnor-gate', baseURL + 'kg-xnor-gate.png');

		// white and grey knights
		game.load.image('white-knight', baseURL + 'kg-white-knight.png');
		game.load.image('grey-knight', baseURL + 'kg-grey-knight.png');

		// white and grey dragons
		game.load.image('white-dragon', baseURL + 'kg-white-dragon.png');
		game.load.image('grey-dragon', baseURL + 'kg-grey-dragon.png');

		// win and loss messages
		game.load.image('win', baseURL + 'win-msg.png');
		game.load.image('loss', baseURL + 'loss-msg.png');
		game.load.spritesheet('retryBt', baseURL + 'kg-retry-text-sprite-sheet.png', 193, 71);

		game.load.image('score0', baseURL + 'kg-text-0.png');
		game.load.image('score1', baseURL + 'kg-text-1.png');
		game.load.image('score2', baseURL + 'kg-text-2.png');
		game.load.image('score3', baseURL + 'kg-text-3.png');
		game.load.image('score4', baseURL + 'kg-text-4.png');
		game.load.image('score5', baseURL + 'kg-text-5.png');
		game.load.image('score6', baseURL + 'kg-text-6.png');
		game.load.image('score7', baseURL + 'kg-text-7.png');
		game.load.image('score8', baseURL + 'kg-text-8.png');
		game.load.image('score9', baseURL + 'kg-text-9.png');
	},
	
	preload: function() {
		this.loadScripts();
		this.loadBGM();
		this.loadGameIMG();
		this.loadImages();
	},

	create: function() {
		this.addGameStates();
		game.state.start('menu');
	},

	addGameStates: function() {
	    game.state.add("level1", level1);
	    game.state.add("level2", level2);
		game.state.add("level3", level3);
		game.state.add("level4", level4);
		game.state.add("level5", level5);
		game.state.add("help", help);
		game.state.add("settings", settings);
		game.state.add('menu', menu);
	}
		
};

game.state.add('controller', controller);
game.state.start('controller');
