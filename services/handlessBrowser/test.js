// ----------- Standard JS function -----------
const puppeteer = require("puppeteer");
const fs = require('fs')
const {readerFileHandler} = require('./readFile')
const logger = fs.createWriteStream('log.txt');
(async () => {
    let t0 = new Date().getTime();
  console.log("-------start-------");
  const url = "https://www.privacyshield.gov/list";
  //launch
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  //elements
  const anchorClassXPath = '//div[@class="letter"]/a';
  const buttonClassXPath = '//a[@class="btn-dark pull-right advanced"]';
  //1. click the button to show filter section
  let btn = await page.$x(buttonClassXPath);
  await btn[0].click();
  await page.waitFor(1000);
  // verify if pagination number of rows by page exists
  let paginationButton = await page.$x(
      '//select[@name="j_id0:j_id1:j_id67:j_id142"]'
  );
  // change number the returned values
  if (paginationButton.length > 0) {
    await page.evaluate(() => {
      document.getElementsByName(
          "j_id0:j_id1:j_id67:j_id142"
      )[0].value = 50;
      search();
    });
    await page.waitFor(3500);
  }
  //2. get all the filters
  let filterStage = await page.$x(anchorClassXPath);
  if (filterStage) {
    for (let filterIndex = 0 ; filterIndex < 1; filterIndex++) {
        //3. click in the filter
      await filterStage[filterIndex].click();
      await page.waitFor(4000);
      //verify is exist data the filter
      let links = await page.$x(`//h4/a`);
      if (links.length > 0) {
        //4. get first all links rows
        console.log("page: 1");
        if (links) {
          await Promise.all(
            links.map(async (link, index) => {
              const text = await link.evaluate(element => element.innerText);
              const href = await link.evaluate(element => element.href);
              // console.log(text);
              // console.log(href);
              logger.write(text+'\n')
              logger.write(href+'\n')
              logger.write('--\n')
            })
          ).catch(error => {
            console.log(error);
          });
        }
        //5. go to the next page if exist
        let nl2 = await page.$x("//a[@class='btn-navigate'][1]");
        if (nl2.length > 0) {
          let nextLink = await page.$x("//a[contains(text(), 'Next Results')]"); //"//a[contains(text(), 'Next Results')]"
          let scrappingPage = 1;
          for (let index = 0; index < nextLink.length; index++) {
            await nextLink[0].click();
            console.log("After the click await");
             await page.waitFor(4500);
             scrappingPage++;
            console.log("page: " + scrappingPage.toString());
            let links = await page.$x(`//h4/a`); //.$(`a.btn-navigate`);
            if (links) {
              await Promise.all(
                links.map(async (link, index) => {
                  const text = await link.evaluate(
                    element => element.innerText
                  );
                  const href = await link.evaluate(element => element.href);
                  // console.log(text);
                  // console.log(href);
                  logger.write(text+'\n')
                  logger.write(href+'\n')
                  logger.write('--\n')
                })
              ).catch(error => {
                console.log(error);
              });
            }
            console.log(
              "-------------------------------------------------------------"
            );
            nextLink = await page.$x("//a[contains(text(), 'Next Results')]");
            if (nextLink.length) {
              index = -1;
            }
          }
        }
      } else {
        console.log("------ NO RESULTS -------");
      } //ends if validate if there are information
    } //ends For
    await browser.close();
      let t1 = new Date().getTime();
      console.log("TIME -- " + (t1-t0) )
    readerFileHandler('./log.txt')
  }
})().catch(error => {console.log(error);});