const dns = require('dns');

async function resolve(host, type = 'A') {
    return new Promise((callback) => {
        dns.resolve(host, type, (err, results) => {
            callback(results ?? []);
        });
    });
}

module.exports = {
    resolve
};