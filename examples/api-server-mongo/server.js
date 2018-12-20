var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  fs = require("fs"),
  ip = require("ip"),
  mrc = require('mrcjs');


// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mrc.initialize(__dirname, app);


//MIDDLEWARE
/*
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
  res.status(500).send({url: req.originalUrl + ' internal error'})
});*/

app.listen(port);


console.log('Server started on: ' + ip.address() + ":" +  port);

