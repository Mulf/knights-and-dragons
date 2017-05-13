help = function(game) {};

help.prototype = {
	
	preload: function() {
		game.load.spritesheet('homeButton', 'assets/Home.png');
	},
	
	create: function() {

		if (music.name !== "BackMusic") {
			music.stop();
			music = game.add.audio('BackMusic');
			music.loop = true;
			music.play();
		}

		this.add.sprite(0, 0, 'background');
		this.add.sprite(400,0,'black'); 		
		this.add.sprite(350,80,'hello'); 
		this.add.sprite(200,30,'logo'); 
		
		homeButton=game.add.button(600, 250, 'homeButton', this.Home, this, 2, 1, 0);
		homeButton.anchor.setTo(0.5, 0.5);
		
		introText = game.add.text(600, 400, '- Help Text is here -', { font: "40px Arial", fill: "#ffffff", align: "center" });
		introText.anchor.setTo(0.5, 0.5);
		l1Button=game.add.button(600, 350, 'homeButton', this.l1, this, 2, 1, 0);
		l1Button.anchor.setTo(0.5, 0.5);
		l2Button=game.add.button(600, 450, 'homeButton', this.l2, this, 2, 1, 0);
		l2Button.anchor.setTo(0.5, 0.5);
		l3Button=game.add.button(600, 550, 'homeButton', this.l3, this, 2, 1, 0);
		l3Button.anchor.setTo(0.5, 0.5);
	},
	
	Home: function(button){
		game.state.start("Main");
	},

	l1:function(button){
		game.state.start("level1");
	},

	l2:function(button){
		game.state.start("level2");
	},

	l3:function(button){
		game.state.start("level3");
	}

};
