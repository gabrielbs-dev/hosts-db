require("dotenv/config");

module.exports = {
    MONGO_HOST: process.env.MONGO_HOST ?? null,
    MONGO_DATABASE: process.env.MONGO_DATABASE ?? null
};