const isSamePage = async (page, inputName) => {
    const isSameInput = await page.evaluate((inputName)=> {
        var $domItemSection = document.querySelector(inputName);
        if (!$domItemSection) return false;
        return true;
    }, inputName);
    return isSameInput;
}

module.exports.fillInput = async (page, domItem, domElementName, inputType, data) => {
    domItem =  await page.evaluate((domItem, domElementName, inputType, data)=> {
        domItem.inputName = domElementName
        domItem.inputType = inputType;
  
        var $domItemSection = document.querySelector(domItem.inputName);
        if (!$domItemSection) return domItem.domItemExists = false;
  
        domItem.inputData = data;
        domItem.domItemExists = true;
  
        return domItem;
    }, domItem, domElementName, inputType, data);

    return domItem;
}

module.exports.solveCaptcha = async (page, domItem, antiCaptcha, browser) => {
    let isSameInput = false;

    try {
        // For Sign-in repeated elements section
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
        if(isSameInput) {
            let solvedToken = await antiCaptcha.solveRecaptchaV2Proxyless(domItem.url, domItem.recaptchaSiteKey)
            .then(gresponse => {
                console.log(`SOLVED TOKEN: ${gresponse}`);
            })
            .catch(error => {
                console.log(`ANTICAPTCHA ERROR: ${error}`);
            });

            await page.evaluate((solvedToken, domItem, isSameInput)=> {
                setTokenVariables(solvedToken, domItem.inputType, isSameInput);
            }, solvedToken, domItem, isSameInput);
            await page.waitFor(5000);

            await page.click('button');
            await page.waitFor(5000);
        }
    } catch(error) {
        return await asyncResponse(500,`SIGN-IN UBER EATS INPUT SOLVE CAPTCHA SECTION ERROR: ${error}` ,null)
    }
}
