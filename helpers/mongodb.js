const mongo = require('mongodb').MongoClient;
const config = require('./config').config;
const options = { useNewUrlParser: true };

module.exports = {
    getDb: async () =>  {
        var client = await mongo.connect(config.mongoDB.url, options);
        var db = client.db(config.mongoDB.db)
        return db;
    }
}