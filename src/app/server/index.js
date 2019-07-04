import express from 'express';
import authorizeRequest from '../middleware/authorizeRequest';
import pipeRequest from '../middleware/pipeRequest';
import errorHandler from '../middleware/errorHandler';
import logger from './logger';

export default function createServer() {
    const server = express();
    const port = process.env.PORT || 3000;
    server.locals.logger = logger;

    server.use(authorizeRequest);
    server.use(pipeRequest);
    server.use(errorHandler);

    return { server, port };
}
