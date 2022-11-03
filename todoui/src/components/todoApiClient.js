export async function list(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'apikey': window._env_.API_KEY
        }
    })
}
export async function create(url, todo) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'apikey': window._env_.API_KEY
        },
        body: JSON.stringify(todo)
    })
}
export async function update(url, todo) {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'apikey': window._env_.API_KEY
        },
        body: JSON.stringify(todo)
    });
}
export async function remove(url) {
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'apikey': window._env_.API_KEY
        }
    });
}