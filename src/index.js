/* eslint-disable global-require */
require('dotenv').config();
require('@babel/register')({
    presets: ['@babel/preset-env']
});
require('@babel/polyfill');

process.env.APP_KEY = 'gateway-service';
process.title = process.env.APP_KEY;

const logger = require('./app/server/logger').default;

try {
    const createServer = require('./app/server').default;
    const { server, port } = createServer();

    server.listen(port, err => {
        if (err) {
            logger.error({ message: 'gateway-service server failed to start' }, err);

            throw err;
        }

        logger.debug(`gateway-service listing on port: ${port}`);
    });
} catch (err) {
    logger.error({ message: 'Application error', error: err });
}
