let scrolling = 'none';

const compatibleBrowsers = [
    {
        name: 'Firefox',
        link: 'https://www.mozilla.org/en-US/firefox/new/'
    },
    {
        name: 'Chrome',
        link: 'https://www.google.com/chrome/'
    }
];

function get(name) {
    let url = window.location.href;
    url = url.substr(url.indexOf('?') + 1);
    url = url.substr(0, url.indexOf('#'));
    let query = url.split('&');
    //return query.find((s,u,o) => s.split('=')[0] === name).split('=')[1];
    return null;
}

function isMobile() {
    return platform.os.family.startsWith('iOS')||platform.os.family.startsWith('android');
}

function isBrowserCompatible() {
    for (var i = 0; i < compatibleBrowsers.length; i++) {
        if (compatibleBrowsers[i].name === platform.name) {
            return true;
        }
    }
    return false
}

function buildSite() {
    document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/css/desktop.css">';
    const xmlhttprequest = new XMLHttpRequest();
    xmlhttprequest.open("GET", "http://localhost/desktop.html", true);
    xmlhttprequest.send();
    xmlhttprequest.onreadystatechange = function () {
        if (xmlhttprequest.readyState === 4 && xmlhttprequest.status === 200) {
            document.body.innerHTML = xmlhttprequest.response;
            document.title = 'einsJannis.dev';
            const scrollToTop = document.createElement('img');
            scrollToTop.style.display = 'none';
            scrollToTop.id = 'scrollToTopButton';
            scrollToTop.src = '/assets/arrow-up.svg';
            scrollToTop.addEventListener('click', () => scrollUp());
            document.body.appendChild(scrollToTop);
            const mainScript = document.createElement('script');
            mainScript.src = '/js/main.js';
            mainScript.type = 'application/javascript';
            document.head.appendChild(mainScript);
            var lastScrollTop;
            document.getElementById('main').addEventListener("scroll", function () {
                if (lastScrollTop === undefined) {
                    lastScrollTop = document.getElementById('main').scrollTop;
                }
                if (document.getElementById('main').scrollTop < document.getElementById('about-me').offsetTop-1) {
                    if (scrolling==='none') {
                        if (lastScrollTop < document.getElementById('main').scrollTop) {
                            scrollDown();
                        } else if (lastScrollTop > document.getElementById('main').scrollTop) {
                            scrollUp();
                        }
                    }
                    document.getElementById('scrollToTopButton').style.display = 'none';
                } else {
                    document.getElementById('scrollToTopButton').style.display = 'block';
                }
                lastScrollTop = document.getElementById('main').scrollTop;
            });
            fetch('http://localhost/g-captcha/public.key')
                .then(response => response.text())
                .then((data) => {
                    document.getElementsByClassName('g-recaptcha').item(0).setAttribute('data-sitekey', data)
                });
            const recaptchaApi = document.createElement("script");
            recaptchaApi.async = true;
            recaptchaApi.defer = true;
            recaptchaApi.src = "https://www.google.com/recaptcha/api.js";
            document.head.appendChild(recaptchaApi);
            const error = get('error');
            if (error != null) {
                console.error('ERROR: An error accrued (error: ' + error + ')');
                const errorMessage = document.createElement('p');
                errorMessage.style.color = 'red';
                if (error === 'recaptcha_failed') {
                    errorMessage.innerText = 'The recaptcha has failed! Please retry';
                    document.getElementById('g-recaptcha-container').insertBefore(errorMessage, document.getElementsByClassName('g-recaptcha').item(0));
                } else {
                    errorMessage.innerText = 'Ooopps something went wrong :(';
                    console.log('ERROR: ' + error);
                    document.getElementsByClassName('g-recaptcha').item(0).insertBefore(errorMessage, null);
                }
            }
            const scrollTo = get('scrollTo');
            if (scrollTo != null) {
                console.log(scrollTo);
                goto('#' + scrollTo);
            }
        }
    };
}

function loadSite() {
    document.title = 'Loading site...';
    document.body.innerHTML = '<h1>Website is loading...</h1>';
    if (isMobile()) {
        console.error('ERROR: Device is incompatible (Site is not guaranteed to work on this device. Force load site with \'buildSite();\'.)');
        document.body.innerHTML = '<h1>Incompatible device</h1><p>Please use a PC to access this site</p>';
        document.title = 'Incompatible device';
        return;
    }
    if (!isBrowserCompatible()) {
        console.error('ERROR: Browser is incompatible (Site is not guaranteed to work in this browser. Force load site with \'buildSite();\'.)');
        var newDoc = '<h1>Incompatible browser</h1><p>Your browser: ' + platform.name + '</p><p>Compatible browsers:</p><ul>';
        compatibleBrowsers.forEach(compatibleBrowser => newDoc += '<li><a href="' + compatibleBrowser.link + '">' + compatibleBrowser.name + '</a></li>');
        newDoc += '</ul>';
        document.body.innerHTML = newDoc;
        document.title = 'Incompatible browser';
        return;
    }
    buildSite();
}
