// eslint-disable-next-line no-unused-vars
export default (error, req, res, next) => {
    const { logger } = req.app.locals;
    const appName = process.env.APP_KEY;

    switch (error.name) {
        case 'SyntaxError':
            logger.log('error', {
                service: appName,
                error,
                stack: error.stack
            });

            res.status(400);
            break;
        case 'AuthorizationError':
            res.status(401);
            break;
        default:
            logger.log('error', {
                service: appName,
                error,
                stack: error.stack
            });

            res.status(error.status || 500);
            break;
    }

    res.json({ message: error.message, error });
};
