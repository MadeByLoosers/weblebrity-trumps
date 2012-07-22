/* Author:

*/

$(document).ready(function () {

	//get a reference to the canvas
	var ctx = $('#flip-coin')[0].getContext("2d");

	console.log('ctx', ctx);
	 
	//draw a circle
	ctx.beginPath();
	ctx.arc(75, 75, 50, 0, Math.PI*8, true); 
	ctx.closePath();
	ctx.fill();


	setInterval(function () {

		// do some flipping

		//$('#flip-coin').

	});

});