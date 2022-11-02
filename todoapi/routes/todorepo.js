var { createClient } = require('redis')
var { Client, Entity, Schema } = require('redis-om');

// 'redis://localhost:6379'
class Todo extends Entity {
    get id() {
        return this.entityId
    }
}

const todoSchema = new Schema(Todo, {
    name: { type: 'string' },
    done: { type: 'boolean' },
})
function redisclient(){
    const redis = createClient({
        "url":process.env.REDIS_URL,
        "socket": {
            reconnectStrategy: function (retries) {
                return new Error('Retry time exhausted');
            }
        }
    })
    redis.on('error', (err) => console.log('Redis Client Error:'+process.env.REDIS_URL+":"+err));
    return redis;
}
function disconnect(redis){
    redis.disconnect().catch((e) => {   
        console.error("caught Error disconnecting: "+e)
    })
}

const get = module.exports.get = async function () {
    const redis = redisclient()
    try {
        await redis.connect()
        const client = await new Client().use(redis)
        const todoRepository = client.fetchRepository(todoSchema)
        await todoRepository.createIndex();
        const result = await todoRepository.search().return.all()
        const todos = result.map(e => ({
            "name": e.name,
            "done": e.done,
            "id": e.id
        }))
        return todos;
    } finally { disconnect(redis) }
};


const getbyname = module.exports.getbyname = async function (name) {
    const redis = redisclient()
    try {
        await redis.connect()
        const client = await new Client().use(redis)
        const todoRepository = client.fetchRepository(todoSchema)
        await todoRepository.createIndex();
        const result = await todoRepository
        .search()
        .where('name')
        .equals(name)
        .return.all()
        const todos = result.map(e => ({
            "name": e.name,
            "done": e.done,
            "id": e.id
        }))
        return todos;
    } finally { disconnect(redis) }
};

const post = module.exports.post = async function (todo) {
    const redis = redisclient()
    try {
        await redis.connect()
        const client = await new Client().use(redis)
        const todoRepository = client.fetchRepository(todoSchema)
        const newtodo = todoRepository.createEntity()
        newtodo.name = todo.name
        newtodo.done = todo.done
        const id = await todoRepository.save(newtodo)
        return {
            name: newtodo.name,
            done: newtodo.done,
            id: newtodo.id,
        }
    } finally { disconnect(redis) }
};


const fetch = module.exports.fetch = async function (id) {
    const redis = redisclient()
    try {
        await redis.connect()
        const client = await new Client().use(redis)
        const todoRepository = client.fetchRepository(todoSchema)
        const existingtodo = await todoRepository.fetch(id)

        return existingtodo.name === null && existingtodo.done === null ? null: {
            name: existingtodo.name,
            done: existingtodo.done,
            id: existingtodo.id,
        }
    } finally { disconnect(redis) }
};

const put = module.exports.put = async function (id, todo) {
    const redis = redisclient()
    try {
        await redis.connect()
        const client = await new Client().use(redis)
        const todoRepository = client.fetchRepository(todoSchema)
        const existingtodo = await todoRepository.fetch(id)

        Object.assign(existingtodo, todo)

        const newid = await todoRepository.save(existingtodo)
        return {
            name: existingtodo.name,
            done: existingtodo.done,
            id: existingtodo.id,
        }
    } finally { disconnect(redis) }
};


const remove = module.exports.remove = async function (id) {
    const redis = redisclient()
    try {
        await redis.connect()
        const client = await new Client().use(redis)
        const todoRepository = client.fetchRepository(todoSchema)
        const deletedId = await todoRepository.remove(id)
        return deletedId
    } finally { disconnect(redis) }
};