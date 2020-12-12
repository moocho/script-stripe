'use strict'
const antiCaptcha = require('@antiadmin/anticaptchaofficial')
const chromium = require('chrome-aws-lambda')
const express = require('express')
const { asyncResponse } = require(process.env['FILE_ENVIRONMENT'] + (process.env['IS_OFFLINE'] ? '/..' : '') + '/globals/common')
const { fillDomItem, solveCaptcha } = require('./utils/helpers')
const config = require('./config')
const app = express()
app.use(express.static(__dirname))
const server = app.listen(5800)

module.exports.handlessBrowser = async event => {
  let browser = null
  //SET ANTI-CAPTCHA KEY
  const antiCaptchaKey = config.antiCaptchaKey
  const { sessionUrl, injectionFileUrl, recaptchaSiteKey } = config.uberEats
  const { domFields } = config.uberEats.signIn

  let domItem = {
    inputData: '',
    inputName: '',
    url: sessionUrl,
    recaptchaSiteKey: recaptchaSiteKey,
    domItemExists: false,
  }

  try {
    // Set antiCaptcha instance
    antiCaptcha.setAPIKey(antiCaptchaKey)
    antiCaptcha
      .getBalance()
      .then(balance => console.log('My balance is: ' + balance))
      .catch(error => console.log('An error with API key: ' + error))

    browser = await chromium.puppeteer.launch({ headless: false })

    let page = await browser.newPage()

    // LOADING PAGE SECTION

    // Bypass uber security
    page.setBypassCSP(true)
    await page.goto(event.url || domItem.url)
    await page.waitFor(5000)

    // Inject script in Uber Eats
    console.log('LOADING SCRIPT...')
    await page.addScriptTag({ url: injectionFileUrl })
    console.log('END LOADING SCRIPT...')

    // await page.waitFor(500000);

    // USER INPUT SECTION
    // const a = await Promise.all(
    //   domFields.map(async (dom)=> {
    //     console.log('domItem 1');
    //     console.log(dom);
    //     domItem = await fillInput(page, domItem, dom.domElement, dom.fieldData);
    //   })
    // )

    for (let key in domFields) {
      let dom = domFields[key]
      domItem = await fillDomItem(page, domItem, dom.domElement, dom.fieldData)
      if (domItem.domItemExists) await solveCaptcha(page, domItem, antiCaptcha, browser)
    }

    // await page.waitFor(100000);

    // domItem = await fillDomItem(page, domItem, domFields[0].domElement, domFields[0].fieldData);
    // Set variables with solved token for user input section and make submit process
    // if(domItem.domItemExists) await solveCaptcha(page, domItem, antiCaptcha, browser);

    // PASSWORD INPUT SECTION
    // domItem = await fillDomItem(page, domItem, domFields[1].domElement, domFields[1].fieldData);
    // Set variables with solved token for password input section and make submit process
    // if(domItem.domItemExists) await solveCaptcha(page, domItem, antiCaptcha, browser);

    await page.waitFor(100000)
  } catch (error) {
    return await asyncResponse(500, `SIGN-IN UBER EATS HANDLER SECTION ERROR: ${error}`, null)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }

  return await asyncResponse(200, 'SESSION CHROMIUM END', null)
}
