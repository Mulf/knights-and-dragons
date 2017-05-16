levelchoose = function(game) {};

levelchoose.prototype = {
	preload: function() {

	},

	create: function() {
		var background = this.add.sprite(0, 0, 'background');
		background.width = 800;
		background.height = 600;

		var level1Bt = this.add.button(400, 100, 'level1Bt', this.clickLevel1, this, 0, 1, 2);
		level1Bt.anchor.setTo(0.5, 0.5);
		var level2Bt = this.add.button(400, 200, 'level2Bt', this.clickLevel2, this, 0, 1, 2);
		level2Bt.anchor.setTo(0.5, 0.5);
		var level3Bt = this.add.button(400, 300, 'level3Bt', this.clickLevel3, this, 0, 1, 2);
		level3Bt.anchor.setTo(0.5, 0.5);
		var level4Bt = this.add.button(400, 400, 'level4Bt', this.clickLevel4, this, 0, 1, 2);
		level4Bt.anchor.setTo(0.5, 0.5);
		var level5Bt = this.add.button(400, 500, 'level5Bt', this.clickLevel5, this, 0, 1, 2);
		level5Bt.anchor.setTo(0.5, 0.5);

		var homeBt = this.add.button(40, 30, 'homeBt', this.clickHome, this, 0, 1, 2);
		homeBt.scale.setTo(0.3, 0.3);

		homeBt.anchor.setTo(0.5, 0.5);
	},

	clickLevel1: function() {
		game.state.start("level1");
	},

	clickLevel2: function() {
		game.state.start("level2");
	},

	clickLevel3: function() {
		game.state.start("level3");
	},

	clickLevel4: function() {
		game.state.start("level4");
	},

	clickLevel5: function() {
		game.state.start("level5");
	},

	clickHome: function() {
		game.state.start("menu");
	}
};