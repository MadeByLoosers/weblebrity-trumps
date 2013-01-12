
var WT = WT || {};
WT.templates = {};

WT.templates.startTemplate = '<div id="start" class="big-circle"><a href="" class="player" data-players="1">One Player</a><a href="" class="player" data-players="2">Two Players</a></div>';
WT.templates.playerTemplate = '<div class="player" id="player<%= number %>"><h1>Player <%= number %><h1></div>';
WT.templates.cardTemplate = '<div class="card"><h2><%= name %></h2><dl></dl></div>';
WT.templates.statTemplate = '<dt data-stat="<%= name %>"><%= name %></dt><dd data-stat="<%= name %>"><%= value %><dd>';