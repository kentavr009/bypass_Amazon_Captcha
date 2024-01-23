// index.js
import 'dotenv/config';
import { launch } from 'puppeteer'
import Captcha from '2captcha-ts';
import { readFileSync } from 'fs'

// Checking for APIKEY in .env
if (!process.env.APIKEY) {
    console.error("APIKEY is not defined in .env file");
    process.exit(1); // Terminate execution if key not found
}

const solver = new Captcha.Solver(process.env.APIKEY);

const target = 'URL where CAPTCHA occurs'

const example = async () => {
    const browser = await launch({
        headless: false,
        devtools: true
    })

    const [page] = await browser.pages()

    const preloadFile = readFileSync('./inject.js', 'utf8')
    await page.evaluateOnNewDocument(preloadFile)

    // Here we intercept the console messages to catch the message logged by inject.js script
    page.on('console', async (msg) => {
        const txt = msg.text()
        if (txt.includes('intercepted-params:')) {
            const params = JSON.parse(txt.replace('intercepted-params:', ''))

            const wafParams = {
                pageurl: target,
                sitekey: params.key,
                iv: params.iv,
                context: params.context,
                challenge_script: params.challenge_script,
                captcha_script: params.captcha_script
            }
            console.log(wafParams)

            try {
                console.log('Solving the captcha...')
                const res = await solver.amazonWaf(wafParams)
                console.log(`Solved the captcha ${res.id}`)
                console.log(res)
                console.log('Using the token...')
                await page.evaluate(async (token) => {
                    await ChallengeScript.submitCaptcha(token);
                    window.location.reload ()
                }, res.data.captcha_voucher);
            } catch (e) {
                console.log(e)
            }
        } else {
            return
        }
    })

    await page.goto(target)
    // Additional code to interact with the page after captcha is solved might be here...
}

example()
