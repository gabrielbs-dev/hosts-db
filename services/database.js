const config = require('../config.js');

const { MongoClient } = require('mongodb');

let singleton = null;

async function connect() {
    if (singleton === null) {
        const client = new MongoClient(config.MONGO_HOST);
    
        await client.connect();

        singleton = client.db(config.MONGO_DATABASE);
    }

    return singleton;
}

module.exports = {
    connect
};