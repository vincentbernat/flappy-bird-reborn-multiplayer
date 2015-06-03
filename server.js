'use strict';

var express = require('express'),
    port = process.env.PORT || 5000,
    app = express();

// Live reload
if (process.env.LIVERELOAD_PORT) {
  try {
    var livereload = require('connect-livereload');
  } catch (er) {
    livereload = null;
  }
  if (livereload) {
    app.use(livereload({
      port: process.env.LIVERELOAD_PORT
    }));
  }
}

app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/dist'));

app.listen(port, function() {
  console.log('Listening on ' + port);
});
