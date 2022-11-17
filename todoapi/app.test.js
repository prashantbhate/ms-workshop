const request = require('supertest');
const app = require('./app')

const { GenericContainer } = require("testcontainers");

describe('TODOs API metrics', () => {
    it('GET /metrics', async () => {
        const response = await request(app)
            .get("/metrics")
            .expect('Content-Type', /text\/plain/)
            .expect(200);
        expect(response.text).toMatch(/nodejs_active_requests gauge/);
    });
});

describe('TODOs API healthcheck', () => {
    it('GET /health/live', async () => {
        await request(app)
            .get("/health/live/true")
            .expect(204);
        const response = await request(app)
            .get("/health/live")
            .expect('Content-Type', /application\/json/)
            .expect(200);
        expect(response.body.status).toEqual("UP");
    });
    it('GET /health/ready', async () => {
        await request(app)
            .get("/health/ready/true")
            .expect(204);
        const response = await request(app)
            .get("/health/ready")
            .expect('Content-Type', /application\/json/)
            .expect(200);
        expect(response.body.status).toEqual("UP");;
    });
    it('GET /health/ready/false', async () => {
        await request(app)
            .get("/health/ready/false")
            .expect(204);
        const response = await request(app)
            .get("/health/ready")
            .expect('Content-Type', /application\/json/)
            .expect(500);
        expect(response.body.status).toEqual("DOWN");;
    });
    it('GET /health/live/false', async () => {
        await request(app)
            .get("/health/live/false")
            .expect(204);
        const response = await request(app)
            .get("/health/live")
            .expect('Content-Type', /application\/json/)
            .expect(500);
        expect(response.body.status).toEqual("DOWN");;
    });
});


describe('TODOs API', () => {

    let container;

    beforeAll(async () => {
        console.info("starting redis-stack testcontainer")
        container = await new GenericContainer("redis/redis-stack")
            .withExposedPorts(6379)
            .start();
        let redisPort = container.getMappedPort(6379)
        process.env.REDIS_URL = 'redis://localhost:' + redisPort;
        console.info("started redis-stack testcontainer:" + process.env.REDIS_URL);
        // var { createClient } = require('redis')
        // const redis = createClient({
        //     "url":process.env.REDIS_URL
        // })
        // redis.on('error', (err) => console.log('Redis Client Error', err));
        // await redis.connect()
        // await redis.disconnect()
        // console.log("checked connection");
    });

    afterAll(async () => {
        console.info("stopping redis-stack testcontainer")
        await container.stop();
    });
    it('GET /todos/headers ==> List request header as response', async () => {
        await request(app)
            .get("/todos/headers")
            .set('req-header', 'value')
            .expect('Content-Type', /text\/plain/)
            .expect(200)
            .then((response) => {
                expect(response.text).toMatch(/req-header/);
            });
    });


    it('POST /todos ==> Create a TODO 201 CREATED', async () => {
        const response = await request(app)
            .post("/todos")
            .send({
                name: "KGF2"
            })
            .expect('Content-Type', /json/)
            .expect(201);
        expect(response.body).toEqual(
            expect.objectContaining(
                {
                    id: expect.any(String),
                    name: "KGF2",
                    done: false
                }
            ));
    });
    it('GET /todos ==> List or arrays of Todos 200 OK', async () => {
        const response = await request(app)
            .get("/todos")
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toEqual(
            expect.arrayContaining(
                [
                    {
                        id: expect.any(String),
                        name: "KGF2",
                        done: false
                    }
                ]
            ));
    });

    it('GET /todos/id ==> a specific Todos 200 OK', async () => {
        const response = await request(app)
            .get("/todos")
            .expect(200)
            .expect('Content-Type', /json/);
        const id = response.body[0].id;
        const getby_id = await request(app)
            .get("/todos/" + id)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(getby_id.body).toEqual(
            expect.objectContaining(
                {
                    id: expect.any(String),
                    name: 'KGF2',
                    done: false
                }
            ));
    });

    it('GET /todos/id ==> a specific Todos 404 NOT Found', () => {

        return request(app)
            .get("/todos/12323232")
            .expect(404);
    });

    it('GET /todos/names/name ==> a specific Todos 200 OK', async () => {

        const response = await request(app)
            .get("/todos/names/KGF2")
            .expect(200)
            .expect('Content-Type', /json/);


        expect(response.body).toEqual(
            expect.arrayContaining(
                [
                    {
                        id: expect.any(String),
                        name: "KGF2",
                        done: expect.any(Boolean)
                    }
                ]
            )
        );
    });
    it('GET /todos/names/name ==> a specific Todos 404 OK', async () => {

        const response = await request(app)
            .get("/todos/names/ABCD");
        expect(response.body).toEqual([]);
    });

    it('PUT /todos/id ==> Update a TODO 200 OK', async () => {
        const response = await request(app)
            .get("/todos")
            .expect(200)
            .expect('Content-Type', /json/);
        const id = response.body[0].id;
        const put_response = await request(app)
            .put("/todos/" + id)
            .send({
                name: "watch KGF2",
                done: false
            })
            .expect(200)
            .expect('Content-Type', /json/);
        expect(put_response.body).toEqual(
            expect.objectContaining(
                {
                    id: expect.any(String),
                    name: "watch KGF2",
                    done: false
                }
            ));
    });


    it('PUT /todos/id ==> Empty body ', async () => {
        const response = await request(app)
            .get("/todos")
            .expect(200)
            .expect('Content-Type', /json/);
        const id = response.body[0].id;
        const put_response = await request(app)
            .put("/todos/" + id)
            .send({})
            .expect(400);
    });


    it('PUT /todos/id ==> Update a TODO 404 OK', () => {

        return request(app)
            .put("/todos/121212")
            .send({
                id: 1,
                name: "watch KGF2",
                done: false
            })
            .expect(404);
    });

    it('DELETE /todos/id ==> Delete a TODO 204 OK', async () => {
        const response = await request(app)
            .get("/todos")
            .expect(200)
            .expect('Content-Type', /json/);
        const id = response.body[0].id;
        await request(app)
            .delete("/todos/" + id)
            .expect(204);
    });

    it('DELETE /todos/id ==> Delete non existing TODO 404 Todo Not Found', () => {
        return request(app)
            .delete("/todos/1111")
            .expect(404);
    });

    it('invalid redis url', async () => {
        process.env.REDIS_URL = 'redis://localhost:' + 13241;
        await request(app)
            .get("/todos")
            .expect(500)
    });

});