import MiddlewareTestFactory from '@bxm/unit-test-utils/lib/functions/middlewareTestFactory';
import proxyquire, { noCallThru } from 'proxyquire';

noCallThru();

const requestStub = sinon.stub();

const pipeRequest = proxyquire('../../../app/middleware/pipeRequest', {
    request: requestStub
}).default;

const MiddlewareTestWrapper = MiddlewareTestFactory(pipeRequest);

describe('pipeRequest middleware', () => {
    [{ APP_ENV: 'sit' }, { APP_ENV: 'prod' }].forEach(({ APP_ENV }) => {
        describe(`when APP_ENV is set to ${APP_ENV}`, () => {
            before(() => {
                process.env.APP_ENV = APP_ENV;
            });

            after(() => {
                delete process.env.APP_ENV;
            });

            describe('and the request method is POST', () => {
                describe('and request is valid', () => {
                    let testArgs;
                    let callMiddleware;

                    before(async () => {
                        [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                            req: {
                                path: '/tag/v1/something',
                                method: 'POST',
                                pipe: sinon.stub().returnsThis(),
                                body: {
                                    tags: []
                                }
                            },
                            res: {}
                        });

                        requestStub.returns({ on: sinon.stub() });

                        await callMiddleware();
                    });

                    it('makes the request with the correct arguments', () => {
                        expect(requestStub).to.be.calledWith({
                            url: `http://services.${APP_ENV}.bxm.internal${testArgs.req.path}`,
                            method: testArgs.req.method,
                            qs: testArgs.req.query,
                            json: true,
                            body: testArgs.req.body
                        });
                    });

                    it('should pipe the response', () => {
                        expect(testArgs.req.pipe.secondCall.args[0]).to.deep.eq(testArgs.res);
                    });
                });

                describe('and request is invalid', () => {
                    let testArgs;
                    let mockResponseError;
                    let callMiddleware;

                    before(async () => {
                        [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                            req: {
                                path: 'does-not-exist',
                                method: 'ETC',
                                pipe: sinon.stub().returnsThis(),
                                body: {
                                    tags: []
                                }
                            },
                            res: {
                                status: sinon.stub().returnsThis(),
                                json: sinon.stub()
                            }
                        });

                        mockResponseError = {
                            status: 500,
                            text: 'something went wrong with the request'
                        };

                        requestStub.returns({
                            on: sinon.stub().callsArgWith(1, mockResponseError)
                        });

                        await callMiddleware();
                    });

                    it('sets the 500 status', () => {
                        expect(testArgs.res.status).to.be.calledWith(500);
                    });

                    it('sends the error with the json method', () => {
                        expect(testArgs.res.json).to.be.calledWith({
                            message: `There was an error connecting to the external service at path http://services.${APP_ENV}.bxm.internal${
                                testArgs.req.path
                            }`,
                            error: mockResponseError
                        });
                    });
                });

                describe('and request pipe throws an error', () => {
                    let testArgs;
                    let mockResponseError;
                    let callMiddleware;

                    before(async () => {
                        mockResponseError = {
                            status: 500,
                            text: 'something went wrong with the request'
                        };

                        requestStub.returns({
                            on: sinon.stub()
                        });

                        [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                            req: {
                                pipe: sinon.stub().throws(mockResponseError)
                            },
                            res: {}
                        });

                        await callMiddleware();
                    });

                    it('should call the next middleware with the error', () => {
                        expect(testArgs.next).to.be.calledWith(mockResponseError);
                    });
                });
            });

            describe('and the request method is GET', () => {
                describe('and request is valid', () => {
                    let testArgs;
                    let callMiddleware;

                    before(async () => {
                        [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                            req: {
                                path: '/entity/v1/something',
                                method: 'GET',
                                pipe: sinon.stub().returnsThis(),
                                body: {
                                    tags: []
                                }
                            },
                            res: {}
                        });

                        requestStub.returns({ on: sinon.stub() });

                        await callMiddleware();
                    });

                    it('makes the request with the correct arguments', () => {
                        expect(requestStub).to.be.calledWith({
                            url: `http://services.${APP_ENV}.bxm.internal${testArgs.req.path}`,
                            method: testArgs.req.method,
                            qs: testArgs.req.query
                        });
                    });

                    it('should pipe the response', () => {
                        expect(testArgs.req.pipe.secondCall.args[0]).to.deep.eq(testArgs.res);
                    });
                });

                describe('and request is invalid', () => {
                    let testArgs;
                    let mockResponseError;
                    let callMiddleware;

                    before(async () => {
                        [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                            req: {
                                path: 'does-not-exist',
                                method: 'ETC',
                                pipe: sinon.stub().returnsThis(),
                                body: {
                                    tags: []
                                }
                            },
                            res: {
                                status: sinon.stub().returnsThis(),
                                json: sinon.stub()
                            }
                        });

                        mockResponseError = {
                            status: 500,
                            text: 'something went wrong with the request'
                        };

                        requestStub.returns({
                            on: sinon.stub().callsArgWith(1, mockResponseError)
                        });

                        await callMiddleware();
                    });

                    it('sets the 500 status', () => {
                        expect(testArgs.res.status).to.be.calledWith(500);
                    });

                    it('sends the error with the json method', () => {
                        expect(testArgs.res.json).to.be.calledWith({
                            message: `There was an error connecting to the external service at path http://services.${APP_ENV}.bxm.internal${
                                testArgs.req.path
                            }`,
                            error: mockResponseError
                        });
                    });
                });

                describe('and request pipe throws an error', () => {
                    let testArgs;
                    let mockResponseError;
                    let callMiddleware;

                    before(async () => {
                        mockResponseError = {
                            status: 500,
                            text: 'something went wrong with the request'
                        };

                        requestStub.returns({
                            on: sinon.stub()
                        });

                        [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                            req: {
                                pipe: sinon.stub().throws(mockResponseError)
                            },
                            res: {}
                        });

                        await callMiddleware();
                    });

                    it('should call the next middleware with the error', () => {
                        expect(testArgs.next).to.be.calledWith(mockResponseError);
                    });
                });
            });
        });
    });
});
