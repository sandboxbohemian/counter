const mongo = require('mongodb').MongoClient;
const config = require('./config').config;

let db;
let connection;

module.exports = {
    connect: async (callback) =>  {
        mongo.connect(
            config.mongoDB.url, 
            { useNewUrlParser: true },
            async (err, database) => {
                db = database.db;
                connection = database;
                return callback(err);
            });
    },
    getDb: () => db
}