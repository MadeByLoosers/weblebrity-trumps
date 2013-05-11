 /* Author:
    Matt [at] Gunt
*/

var WT = WT || {};
WT.settings = {
    roundTimeout: 5, //seconds between rounds,
    debug: true
};

//Stuff for later
WT.weblebrities = [];
WT.$mainEl = {};
WT.$player1HeadScore = {};
WT.$player2HeadScore = {};


/**
* Start here. Load card data.
*/
WT.init = function(){

    WT.$mainEl = $('#main');
    WT.$headerEl = $('.headerinner');

    $.get('weblebrity-game-stats/latest.json', function(data){
        WT.weblebrities = data;
        WT.weblebrities = _.shuffle(WT.weblebrities);
        WT.cardsEach = Math.floor(WT.weblebrities.length / 2);

        WT.setUpGame();

    });
};

/**
* Ask the user if it's one or two players
* Setup players
*/
WT.setUpGame = function(){

    //Present player choice
    WT.$start = $(WT.templates.startTemplate);
    WT.$end = $(WT.templates.endTemplate);
    WT.$suggest = $(WT.templates.suggestTemplate);

    WT.$mainEl.append(WT.$start);

    WT.$start.find('.button').on('click', WT.startGame);
    WT.$start.find('.suggest').on('click', WT.showSuggest);
};

/*
 * set up players
 */
WT.setUpPlayers = function() {

    WT.weblebrities = _.shuffle(WT.weblebrities);
    WT.cardsEach = Math.floor(WT.weblebrities.length / 2);

    WT.player1 = { name: 'Player1', number: 1, oppositeNumber: 2, cards: [], el: {}, isAI:false };
    WT.player2 = { name: 'Player2', number: 2, oppositeNumber: 1, cards: [], el: {}, isAI:true };

    WT.players = [WT.player1, WT.player2];

    //Always start with first player
    WT.currentPlayer = WT.player1;
};


/**
* Show suggest
*/
WT.showSuggest = function(event){

    event.preventDefault();

    WT.$mainEl.append(WT.$suggest);
    WT.$suggest.fadeIn();

    WT.$suggest.find('.cancel').on('click', WT.hideSuggest);
    WT.$suggest.find('.suggest-submit').on('click', WT.submitSuggest);
    WT.$suggest.find('#webleb-suggest').on('keydown', function(event) {
        if (event.keyCode == 13) {
            WT.submitSuggest(event);
        }
    });
};


/**
* Submit suggest
*/
WT.submitSuggest = function(event){

    event.preventDefault();

    var $input = WT.$suggest.find('#webleb-suggest');
    var suggestion = $input.val();

    if (suggestion.length > 0) {

        $.post("http://dev.f90.co.uk/gunt/webleb-mailer/", { suggestion: suggestion }, function(data) {
            //data will always be null
        });

        if (WT.$suggest.find('.thanks').length < 1) {
            var $thanks = $("<p/>")
                .addClass("thanks")
                .text("Thanks! Why not add another?");
            $thanks.insertAfter(WT.$suggest.find('.suggest-submit'));
        }

        $input.val("@");
    }
};


/**
* Hide suggest
*/
WT.hideSuggest = function(event){

    event.preventDefault();

    WT.$suggest.find('.cancel').off('click');
    WT.$start.find('.suggest').on('click', WT.showSuggest);
    WT.$suggest.fadeOut(250, function(){
        WT.$suggest.remove();
    });
};


/**
* Start a game
*/
WT.startGame = function(event){

    event.preventDefault();
    WT.$mainEl.off('click');

    WT.$start.remove();
    WT.$end.remove();

    WT.setUpPlayers();

    //What player did we click on?
    var data = $(this).data();

    //Update Player objects
    if(data.players === 2){
        WT.player2.isAI = false;
        WT.player2.name = 'Player 2';
    }else{
        WT.player2.isAI = true;
        WT.player2.name = 'Player 2 (AI)';
    }

    //Divide up cards
    WT.player1.cards = _.first(WT.weblebrities, WT.cardsEach);
    WT.player2.cards = _.rest(WT.weblebrities, WT.cardsEach);

    //Add player divs
    var $playerOneEl = $(_.template(WT.templates.playerTemplate, {number:1, score:WT.player1.cards.length}));
    var $playerTwoEl = $(_.template(WT.templates.playerTemplate, {number:2, score:WT.player2.cards.length}));
    var $playerOneScoreEl = $(_.template(WT.templates.scoreTemplate, {number:1, score:WT.player1.cards.length}));
    var $playerTwoScoreEl = $(_.template(WT.templates.scoreTemplate, {number:2, score:WT.player2.cards.length}));
    WT.$mainEl.append($playerOneEl);
    WT.$mainEl.append($playerTwoEl);
    WT.$headerEl.append($playerOneScoreEl);
    WT.$headerEl.append($playerTwoScoreEl);

    WT.player1.el = $playerOneEl.find('.card');
    WT.player2.el = $playerTwoEl.find('.card');

    WT.$player1HeadScore = WT.$headerEl.find('.player-1-score');
    WT.$player2HeadScore = WT.$headerEl.find('.player-2-score');

    //Start Rounds
    WT.startRound(WT.currentPlayer);
};


