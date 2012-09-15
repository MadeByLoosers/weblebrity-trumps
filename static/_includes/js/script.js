/* Author:

*/

var WT = WT || {};
WT.weblebrities = [];
WT.player1 = { name: 'Player1', cards: [], el: $('#player1')};
WT.player2 = { name: 'Player2', cards: [], el: $('#player2')};
WT.cardTemplate = '<div class="card"><h2><%= name %></h2><dl></dl></div>';
WT.statTemplate = '<dt data-stat="<%= name %>"><%= name %></dt><dd data-stat="<%= name %>"><%= value %><dd>';

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

		WT.showCard(WT.player1);
		WT.startRound(WT.player1);
	});
};

WT.showCard = function(player){

	var card = player.cards[0];

	var output = $(_.template(WT.cardTemplate, {name: card.name}));

	_.each(card.stats, function(value, key){
		var stat = {name: key, value: value};
		output.find('dl').append(_.template(WT.statTemplate, stat));
	});
	console.log(player.el);
	player.el.append(output);
	
};

WT.startRound = function(player){

	player.el.find('dl dt, dl dd').on('click', function(e){
		var stat = $(this).attr('data-stat');
		WT.compareCards(stat);
		WT.showCard(WT.player2);
	});
};

WT.compareCards = function(stat){

	var winner,
		draw = false;

	var player1Value = WT.player1.cards[0].stats[stat];
	var player2Value = WT.player2.cards[0].stats[stat];
	
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

	$('header').html('Winner: '+winner.name);
	
};
