import proxyquire, { noCallThru } from 'proxyquire';

noCallThru();

const expressStub = sinon.stub();
const authorizeRequestStub = sinon.stub();
const pipeRequestStub = sinon.stub();
const errorHandlerStub = sinon.stub();
const loggerStub = sinon.stub();

const createServer = proxyquire('../../app/server/index', {
    express: expressStub,
    '../middleware/authorizeRequest': authorizeRequestStub,
    '../middleware/pipeRequest': pipeRequestStub,
    '../middleware/errorHandler': errorHandlerStub,
    './logger': loggerStub
}).default;

describe('createServer function', () => {
    describe('when a port is set on the environment', () => {
        let result;
        let port;
        let mockServer;
        let expressUseStub;
        const middlewareStack = [];

        before(() => {
            port = 4240;
            process.env.PORT = port;
            expressUseStub = sinon.stub().callsFake(arg => {
                middlewareStack.push(arg);
            });
            mockServer = {
                locals: {},
                use: expressUseStub
            };

            expressStub.returns(mockServer);

            result = createServer();
        });

        after(() => {
            delete process.env.PORT;
            expressStub.reset();
        });

        it('creates a new express instance', () => {
            expect(expressStub).to.be.calledOnce;
        });

        it('sets the middlewares in the correct order on the express instance', () => {
            expect(middlewareStack[0]).to.deep.eq(authorizeRequestStub);
            expect(middlewareStack[1]).to.deep.eq(pipeRequestStub);
            expect(middlewareStack[2]).to.deep.eq(errorHandlerStub);
        });

        it('returns the express instance and port set to the env', () => {
            expect(result)
                .to.have.property('server')
                .and.to.be.eq(mockServer);
            expect(result)
                .to.have.property('port')
                .and.to.deep.eq(`${port}`);
        });

        it('sets the logger on the express instance locals', () => {
            expect(result)
                .to.have.property('server')
                .have.property('locals')
                .to.have.property('logger')
                .to.deep.eq(loggerStub);
        });
    });

    describe('when a port is not set on the environment', () => {
        let result;
        let mockServer;
        let expressUseStub;
        const middlewareStack = [];

        before(() => {
            expressUseStub = sinon.stub().callsFake(arg => {
                middlewareStack.push(arg);
            });
            mockServer = {
                locals: {},
                use: expressUseStub
            };

            expressStub.returns(mockServer);

            result = createServer();
        });

        after(() => {
            expressStub.reset();
        });

        it('creates a new express instance', () => {
            expect(expressStub).to.be.calledOnce;
        });

        it('sets the middlewares in the correct order on the express instance', () => {
            expect(middlewareStack[0]).to.deep.eq(authorizeRequestStub);
            expect(middlewareStack[1]).to.deep.eq(pipeRequestStub);
            expect(middlewareStack[2]).to.deep.eq(errorHandlerStub);
        });

        it('returns the express instance and port set to the default', () => {
            expect(result)
                .to.have.property('server')
                .and.to.be.eq(mockServer);
            expect(result)
                .to.have.property('port')
                .and.to.deep.eq(3000);
        });

        it('sets the logger on the express instance locals', () => {
            expect(result)
                .to.have.property('server')
                .have.property('locals')
                .to.have.property('logger')
                .to.deep.eq(loggerStub);
        });
    });
});
