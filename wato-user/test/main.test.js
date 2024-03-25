const sinon = require('sinon');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../main');

const mockClient = {
    db: sinon.stub().returnsThis(),
    collection: sinon.stub().returnsThis(),
    insertOne: sinon.stub().resolves({ insertedId: 'mockId' }),
    findOne: sinon.stub().resolves({ name: 'mockName' })
};

const sandbox = sinon.createSandbox();
sandbox.stub(require('mongodb'), 'MongoClient').returns(mockClient);

describe('API Unit Tests', () => {
    it('should create a user', async () => {
        const res = await request(app)
            .post('/user')
            .send({ name: 'Test User' });
        expect(res.status).to.equal(200);
        expect(typeof res.body.id).to.equal('string');
    });

    it('should get a user by ID', async () => {
        const createUserResponse = await request(app)
            .post('/user')
            .send({ name: 'Test User' });
        const userId = createUserResponse.body.id;

        const getUserResponse = await request(app).get(`/user/${userId}`);
        expect(getUserResponse.status).to.equal(200);
        expect(getUserResponse.body.id).to.equal(userId);
        expect(getUserResponse.body.name).to.equal('Test User');
    });
});

afterEach(() => {
    sandbox.restore();
});