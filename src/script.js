//*================== Variables ==================*//


const vakitlerArray = ["İmsak", "Güneş", "Öğle", "İkindi", "Akşam", "Yatsı"];
let clockInterval;
const params = new URL(location.href).searchParams;


//*================== Variables ==================*//



//*============= Functions & Classes =============*//


class htmlHelper {
    constructor() {
        return new Proxy(this, {
                get: (target, prop) => {
                    return document.getElementById(prop) || target[prop];
                }
        });
    }
}
const html = new htmlHelper();



function kalanZaman(hedefSaati) {
    const simdikiZaman = new Date();
    const hedefZaman = new Date();
    const saatDilimi = hedefSaati.split(":");
    hedefZaman.setHours(parseInt(saatDilimi[0]));
    hedefZaman.setMinutes(parseInt(saatDilimi[1]));
    hedefZaman.setSeconds(0);
    let kalanZaman = hedefZaman - simdikiZaman;
    if (kalanZaman < 0) {
        kalanZaman += 24 * 60 * 60 * 1000;
    }
    const kalanSaat = Math.floor(kalanZaman / (60 * 60 * 1000));
    const kalanDakika = Math.floor((kalanZaman % (60 * 60 * 1000)) / (60 * 1000));
    const kalanSaniye = Math.floor((kalanZaman % (60 * 1000)) / 1000);
    // const kalanSalise = Math.floor((kalanZaman % 1000) / 10);
    return [kalanSaat, kalanDakika, kalanSaniye];//, kalanSalise
}


function longDate(tarih) {
    const [year, moon, day] = tarih.split("-").map(Number);
    const dateObject = new Date(year, moon - 1, day);

    const longDate = new Intl.DateTimeFormat('tr-tr', {
        dateStyle: 'full',
    }).format(dateObject);

    return longDate;
}

