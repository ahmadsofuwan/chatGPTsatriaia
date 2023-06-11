const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

var browser
var page
app.listen(9090, () => {
    console.log('GPT berjalan di port 9090');
});
app.get('/', (req, res) => {
    const promb = req.query.promb;
    generate(promb, function (result) {
        res.send(result);
    })
});
(async () => {
    browser = await puppeteer.launch({
        // executablePath:chromium.path,
        userDataDir: './my-user-data',
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-suid-sanbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--single-process',//this one does't work ini windows
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



