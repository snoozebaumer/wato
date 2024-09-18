const bodyParser = require('body-parser');
const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();
const winston = require('winston');
const {ChallengeStatus} = require('./models/challenge-status');


const PORT = 4566;
const server = express();
// turn off fingerprint
server.disable("x-powered-by");


server.use(bodyParser.json());

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
    defaultMeta: { service: 'game' },
    transports: [
        new winston.transports.Console()
    ]
});

server.post('/game', async (req, res) => {
    let query = {challengerId: req.body.challengerId.toString(), challenge: req.body.challenge.toString(), challengeStatus: ChallengeStatus.NEW};

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const id = (await db.collection('challenge').insertOne(query)).insertedId;
        logger.info(`created challenge with id: ${id.toString()}`);
        res.send({'id': id.toString()});
    } catch (e) {
        logger.error(`could not create challenge with error: ${e.message}`);
        res.status(500).send(e);
    } finally {
        res.end();
    }
});

server.get('/game/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const challenge = await db.collection('challenge').findOne({_id: new ObjectId(id)});
        logger.info(`fetched challenge with id: + ${id.toString()}`);
        res.send(challenge);
    } catch (e) {
        logger.error(`could not fetch challenge with id: ${id} with error: ${e.message}`);
        res.status(404).send(e);
    } finally {
        res.end();
    }
});

server.patch('/game/:id', async (req, res) => {
    const id = req.params.id;
    let newStatus;

    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        let challenge = await db.collection('challenge').findOne({_id: new ObjectId(id)});
        if (challenge.challengeStatus === ChallengeStatus.NEW && req.body.maxRange) {
            newStatus = ChallengeStatus.GUESS_TO_BE_SET;
            challenge = await db.collection('challenge').findOneAndUpdate({_id: new ObjectId(id)},
                {
                    "$set": {
                        challengeeId: req.body.challengeeId,
                        maxRange: req.body.maxRange,
                        challengeStatus: newStatus
                    }
                }, { returnDocument: 'after'});
        } else if (challenge.challengeStatus === ChallengeStatus.GUESS_TO_BE_SET && req.body.challengeeNumber) {
            newStatus = ChallengeStatus.CHALLENGER_TO_MOVE;
            challenge = await db.collection('challenge').findOneAndUpdate({_id: new ObjectId(id)},
                {
                    "$set": {
                        challengeeNumber: req.body.challengeeNumber,
                        challengeStatus: newStatus
                    }
                }, { returnDocument: 'after'});
        } else if (challenge.challengeStatus === ChallengeStatus.CHALLENGER_TO_MOVE && req.body.challengerNumber) {
            newStatus = challenge.challengeeNumber === req.body.challengerNumber ? ChallengeStatus.SUCCESS : ChallengeStatus.FAILURE;
            challenge = await db.collection('challenge').findOneAndUpdate({_id: new ObjectId(id)},
                {
                    "$set": {
                        challengerNumber: req.body.challengerNumber,
                        challengeStatus: newStatus
                    }
                }, { returnDocument: 'after'});
        }
        else {
            return res.status(403).send("Challenge status cannot be changed.");
        }

        logger.info(`changed challenge status for id: ${id}. New status: ${newStatus}, edited values: ${JSON.stringify(req.body)}`)
        res.send(challenge);
    } catch (e) {
        logger.error(`could not edit challenge with id: ${id} and change: ${JSON.stringify(req.body)} with error: ${e.message}`);
        res.status(500).send(e);
    }

    res.status(200);
    res.end();
});

const serverInstance = server.listen(PORT, () => {
    logger.info(`game service started on port ${PORT}`);
});

module.exports = serverInstance;