const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
require('express-async-errors');
const expressOasGenerator = require('express-oas-generator');

const cors = require('cors')

const app = express();
// expressOasGenerator.handleResponses(app, {});
app.use(cors({
    allowedHeaders:["apikey","content-type"],
    exposedHeaders:"x-pod-name"
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var todosRouter = require('./routes/todos'); 
var healthRouter = require('./routes/health'); 
var metricsRouter = require('./routes/metrics'); 

app.use(function (req,res,next) {
    res.header('x-pod-name',process.env.POD_NAME)
    next()
})
app.use('/todos', todosRouter);
app.use('/health', healthRouter);
app.use('/metrics', metricsRouter);




//  expressOasGenerator.handleRequests(app, {});
module.exports = app;
