const http = require('axios');
const config = require('./config').config;

module.exports = {
    getRandomDrink: async function (liquor) {
        const url = config.baseUrl + '/bar/menu/surpriseme' + (liquor ? '/' + liquor : '');
        return http.get(url, {
            'headers': { 'content-type': 'text/plain' }
        });
    },
    getBarMenu: async function () {
        const url = config.baseUrl + '/bar/menu';
        return http.get(url, {
            'headers': { 'content-type': 'application/json' }
        });
    },
    getBarMenuAvailable: async function () {
        const url = config.baseUrl + '/bar/menu/available';
        return http.get(url, {
            'headers': { 'content-type': 'application/json' }
        });
    },
    getRecipe: async function (drink) {
        const url = config.baseUrl + `/bar/recipe/${drink}`;
        return http.get(url, {
            'headers': { 'content-type': 'application/json' }
        });
    }
}
