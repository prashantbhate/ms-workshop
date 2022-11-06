import { useRef, useEffect } from 'react';
function Broadcaster({ url, broadcast, afterBroadcast, onBroadcastRequest }) {

    const ws = useRef(null);
    useEffect(() => {

        ws.current = new WebSocket(url);
        // Connection opened
        ws.current.onopen = (event) => {
            ws.current.send('Hello Server!', event);
        };
        ws.current.onerror = (event) => {
            console.log('WebSocket error: ', event);
        };
        console.log("adding event listener")
        ws.current.onmessage = (event) => {
            console.log('Message from server ', event.data);
            if (event.data === 'reload') {
                console.log('onBroadcastRequest()')
                onBroadcastRequest();
            };
        };
        return () => {
            if (ws.current.readyState === ws.current.OPEN) {
                ws.current.close();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (broadcast === true) {
            if (ws.current.readyState === ws.current.OPEN) {
                ws.current.send('reload')
                console.log('afterBroadcast()')
                afterBroadcast()
            }
        };
        // eslint-disable-next-line
    }, [broadcast]);
}
export default Broadcaster;