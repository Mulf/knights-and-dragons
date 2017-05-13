var musicPlay = true;

settings = function(game) {};

settings.prototype = {
	
	preload: function() {
		game.load.spritesheet('homeButton', 'assets/Home.png');
		game.load.spritesheet('musicButton', 'assets/music.png');
		game.load.spritesheet('musicOffButton', 'assets/musicOff.png');
	},
	
	create: function() {

		if (music.name !== "bgMusic" && musicPlay) {
			music.stop();
			music = game.add.audio('bgMusic');
			music.loop = true;
			music.play();
		}

		this.add.sprite(0, 0, 'background');
		
		homeButton = game.add.button(400, 250, 'homeButton', this.Home, this, 2, 1, 0);
		homeButton.anchor.setTo(0.5, 0.5);
		
		// music button
		musicOffButton = game.add.button(400, 350, 'musicOffButton', this.mute, this, 2, 1, 0);
		musicOffButton.anchor.setTo(0.5, 0.5);			
		musicButton = game.add.button(400, 350, 'musicButton', this.mute, this, 2, 1, 0);
		musicButton.anchor.setTo(0.5, 0.5);
	},

	Home: function(button) {
		game.state.start("menu");
	},

	mute: function() {
		musicPlay =! musicPlay;

		if(musicPlay) {
			musicOffButton.invisible = false;
			musicButton = game.add.button(400, 350, 'musicButton', this.mute, this, 2, 1, 0);
			musicButton.anchor.setTo(0.5,0.5);
			music.play();
		} else {
			musicButton.invisible = false;
			musicOffButton = game.add.button(400, 350, 'musicOffButton', this.mute, this, 2, 1, 0);
			musicOffButton.anchor.setTo(0.5, 0.5);
			music.stop();
		}
	}
};
