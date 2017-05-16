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

		var aniLogoSize = 150;

		var background = this.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		var title = this.add.sprite(400, 100, 'title');
		title.width = 700;
		title.anchor.setTo(0.5, 0.5);

		var redKnight = this.add.sprite(75, 225, 'red-knight-sheet');
		redKnight.width = aniLogoSize;
		redKnight.height = aniLogoSize;
		redKnight.animations.add('walk');
		redKnight.animations.play('walk', 1000, true);

		var yellowKnight = this.add.sprite(75, 350, 'yellow-knight-sheet');
		yellowKnight.width = aniLogoSize;
		yellowKnight.height = aniLogoSize;
		yellowKnight.animations.add('walk');
		yellowKnight.animations.play('walk', 1000, true);


		var redDragon = this.add.sprite(575, 225, 'red-dragon-sheet');
		redDragon.width = aniLogoSize;
		redDragon.height = aniLogoSize;
		redDragon.animations.add('fly');
		redDragon.animations.play('fly', 1000, true);

		var yellowDragon = this.add.sprite(575, 350, 'yellow-dragon-sheet');
		yellowDragon.width = aniLogoSize;
		yellowDragon.height = aniLogoSize;
		yellowDragon.animations.add('fly');
		yellowDragon.animations.play('fly', 1000, true);

		var startBt = this.add.button(400, 225, 'startBt', this.clickStart, this, 0, 1, 2);
		startBt.anchor.setTo(0.5, 0.5);
		
		var settingsBt = this.add.button(400, 325, 'settingBt', this.clickSetting, this, 0, 1, 2);
		settingsBt.anchor.setTo(0.5, 0.5);

		var levelBt = this.add.button(400, 425, 'levelBt', this.clickSetting, this, 0, 1, 2);
		levelBt.anchor.setTo(0.5, 0.5);
		
		var helpBt = this.add.button(400, 525, 'helpBt', this.clickHelp, this, 0, 1, 2);
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