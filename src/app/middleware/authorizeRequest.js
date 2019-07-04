export default function authorizeRequest(req, res, next) {
    try {
        const accessKey = process.env.APP_SERVICES_ACCESS_KEY;
        const headerAccessKey = req.header('x-service-access-key');

        if (!headerAccessKey || headerAccessKey !== accessKey) {
            const AuthorizationError = new Error('you are not authorized to access this resource');
            AuthorizationError.name = 'AuthorizationError';

            throw AuthorizationError;
        }

        if (headerAccessKey === accessKey) {
            next();

            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
