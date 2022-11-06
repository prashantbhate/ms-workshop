const path = require('path');
const logger = require('morgan');
const express = require('express');

const app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
