const _ = require('lodash');

const units = {
    'oz': ['ounce', 'ounces'],
    'dash': ['dash', 'dashes'],
    'pinch': ['pinch', 'pinches'],
    'tsp': ['tea spoon', 'tea spoons'],
    'tbsp': ['table spoon', 'table spoons'],
    'eighth': ['eighth', 'eighths'],
    'quarter': ['quarter', 'quarters'],
    'half': ['half', 'halves'],
    'third': ['third', 'thirds'],
    'slice': ['slice', 'slices'],
    'leaf': ['leaf', 'leaves']
};

const wholes = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    0: ''
};

const fractions = {
    25: 'quarter',
    33: 'third',
    5: 'half',
    75: 'three quarters'
};

const formats = {
    'liquidFormat': '{portion} ${unit} of ${name}',
    'fractionFormat': '{name} cut in {portion}'
};

module.exports = {
    stringifyList: function(array, ender = 'or', joiner = ',') {
        const len = array.length;
        if (len == 1)
            return array[0].toString();
        const array1 = array.splice(0, len - 1);
        const str1 = array1.join(joiner + ' ');
        const concatString = str1 + ' ' + ender + ' ' + array[0];
        return concatString;
    },

    getIngredients: function(recipe) {
        return _.concat(
            _.map(recipe.ingredients, 'name'),
            _.map(recipe.garnish, 'name')
        );
    },

    getMeasures: function(recipe) {
        return _.concat(
                recipe.ingredients,
                recipe.garnish
            )
            .map(item => {
                const unitArr = units[item.unit];
                const spokenUnit = item.unit ?
                    ((item.portion <= 1) ?
                        unitArr[0] :
                        unitArr[unitArr.length - 1]) :
                    undefined;
                const portionParts = item.portion.toString().split('.');
                const whole = wholes[portionParts[0]];
                var spokenMeasure = whole;
                if (portionParts.length == 2) {
                    const frac = fractions[portionParts[1]];
                    spokenMeasure = spokenMeasure + ' and ' + frac;
                }
                item.spokenMeasure = spokenUnit ?
                    spokenMeasure + ' ' + spokenUnit + ' of ' + item.name :
                    spokenMeasure + ' ' + item.name;
                return item.spokenMeasure;
            });
    }
};
