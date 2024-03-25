const sinon = require('sinon');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../main');
const axios = require('axios');

const sandbox = sinon.createSandbox();

describe('Gateway API Unit Tests', () => {
    afterEach(() => {
        sandbox.restore();
    });
    const challengeData = {
        challenge: 'Test Challenge',
        name: 'Test Challenger',
        challengeStatus: 'GAME.NEW_TITLE'
    };
    describe('create challenge', () => {
        it('should create a new challenge', async () => {

            const axiosPostStub = sandbox.stub(axios, 'post');
            axiosPostStub.onFirstCall().resolves({data: {id: 'userId'}});

            axiosPostStub.onSecondCall().resolves({data: {id: 'challengeId'}});

            const res = await request(app)
                .post('/api/challenges')
                .send(challengeData);

            expect(res.status).to.equal(200);
            expect(res.body.id).to.equal('challengeId');
        });
    });

    describe('fetch challenge', () => {
        it('should fetch a challenge and not return guesses before challenge is finished', async () => {
            const challengeId = 'challengeId';
            const mockChallengeData = {
                id: challengeId,
                challengerName: 'Test Challenger',
                challengeeName: 'Test Challengee',
                ...challengeData,
                challengerNumber: 50,
                challengeeNumber: 25
            };
            mockChallengeData.challengeStatus = 'GAME.CHALLENGER_TO_MOVE_TITLE';

            const axiosGetStub = sandbox.stub(axios, 'get');
            axiosGetStub.resolves({data: mockChallengeData});

            const res = await request(app)
                .get(`/api/challenges/${challengeId}`);

            expect(res.status).to.equal(200);
            expect(res.body.challenge).to.equal(mockChallengeData.challenge);
            expect(res.body.challengeStatus).to.equal(mockChallengeData.challengeStatus);
            expect(res.body.challengerName).to.equal(mockChallengeData.challengerName);
            expect(res.body.challengeeName).to.equal(mockChallengeData.challengeeName);
            expect(res.body.challengerNumber).to.equal(undefined, 'Challenger number must not be sent to client when challenge is not finished');
            expect(res.body.challengeeNumber).to.equal(undefined, 'Challengee number must not be sent to client when challenge is not finished');
        });

        it('should fetch a challenge and return guesses after challenge is finished', async () => {
            const challengeId = 'challengeId';
            const mockChallengeData = {
                id: challengeId,
                challengerName: 'Test Challenger',
                challengeeName: 'Test Challengee',
                ...challengeData,
                challengerNumber: 50,
                challengeeNumber: 50
            };
            mockChallengeData.challengeStatus = 'GAME.SUCCESS_TITLE';

            const axiosGetStub = sandbox.stub(axios, 'get');
            axiosGetStub.resolves({data: mockChallengeData});

            const res = await request(app)
                .get(`/api/challenges/${challengeId}`);

            expect(res.status).to.equal(200);
            expect(res.body.challenge).to.equal(mockChallengeData.challenge);
            expect(res.body.challengeStatus).to.equal(mockChallengeData.challengeStatus);
            expect(res.body.challengerName).to.equal(mockChallengeData.challengerName);
            expect(res.body.challengeeName).to.equal(mockChallengeData.challengeeName);
            expect(res.body.challengerNumber).to.equal(mockChallengeData.challengerNumber, 'Challenger number must be sent to client when challenge is finished');
            expect(res.body.challengeeNumber).to.equal(mockChallengeData.challengeeNumber, 'Challengee number must be sent to client when challenge is finished');
        });
    });

    describe('update challenge', () => {
        it('should update a challenge and return challenge with names of both users', async () => {
            const challengeId = 'mockId';
            const mockPatchData = {
                challengeeNumber: 50
            };

            const axiosPatchStub = sandbox.stub(axios, 'patch');
            axiosPatchStub.resolves({
                data: {
                    id: challengeId,
                    challengeeId: 'mockChallengeeId',
                    challengerId: 'mockChallengerId',
                }
            });
            const axiosGetStub = sandbox.stub(axios, 'get');
            axiosGetStub.onFirstCall().resolves({ data: { name: 'Test Challenger' } });
            axiosGetStub.onSecondCall().resolves({ data: { name: 'Test Challengee' } });

            const res = await request(app)
                .patch(`/api/challenges/${challengeId}`)
                .set('Cookie', [`id=mockChallengeeId`])
                .send(mockPatchData);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('challengerName').to.equal('Test Challenger');
            expect(res.body).to.have.property('challengeeName').to.equal('Test Challengee');
            expect(axiosPatchStub.callCount).to.equal(1);
            expect(axiosGetStub.callCount).to.equal(2);
        });

        describe('when challenge is in NEW state', () => {
            it('should return status 400 if challengeeName is not provided', async () => {
                const challengeId = 'mockId';
                const mockPatchData = {
                    maxRange: 100
                };

                const res = await request(app)
                    .patch(`/api/challenges/${challengeId}`)
                    .send(mockPatchData);

                expect(res.status).to.equal(400);
            });

            it('should create a new user and then update a challenge if challengeeName is provided', async () => {
                const challengeId = 'mockId';
                const mockPatchData = {
                    maxRange: 100,
                    challengeeName: 'Test Challengee'
                };

                const axiosPostStub = sandbox.stub(axios, 'post');
                axiosPostStub.onFirstCall().resolves({data: {id: 'mockChallengeeId'}});
                const axiosPatchStub = sandbox.stub(axios, 'patch');
                axiosPatchStub.onFirstCall().resolves({
                    data: {
                        id: 'mockId',
                        challengeeId: 'mockChallengeeId',
                        challengerId: 'mockChallengerId'
                    }
                });
                const axiosGetStub = sandbox.stub(axios, 'get');
                axiosGetStub.resolves({data: {name: 'Test Challenger'}});

                const res = await request(app)
                    .patch(`/api/challenges/${challengeId}`)
                    .send(mockPatchData);

                expect(res.status).to.equal(200);
                expect(axiosPostStub.callCount).to.equal(1);
                expect(axiosPatchStub.callCount).to.equal(1);
                expect(axiosGetStub.callCount).to.equal(2);
            });

            it('should use existing challengeeId from cookie and then update a challenge if challengeeName is not provided', async () => {
                const challengeId = 'mockId';
                const mockPatchData = {
                    maxRange: 100
                };

                const axiosPostStub = sandbox.stub(axios, 'post');
                axiosPostStub.onFirstCall().resolves({data: {id: 'mockChallengeeId'}});
                const axiosPatchStub = sandbox.stub(axios, 'patch');
                axiosPatchStub.resolves({ data: { id: challengeId, challengeeId: 'mockChallengeeId', challengerId: 'mockChallengerId' } });
                const axiosGetStub = sandbox.stub(axios, 'get');
                axiosGetStub.resolves({ data: { name: 'Test Challenger' } });

                const res = await request(app)
                    .patch(`/api/challenges/${challengeId}`)
                    .set('Cookie', [`id=mockChallengeeId`])
                    .send(mockPatchData);

                expect(res.status).to.equal(200);
                expect(axiosPostStub.callCount).to.equal(0);
                expect(axiosPatchStub.callCount).to.equal(1);
                expect(axiosGetStub.callCount).to.equal(2);
            });
        });
    });

    describe('fetch user', () => {
        it('should fetch a user if cookie is set', async () => {
            const userId = 'mockUserId';
            const mockUserData = {
                id: userId,
                name: 'Test User'
            };

            const axiosGetStub = sandbox.stub(axios, 'get');
            axiosGetStub.resolves({data: mockUserData});

            const res = await request(app)
                .get('/api/user')
                .set('Cookie', [`id=${userId}`]);

            expect(res.status).to.equal(200);
            expect(res.body.id).to.equal(userId);
            expect(res.body.name).to.equal(mockUserData.name);
        });

        it('should return 404 if user cookie is not set', async () => {
            const userId = 'mockUserId';
            const mockUserData = {
                id: userId,
                name: 'Test User'
            };

            const axiosGetStub = sandbox.stub(axios, 'get');
            axiosGetStub.resolves({data: mockUserData});

            const res = await request(app)
                .get('/api/user')

            expect(res.status).to.equal(404);
        });
    });
});
