require('dotenv').config();
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const serverPort = process.env.PORT;
var page
app.listen(9090, () => {
    console.log('GPT berjalan di port ' + serverPort);
});
app.get('/', (req, res) => {
    const promb = req.query.promb;
    generate(promb, function (result) {
        res.send(result);
    })
});
(async () => {
    const browser = await puppeteer.launch({
        // executablePath:chromium.path,
        userDataDir: './browser_data',
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-suid-sanbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            //'--single-process',//this one does't work ini windows
            '--disable-gpu',
        ],

    });
    page = await browser.newPage();
    await page.goto('https://www.satriaopenai.site/');

    await page.evaluate(() => {
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        document.head.appendChild(script);
    });
    await page.waitForTimeout(2000);
    await page.click(".sys-edit-btn");
    await page.type("body > main > astro-island > div > div.my-4 > div > div:nth-child(3) > textarea", process.env.ROLE);
    await page.click("body > main > astro-island > div > div.my-4 > div > button");



    const pageTitle = await page.evaluate(() => {
        // Kode JavaScript untuk evaluasi di dalam halaman
        return document.title;
    });
    console.log(pageTitle + " ready");

})();
function generate(promb, callback) {
    (async () => {

        await page.type('.gen-textarea', promb);
        await page.keyboard.press('Enter');
        const response = await page.waitForResponse(response => response.url().includes('https://www.satriaopenai.site/api/generate'));
        // Mendapatkan data JSON dari respons
        const responseData = await response.text();
        return callback(responseData)

    })();
}