/**
* Start a game Round
*/
WT.startRound = function(){

    WT.player2.el.html('');
    WT.player1.el.html('');

    var player = WT.currentPlayer;
    WT.showCardFront(player);

    var nonPlayer = WT.getNonPlayingPlayer();
    WT.showCardBack(nonPlayer);

    WT.updateInfoCircle('vs').done(function(){

        // Wait for token to flip back to VS

        if(player.isAI){
            //Make a choice
            setTimeout(WT.makeAIChoice, 1000);
        }else{

            var $playerStats = player.el.find('li');

            $playerStats.on('click', function(e){

                var $selected = $(this);

                $playerStats.off('click');

                // highlight selected stat
                //$selected.addClass('selected');
                var index = $selected.index();

                //Show other players card
                WT.showCardFront(nonPlayer);

                // compare stats
                var stat = $selected.find('.stat').text().toLowerCase();
                WT.compareCards(stat, index);
            });
        }

    });
};


WT.updateInfoCircle = function(state){

    var dfd = $.Deferred();

    //Add if not there
    if(_.isEmpty(WT.infoCircle)){
        WT.$mainEl.append(WT.templates.infoCircle);
        WT.infoCircle = WT.$mainEl.find('.info-circle');
    }

    WT.infoCircle.on(getTransitionEndEventName(), function(event){

        WT.infoCircle.off(getTransitionEndEventName());

        var content = '';

        switch(state)
        {
            case 'vs':
                content = '<p class="vs">VS</p>';
                break;
            case 'player1win':
                content = '<p class="wins">Player 1<br />wins</p>';
                break;
            case 'player2win':
                content = '<p class="wins">Player 2<br />wins</p>';
                break;
            case 'draw':
                content = '<p class="draw">Draw</p>';
                break;
            case 'score':
                content = '<p class="score"><span>' + WT.player1.cards.length + '</span> - <span>' + WT.player2.cards.length + '</span></p>';
                break;
        }

        WT.infoCircle.html(content);

        WT.infoCircle.on(getTransitionEndEventName(), function(event){

            dfd.resolve();
            WT.infoCircle.off(getTransitionEndEventName());
        });

        _.delay(function () {
            WT.infoCircle.addClass('no-transitions').removeClass('flip').removeClass('no-transitions').addClass('flipped');
        }, 100);
    });


    _.delay(function(){
        WT.infoCircle.addClass('flip');
    }, 500);

    // Return a promise
    return dfd.promise();
};


/**
* Display a card
*/
WT.showCardFront = function(player, index){

    player.el.find('.card-back').remove();

    var card = player.cards[0];

    var output = $(_.template(WT.templates.cardFront, {
            name: card.name,
            twitterName: card.accounts.twitter,
            bio: card.bio
        }));

    _.each(card.stats, function(value, key){
        var stat = {name: capitaliseFirstLetter(key), value: value};
        output.find('ul').append(_.template(WT.templates.statTemplate, stat));
    });

    player.el.append(output);
};


WT.showCardBack = function(player){
    player.el.append(WT.templates.cardBack);
    player.el.find('.player-no').html(player.oppositeNumber);
};

/**
* Make a random choice for the AI
*/
WT.makeAIChoice = function(){

    var choices = _.clone(WT.currentPlayer.cards[0].stats);
    var result;
    var count = 0;
    var selected;
    for (var prop in choices) {
        if (Math.random() < 1/++count) {
           result = prop;
           selected = count-1;
        }
    }

    if(WT.settings.debug) {
        console.log("AI selected: ", result, selected);
    }

    var nonPlayer = WT.getNonPlayingPlayer();
    WT.showCardFront(nonPlayer);
    WT.compareCards(result, selected);
};


