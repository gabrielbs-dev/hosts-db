const db = require('../services/database.js');
const { ObjectId } = require('mongodb');
const moment = require('moment');

const COLLECTION = "hosts";

async function findAll() {
    const connection = await db.connect();

    return connection.collection(COLLECTION)
        .find()
        .toArray();
}

async function findAllActives() {
    const connection = await db.connect();

    return connection.collection(COLLECTION)
        .find({
            removed_at: null
        })
        .toArray();
}

async function count() {
    const connection = await db.connect();

    return connection.collection(COLLECTION)
        .count();
}

async function countActives() {
    const connection = await db.connect();

    return connection.collection(COLLECTION)
        .count({
            removed_at: null
        });
}

async function insert(host) {
    const connection = await db.connect();

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    host.created_at = now;
    host.updated_at = now;
    host.removed_at = null;

    return connection.collection(COLLECTION)
        .insertOne(host);
}

async function update(id, host) {
    const connection = await db.connect();

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    host.updated_at = now;

    return connection.collection(COLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: host });
}

async function remove(id) {
    const connection = await db.connect();

    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    return connection.collection(COLLECTION)
        .updateOne({
            _id: new ObjectId(id)
        }, {
            $set: {
                removed_at: now
            }
        });
}

async function findByHost(host) {
    const connection = await db.connect();

    return connection.collection(COLLECTION)
        .findOne({ host });
}

module.exports = {
    findAll,
    findAllActives,
    count,
    countActives,
    insert,
    update,
    remove,
    findByHost
}