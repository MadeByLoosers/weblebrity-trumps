/* Author:

*/

var WT = WT || {};
WT.weblebrities = [];
WT.player1 = { name: '', cards: []};
WT.player2 = { name: '', cards: []};


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

	});
}
