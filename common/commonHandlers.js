const _ = require('lodash');

const liquors = [
    `vodka`,
    `rum`,
    `gin`,
    `rye`,
    `whisky`,
    `bourbon`,
    `tequila`,
    `sake`,
    `beer`
];

const farewellSpeech = [
    `Good bye!`,
    `See you later!`,
    `Adios`,
    `Come again`,
    `Bye`,
    `Bye now`,
    `Bye bye`
];

module.exports = {
    LaunchHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'LaunchRequest';
        },
        async handle(handlerInput) {
            const speech = `Welcome! How may I help you today?` +
                ` You can ask for a cocktail by name.` +
                ` Or say surprise me to get the barkeep's choice.`;
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .withShouldEndSession(false)
                .getResponse();
        }
    },
    ExitHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                (request.intent.name == 'AMAZON.CancelIntent' ||
                    request.intent.name == 'AMAZON.StopIntent');
        },
        handle(handlerInput) {
            const speech = farewellSpeech[_.random(0, farewellSpeech.length - 1)];
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .withShouldEndSession(true)
                .getResponse();
        }
    },
    HelpHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest' &&
                (request.intent.name == 'AMAZON.HelpIntent' ||
                    request.intent.name == 'AMAZON.FallbackIntent');
        },
        handle(handlerInput) {
            const randomLiquor = liquors[_.random(0, liquors.length)];
            const speech = `You can ask for a specific cocktail recipe, by saying its name.` +
                ` Or say surprise me to get my pick.` +
                ` You can also say "give me a ${randomLiquor} cocktail".`;
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .getResponse();
        }
    },
    ErrorHandler: {
        canHandle() {
            return true;
        },
        handle(handlerInput) {
            const randomLiquor = liquors[_.random(0, liquors.length - 1)];
            const speech = `Sorry, I was unable to find anything relevant.` +
                ` You can ask for a specific cocktail, by saying its name.` +
                ` Or say "surprise me", to get my pick.` +
                ` You can also say "give me a ${randomLiquor} cocktail".` + 
                ` At any point of time, you can also say "cancel", or "start over".` ;
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .getResponse();
        }
    }
};
