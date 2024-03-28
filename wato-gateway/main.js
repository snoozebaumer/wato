const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const winston = require('winston');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {ChallengeStatus} = require('./models/challenge-status');

const SERVICE_NAME = 'gateway';
const PORT = 8080;
const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
const server = express();

// Middleware
server.use(cors({origin: 'http://localhost:4200', credentials: true}));
server.use(cookieParser());
server.use(bodyParser.json());

// Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.service.toUpperCase()} ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: SERVICE_NAME },
    transports: [
        new winston.transports.Console()
    ]
});

// Routes
server.get('/', handleRoot);
server.post('/api/challenges', handleChallengeCreation);
server.get('/api/challenges/:id', handleFetchChallenge);
server.patch('/api/challenges/:id', handleEditChallenge);
server.get('/api/user', handleGetCurrentUser);

// Handlers
async function handleRoot(req, res) {
    res.send('wato API is running.');
}

async function handleChallengeCreation(req, res) {
    const {challenge, name, challengeStatus} = req.body;

    // input validation
    if (!challenge || !name) {
        return res.status(400).send('Bad Request');
    }

    try {
        const userId = await createUserIfNotExists(req, res, name);
        const challengeId = await createChallenge(req, res, userId, challenge, challengeStatus);
        logger.info(`Created challenge with id: ${challengeId} from IP: ${req.ip}`);
        res.send({id: challengeId});
    } catch(error) {
        logger.error(`failed to create challenge from IP: ${req.ip} with error: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
}

async function handleFetchChallenge(req, res) {
    const id = req.params.id;
    try {
        let response = await axios.get(process.env.GAME_SERVICE_ADDR + '/' + id);
        response.data = processChallengeResponse(response.data);

        response.data.challengerName = await getUserName(response.data.challengerId);
        if (response.data.challengeeId) {
            response.data.challengeeName = await getUserName(response.data.challengeeId);
        }

        logger.info(`Fetched challenge with id: ${id}`);
        res.send(response.data);
    } catch (error) {
        logger.error(`Failed to fetch challenge: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
}

async function handleEditChallenge(req, res) {
    const id = req.params.id;
    let challengeeId;

    // if range is provided, which means the challengee interacts with the game for the first time
    if(req.body.maxRange) {
        if (!req.body.challengeeName && (!req.cookies || !req.cookies.id)) {
            return res.status(400).send('Please provide username');
        }

        challengeeId = createUserIfNotExists(req, res, req.body.challengeeName);
        delete req.body.challengeeName;
    }

    try {
        // add challengeeId to the request body if it exists, if not, just send the request body
        let response = await axios.patch(process.env.GAME_SERVICE_ADDR + '/' + id,
            {...(challengeeId ? {challengeeId} : {}), ...req.body});

        response.data = await processEditedChallengeResponse(req, res, response.data);

        logger.info(`Edited challenge with id: ${id} for IP: ${req.ip}`);
        res.send(response.data);
    } catch (error) {
        logger.error(`failed to edit challenge for IP: ${req.ip} with error: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
}

async function handleGetCurrentUser(req, res) {
    if (!req.cookies || !req.cookies.id) {
        logger.info(`no cookie set for user for ip ${req.ip}.`)
        return res.status(404).send("User not found");
    }

    const id = req.cookies.id
    try {
        const response = await axios.get(process.env.USER_SERVICE_ADDR + '/' + id);
        logger.info(`fetched user ${id} for ip ${req.ip}.`);
        res.send(response.data);
    } catch (error) {
        logger.error(`failed to fetch user for IP: ${req.ip} with error: ${error.message}.`);
        return res.status(500).send('Internal Server error');
    }
}

// Helper functions
async function processEditedChallengeResponse(req, res, data) {
    data.challengerName = await getUserName(data.challengerId);
    if (data.challengeeId) {
        data.challengeeName = await getUserName(data.challengeeId);
    }
    return data;
}

function processChallengeResponse(data) {
    if (data.challengeStatus !== ChallengeStatus.SUCCESS &&
        data.challengeStatus !== ChallengeStatus.FAILURE) {
        delete data['challengerNumber'];
        delete data['challengeeNumber'];
    }
    delete Object.assign(data, { id: data._id })._id;

    return data;
}

async function getUserName(userId) {
    try {
        const response = await axios.get(process.env.USER_SERVICE_ADDR + '/' + userId);
        return response.data.name;
    } catch (error) {
        return 'Unknown';
    }
}

async function createUserIfNotExists(req, res, name) {
    let userId;

    // Check if user exists, if not create user
    if (!req.cookies || !req.cookies.id) {
        try {
            const response = await axios.post(process.env.USER_SERVICE_ADDR, {name});
            userId = response.data.id;
            res.cookie('id', userId, {httpOnly: false, sameSite: 'none', secure: true, maxAge: ONE_YEAR_IN_MS});
            logger.info(`Created user: ${name} with id: ${userId} from IP: ${req.ip}`);
        } catch (error) {
            logger.error(`failed to create user: ${name} from IP: ${req.ip} with error: ${error.message}`);
            throw error;
        }
    } else {
        userId = req.cookies.id;
    }
    return userId;
}

async function createChallenge(req, res, userId, challenge, challengeStatus) {
    const response = await axios.post(process.env.GAME_SERVICE_ADDR, {
        'challengerId': userId,
        challenge,
        challengeStatus
    });
    return response.data.id;
}

// Start server
const serverInstance = server.listen(PORT, () => {
    logger.info(`gateway started on port ${PORT}.`);
});

module.exports = serverInstance;