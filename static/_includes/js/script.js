 /* Author: 
	Matt [at] Gunt
*/

var WT = WT || {};
WT.settings = {
	roundTimeout: 5, //seconds between rounds,
	debug: true
}

//Stuff for later
WT.weblebrities = [];
WT.$mainEl = {};
WT.player1 = { name: 'Player1', cards: [], el: {}, isAI:false };
WT.player2 = { name: 'Player2', cards: [], el: {}, isAI:true };
WT.players = [WT.player1, WT.player2];

//Always start with first player
WT.currentPlayer = WT.player1;

$(document).ready(function () {

	//GO!
	WT.init();
});

/**
* Start here. Load card data.
*/
WT.init = function(){

	WT.$mainEl = $('#main');

	$.get('weblebrities.json', function(data){
		WT.weblebrities = data;
		WT.weblebrities = _.shuffle(WT.weblebrities);
		WT.cardsEach = Math.floor(WT.weblebrities.length / 2);

		WT.setUpGame();
		
	});
};

/**
* Ask the user if its one or two players
* Setup players
*/
WT.setUpGame = function(){

	//Present player choice		
	var $start = $(WT.templates.startTemplate);
	WT.$mainEl.append($start);

	WT.$mainEl.on('click', '.button', function(event){

		event.preventDefault();
		WT.$mainEl.off('click');

		//What player did we click on?
		var data = $(this).data();

		//Update Player objects
		if(data.players === 1){
			WT.player2.isAI = true;
		}else if(data.players === 2){
			WT.player2.isAI = false;
			WT.player2.name = 'Player 2 (AI)';
		}else{
			//Something's gone horribly wrong.
		}

		//Add player divs
		$start.remove();
		var $playerOneEl = $(_.template(WT.templates.playerTemplate, {number:1}));
		var $playerTwoEl = $(_.template(WT.templates.playerTemplate, {number:2}));
		WT.$mainEl.append($playerOneEl);
		WT.$mainEl.append($playerTwoEl);

		WT.player1.el = $playerOneEl.find('.card');
		WT.player2.el = $playerTwoEl.find('.card');

		//Divide up cards
		WT.player1.cards = _.first(WT.weblebrities, WT.cardsEach);
		WT.player2.cards = _.rest(WT.weblebrities, WT.cardsEach);

		//Start Rounds
		WT.startRound(WT.currentPlayer);
		WT.updateScores();

	});
	
}

/**
* Start a game Round
*/
WT.startRound = function(){


	var player = WT.currentPlayer;
	WT.showCardFront(player);

	var nonPlayer = WT.getNonPlayingPlayer();
	WT.showCardBack(nonPlayer);

	if(player.isAI){
		//Make a choice
		setTimeout(WT.makeAIChoice, 1000);
	}else{

		var $playerStats = player.el.find('li');

		$playerStats.on('click', function(e){
			
			$playerStats.off('click');

			var stat = parseInt($(this).find('.stat-val').text(), 10);

			//Show other players card
			if(player === WT.player1){
				WT.showCardFront(WT.player2);
			}else{
				WT.showCardFront(WT.player1);
			}
			WT.compareCards(stat);	
		});
	}
};



/**
* Display a card
*/ 
WT.showCardFront = function(player){

	
	player.el.find('.card-back').remove();

	var card = player.cards[0];

	var output = $(_.template(WT.templates.cardFront, {name: card.name, twitterName: card.accounts.twitter }));

	_.each(card.stats, function(value, key){
		var stat = {name: key, value: value};
		output.find('ul').append(_.template(WT.templates.statTemplate, stat));
	});

	player.el.append(output);
	
};

WT.showCardBack = function(player){

	console.log(player.el);
	player.el.append(WT.templates.cardBack);
}

/**
* Make a random choice for the AI
*/
WT.makeAIChoice = function(){
	
	var choices = _.clone(WT.currentPlayer.cards[0].stats);
	var result;
    var count = 0;
    for (var prop in choices)
        if (Math.random() < 1/++count)
           result = prop;
    
	
	WT.compareCards(result);

};

/**
* Compare card values to see who wins
*/
WT.compareCards = function(stat){

	var winner,
		draw = false;

	var player1Value = parseInt(WT.player1.cards[0].stats[stat]);
	var player2Value = parseInt(WT.player2.cards[0].stats[stat]);

	//Just incase we need different comparitors.
	switch(stat){
		case 'twitter':
		case 'linkedin':
		case 'github':
		case 'lanyrd':
		case 'facebook':
			//Higher value wins.
			if(player1Value > player2Value){
				winner = WT.player1
			}else if(player1Value < player2Value){
				winner = WT.player2
			}else if(player1Value == player2Value){
				draw = true;
			}
	}

	if(WT.settings.debug)
		console.log('Player 1: '+ player1Value , 'Player 2: '+ player2Value);

	if(draw){
		// $('header .message').html('Draw');
    	WT.player1.cards.push(WT.player1.cards.shift()); // put current card to back of the stack
    	WT.player2.cards.push(WT.player2.cards.shift());
    	winner = WT.currentPlayer;
	}else{		
		// $('header .message').html('Winner: '+winner.name);
		if(winner === WT.player1){
			WT.player1.cards.push(WT.player1.cards.shift());
			WT.player1.cards.push(WT.player2.cards.shift());
		}else{
			WT.player2.cards.push(WT.player2.cards.shift());
			WT.player2.cards.push(WT.player1.cards.shift());
		}
	}

	if(WT.settings.debug)
		console.log('Winner: ' + winner.name);

	WT.currentPlayer = winner;


	
	WT.updateScores();

	if(WT.player1.cards.length <= 0 && WT.player2.cards.length <= 0){
		WT.endGame();
	}else{
		WT.countdownToNewRound();
	}
	
};

/*
* Countdown to the next round
*/
WT.countdownToNewRound = function(){
	
	//Countdown to new round
	var count = 0,
		timeout = WT.settings.roundTimeout;

	var interVal = setInterval(function(){
		
		count++;

		if(count > timeout){
			clearInterval(interVal);
			if(WT.settings.debug){
				console.log('starting new round');
				WT.debugCards();
			}
			WT.startRound();
		}else if(count > timeout - 5){

			// $('header .message').html('starting new round in '+  ((timeout+1) - count));
		}
	}, 1000);
}

/**
* Update scores
*/
WT.updateScores = function(){
	// $('header .score').html(WT.player1.cards.length + ' v ' + WT.player2.cards.length);
}

/**
* 
*/
WT.endGame = function(){

	// if(WT.player1.cards.length <= 0){
	// 	$('header .message').html('Player 2 is the winner!');
	// }else{
	// 	$('header .message').html('Player 1 is the winner!');
	// }
}

WT.getNonPlayingPlayer = function(){

	var notPlaying;
	_.each(WT.players, function(player){
		if(player.name !== WT.currentPlayer.name)
			notPlaying = player;
	});

	return notPlaying;
}

/**
* Debug trace out cards quickly
*/
WT.debugCards = function(){

	if(WT.settings.debug){
		console.log('***** CARDS DUMP *****');
		console.log('----------------');
		console.log('Player 1: ' + WT.player1.cards.length + ' cards.');
		console.log('----------------');
		_.each(WT.player1.cards, function(card){
			console.log(card.name);
		});
		console.log('----------------');
		console.log('Player 2: ' + WT.player2.cards.length + ' cards.');
		console.log('----------------');
		_.each(WT.player2.cards, function(card){
			console.log(card.name);
		});
		console.log('***** CARDS DUMP END *****');
	}
}
