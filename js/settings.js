var musicPlay = true;

settings = function(game) {};

settings.prototype = {
	
	preload: function() {

	},
	
	create: function() {

		var background = this.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		if (music.name !== "bgMusic" && musicPlay) {
			music.stop();
			music = game.add.audio('bgMusic');
			music.loop = true;
			music.play();
		}
		
		var homeBt = this.add.button(40, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		homeBt.scale.setTo(0.3, 0.3);
		homeBt.anchor.setTo(0.5, 0.5);
		
		// music button
		musicOffButton = game.add.button(400, 300, 'musicOffBt', this.setMusicBt, this, 2, 1, 0);
		musicOffButton.anchor.setTo(0.5, 0.5);			
		musicButton = game.add.button(400, 300, 'musicOnBt', this.setMusicBt, this, 2, 1, 0);
		musicButton.anchor.setTo(0.5, 0.5);
	},

	clickHome: function(button) {
		game.state.start("menu");
	},

	setMusicBt: function() {
		musicPlay = !musicPlay;
		if(musicPlay) {
			musicOffButton.invisible = false;
			musicButton = game.add.button(400, 300, 'musicOnBt', this.setMusicBt, this, 2, 1, 0);
			musicButton.anchor.setTo(0.5,0.5);
			music.play();
		} else {
			musicButton.invisible = false;
			musicOffButton = game.add.button(400, 300, 'musicOffBt', this.setMusicBt, this, 2, 1, 0);
			musicOffButton.anchor.setTo(0.5, 0.5);
			music.stop();
		}
	}
};
