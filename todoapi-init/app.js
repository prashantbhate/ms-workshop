//var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const express = require('express');
const expressOasGenerator = require('express-oas-generator');

var todosRouter = require('./routes/todos'); 
var cors = require('cors')

var app = express();
expressOasGenerator.handleResponses(app, {});
app.use(cors())
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/todos', todosRouter);
expressOasGenerator.handleRequests(app, {});
module.exports = app;
