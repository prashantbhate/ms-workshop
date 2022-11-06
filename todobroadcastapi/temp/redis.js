var { createClient } = require('redis')

function redisclient() {
    const redis = createClient({
        "url": process.env.REDIS_URL,
        "socket": {
            reconnectStrategy: function (retries) {
                return new Error('Retry time exhausted');
            }
        }
    })
    redis.on('error', (err) => console.log('Redis Client Error:' + process.env.REDIS_URL + ":" + err));
    return redis;
}


(async () => {

    const client = redisclient();
    const subscriber = client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe('article', (message) => {
        console.log(message); // 'message'
    });

})();



function disconnect(redis) {
    redis.disconnect().catch((e) => {
        console.error("caught Error disconnecting: " + e)
    })
}

const get = async () => {
    const client = redisclient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    try {
        await client.connect();
        await client.set('key', 'value');
        const value = await client.get('key');
        console.log(value)
        await client.subscribe('test', (message) => {
            console.log("init")
            console.log(message); // 'message'
        });
        await client.publish('test', 'hi');

    } catch (e) {
        console.log("Caught error:", e)
    } finally { disconnect(client) }
};

get()

setTimeout(() => { console.log("hi") },
    1000);