const redis = require('redis');
(async () => {

    const publisher = redis.createClient();
    await publisher.connect();

    const article = {
        id: '123456',
        name: 'Using Redis Pub/Sub with Node.js',
        blog: 'Logrocket Blog',
    };
    await publisher.publish('article', JSON.stringify(article));
    await publisher.publish('article', JSON.stringify(article));

})();