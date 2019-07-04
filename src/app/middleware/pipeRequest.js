import request from 'request';
import { createForwardedRequestUrl } from '../utils';

export default function pipeRequest(req, res, next) {
    try {
        const { path, query, method, hostname } = req;

        const url = createForwardedRequestUrl(hostname, path);

        req.pipe(
            request({
                url,
                method,
                qs: query,
                ...(method === 'POST' && {
                    json: true,
                    body: req.body
                })
            }).on('error', err => {
                res.status(500).json({
                    message: `There was an error connecting to the external service at path ${url}`,
                    error: err
                });
            })
        ).pipe(res);
    } catch (err) {
        next(err);
    }
}
