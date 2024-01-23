// console.clear = () => console.log('Console was cleared')

let counter = 0;
const MAX_ATTEMPTS = 2000; // Approximately 10 seconds at 5 ms intervals
console.log('Lets start searching for CaptchaScript...');

const i = setInterval(() => {
    console.log(`Попытка ${counter}: Checking for CaptchaScript...`);

    if (window.CaptchaScript || counter > MAX_ATTEMPTS) {
        clearInterval(i);
        if (!window.CaptchaScript) {
            console.log('CaptchaScript not found');
        } else {
            console.log('CaptchaScript found');

            let params = gokuProps;
            Array.from(document.querySelectorAll('script')).forEach(s => {
                const src = s.getAttribute('src');
                if (src && src.includes('captcha.js')) params.captcha_script = src;
                if (src && src.includes('challenge.js')) params.challenge_script = src;
            });

            console.log('intercepted-params: ' + JSON.stringify(params));
        }
    }
    counter++;
}, 5);
