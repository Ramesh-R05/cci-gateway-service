export default function createForwardedRequestUrl(hostname, path) {
    const env = {
        'services.prod.bxm.net.au': 'prod',
        'services.sit.bxm.net.au': 'sit'
    }[hostname];

    return `http://services.${env}.bxm.internal${path}`;
}
