const Alexa = require('ask-sdk-core')
const axios = require('axios')

function getRecipe(cocktail) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`

  return axios.get(url).then(function (response) {
    return response.data.drinks[0].strInstructions
  })
}


const RecipeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RecipeIntent'
  },
  handle(handlerInput) {
    const cocktail = handlerInput.requestEnvelope.request.intent.slots.Cocktail.value

    return getRecipe(cocktail).then(function (recipe) {
      const speechText = `Sure thing, all you will need to do is ${recipe} <amazon:emotion name="excited" intensity="high"> Enjoy! </amazon:emotion>`

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt("Is there anything else I can help make you?")
        .getResponse()

    })
  }
}


const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Im sorry I don't think I know how to make that drink! Can you please repeat it?")
      .reprompt("I didnt catch that, can you please repeat it?")
      .withShouldEndSession(false)
      .getResponse()
  }
}


const builder = Alexa.SkillBuilders.custom()

exports.handler = builder
  .addRequestHandlers(RecipeIntentHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda()