const _ = require('lodash');
const barkeep = require('../helpers/barkeep');
const utils = require("../helpers/utils");

const recommendSpeech = [
    [`Try `, `.`],
    [`How about `, `?`],
    [`I would suggest `, `.`],
    [`What about `, `?`],
    [`Have you tried `, `?`],
    [`I recommend `, `.`],
    [`Wanna try`, `?`],
    [`Do you want to try`, `?`],
    [`Check out the recipe for `, `.`]
];

const helpSpeech = ` You can also say "repeat", "cancel", "start over", or "something else" `;
const ingredientsSpeech = ` To get the list of ingredients, say "ingredients". `;
const methodSpeech = ` To hear how to make ${drinkName}, say "method". `;

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
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const sessionLiquor = sessionAttributes.liquor;
            var requestLiquor = undefined;
            if (handlerInput.requestEnvelope.request.intent.name == 'BarkeepsChoiceSpecial') {
                requestLiquor = handlerInput.requestEnvelope.request.intent.slots.liquor.value;
            }
            const liquor = requestLiquor ?
                requestLiquor :
                (sessionLiquor ?
                    sessionLiquor :
                    '');
            const randomDrinkRes = await barkeep.getRandomDrink(liquor);
            const randomDrink = randomDrinkRes.data;
            sessionAttributes.drinkName = randomDrink;
            sessionAttributes.liquor = liquor;
            const recPair = recommendSpeech[_.random(0, recommendSpeech.length - 1)];
            const speech = recPair[0] + ' ' + randomDrink + recPair[1];
            const repromptSpeech = recPair[0] + ' ' + randomDrink + recPair[1] +
                ` To know more about it, say "yes", or "that one", or ${randomDrink}.` +
                ` For a different cocktail, say "try again".`;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(repromptSpeech)
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
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const sessionDrink = sessionAttributes.drinkName;
            const requestDrink = handlerInput.requestEnvelope.request.intent.slots.cocktail.value;
            const drinkName = requestDrink ? requestDrink : sessionDrink;
            const response = await barkeep.getRecipe(drinkName);
            const recipe = response.data;
            const list = utils.stringifyList(utils.getIngredients(recipe), 'and');
            const glassware = utils.stringifyList(recipe.glassware, 'or');
            const speech = `To create a ${drinkName}, you need ${list}.` +
                ` It is typically served in a ${glassware}.` +
                ` To get the list of ingredients, say "ingredients".` +
                ` To hear how to make ${drinkName}, say "method".`;
            const repromptSpeech = speech + helpSpeech;
            const sessAttrib = {
                "drinkName": drinkName,
                "drink": recipe
            };
            handlerInput.attributesManager.setSessionAttributes(sessAttrib);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(repromptSpeech)
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
            const allBranchesVisited = (sessionAttributes.ingredients === true) && (sessionAttributes.process === true);
            const speech = `You will need ${list}.` +
               (allBranchesVisited? helpSpeech: methodSpeech);
            const repromptSpeech = speech;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(repromptSpeech)
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
            var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const recipe = sessionAttributes.drink;
            sessionAttributes.process = true;
            const allBranchesVisited = (sessionAttributes.ingredients === true) && (sessionAttributes.process === true);
            const speech = recipe.method +
                (allBranchesVisited ? helpSpeech : ingredientsSpeech);
            const repromptSpeech = speech;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(repromptSpeech)
                .withShouldEndSession(false)
                .getResponse();
        }
    }
};