function editDate() {
    html.date.innerHTML = longDate(html.date.innerHTML).replace(/\s[0-9]{4}/, "");
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getVal(e) {
    return e.options[e.selectedIndex].text;
}

function sonrakiVaktiBul(vakitler) {
    let enKucuk = Infinity;
    let enSon = 0;
    for (let i = 0; i < vakitler.length; i++) {
        const vakit = vakitler[i];
        const kalan = kalanZaman(vakit);
        if (kalan[0] < enKucuk) {
            enKucuk = kalan[0];
            enSon = i;
        }
    }
    return enSon;
}

function sistemSaati() {
    const date = new Date();
    return date.toLocaleTimeString([], { hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function applySettings() {
    if (params.get("il")) {
        html.city.value = Number(params.get("il"));
    } else {
        html.city.value = 1;
    }

    if (params.get("theme")) {
        html.themeSelect.value = params.get("theme");
        html.themeLink.href = `./styles/${html.themeSelect.value}.css`;
    }

    if (params.get("zoom")) {
        html.zoom.value = Number(params.get("zoom"));
        document.querySelector("html").style.zoom = html.zoom.value;
        html.zoomVal.innerHTML = html.zoom.value;
    } else {
        html.zoom.value = 1;
        document.querySelector("html").style.zoom = html.zoom.value;
    }

    if (params.get("lowAnims")) {
        if (params.get("lowAnims") == "false") {
            html.lowAnims.checked = false;
            html.anims.href = "./styles/animations.css";
        } else {
            html.lowAnims.checked = true;
            html.anims.href = "";
        }
    } else {
        html.lowAnims.checked = false;
        html.anims.href = "./styles/animations.css";
    }
}


async function editContent() {
    if (clockInterval) clearInterval(clockInterval);


    let sehir = capitalizeFirstLetter(getVal(html.city));


    const res = await fetch(`https://vakit.vercel.app/api/timesFromPlace?country=Turkey&region=${sehir}&city=${sehir}&timezoneOffset=180`);
    const data = await res.json();
    // const data = {"place":{"country":"Turkey","countryCode":"TR","city":"Adana","region":"Adana","latitude":37.001902,"longitude":35.328827},"times":{"2024-05-24":["03:38","05:17","12:41","16:31","19:54","21:27"]}}


    const vakitler = data.times[Object.keys(data.times)[0]];
    const [imsak, gunes, ogle, ikindi, aksam, yatsi] = vakitler;
    const sonrakiVakitI = sonrakiVaktiBul(vakitler);
    const sonrakiVakit = vakitlerArray[sonrakiVakitI];

    html.imsak.innerHTML = imsak;
    html.gunes.innerHTML = gunes;
    html.ogle.innerHTML = ogle;
    html.ikindi.innerHTML = ikindi;
    html.aksam.innerHTML = aksam;
    html.yatsi.innerHTML = yatsi;

    html.cityName.innerHTML = sehir;

    date.innerHTML = Object.keys(data.times)[0];

    html.sonrakiVakit.innerHTML = sonrakiVakit;

    const [kalanSaat, kalanDk, kalanSn] = kalanZaman(vakitler[sonrakiVakitI]);
    html.sonrakineKalan.innerHTML = `${"0".repeat(2-kalanSaat.toString().length)}${kalanSaat}:${"0".repeat(2-kalanDk.toString().length)+kalanDk}:${"0".repeat(2-kalanSn.toString().length)+kalanSn}`;
    html.time.innerHTML = sistemSaati();

    clockInterval = setInterval(()=>{
        const [kalanSaat, kalanDk, kalanSn] = kalanZaman(vakitler[sonrakiVakitI]);
        html.sonrakineKalan.innerHTML = `${"0".repeat(2-kalanSaat.toString().length)}${kalanSaat}:${"0".repeat(2-kalanDk.toString().length)+kalanDk}:${"0".repeat(2-kalanSn.toString().length)+kalanSn}`;
        html.time.innerHTML = sistemSaati();
    },1000);

    editDate();

}


async function loadAboutContent() {
    const res = await fetch("./about.html");
    const content = await res.text();
    html.about.outerHTML = content;
}


function writeSettingsToURL() {
    let search = "?";
    search += `il=${html.city.value}&`;
    search += `theme=${html.themeSelect.value}&`;
    search += `zoom=${html.zoom.value}&`;
    search += `lowAnims=${html.lowAnims.checked.toString()}`;
    history.pushState({}, "", search);
    location.search = search;
}


//*============= Functions & Classes =============*//



//*================ Main Function ================*//


async function main() {
    await loadAboutContent();
    applySettings();
    await editContent();

    html.body.style.display = "flex";
}


//*================ Main Function ================*//



//*=============== Event Listeners ===============*//


document.addEventListener("DOMContentLoaded", main);

/* html.city.addEventListener("change", ()=>{
    editContent();
});

html.themeSelect.addEventListener("change", ()=>{
    html.themeLink.href = `./styles/${html.themeSelect.value}.css`;
}); */

html.zoom.addEventListener("change", ()=>{
    document.querySelector("html").style.zoom = html.zoom.value;
});

html.zoom.addEventListener("input", ()=>{
    html.zoomVal.innerHTML = html.zoom.value;
});

/* html.lowAnims.addEventListener("change", ()=>{
    if (html.lowAnims.checked) {
        html.anims.href = "";
    } else {
        html.anims.href = "./styles/animations.css";
    }
}); */


/* Settings apply */

html.applyBtn.addEventListener("click", ()=>{
    writeSettingsToURL();
});

/* Settings apply */


/* Settings and About Div */

html.settingsBtn.addEventListener("click", ()=>{
    html.settings.style.display = html.settings.style.display == "block" ? "none" : "block";
});

html.aboutBtn.addEventListener("click", ()=>{
    html.aboutContent.style.display = html.aboutContent.style.display == "block" ? "none" : "block";
});

/* Settings and About Containers */


//*=============== Event Listeners ===============*//