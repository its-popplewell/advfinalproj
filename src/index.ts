import * as pupp from "puppeteer";

const getInfoByYear = async (year: Number) => {

  const browser = await pupp.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.goto('https://mathscinet.ams.org/');

  // click radio button
  await page.waitForSelector('input#pubyear');
  await page.click('input#pubyear');

  // type year
  await page.type('input#yearValue', String(year));

  // await page.pdf({path: 'beforeclick.pdf'});

  console.log("before");
  // submit form
  try {
    console.log('try');
    await page.waitForSelector("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
    await page.click("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
    // await page.waitForNavigation();
  } 
  catch(err) {
    console.log('err');
    await page.waitForSelector("#titleSeparator > div.extendHeadlines > a");
    await page.click("#titleSeparator > div.extendHeadlines > a");
    // await page.waitForNavigation();
  }
  console.log("after");

  // await page.pdf({path: 'afterclick.pdf'});

  await page.waitForSelector('.headlineText');
  const els = await page.$$eval('.headlineText', eL => eL.map(el => el.textContent));

  console.log("doop");

  let info = await els.map((el:String) => {
    return(el
      .split("\n")
      .map((e:String) => e.trim())
      .filter((e:String) => e != ""))
  });

  let info_bop = info.map((el) => {return({
        'id': el[0],
        'type': el[1],
        'authtitle': el[2],
        'pubyear': el[11],
        'exdat': el[3],
        })});

    // info_bop.forEach((el) => console.log(el));

  await page.pdf({path: 'goog.pdf'});

  await browser.close();
  
  return(info_bop);
}

const getInfoByYearEasy = async (year : number) => {
  const browser = await pupp.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.goto('https://mathscinet.ams.org/');

  // click radio button
  await page.waitForSelector('input#pubyear');
  await page.click('input#pubyear');

  // type year
  await page.type('input#yearValue', String(year));

  // await page.pdf({path: 'beforeclick.pdf'});

  console.log("before");
  // submit form
  try {
    console.log('try');
    await page.waitForSelector("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
    await page.click("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
    // await page.waitForNavigation();
  } 
  catch(err) {
    console.log('err');
    await page.waitForSelector("#titleSeparator > div.extendHeadlines > a");
    await page.click("#titleSeparator > div.extendHeadlines > a");
    // await page.waitForNavigation();
  }
  console.log("after");

  const isBadYear = (y : number) => {
    return ((year >= 1930 && year < 1935) || (1925 <= year && year <= 1927) || (1967 <= year && year <= 1969) || (1972 <= year))
  }

  await page.waitForSelector(`#content > form > div.row.has-side-left > div.aggs.row-side > div > div.searchagg > dl:nth-child(${isBadYear(year) ? 4 : 3}) > dd > ul`)
  const els = await page.$$eval(`#content > form > div.row.has-side-left > div.aggs.row-side > div > div.searchagg > dl:nth-child(${isBadYear(year) ? 4 : 3}) > dd > ul > li`, el => el.map(e => e.textContent));//.map(e => e.textContent));
  
  const info = els.map(el => el.trim()).map(el=>el.replaceAll("(", "")).map(el=>el.replaceAll(")", "")).map(el=>el.split("\n\n\n"))

  await browser.close()

  return info

}

(async () => {
  // console.log(await getInfoByYearEasy(1900));
  
  let data : {[key: number] : any} = {};
  for (let i : number = 1900; i != 2022; i++) {
    console.log(i);
    data[i] = await getInfoByYearEasy(i);
    console.log("success")
  }
  console.log(data);

})();

