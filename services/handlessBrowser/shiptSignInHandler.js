'use strict'

const chromium = require('chrome-aws-lambda')
const { response, wakeUpLambda, getBody } = require(`${process.env['FILE_ENVIRONMENT']}/globals/common`)
const { fillInputs, saveCookies,prepareData,chromiumOptions } = require('./utils/helpers')
const config = require('./config')
const AWS = require('aws-sdk')
const { SIGNINSECTION, ADDRESSSECTION, SAVEADDRESSSECTION, CHOOSESTORESECTION } = require('./utils/constants')
const SNS = new AWS.SNS()

/**
 * POST example
 * {
    "user_id": 290665 ,
    "email":"dontoro2@gmail.com",
    "password":"dontoro2",
    "address": "Los Angeles County Arboretum 301 N Baldwin Ave, Arcadia, CA 91007, USA",
    }
 * @param event
 * @returns {Promise<any>}
 */
module.exports.handlessBrowser = async event => {
  if (wakeUpLambda(event)) return await response(200, { message: 'just warnUp me' }, null)

  let browser = null
  let optionsChromium = await chromiumOptions(chromium)
  const { sessionUrlSignIn, recaptchaSiteKey } = config.shipt
  const { domFields } = config.shipt.signIn
  
  let domItem = {
    inputData: '',
    inputName: '',
    url: sessionUrlSignIn,
    recaptchaSiteKey: recaptchaSiteKey,
    domItemExists: false,
  }
  let userData = getBody(event)
  console.log("ENTRO ADDRESS SHIPT");
  prepareData(domFields,userData,'signInShipt')
  console.log("ENTRO ADDRESS SHIPT END");
  try {
    browser = await chromium.puppeteer.launch(optionsChromium);

    let page = await browser.newPage()

    page.setBypassCSP(true)
    await page.goto(event.url || domItem.url)
    await page.waitFor(3000)

    await fillInputs(page, domFields, SIGNINSECTION);

    await page.waitFor(3000)

    console.log("URL SHIPT");
    let title = await page.title();
    console.log(title);

    const cookies = await page.cookies();
    /** EN ESTA PARTE YA ESTA LA ESTRUCTURA CORRECTA DE LA COOKIES */
    if (cookies.length > 0)
      await saveCookies(cookies,SNS,userData.user_id,'shipt')

    let log;
    console.log("START EVALUATION");
    const data = await page.evaluate((log) => {
      var $domItemSection = document.querySelector('#address-autocomplete-input');
      if($domItemSection) {
        log = "ITEM EXISTS AND PASSED LOG IN";
      } else {
        log = "ITEM DOESNT EXISTS HASNT PASSED LOG IN";
      }

      return log;
    }, log);

    console.log("LOG");
    console.log(data);



    await fillInputs(page, domFields, ADDRESSSECTION);
    await page.waitFor(3000)

    await fillInputs(page, domFields, SAVEADDRESSSECTION);
    await page.waitFor(3000)

    await fillInputs(page, domFields, CHOOSESTORESECTION);
    await page.waitFor(3000)
    
    console.log("URL SHIPT");
    title = await page.title();
    console.log(title);
    await page.waitFor(5000);
  } catch (error) {
    return await response(500, `SIGN-IN SHIPT HANDLER SECTION ERROR: ${error}`, null)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }

  return await response(200, 'SESSION SHIPT SIGN IN CHROMIUM END', null)
}
