module.exports = {
    LaunchHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'LaunchRequest';
        },
        async handle(handlerInput) {
            const speech = `Welcome! How may I help you today?` +
                ` You can ask for a specific cocktail` +
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
            const speech = `Good bye!`;
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
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
            const speech = `Welcome! How may I help you today?` +
                ` You can ask for a specific cocktail recipe, by saying the drink's name.` +
                ` Or say surprise me to get the barkeep's choice. ` +
                ` You can also say "give me a rum cocktail"`;
            return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(speech)
                .getResponse();
        }
    }
};
