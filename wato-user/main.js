const bodyParser = require('body-parser');
const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const server = express();
require('dotenv').config();
require('log-timestamp')


server.use(bodyParser.json());
const port = 4567;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});


server.post('/user', async (req, res) => {
    const name = req.body.name;
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const id = (await db.collection('user').insertOne({name: name})).insertedId;
        console.log('USER: created user with id: ' + id)
        res.send({'id': id.toString()});
    } catch (e) {
        console.error(`USER: could not create user ${name} with error: `, e.message);
        res.status(500).send(e);
    } finally {
        res.end();
    }
});

server.get('/user/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const user = await db.collection('user').findOne({_id: new ObjectId(id)});
        console.log('USER: fetched user with id: ' + id);
        res.send({id, name: user.name});
    } catch (e) {
        console.error(`USER: could not fetch user with id: ${id} with error: `, e.message);
        res.status(404).send(e);
    } finally {
        res.end();
    }
});

server.listen(port, () => {
    console.log('USER: listening on port ', port);
});