/**
* Compare card values to see who wins
*/
WT.compareCards = function(stat, index){

    var winner,
        draw = false;

    var player1Value = parseInt(WT.player1.cards[0].stats[stat], 10);
    var player2Value = parseInt(WT.player2.cards[0].stats[stat], 10);

    // highlight selected stats
    if (index !== undefined) {
        WT.player1.el.find('li:eq('+index+')').addClass('selected');
        WT.player2.el.find('li:eq('+index+')').addClass('selected');
    }


    //Just incase we need different comparitors.
    switch(stat){
        case 'twitter':
        case 'linkedin':
        case 'github':
        case 'lanyrd':
            //Higher value wins.
            if(player1Value > player2Value){
                winner = WT.player1;
            }else if(player1Value < player2Value){
                winner = WT.player2;
            }else if(player1Value == player2Value){
                draw = true;
            }
    }


    if(WT.settings.debug) {
        console.log('Player 1: '+ player1Value , 'Player 2: '+ player2Value);
    }

    if(draw){
        WT.updateInfoCircle('draw').done(WT.updateScoreHeadings);
        WT.player1.cards.push(WT.player1.cards.shift()); // put current card to back of the stack
        WT.player2.cards.push(WT.player2.cards.shift());
        winner = WT.currentPlayer;
    } else {
        if(winner === WT.player1){
            WT.player1.cards.push(WT.player1.cards.shift());
            WT.player1.cards.push(WT.player2.cards.shift());
            WT.updateInfoCircle('player1win').done(WT.updateScoreHeadings);
        }else{
            WT.player2.cards.push(WT.player2.cards.shift());
            WT.player2.cards.push(WT.player1.cards.shift());
            WT.updateInfoCircle('player2win').done(WT.updateScoreHeadings);
        }
    }

    if(WT.settings.debug) {
        console.log('Winner: ' + winner.name);
    }

    WT.currentPlayer = winner;

    if(WT.player1.cards.length <= 0 || WT.player2.cards.length <= 0){
        WT.endGame();
    }else{
        WT.countdownToNewRound();
    }

};


WT.updateScoreHeadings = function() {
    var p1score = WT.player1.cards.length,
        p2score = WT.player2.cards.length,
        $p1scoreEl = WT.$player1HeadScore.find('.score'),
        $p2scoreEl = WT.$player2HeadScore.find('.score'),
        $p1pluralEl = WT.$player1HeadScore.find('.plural'),
        $p2pluralEl = WT.$player2HeadScore.find('.plural');


    $p1scoreEl.html(p1score);
    $p2scoreEl.html(p2score);

    if (p1score === 1) {
        $p1pluralEl.addClass('hidden');
    } else {
        $p1pluralEl.removeClass('hidden');
    }

    if (p2score === 1) {
        $p2pluralEl.addClass('hidden');
    } else {
        $p2pluralEl.removeClass('hidden');
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
                //WT.debugCards();
            }
            WT.startRound();
        }else if(count > timeout - 5){

            // $('header .message').html('starting new round in '+  ((timeout+1) - count));
        }
    }, 1000);
};


/**
*
*/
WT.endGame = function(){

    var large, medium;

    if(WT.player1.cards.length <= 0){
        if (!!WT.player2.isAI) {
            large = 'You lose!';
            medium = 'Better luck next time...';
        } else {
            large = 'Player 2';
            medium = 'Wins!';
        }
    } else {
        if (!!WT.player2.isAI) {
            large = 'You win';
            medium = 'You know your weblebrities!';
        } else {
            large = 'Player 1';
            medium = 'Wins!';
        }
    }

    WT.$end.find('.large').text(large);
    WT.$end.find('.medium').text(medium);

    WT.infoCircle = null;
    WT.$mainEl.empty();
    WT.$mainEl.append(WT.$end);

    WT.$end.find('.button').on('click', WT.startGame);
    WT.$end.find('.suggest').on('click', WT.showSuggest);
};

WT.getNonPlayingPlayer = function(){

    var notPlaying;
    _.each(WT.players, function(player){
        if(player.name !== WT.currentPlayer.name)
            notPlaying = player;
    });

    return notPlaying;
};

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
};

/*
* Helper to get transition end event name from modernizr
*/
function getTransitionEndEventName(){
    var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'
    };
    return transEndEventNames[ Modernizr.prefixed('transition') ];
}


/*
 * Ronseal...
 */
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



$(document).ready(function () {
    //GO!
    WT.init();
});