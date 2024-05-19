const sinon = require('sinon');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../main');

const mockClient = {
    db: sinon.stub().returnsThis(),
    collection: sinon.stub().returnsThis(),
    insertOne: sinon.stub().resolves({ insertedId: 'mockId' }),
    findOne: sinon.stub().resolves({ id: 'mockId' })
};

const sandbox = sinon.createSandbox();
sandbox.stub(require('mongodb'), 'MongoClient').returns(mockClient);

const challengeToCreate = {
    challenge: 'Unit test challenge',
    challenger: 'Challenger',
    challengeStatus: 'GAME.NEW_TITLE'
}

describe('Game API Unit Tests', () => {
    it('should create a new challenge', async () => {
        const res = await request(app)
            .post('/game')
            .send(challengeToCreate);
        expect(res.status).to.equal(200);
        expect(typeof res.body.id).to.equal('string');
    });

    it('should fetch a challenge by ID', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);

        const getChallengeResponse = await request(app).get(`/game/${challengeId}`);
        expect(getChallengeResponse.status).to.equal(200);
        expect(getChallengeResponse.body.challenge).to.equal(challengeToCreate.challenge);
        expect(getChallengeResponse.body.challenger).to.equal(challengeToCreate.challenger);
        expect(getChallengeResponse.body.challengeStatus).to.equal(challengeToCreate.challengeStatus);
    });

    it('should update status for NEW challenge when range is provided', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);

        const patchResponse = await setRangeForChallenge(challengeId, 100);
        expect(patchResponse.status).to.equal(200);
        expect(patchResponse.body.challengeStatus).to.equal('GAME.GUESS_TO_BE_SET_TITLE');
    });

    it('should reject updating status for NEW challenge when range is not provided', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);

        const patchResponse = await setChallengeeGuessForChallenge(challengeId, 50);
        expect(patchResponse.status).to.equal(403);
    });

    it('should update status for GUESS_TO_BE_SET challenge when guess is provided', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);
        await setRangeForChallenge(challengeId, 100);

        const patchResponse = await setChallengeeGuessForChallenge(challengeId, 50);

        expect(patchResponse.status).to.equal(200);
        expect(patchResponse.body.challengeStatus).to.equal('GAME.CHALLENGER_TO_MOVE_TITLE');
    });

    it('should reject updating status for GUESS_TO_BE_SET challenge when wrong guess is provided', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);
        await setRangeForChallenge(challengeId, 100);

        const patchResponse = await setChallengerGuessForChallenge(challengeId, 50);

        expect(patchResponse.status).to.equal(403);
    });

    it('should conclude successfully for CHALLENGER_TO_MOVE challenge when second guess is provided and numbers match', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);
        await setRangeForChallenge(challengeId, 100);

        await setChallengeeGuessForChallenge(challengeId, 50);

        const patchResponse = await setChallengerGuessForChallenge(challengeId, 50);

        expect(patchResponse.status).to.equal(200);
        expect(patchResponse.body.challengeStatus).to.equal('GAME.FINISHED_SUCCESSFULLY_TITLE');
    });

    it('should conclude with failure status for CHALLENGER_TO_MOVE challenge when second guess is provided and numbers do not match', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);
        await setRangeForChallenge(challengeId, 100);

        await setChallengeeGuessForChallenge(challengeId, 50);

        const patchResponse = await setChallengerGuessForChallenge(challengeId, 60);

        expect(patchResponse.status).to.equal(200);
        expect(patchResponse.body.challengeStatus).to.equal('GAME.FINISHED_NOTHING_HAPPENS_TITLE');
    });

    it('should not conclude and reject status change for CHALLENGER_TO_MOVE challenge when second guess is not provided', async () => {
        const challengeId = await createChallengeWithoutChecks(challengeToCreate);
        await setRangeForChallenge(challengeId, 100);

        await setChallengeeGuessForChallenge(challengeId, 50);

        const patchResponse = await setChallengerGuessForChallenge(challengeId, null);

        expect(patchResponse.status).to.equal(403);
    });
});

afterEach(() => {
    sandbox.restore();
});

const createChallengeWithoutChecks = async (challengeToCreate) => {
    const res = await request(app)
        .post('/game')
        .send(challengeToCreate);
    return res.body.id;
}

const setRangeForChallenge = async (challengeId, range) => {
    return await request(app)
        .patch(`/game/${challengeId}`)
        .send({
            maxRange: range,
            challengeeName: 'Challengee'
        })
}

const setChallengeeGuessForChallenge = async (challengeId, guess) => {
    return await request(app)
        .patch(`/game/${challengeId}`)
        .send({
            challengeeNumber: guess
        })
}

const setChallengerGuessForChallenge = async (challengeId, guess) => {
    return await request(app)
        .patch(`/game/${challengeId}`)
        .send({
            challengerNumber: guess
        })
}
