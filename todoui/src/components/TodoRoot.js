import { useState } from 'react';
import App from './App';
import Broadcaster from './Broadcaster';
function TodoRoot() {
    const [broadcast, setBroadcast] = useState(false);
    const [stale, setStale] = useState(true);

    return (<div>

        <Broadcaster
            url={window._env_.WS_URL}
            broadcast={broadcast}
            onBroadcastRequest={() => setStale(true)}
            afterBroadcast={() => setBroadcast(false)}
        />

        <App stale={stale}
            url={window._env_.API_URL}
            onChange={() => setBroadcast(true)}
            afterLoad={() => setStale(false)}
        />

    </div>);
}

export default TodoRoot;