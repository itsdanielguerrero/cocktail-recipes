const Alexa = require('ask-sdk-core')
const axios = require('axios')

function getRecipe(cocktail) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`

  return axios.get(url).then(function (response) {
    return response.data.strInstructions
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
      const speechText = `To make a ${cocktail} you will need <emphasis>${recipe}</emphasis>`

      return handlerInput.responseBuilder
        .speak(speechText)
        .getReponse()
    })
  }
}

const builder = Alexa.SkillBuilders.custom()

exports.handler = builder
  .addRequestHandlers(RecipeIntentHandler)
  .lambda()