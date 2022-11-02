var express = require('express');
var router = express.Router();

var alive=true;
var ready=true;

router.get('/live', function (req, res, next) {
    if(alive){
        res.json({"status":"UP"});
    }else{
        res.status(500).send({ "status": "DOWN" })
    }
});
router.get('/ready', function (req, res, next) {
    if(ready){
        res.json({"status":"UP"});
    }else{
        res.status(500).send({ "status": "DOWN" })
    }
});
router.get('/ready/true', function (req, res, next) {
    ready=true;
    res.sendStatus(204)
});
router.get('/ready/false', function (req, res, next) {
    ready=false;
    res.sendStatus(204)
});
router.get('/live/true', function (req, res, next) {
    alive=true;
    res.sendStatus(204)
});
router.get('/live/false', function (req, res, next) {
    alive=false;
    res.sendStatus(204)
});

module.exports = router;
