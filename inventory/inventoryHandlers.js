module.exports = {
    GetInventoryHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest'
                && request.intent.name == 'InventoryStatus';
        },
        handle(handlerInput) {
            return handlerInput.responseBuilder
                .speak('Welcome to the bar, how may I help you?')
                .reprompt('Welcome to the bar, how may I help you?')
                .getResponse();
        }
    },
    AddToInventoryHandler: {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest'
                && request.intent.name == 'AddToInventory';
        },
        handle(handlerInput) {
            return handlerInput.responseBuilder
                .speak('Welcome to the bar, how may I help you?')
                .reprompt('Welcome to the bar, how may I help you?')
                .getResponse();
        }
    }
}