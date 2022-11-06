
const { WebSocket, Server } = require('ws');
const { createClient } = require('redis');

const WS_CHANNEL = 'app:notifications';

function redisclient() {
    const redis = createClient({
        "url": process.env.REDIS_URL,
        // "socket": {
        //     reconnectStrategy: function (retries) {

        //         return new Error('Retry time exhausted');
        //     }
        // }
    })
    redis.on('error', (err) => console.log('Redis Client Error:' + process.env.REDIS_URL + ":" + err));
    return redis;
}


function setupWebSocket(server) {

    const wss = new Server({ server: server });

    wss.on('connection', async function connection(ws, req) {
        console.log('wss:connection:', req.url);
        ws.on('message', async function message(data) {
            msg = data.toString();
            console.log('received from client: %s', msg);
            if (msg === 'reload') {
                //broadcast to all clients to reload
                // wss.clients.forEach(client => {
                //     client.send(msg)
                // })
                //publish 
                const publisher = redisclient()
                await publisher.connect();
                console.log("Publishing 'reload' to redis...");
                await publisher.publish(WS_CHANNEL, msg);
                console.log("Published 'reload' to redis");
            }
        });
        ws.send('server:connected');
    });
    return { wss };
}

async function subscribeToRedis(wss) {
    const subscriber = redisclient().duplicate();
    console.log("connect")
    await subscriber.connect();
    console.log("connected")
    await subscriber.subscribe(WS_CHANNEL, (message) => {
        console.log('Received from redis : %s', message);
        let i = 1;
        wss.clients.forEach(client => {
            console.log('Broadcasting to client:' + i++);
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    console.log("done")
}

module.exports = { setupWebSocket, subscribeToRedis }