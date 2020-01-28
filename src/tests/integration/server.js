import nock from 'nock';
import suptertest from 'supertest';
import createServer from '../../app/server/index';

const { server: baseServer } = createServer();

describe('gateway-service server integration test', () => {
    before(() => {
        process.env.APP_ENV = 'sit';
        process.env.APP_SERVICES_ACCESS_KEY = '1235';
    });

    after(() => {
        delete process.env.APP_ENV;
        delete process.env.APP_SERVICES_ACCESS_KEY;
    });

    describe('requesting entity service', () => {
        describe('when authorization headers are passed', () => {
            let apiResponse;
            let server;

            before(() => {
                apiResponse = {
                    id: '123',
                    name: 'section'
                };

                nock('http://services.sit.bxm.internal/entity')
                    .get('/section')
                    .reply(200, { ...apiResponse });

                server = baseServer;
            });

            it('should return a valid 200 response', done => {
                suptertest(server)
                    .get('/entity/section')
                    .set('host', 'services.sit.bxm.net.au')
                    .set('x-service-access-key', process.env.APP_SERVICES_ACCESS_KEY)
                    .expect(
                        200,
                        {
                            ...apiResponse
                        },
                        done
                    );
            });
        });

        describe('when authorization headers are not passed', () => {
            let errorResponse;
            let server;

            before(() => {
                errorResponse = { message: 'you are not authorized to access this resource', error: { name: 'AuthorizationError' } };

                server = baseServer;
            });

            it('should send a 401 response', done => {
                suptertest(server)
                    .get('/entity/section')
                    .set('host', 'services.sit.bxm.net.au')
                    .set('x-service-access-key', 'invalid')
                    .expect(401, errorResponse, done);
            });
        });
    });
});
