const { CREDITCARDSECTION } = require('./constants');
const constants = require('./constants');
// const { response } = require(`${process.env['FILE_ENVIRONMENT']}/globals/common`)
const {
    FILLINPUT,
    CLICKELEMENT,
    SUBMITBUTTON,
    EMAILINPUT,
    PASSWORDINPUT,
    FIRSTNAMEINPUT,
    LASTNAMEINPUT,
    MOBILENUMBERINPUT,
    SIGNINSECTION
} = constants;

const isSamePage = async (page, inputName) => {
    const isSameInput = await page.evaluate((inputName)=> {
        var $domItemSection = document.querySelector(inputName);
        if (!$domItemSection) return false;
        return true;
    }, inputName);
    return isSameInput;
}

// module.exports.fillInputs = async (page, domFields) => {
//     try {
//         for(let key in domFields){
//             if(domFields[key].action === FILLINPUT && domFields[key].section === SIGNINSECTION) {
//                 let dom = domFields[key];
//                 console.log("ELEMENT")
//                 console.log(dom.domElement);
//                 await page.type(dom.domElement, dom.fieldData);
//                 await page.waitFor(500);
//             }
//         }

//         const $domButton = domFields.filter(
//           dom => dom.action === CLICKELEMENT &&
//             dom.name === SUBMITBUTTON
//         );

//         console.log("BUTTON");
//         console.log($domButton);
//         console.log($domButton[0]);
//         const $submitButton = $domButton[0].domElement

//         await page.click($submitButton);
//         await page.waitFor(5000);

//     } catch(error) {
//         console.log("ERROR: ", error);
//         // return await response(500,`FILL INPUTS ERROR: ${error}` ,null);
//     }
// }

module.exports.fillInputs = async (page, domFields, section) => {
    try {
        let hasFrame = false;
        let frameContainer;
        let frame;
        if(section === CREDITCARDSECTION){
            console.log("HAS FRAME");
            await page.waitForSelector("iframe[title='Secure CVC input frame']");
            console.log("HAS FRAME LODING DONE");
            frameContainer = await page.$(
                "iframe[title='Secure CVC input frame']",
            );
            frame = await frameContainer.contentWindow();
            let test =  await page.evaluate(()=> {
                var $domItemSection = document.querySelector("iframe");
                var $domIframeSection = $domItemSection.contentWindow.document.querySelector("input[name='cardnumber']");
                // if (!$domItemSection) return domItem.domItemExists = false;
        
                // domItem.inputData = data;
                // domItem.domItemExists = true;
        
                return $domIframeSection;
            });
            console.log(frameContainer);
            console.log(test);
            hasFrame = true;
        }

        for(let key in domFields){
            if(domFields[key].action === FILLINPUT && domFields[key].section === section) {
                let dom = domFields[key];
                console.log("ELEMENT")
                console.log(typeof dom.domElement)
                console.log(dom.domElement);
                hasFrame ? 
                    await frame.type(dom.domElement,dom.fieldData) : 
                    await page.type(dom.domElement, dom.fieldData);
                await page.waitFor(500);
            }
        }

        const $domButton = domFields.filter(
          dom => dom.action === CLICKELEMENT &&
            dom.name === SUBMITBUTTON &&
            dom.section === section
        );

        console.log("BUTTON");
        console.log($domButton);
        console.log($domButton[0]);
        const $submitButton = $domButton[0].domElement

        await page.click($submitButton);
        await page.waitFor(5000);
    } catch(error) {
        console.log("ERROR: ", error);
        // return await response(500,`FILL INPUTS ERROR: ${error}` ,null);
    }
}

module.exports.fillDomItem = async (page, domItem, domElementName, data) => {
    domItem =  await page.evaluate((domItem, domElementName, data)=> {
        domItem.inputName = domElementName;

        var $domItemSection = document.querySelector(domItem.inputName);
        if (!$domItemSection) return domItem.domItemExists = false;

        domItem.inputData = data;
        domItem.domItemExists = true;

        return domItem;
    }, domItem, domElementName, data);

    return domItem;
}

