## About This Project

This script is developed to automate to automate the rolls and collect the free DOGE on [dogefaucet.com](http://dogefaucet.com "dogefaucet.com") in your account.

This was a project developed for personal use and better left ran unattended. You can run this on your computer or server, wherever you choose to run it.

#### The current coins thats claimed is: DOGE

Please feel free to use, modify or improve this project!

## Environment Variables

```
EMAIL
PASS
WEBSITE
MINWALLET
```

- EMAIL: Your Email Here
- PASS: Your Password Here
- WEBSITE: https://free-doge.com/set-language/en
- MINWALLET: 40 (min value to withdraw)

## Getting Started

In order to run the script, you will require Node.js to be pre-installed first. The script uses a combination of Node.js, Puppeteer and Chromium.

To use this project you must have installed all dependencies on your machine. In the root directory type:

`yarn install`

## Scripts

- dev: Run the project locally with Nodemon.
- start: Run project in production.

## Production

if you want to place this project on your server, such as Heroku, you will need to make some configurations;

First of all be sure that your code contains in **chromeOptions** to puppeteer.launch bacause Heroku doesn't have a GUI to show you chrome when running and Heroku will throw an error:

```
headless: true,
defaultViewport: null,
args: [
  "--incognito",
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--single-process",
   "--no-zygote"
],
```

After that you will need add puppeteer-heroku-buildpack and the heroku/nodejs. using Heroku CLI runt this command:

 `heroku buildpacks:add jontewks/puppeteer`

 or manually add directly to the platform this source code:

 `heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack.git`

 Finally, deploy it back to Heroku:

 ```
git add .
git commit -m "Batman has no parents"
git push heroku master
```
