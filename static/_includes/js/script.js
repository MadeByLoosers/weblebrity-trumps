/* Author:

*/

var WT = WT || {};
WT.settings = {
	roundTimeout: 5, //seconds between rounds,
	debug: true
}

WT.weblebrities = [];
WT.player1 = { name: 'Player1', cards: [], el: $('#player1'), isAI:false};
WT.player2 = { name: 'Player2', cards: [], el: $('#player2'), isAI:true};
WT.cardTemplate = '<div class="card"><h2><%= name %></h2><dl></dl></div>';
WT.statTemplate = '<dt data-stat="<%= name %>"><%= name %></dt><dd data-stat="<%= name %>"><%= value %><dd>';
WT.currentPlayer = WT.player1;

$(document).ready(function () {

	// //get a reference to the canvas
	// var ctx = $('#flip-coin')[0].getContext("2d");

	// console.log('ctx', ctx);
	 
	// //draw a circle
	// ctx.beginPath();
	// ctx.arc(75, 75, 50, 0, Math.PI*8, true); 
	// ctx.closePath();
	// ctx.fill();


	// setInterval(function () {

	// 	// do some flipping

	// 	//$('#flip-coin').

	// });
	WT.init();
});

WT.init = function(){

	$.get('weblebrities.json', function(data){
		WT.weblebrities = data;
		WT.weblebrities = _.shuffle(WT.weblebrities);
		var cardsEach = Math.floor(WT.weblebrities.length / 2);

		WT.player1.cards = _.first(WT.weblebrities, cardsEach);
		WT.player2.cards = _.rest(WT.weblebrities, cardsEach);

		WT.startRound(WT.currentPlayer);
		WT.updateScores();
		
	});
};

WT.showCard = function(player){

	var card = player.cards[0];

	var output = $(_.template(WT.cardTemplate, {name: card.name}));

	_.each(card.stats, function(value, key){
		var stat = {name: key, value: value};
		output.find('dl').append(_.template(WT.statTemplate, stat));
	});

	player.el.append(output);


	
};

WT.makeAIChoice = function(){
	
	var choices = _.clone(WT.currentPlayer.cards[0].stats);
	var result;
    var count = 0;
    for (var prop in choices)
        if (Math.random() < 1/++count)
           result = prop;
    
	
	WT.compareCards(result);

};

WT.startRound = function(){

	$('.card').remove();
	var player = WT.currentPlayer;
	WT.showCard(player);

	if(player.isAI){
		setTimeout(WT.makeAIChoice, 1000);
	}else{
		player.el.find('dl dt, dl dd').on('click', function(e){
			var stat = $(this).attr('data-stat');

			//Show other players card
			if(player === WT.player1){
				WT.showCard(WT.player2);
			}else{
				WT.showCard(WT.player1);
			}
			WT.compareCards(stat);	
		});
	}
};

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
		$('header .message').html('Draw');
    	WT.player1.cards.push(WT.player1.cards.shift()); // put current card to back of the stack
    	WT.player2.cards.push(WT.player2.cards.shift());
    	winner = WT.currentPlayer;
	}else{		
		$('header .message').html('Winner: '+winner.name);
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

			$('header .message').html('starting new round in '+  ((timeout+1) - count));
		}
	}, 1000);
}

WT.updateScores = function(){
	$('header .score').html(WT.player1.cards.length + ' v ' + WT.player2.cards.length);
}

WT.endGame = function(){

	if(WT.player1.cards.length <= 0){
		$('header .message').html('Player 2 is the winner!');
	}else{
		$('header .message').html('Player 1 is the winner!');
	}
}

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
