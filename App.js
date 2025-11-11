import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

const USER_DATA_PATH = './puppeteer_user_data';
const HOME_URL = 'https://portal.softcomservices.com/';
const CLIENTES_URL = 'https://portal.softcomservices.com/Clientes';
const LOGIN_URL = 'https://portal.softcomservices.com/Account/Login?ReturnUrl=%2F';
async function portal() {
    // Launch the browser and open a new blank page.
const browser = await puppeteer.launch({ headless: false, userDataDir : USER_DATA_PATH }); // abriu o navegador
const page = await browser.newPage(); // abriu a aba

// Navigate the page to a URL.
    //await page.goto('https://portal.softcomservices.com/Account/Login?ReturnUrl=%2F', { waitUntil: 'networkidle0' }); // url da página
    await page.setViewport({width: 1080, height: 1024});
await page.goto(CLIENTES_URL, { waitUntil: 'networkidle0' })
    // Set screen size.
    const CurrentUrl = page.url();
    if (CurrentUrl.startsWith(LOGIN_URL)) {
        await page.type('#UserName', "vanderson");
  await page.type('#Password', "franquias");
    } 

    // Open the search menu using the keyboard.
    
await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);
    console.log('Login realizado! URL atual:', page.url());
    
    await page.waitForSelector('a[href="/Clientes"]', { visible: true });
    
    await Promise.all(
       [ page.waitForNavigation({ waitUntil: 'networkidle0' }),
        await page.click('a[href="/Clientes"]')
    //await page.click('#menuClientesId > a');
    
]);    
console.log('entrei na page de login');
console.log('começar a raspagem')
    await page.waitForSelector('p.m-0 strong',  { timeout: 10000 });
    const result = await page.evaluate(() => {
        const titles = [];  
        document.querySelectorAll('p.m-0 strong').forEach((title)=> {
            titles.push({ titulo: title.innerText.trim() });
        })  ;
        return titles;
    })
    console.log(result);
await browser.close();
}
portal();