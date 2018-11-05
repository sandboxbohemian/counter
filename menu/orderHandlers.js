const barkeep = require('../helpers/barkeep');
const utils = require("../helpers/utils");

module.exports = {
    BarMenuHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                request.intent.name == 'BarMenu';
        },
        async handle(handlerInput) {
            const specials = await barkeep.getBarMenu();
            console.log(specials.data);
            const concatString = utils.stringifyList(specials.data);
            const reply = `Today you can choose from ${concatString}. Which one would you like?`;
            return handlerInput.responseBuilder
                .speak(reply)
                .reprompt(reply)
                .getResponse();
        }
    },
    MyBarMenuHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                request.intent.name == 'MyBarMenu';
        },
        async handle(handlerInput) {
            const specials = await barkeep.getBarMenu();
            console.log(specials.data);
            return handlerInput.responseBuilder
                .speak(``)
                .reprompt(`Welcome to the bar, today\'s special is ${specials.data}`)
                .getResponse();
        }
    },
    BarkeepsChoiceHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                (request.intent.name == 'BarkeepsChoice' ||
                    request.intent.name == 'BarkeepsChoiceSpecial');
        },
        async handle(handlerInput) {
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes;
            const sessionLiquor = sessionAttributes.liquor;
            var requestLiquor = undefined;
            if (handlerInput.requestEnvelope.request.intent.name == 'BarkeepsChoiceSpecial') {
                requestLiquor = handlerInput.requestEnvelope.request.intent.slots.liquor.value;
            }
            const randomDrinkRes = await barkeep.getRandomDrink(
                requestLiquor ?
                requestLiquor :
                (sessionLiquor ?
                    sessionLiquor :
                    ''));
            const randomDrink = randomDrinkRes.data;
            sessionAttributes.drinkName = randomDrink;
            sessionAttributes.liquor = sessionLiquor;
            const speech = `I would recommend ${randomDrink}.` +
                ` If you would like to know more about it, say "${randomDrink}".` +
                ` If you want a different one, say "try again"`;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .withShouldEndSession(false)
                .getResponse();
        }
    },
    DrinkIntroHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                request.intent.name == 'DrinkIntro';
        },
        async handle(handlerInput) {
            const drinkName = handlerInput.requestEnvelope.request.intent.slots.cocktail.value;
            const response = await barkeep.getRecipe(drinkName);
            const recipe = response.data;
            const list = utils.stringifyList(utils.getIngredients(recipe), 'and');
            const glassware = utils.stringifyList(recipe.glassware, 'or');
            const speech = `To create a ${drinkName}, you will need ${list}.` +
                ` It is typically served in a ${glassware}.` +
                ` To get the list of ingredients, say "ingredients".` +
                ` To hear how to make ${drinkName}, say "method".`;
            const sessAttrib = {
                "drinkName": drinkName,
                "drink": recipe
            };
            handlerInput.attributesManager.setSessionAttributes(sessAttrib);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .withShouldEndSession(false)
                .getResponse();
        }
    },
    MeasuresHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                request.intent.name == 'Ingredients';
        },
        async handle(handlerInput) {
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const recipe = sessionAttributes.drink;
            const drinkName = sessionAttributes.drinkName;
            sessionAttributes.ingredients = true;
            const list = utils.stringifyList(utils.getMeasures(recipe), 'and');
            const speech = `You will need ${list}.` +
                ` To hear how to make ${drinkName}, say "method". `;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .withShouldEndSession(false)
                .getResponse();

        }
    },
    MethodHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                request.intent.name == 'Process';
        },
        async handle(handlerInput) {
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes;
            const recipe = sessionAttributes.drink;
            sessionAttributes.process = true;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            const speech = recipe.method +
                ` To get the list of ingredients, say "ingredients". `;
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .withShouldEndSession(false)
                .getResponse();
        }
    }
};
