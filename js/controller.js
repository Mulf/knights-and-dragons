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
		game.load.script('help', '../js/help.js');
		game.load.script('settings', '../js/settings.js');
		console.log('loading scripts');
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
		// background and white block
		game.load.image('background', baseURL + 'kg-background.jpg');
		game.load.image('white-block', baseURL + 'white.png');

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
	},
	
	preload: function() {
		this.loadScripts();
		this.loadBGM();
		this.loadGameIMG();
		this.loadImages();
		console.log('preloading');
	},

	create: function() {
		this.addGameStates();
		game.state.start('menu');
	},

	addGameStates: function() {
	    game.state.add("level1", level1);
	    game.state.add("level2", level2);
		game.state.add("level3", level3);
		game.state.add("help", help);
		game.state.add("settings", settings);
		game.state.add('menu', menu);
	}
		
};

game.state.add('controller', controller);
game.state.start('controller');
