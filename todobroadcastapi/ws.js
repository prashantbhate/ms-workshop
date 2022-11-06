
const websocket = require('ws');

function setupWebSocket(server) {
    const wss = new websocket.Server({ server: server });
    const list = [];
    wss.on('connection', function connection(ws, req) {
        console.log('wss:connection:', req.url);
        ws.on('message', function message(data) {
            msg = data.toString();
            console.log('received: %s', msg);
            if (msg === 'reload') {
                //broadcast to all clients to reload
                wss.clients.forEach(client => {
                    client.send(msg)
                })
            }
        });
        ws.send('server:connected');
    });

}

module.exports = { setupWebSocket }