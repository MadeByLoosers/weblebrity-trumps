
var WT = WT || {};
WT.templates = {};

WT.templates.startTemplate = '<div id="start" class="big-circle">' +
                                '<h2><span class="large">Welcome</span><span class="medium"> to Weblebrity Trumps</span></h2>' +
                                '<p>Like a who’s who of the information superhighway websphere, Weblebrity Trumps turns the web\'s elite into a gamification experience based on social media and internet proliferation.</p>' +
                                '<div class="controls">' +
                                    '<h3>Play</h3>' +
                                    '<a href="" class="button start first" data-players="1">1 Player</a>' +
                                    '<a href="" class="button start" data-players="2">VS</a>' +
                                '</div>' +
                                '<p class="cta-suggest">' +
                                    '<a class="suggest" href="">SUGGEST A WEBLEBRITY</a>' +
                                '</p>' +
                            '</div>';

WT.templates.suggestTemplate = '<div id="suggest" class="big-circle">' +
                                '<h2><span class="large">Suggest</span><span class="medium"> A Weblebrity</span></h2>' +
                                '<p>Do you know a weblebrity? Are they worthy of joining these greats? If so please enter their Twitter handle below.</p>' +
                                '<div class="suggest controls">' +
                                    '<input type="text" name="webleb-suggest" id="webleb-suggest" placeholder="@" value="@">' +
                                    '<a href="" class="button suggest-submit">Suggest</a>' +
                                    '<a href="" class="cancel">Cancel</a>' +
                                '</div>' +
                            '</div>';

WT.templates.endTemplate = '<div id="end" class="big-circle">' +
                                '<h2><span class="large"></span><span class="medium"></span></h2>' +
                                '<p>Why not play again?</p>' +
                                '<div class="controls">' +
                                    '<h3>Play</h3>' +
                                    '<a href="" class="button start first" data-players="1">1 Player</a>' +
                                    '<a href="" class="button start" data-players="2">VS</a>' +
                                '</div>' +
                                '<p class="cta-suggest">' +
                                    '<a class="suggest" href="">SUGGEST A WEBLEBRITY</a>' +
                                '</p>' +
                            '</div>';


WT.templates.playerTemplate = '<div class="player" id="player<%= number %>">' +
                                '<h2 class="score-heading">' +
                                    'Player <%= number %>: ' +
                                    '<span class="score"><%= score %></span>' +
                                    ' card<span class="plural">s</span> remaining' +
                                '</h2>' +
                                '<div class="card clearfix"></div>' +
                            '</div>';

WT.templates.cardFront = '<div class="card-front">'+
                            '<h2><%= name %></h2>'+
                            '<div class="card-details">'+
                                '<img src="https://api.twitter.com/1/users/profile_image?screen_name=<%= twitterName %>&size=original" height="160px">'+
                                '<% if (bio) { %><div class="bio"><p><%= bio %></p></div><% } %>'+
                            '</div>' +
                            '<ul class="stats"></ul>'+
                        '</div>';

WT.templates.cardBack = '<div class="card-back"><p>Player <span class="player-no">1</span><br />Pick your stat</p></div>';

WT.templates.statTemplate = '<li><span class="stat"><%= name %></span><span class="stat-val"><%= value %></span></li>';

WT.templates.infoCircle = '<div class="info-circle"><p class="game-on">Game On!</p></div>';
