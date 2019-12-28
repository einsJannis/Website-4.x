let isImprintOpen;

function openImprint() {
    isImprintOpen = true;
    document.head.innerHTML += '<link id="imprint-stylesheet" rel="stylesheet" type="text/css" href="/css/imprint.css">';
    const xmlhttprequest = new XMLHttpRequest();
    xmlhttprequest.open("GET", "http://localhost/imprint.html", true);
    xmlhttprequest.send();
    xmlhttprequest.onreadystatechange = function () {
        if (xmlhttprequest.readyState === 4 && xmlhttprequest.status === 200) {
            var overlay = document.createElement('div');
            overlay.setAttribute('id', 'imprint-overlay');
            overlay.addEventListener('click', function () {
                closeImprint();
            });
            var container = document.createElement('div');
            container.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            container.setAttribute('id', 'imprint-container');
            var title = document.createElement('h1');
            title.innerText = 'Imprint';
            container.appendChild(title);
            var closeIcon = document.createElement('img');
            closeIcon.setAttribute('src', '/assets/cross.svg');
            closeIcon.setAttribute('alt', 'closeButton');
            closeIcon.setAttribute('id', 'closeButton');
            closeIcon.setAttribute('onclick', 'closeImprint();');
            container.appendChild(closeIcon);
            container.innerHTML += xmlhttprequest.response;
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            document.title = 'Imprint & Privacy';
        }
    };
}

function closeImprint() {
    if (isImprintOpen) {
        isImprintOpen = false;
        document.title = 'einsJannis.dev';
        document.body.removeChild(document.getElementById('imprint-overlay'));
        document.head.removeChild(document.getElementById('imprint-stylesheet'));
    }
}

function goto(url) {
    if (url.startsWith('#')) {
        url = url.substr(1);
        if (scrolling!==url) {
            scrolling = url;
            document.getElementById(url).scrollIntoView({behavior: 'smooth'});
            setTimeout(function () {
                scrolling = 'none';
            }, 700);
        }
    } else {
        document.location = url;
    }
}

function scrollDown() {
    if (scrolling!=='down') {
        document.getElementById('down').scrollIntoView({behavior: 'smooth'});
        scrolling = 'down';
        setTimeout(function () {
            scrolling = 'none';
        }, 800);
    }
}

function scrollUp() {
    if (scrolling!=='up') {
        document.getElementById('top').scrollIntoView({behavior: 'smooth'});
        scrolling = 'up';
        setTimeout(function () {
            scrolling = 'none';
        }, 1100);
    }
}
