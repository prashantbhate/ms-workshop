// new feature added
var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var todorepo = require('./todorepo')
// const todos = [{ id: '1', name: 'Watch RRR', done: true }]

router.get('/headers', function (req, res, next) {
    res.set('Content-Type', 'text/plain');
    res.send(JSON.stringify(req.headers, null, 4));
});

/* GET todos listing. */
router.get('/', async function (req, res, next) {
    const todos = await todorepo.get();
    res.json(todos);
});

/* GET todo by ID listing. */
router.get('/:id', async function (req, res, next) {
    const result = await todorepo.fetch(req.params.id);

    if (result === null) {
        return next(createError(404, "Todo Not Found!"))
    }
    res.json(result);
});

/* GET todo by ID listing. */
router.get('/names/:name', async function (req, res, next) {
    const todos = await todorepo.getbyname(req.params.name);
    res.json(todos);
});

/* POST todos */
router.post('/', async function (req, res, next) {
    const { body } = req;

    const newTodo = await todorepo.post({
        name: body.name,
        done: false
    })

    res.status(201).json(newTodo);
});

/* PUT todo by ID listing. */
router.put('/:id', async function (req, res, next) {
    const result = await todorepo.fetch(req.params.id);
    if (result === null) {
        return next(createError(404, "Todo Not Found!"))
    }

    const reqtodo = req.body;

    var atleastOne = false;

    const todo = {}

    if (reqtodo.hasOwnProperty('name')) {
        todo.name = reqtodo.name;
        atleastOne = true;
    }
    if (reqtodo.hasOwnProperty('done')) {
        todo.done = reqtodo.done;
        atleastOne = true;
    }
    if (!atleastOne) {
        next(createError(400, 'Specify atleast one attribute'))
    }
    else {
        const newTodo = await todorepo.put(req.params.id, todo);
        res.json(newTodo);
    }
});

/* Delete todo by ID listing. */
router.delete('/:id', async function (req, res, next) {
    const todo = await todorepo.fetch(req.params.id);

    if (!todo) {
        return next(createError(404, "Todo Not Found!"))
    };
    const deletedId = await todorepo.remove(req.params.id);
    res.sendStatus(204);
});

module.exports = router;
