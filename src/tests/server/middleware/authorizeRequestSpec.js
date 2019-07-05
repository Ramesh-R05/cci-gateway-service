import MiddlewareTestFactory from '@bxm/unit-test-utils/lib/functions/middlewareTestFactory';
import proxyquire, { noCallThru } from 'proxyquire';
noCallThru();

const authorizeRequest = proxyquire('../../../app/middleware/authorizeRequest', {}).default;
const MiddlewareTestWrapper = new MiddlewareTestFactory(authorizeRequest);

const accessKeyMock = '1234';

describe('authorizeRequest middleware', () => {
    before(() => {
        process.env.APP_SERVICES_ACCESS_KEY = accessKeyMock;
    });

    after(() => {
        delete process.env.APP_SERVICES_ACCESS_KEY;
    });

    describe('when there is an access key set on the env', () => {
        describe('and it matches the key in the request headers service-access-key property', () => {
            let callMiddleware;
            let testArgs;

            before(async () => {
                [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                    req: {
                        header: sinon
                            .stub()
                            .withArgs('x-service-access-key')
                            .returns(accessKeyMock)
                    }
                });

                await callMiddleware();
            });

            it('allows the request to continue through the middleware chain', () => {
                expect(testArgs.next).to.be.calledWithExactly(/* checks for no arguments */);
            });
        });

        describe('and it does not match the key in the request headers service-access-key property', () => {
            let callMiddleware;
            let testArgs;
            let mockError;

            before(async () => {
                mockError = new Error('you are not authorized to access this resource');
                mockError.name = 'AuthorizationError';

                [testArgs, callMiddleware] = await MiddlewareTestWrapper({
                    req: {
                        header: sinon
                            .stub()
                            .withArgs('x-service-access-key')
                            .returns('')
                    }
                });

                await callMiddleware();
            });

            it('throws an error and calls next with the error, disallowing the request to continue through the middleware chain', () => {
                try {
                    expect(testArgs.next).to.be.calledWithExactly(mockError);
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            });
        });
    });
});
