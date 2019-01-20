const config = require('./config').config;
const mongo = require('./mongodb');

module.exports = {
    getRandomDrink: async function(liquor) {
        const db = await mongo.getDb();
        const collection = db.collection(config.mongoDB.collection);
        const pipeline = liquor? [
            { $match: { liquor: liquor.toLowerCase() } },
            { $sample: { size: 1 } },
            { $project: {_id: 0, name: 1 } }
        ] : [
            { $sample: { size: 1 } },
            { $project: {_id: 0, name: 1 } }
        ];
        var results = await collection.aggregate(pipeline).toArray();
        return results? results[0] : null
    },
    getBarMenu: async function() {
        const db = await mongo.getDb();
        const collection = db.collection(config.mongoDB.collection);
        var results = await collection.find({})
            .project({_id: 0, name: 1})
            .toArray();
        return results;
    },
    getBarMenuAvailable: async function() {
        const db = await mongo.getDb();
        const collection = db.collection(config.mongoDB.collection);
        var results = await collection.find({})
            // FIXME: add name-based filter
            .project({_id: 0, name: 1})
            .toArray();
        return results;
    },
    getRecipe: async function(drink) {
        const db = await mongo.getDb();
        const collection = db.collection(config.mongoDB.collection);
        var results = await collection.find({})
            .filter({name: drink.toLowerCase()})
            .toArray();
        return results[0];
    }
}
