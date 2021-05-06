exports.autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0
      const distance = 50
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports.saveTimestamp = (date) => {
  try {
    LAST_CALL_FS = date
  } catch (e) {
    console.error('Writing Timestamp error', e)
  }
}

exports.getTimestamp = async () => {
  try {
    return new Date().getTime()
  } catch (e) {
    return 0
  }
}

exports.dateToPrint = () => {
  const now = new Date();
  return '[' + now.getHours() + 'h' + ( (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() ) + '] '
}

exports.randomOffset = () => {
  const start = 1000  // 1 second
  const end =  300000  // 5 minutes
  return Math.floor(Math.random() * (end - start + 1) + start)
}

exports.duringToPrint = (timeInMs, offsetInMs = 0) => {
  const timeDate = new Date(timeInMs + offsetInMs)
  let offsetMsg = ''
  if (offsetInMs > 0) {
    const offsetDate = new Date(offsetInMs)
    offsetMsg = '[including offset=' + (offsetDate.getMinutes() > 0 ? offsetDate.getMinutes() + 'm ' : '') +
        offsetDate.getSeconds() + 's]'
  }
  return (timeDate.getMinutes() > 0 ? timeDate.getMinutes() + ' min ' : '') + timeDate.getSeconds() + ' seconds ' + offsetMsg
}

exports.millisToMinutesAndSeconds = (millis) => {
  var milliseconds = Math.floor((millis % 1000) / 100),
    seconds = Math.floor((millis / 1000) % 60),
    minutes = Math.floor((millis / (1000 * 60)) % 60),
    hours = Math.floor((millis / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

exports.autoWithDraw = async (currentBalance, minwallet) => {
  if (currentBalance >= minwallet) {
    console.log('chegou a hora de retirar..!')
    //open popup withdraw
    const popup = await select(page).getElement('button:contains(Withdraw)')
    await popup.click()
    const minimum = await page.evaluate(() => document.querySelector('.header.bg-3').innerText)
    const cleanminimum = (minimum.substr(15,10)).trim();
    const amount = await select(page).getElement('label:contains((Withdraw All))')
    await amount.click()
    await sleep(500)
    await page.type('input[type="text"][class="form-control wallet-address"]', wallet, {delay : 20})
    await sleep(500)
    await page.evaluate(() => {
    [...document.querySelectorAll('.main-button-2.main-button-blue.withdraw-now.bg-3')].find(element => element.textContent === 'Withdraw').click();
    });
    await sleep(3000)
  }   
}
