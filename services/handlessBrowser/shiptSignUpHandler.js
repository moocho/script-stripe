'use strict'
const chromium = require('chrome-aws-lambda')
const { response, wakeUpLambda, getBody } = require(`${process.env['FILE_ENVIRONMENT']}/globals/common`)
const { fillInputs,saveCookies,prepareData,chromiumOptions } = require('./utils/helpers')
const config = require('./config')
const AWS = require('aws-sdk')
const { SIGNUPSECTION } = require('./utils/constants')
const SNS = new AWS.SNS()

module.exports.handlessBrowser = async event => {
  //keep your lambda warm up
  if (wakeUpLambda(event)) return await response(200, { message: 'just warnUp me' }, null)

  let browser = null
  let optionsChromium = await chromiumOptions(chromium)
  const { sessionUrlSignUp, recaptchaSiteKey } = config.shipt
  const { domFields } = config.shipt.signUp

  let userData = getBody(event)
  prepareData(domFields,userData,'signUpShipt')

  let domItem = {
    inputData: '',
    inputName: '',
    url: sessionUrlSignUp,
    recaptchaSiteKey: recaptchaSiteKey,
    domItemExists: false,
  }

  try {
    browser = await chromium.puppeteer.launch(optionsChromium);

    let page = await browser.newPage()

    page.setBypassCSP(true)
    await page.goto(event.url || domItem.url)
    await page.waitFor(3000)
    await fillInputs(page, domFields, SIGNUPSECTION)
    const cookies = await page.cookies();

    if(cookies.length > 0)
      await saveCookies(cookies,SNS,userData.user_id,'shipt')

    console.log("FINISHED SIGN UP SHIPT");
  } catch (error) {
    return await response(500, `SIGN-UP SHIPT HANDLER SECTION ERROR: ${error}`, null)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
  return await response(200, 'SESSION SHIPT SIGN UP CHROMIUM END', null)
}
