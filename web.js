/**
 * Server
 */
var path = require('path'),
    express = require('express'),
    app = require('express')();

// Serve anything in assets as a static fgbile
app.use(express.static('static'));

// // Any request server HTML file
// app.use('*', function (req, res) {
//     res.set('Content-Type', 'text/html');
//     res.sendFile(path.resolve(__dirname + '/static/index.html'));
// });

// Take port from argument if given
var port = process.argv[2] || 8080;

app.listen(port, function () {
    console.log('SERVER LISTENING ON: ' + port);
});
