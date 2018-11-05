const inventoryHandlers = require("./inventory/inventoryHandlers");
const orderHandlers = require("./menu/orderHandlers");
const commonHandlers = require("./common/commonHandlers");
const Alexa = require('ask-sdk-core');

const skillBuilder = Alexa.SkillBuilders.custom();

exports.requestHandler = skillBuilder
  .addRequestHandlers(
    inventoryHandlers.GetInventoryHandler,
    inventoryHandlers.AddToInventoryHandler,
    orderHandlers.BarMenuHandler,
    orderHandlers.BarkeepsChoiceHandler,
    orderHandlers.DrinkIntroHandler,
    orderHandlers.MeasuresHandler,
    orderHandlers.MethodHandler,
    commonHandlers.ExitHandler,
    commonHandlers.HelpHandler
  )
  .addErrorHandlers(commonHandlers.ErrorHandler)
  .lambda();
