'use strict'
const chromium = require('chrome-aws-lambda')
const { response, wakeUpLambda, getBody } = require(`${process.env['FILE_ENVIRONMENT']}/globals/common`)
const { fillInputs, saveCookies, prepareData, chromiumOptions } = require('./utils/helpers')
const config = require('./config')
const constants = require('./utils/constants')
const { 
  CLICKELEMENT, 
  SIGNINBUTTON, 
  ADDRESSSECTION,
  SIGNINSECTION, 
  MENUSECTION, 
  PAYMENTMENUSECTION, 
  PYAMENTMETHODADDSECTION,
  CREDITCARDSECTION 
} = constants
const AWS = require('aws-sdk')
const SNS = new AWS.SNS()

/**
 * POST example
 * {
    "user_id": 290665 ,
    "email":"b3c3b647-5b3f-4ec3-a4dd-cb95ad4da764@mailslurp.com",
    "password":"1606330518806-290665",
    "address": "Los Angeles County Arboretum 301 N Baldwin Ave, Arcadia, CA 91007, USA",
    "credit_card_number": "4487960014071137",
    "cvv": "148",
    "expiration_date": "0923",
    "postal_code": "90201"
    }
 * @param event
 * @returns {Promise<any>}
 */
module.exports.handlessBrowser = async event => {
  //keep your lambda warm up
  if (wakeUpLambda(event)) return await response(200, { message: 'just warnUp me' }, null)
  console.log(event);
  let browser = null
  let optionsChromium = await chromiumOptions(chromium)
  const { sessionUrlSignIn, recaptchaSiteKey } = config.doordash
  let { domFields } = config.doordash.signIn

  let userData = getBody(event)
  prepareData(domFields,userData,'signInDoordash')

  let domItem = {
    inputData: '',
    inputName: '',
    url: sessionUrlSignIn,
    recaptchaSiteKey: recaptchaSiteKey,
    domItemExists: false,
  }


  try {
    browser = await chromium.puppeteer.launch(optionsChromium);

    let page = await browser.newPage()

    page.setBypassCSP(true)
    console.log("WEBSITE URL");
    console.log(domItem.url);
    await page.goto(event.url || domItem.url)
    await page.waitFor(5000)

    const $domButton = domFields.filter(dom => dom.action === CLICKELEMENT && dom.name === SIGNINBUTTON)
    const $signInButton = $domButton[0].domElement

    await page.evaluate($signInButton => document.querySelector($signInButton).click(), $signInButton)
    await page.waitFor(5000)

    await fillInputs(page, domFields, SIGNINSECTION);
    await page.waitFor(5000)
    const cookies = await page.cookies();

    if(cookies.length > 0)
      await saveCookies(cookies,SNS,userData.user_id,'doordash')

    console.log("FINISHED SIGN IN Doordash");
    await page.waitFor(5000);

    await fillInputs(page, domFields, ADDRESSSECTION);
    await page.waitFor(5000)

    await fillInputs(page, domFields, MENUSECTION);
    await page.waitFor(5000)

    await fillInputs(page, domFields, PAYMENTMENUSECTION);
    await page.waitFor(5000)

    await fillInputs(page, domFields, PYAMENTMETHODADDSECTION);
    await page.waitFor(5000)

    await fillInputs(page, domFields, CREDITCARDSECTION);
    await page.waitFor(5000)    
  } catch (error) {
    console.log(error)
    return await response(500, `SIGN-IN DOORDASH HANDLER SECTION ERROR: ${error}`, null)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }

  return await response(200, 'SESSION CHROMIUM END', null)
}
