const bodyParser = require('body-parser');
const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const server = express();
require('dotenv').config();
const winston = require('winston');


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

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.service.toUpperCase()} ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: 'user' },
    transports: [
        new winston.transports.Console()
    ]
});


server.post('/user', async (req, res) => {
    const name = req.body.name.toString();

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const id = (await db.collection('user').insertOne({name: name})).insertedId;
        logger.info(`created user with id: ${id.toString()}`);
        res.send({'id': id.toString()});
    } catch (e) {
        logger.error(`could not create user ${name} with error: ${e.message}.`);
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
        logger.info(`fetched user with id: ${id}`);
        res.send({id, name: user.name});
    } catch (e) {
        logger.error(`could not fetch user with id: ${id} with error: ${e.message}`);
        res.status(404).send(e);
    } finally {
        res.end();
    }
});

const serverInstance = server.listen(port, () => {
    logger.info(`user service started on port ${port}`);
});

module.exports = serverInstance;