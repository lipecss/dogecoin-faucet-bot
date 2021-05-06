require('dotenv').config()

const select = require ('puppeteer-select')
const puppeteer = require('puppeteer')

const {
  autoScroll,
  sleep,
  saveTimestamp,
  getTimestamp,
  dateToPrint,
  randomOffset,
  duringToPrint,
  autoWithDraw,
  millisToMinutesAndSeconds } = require('./helpers/functions')

const ONE_HOUR_MS = 3600000
const LAST_CALL_FS = 0

const chromeOptions = {
  headless: true,
  defaultViewport: null,
  args: [
    "--incognito",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--single-process",
    "--no-zygote"
  ],
};

/**
 * MAIN
 */
(async () => {
  const email = process.env.EMAIL
  const pass = process.env.PASS
  const website = process.env.WEBSITE

  console.log('🤖 ----------------- INICIANDO O BOT ----------------- 🤖')
  console.log('Usando o Email:', email)
  console.log("\n  🍀 Boa sorte amigo!\n")

  while (true) {

    const lastCall = await getTimestamp()

    if (((new Date) - lastCall) < ONE_HOUR_MS) {

      let loopError = false
      const browser = await puppeteer.launch(chromeOptions)
      const page = await browser.newPage()
      await page.setViewport({ width: 1866, height: 768})
      
      //if bot meets alert verify bot, accept it
      page.on('dialog', async dialog => {
      console.log(dialog.accept());
      console.log('\n Dialog bot verification accepted...! 😎🤖 \n')
      });

      console.log(dateToPrint() + '----------------- TENTATIVA DA ROLETA -----------------')

      try {

        await page.goto(website, { waitUntil: 'networkidle2', timeout: 0 })
        await sleep(200)

        await page.type('input[name=email]', email, {delay: 20})
        await page.type('input[name=password]', pass, {delay: 20})
        const element = await select(page).getElement('button:contains(LOGIN!)')
        await element.click()

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
        await autoScroll(page);
        const element_roll = await select(page).getElement('button:contains(ROLL!)')
        await element_roll.click()
        await sleep(2000);

        // inner HTML
        const innerText = await page.evaluate(() => document.querySelector('.navbar-coins').innerText)
        const cleaninnerText = (innerText.substr(0,10));
        const cleantoken = (innerText.substr(11)).trim();
        console.log('Balance 🏛️ ->', innerText);
        const minwallet = process.env.MINWALLET
        console.log("   👍 PARABÉNS! Moeda reivindicada!\n\n")

        // automatically withdraw  
        millisToMinutesAndSeconds(cleaninnerText, minwallet)
                           
      } catch(e) {
        console.log('Erro encontrado em: ', website)
        console.error("Error: " + e.message)
        console.log("  👎 FALHA. Moeda não reivindicada. ❌\n\n")
        loopError = true
      }

      let pages = await browser.pages()
      await Promise.all(pages.map(page =>page.close()))
      await browser.close()

      if (loopError) {
        console.log(`### Ocorreu um erro, tentando novamente em ${millisToMinutesAndSeconds(ONE_HOUR_MS)} ###`)
        await sleep(360000)
      } else {
        console.log('🏆 Todas as moedas foram coletadas com sucesso!')
        console.log(`${dateToPrint()} Indo mimir\n Te vejo depois 💤`)

        // await saveTimestamp(Date.now().toString())
        await saveTimestamp(Date.now())

        await sleep(ONE_HOUR_MS + randomOffset())
        console.log('----------------- HORA DE LEVENTAR -----------------')
      }
    } else {
      await sleep(36000)
    }

  }
})()

