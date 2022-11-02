const express = require('express');
const router = express.Router();
const client = require('prom-client')

// Create a Registry which registers the metrics
const register = new client.Registry()

register.setDefaultLabels({
    app: 'todoapi'
  })

client.collectDefaultMetrics({ register })

router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
});

module.exports = router;
