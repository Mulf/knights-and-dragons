var button1;
var button2;
var preload = 1;
menu = function(game) {};

menu.prototype = {

	preload: function() {
		
	},	

	create: function() {

		if(preload == 1) {
			this.addGameMusic();			
			preload = 0;			
		}	

		var background = this.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		var title = this.add.sprite(400, 100, 'title');
		title.width = 700;
		title.anchor.setTo(0.5, 0.5);

		startBt = this.add.button(400, 200, 'startBt', this.clickStart, this, 2, 1, 0);
		startBt.anchor.setTo(0.5, 0.5);
		
		settingsBt = this.add.button(400, 300, 'settingButton', this.clickSetting, this, 2, 1, 0);
		settingsBt.anchor.setTo(0.5, 0.5);
		
		helpBt = this.add.button(400, 400, 'helpButton', this.clickHelp, this, 2, 1, 0);
		helpBt.anchor.setTo(0.5, 0.5);		
	},

	clickStart: function(button) {		
		game.state.start("level1");
	},

	clickSetting: function(button) {	
		game.state.start("settings");
	},

	clickHelp: function(button) {	
		game.state.start("help");
	},

	addGameMusic: function() {	
		music = game.add.audio('bgMusic');
		music.loop = true;
		music.play();
	}		
};