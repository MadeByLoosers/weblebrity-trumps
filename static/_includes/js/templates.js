
var WT = WT || {};
WT.templates = {};

WT.templates.startTemplate = '<div id="start"><a href="" class="player" data-players="1">One Player</a><a href="" class="player" data-players="2">Two Players</a></div>';
WT.templates.playerTemplate = '<div class="player" id="player<%= number %>"><h1>Player <%= number %><h1></div>';	
WT.templates.cardTemplate = '<div class="card"><img src="https://api.twitter.com/1/users/profile_image?screen_name=<%= twitterName %>&size=original" height="160px"><h2><%= name %></h2><dl></dl></div>';
WT.templates.statTemplate = '<dt data-stat="<%= name %>"><%= name %></dt><dd data-stat="<%= name %>"><%= value %><dd>';