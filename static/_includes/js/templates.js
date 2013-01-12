
var WT = WT || {};
WT.templates = {};

WT.templates.startTemplate = '<div id="start"><a href="" class="player" data-players="1">One Player</a><a href="" class="player" data-players="2">Two Players</a></div>';
WT.templates.playerTemplate = '<div class="player" id="player<%= number %>"></div>';	
WT.templates.cardTemplate = '<div class="card"><h2><%= name %></h2><img src="https://api.twitter.com/1/users/profile_image?screen_name=<%= twitterName %>&size=original" height="160px"><dl></dl></div>';
WT.templates.statTemplate = '<dt data-stat="<%= name %>"><%= name %></dt><dd data-stat="<%= name %>"><%= value %><dd>';