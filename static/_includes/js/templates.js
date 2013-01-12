
var WT = WT || {};
WT.templates = {};

WT.templates.startTemplate = '<div id="start" class="big-circle">' + 
								'<h2><span class="large">Welcome</span><span class="medium"> to Weblebrity Trumps</span></h2>' +
								'<p>Using the who’s who on the webasphere, Weblebritiy Trumps allows you to play Using the who’s who on the webasphere, Weblebritiy Trumps allows you to play</p>' + 
								'<div class="controls">' + 
									'<h3>Play</h3>' + 
									'<a href="" class="button first" data-players="1">1 Player</a>' +
									'<a href="" class="button" data-players="2">VS</a>' + 
								'</div>' + 
								'<div class="social">' + 
									'<p>This is a Gunt London Production</p>' + 
									'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>' +
									'<a href="https://twitter.com/guntlondon" class="twitter-follow-button" data-show-count="false" data-lang="en">Follow @guntlondon</a>' + 
								'</div>' + 
							'</div>';

WT.templates.playerTemplate = '<div class="player" id="player<%= number %>"><div class="card clearfix"></div></div>';
WT.templates.cardFront = '<div class="card-front"><h2><%= name %></h2><img src="https://api.twitter.com/1/users/profile_image?screen_name=<%= twitterName %>&size=original" height="160px"><ul></ul></div>';
WT.templates.cardBack = '<div class="card-back"><p>Player 1<br />Pick your stat</p></div>';
WT.templates.statTemplate = '<li><span class="stat"><%= name %></span><span class="stat-val"><%= value %></span></li>';
WT.templates.infoCircle = '<div class="info-circle">VS</div>';
