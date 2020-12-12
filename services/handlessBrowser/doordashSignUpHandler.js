'use strict'
const chromium = require('chrome-aws-lambda')
const { response, wakeUpLambda,getBody } = require(`${process.env['FILE_ENVIRONMENT']}/globals/common`)
const { fillInputs,saveCookies, prepareData, chromiumOptions  } = require('./utils/helpers')
const config = require('./config')
const constants = require('./utils/constants')
const { CLICKELEMENT, SIGNUPBUTTON } = constants
const AWS = require('aws-sdk')
const { SIGNUPSECTION } = require('./utils/constants')
const SNS = new AWS.SNS()

/**
 * POST example
 * {
      "email":"kenri@userlab.co",
      "password":"Kenri123456",
      "first_name":"kenri"
      "last_name":"kenri"
      "phone":"9175085363"
    }
 * @param event
 * @returns {Promise<any>}
 */
module.exports.handlessBrowser = async event => {
  //keep your lambda warm up
  if (wakeUpLambda(event)) return await response(200, { message: 'just warnUp me' }, null)
  let browser = null
  let optionsChromium = await chromiumOptions(chromium)
  const { sessionUrlSignUp, recaptchaSiteKey } = config.doordash
  const { domFields } = config.doordash.signUp
  console.log('Start')
  let userData = getBody(event)
  prepareData(domFields,userData,'signUpDoordash')
  console.log(domFields,'domFields')

  let domItem = {
    inputData: '',
    inputName: '',
    url: sessionUrlSignUp,
    recaptchaSiteKey: recaptchaSiteKey,
    domItemExists: false,
  }

  try {
    console.log('Chromium')
    browser = await chromium.puppeteer.launch(optionsChromium);
    let page = await browser.newPage()
    page.setBypassCSP(true)

    await page.goto(event.url || domItem.url)
    await page.waitFor(5000)

    const $domButton = domFields.filter(dom => dom.action === CLICKELEMENT && dom.name === SIGNUPBUTTON)
    const $signUpButton = $domButton[0].domElement

    await page.evaluate($signUpButton => document.querySelector($signUpButton).click(), $signUpButton)
    await page.waitFor(5000)
    await fillInputs(page, domFields, SIGNUPSECTION)
    await page.waitFor(10000)

    const cookies = await page.cookies();
    if(cookies.length > 0)
      await saveCookies(cookies,SNS,userData.user_id,'doordash')

    console.log("FINISHED SIGN UP doordash");
    await page.waitFor(5000);
  } catch (error) {
    return await response(500, `SIGN-UP DOORDASH HANDLER SECTION ERROR: ${error}`, null)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }

  return await response(200, 'SESSION CHROMIUM END', null)
}
