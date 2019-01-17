const http = require('axios');
const config = require('./config').config;
const mongo = require('./mongodb');

module.exports = {
    getRandomDrink: async function(liquor) {
        const collection = mongo.getDb().collection(config.mongoDB.collection);
        const pipeline = liquor? [
            { $match: { liquor: liquor } },
            { $sample: { size: 1 } },
            { $project: {_id: 0, name: 1 } }
        ] : [
            { $sample: { size: 1 } },
            { $project: {_id: 0, name: 1 } }
        ];
        return await collection().aggregate(pipeline).toArray();
    },
    getBarMenu: async function() {
        const url = config.baseUrl + '/bar/menu';
        return http.get(url, {
            'headers': { 'content-type': 'application/json' }
        });
    },
    getBarMenuAvailable: async function() {
        const url = config.baseUrl + '/bar/menu/available';
        return http.get(url, {
            'headers': { 'content-type': 'application/json' }
        });
    },
    getRecipe: async function(drink) {
        const url = config.baseUrl + `/bar/recipe/${drink}`;
        return http.get(url, {
            'headers': { 'content-type': 'application/json' }
        });
    }
}
