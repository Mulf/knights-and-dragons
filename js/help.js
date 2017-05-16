help = function(game) {};

help.prototype = {
	
	preload: function() {

	},
	
	create: function() {

		var background = this.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		var homeBt = this.add.button(40, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		homeBt.scale.setTo(0.3, 0.3);
		homeBt.anchor.setTo(0.5, 0.5);
	},
	
	clickHome: function() {
		game.state.start("menu");
	}
};
