var baseURL = 'https://storage.googleapis.com/bytehunter_images/knights-and-dragons/';
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),

controller = function(game) {};

controller.prototype = {

	loadScripts: function () {
		game.load.script('menu', 'js/menu.js');
		game.load.script('level1', 'js/level1.js');
		game.load.script('level2', 'js/level2.js');
		game.load.script('level3', 'js/level3.js');
		game.load.script('help', 'js/help.js');
		game.load.script('settings', 'js/settings.js');
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
		game.load.image('background', baseURL + 'kl-background.png');
		game.load.image('buffer-gate', baseURL + 'kl-buffer-gate.png');
		game.load.image('not-gate', baseURL + 'kl-not-gate.png');
		game.load.image('white-block', baseURL + 'white.png');

		game.load.image('kl-zero', baseURL + 'kl-zero.png');
		game.load.image('kl-one', baseURL + 'kl-one.png');

		game.load.image('white-knight', baseURL + 'kl-white-knight.png');
		game.load.image('black-knight', baseURL + 'kl-black-knight.png');

		game.load.image('white-dragon', baseURL + 'kl-white-dragon.png');
		game.load.image('black-dragon', baseURL + 'kl-black-dragon.png');

		game.load.image('win', baseURL + 'win-msg.png');
		game.load.image('loss', baseURL + 'loss-msg.png');

		game.load.image('and-gate', baseURL + 'kl-and-gate.png');
		game.load.image('or-gate', baseURL + 'kl-or-gate.png');
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
		game.state.add("help", help);
		game.state.add("settings", settings);
		game.state.add('menu', menu);
	}
		
};

game.state.add('controller', controller);
game.state.start('controller');