module.exports.solveCaptcha = async (page, domItem, antiCaptcha) => {
    let isSameInput = false;

    try {
        // For Sign-in repeated elements section in UBER EATS
        await page.evaluate(()=> {
            var $domItemSection = document.querySelectorAll('.soft-tiny');
            if($domItemSection && $domItemSection.length > 1) {
                $domItemSection[0].remove();
            };
        });

        await page.type(domItem.inputName, domItem.inputData);
        await page.waitFor(2000);

        await page.click('button');
        await page.waitFor(5000);

        isSameInput = await isSamePage(page, domItem.inputName);

        console.log("isSameInput");
        console.log(isSameInput);

        // If same input on page means Recaptcha has being showed
        if(isSameInput && domItem.recaptchaSiteKey) {
            let solvedToken = await antiCaptcha.solveRecaptchaV2Proxyless(domItem.url, domItem.recaptchaSiteKey)
              .then(gresponse => {
                  console.log(`SOLVED TOKEN: ${gresponse}`);
              })
              .catch(error => {
                  console.log(`ANTICAPTCHA ERROR: ${error}`);
              });

            await page.evaluate((solvedToken, isSameInput)=> {
                setTokenVariables(solvedToken, isSameInput);
            }, solvedToken, isSameInput);
            await page.waitFor(5000);

            await page.click('button');
            await page.waitFor(5000);
        }
    } catch(error) {
        console.log("ERROR: ", error);
        // return await response(500,`SOLVE CAPTCHA SECTION ERROR: ${error}` ,null)
    }
}
/**
 *
 * @param cookies
 * @param SNS -> AWS instance
 * @param email
 * @returns {Promise<boolean>}
 */
module.exports.saveCookies = async (cookies,SNS,user_id,provider) => {
    try {
        let dataToSave = {
            user_id: user_id,
            provider: provider,
            expiration_date:'',
            cookies:null
        }

        cookies.map((item)=>{
            dataToSave.expiration_date = item.expires
            delete item.domain;
            delete item.path;
            delete item.expires;
            delete item.size;
            delete item.httpOnly;
            delete item.secure;
            delete item.session;
            delete item.sameSite;
        });

        dataToSave.cookies = cookies
        let snsParams = {
            Message: JSON.stringify(dataToSave),
            TopicArn: `arn:aws:sns:us-east-1:${process.env['ACCOUNT_ID']}:save-cookies`,
        }
        
        await SNS.publish(snsParams).promise()
        return true
    }catch (e){
        console.log(e)
        return false
    }
}

module.exports.prepareData = (domFields,data, type) => {

    switch (type){
        case 'signInDoordash':
            domFields[1].fieldData = data.email
            domFields[2].fieldData = data.password
            domFields[4].fieldData = data.address
            domFields[9].fieldData = data.credit_card_number
            domFields[10].fieldData = data.cvv
            domFields[11].fieldData = data.expiration_date
            domFields[12].fieldData = data.postal_code
            break;
        case'signUpDoordash':
            domFields[1].fieldData = data.first_name
            domFields[2].fieldData = data.last_name
            domFields[3].fieldData = data.email
            domFields[4].fieldData = data.phone
            domFields[5].fieldData = data.password
            break;
        case 'signInShipt':
            console.log('put the data here to signInShipt ');
            domFields[1].fieldData = data.email
            domFields[2].fieldData = data.password
            domFields[4].fieldData = data.address
            break;
        case 'signUpShipt':
            console.log('put the data here to signUpShipt ');
            // domFields[1].fieldData = `${data.first_name} ${data.last_name}`
            // domFields[2].fieldData = data.email
            // domFields[4].fieldData = data.password

            domFields[1].fieldData = "Don Toro3"
            domFields[2].fieldData = "dontoro3@gmail.com"
            domFields[4].fieldData = "dontoro3"
            break;
        break
        default:
            console.log('put the data here to signInShipt ')
    }

    return domFields
}

module.exports.chromiumOptions = async (chromium) => {

    let optionsChromium = {}
    if(process.env['RUN_LIKE'] === 'deployed'){
        optionsChromium = {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        }
    }else {
        optionsChromium = { headless: false, args: [ '--disable-web-security', ] }
    }

    return optionsChromium
}