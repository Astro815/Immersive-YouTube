const $ = (e) => { return document.querySelector(e); };
const $$ = (e) => { return document.querySelectorAll(e); };

// Canva
let cv = document.createElement("canvas");
cv.width = cv.height = 9;
let ctx = cv.getContext("2d", { willReadFrequently: true });

// Audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let mediaSource;

let style;

// rootEfx - Um <style> atualizado a cada tick da tela, definindo as cores e alterações na pagina.
let rootEfx = document.createElement("style");
rootEfx.id = "rootEfx";
let stel = document.createElement("style");
stel.id = "poseffects";

// Create GLOW Canva 
let cvGlow = document.createElement("canvas");
cvGlow.id = "astry-cvglow";
let glowctx = cvGlow.getContext("2d", { willReadFrequently: true, imageSmoothingQuality: "low" });

// Create Canva
const bkCanva = document.createElement("canvas");
bkCanva.id = "astry-bkCanva";
let bkctx = bkCanva.getContext("2d", { willReadFrequently: true, imageSmoothingQuality: "low" });

let AUDIO = {
    history: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    deltaR: 0,
    dt: 0
};

let COLOR = [255, 0, 0];
let BRILHO = 0;

function updateBkCanva(vid) {
    let reduce = 20;

    bkCanva.width = Math.round(window.innerWidth / reduce);
    bkCanva.height = Math.round(window.innerHeight / reduce);

    let infVid = vid.getBoundingClientRect();

    let wd = (infVid.right - infVid.x) / reduce;
    let hg = (infVid.bottom - infVid.y) / reduce;
    let px = infVid.x / reduce;
    let py = infVid.y / reduce;

    bkctx.drawImage(vid, px - 1, py - 1, wd + 3, hg + 3);
}

function drawGlow(vid) {
    if ($("#astry-cvglow") == null) {
        $("ytd-app").insertBefore(cvGlow, $("ytd-app").firstChild);
    }

    let reduce = 20;
    cvGlow.width = Math.round(window.innerWidth / reduce);
    cvGlow.height = Math.round(window.innerHeight / reduce);

    let infVid = vid.getBoundingClientRect();
    let wd = (infVid.right - infVid.x) / reduce;
    let hg = (infVid.bottom - infVid.y) / reduce;
    let px = infVid.x / reduce;
    let py = infVid.y / reduce;

    glowctx.drawImage(vid, px, py, wd, hg);
}

class STYLE {
    constructor() { }
    setStyle() {
        style = `
        #logo-icon > yt-icon-shape > icon-shape > div > svg > svg > g:nth-child(1) > path:nth-child(1),
        #logo-icon > yt-icon-shape > icon-shape > div > svg > svg > g > g > path,
        #icon > yt-icon-shape > icon-shape > div > svg > g > path,
        #segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-animated-icon > ytd-lottie-player > lottie-component > svg > g > g:nth-child(2)>*>*{
            color: var(--astColor) !important;
            fill: var(--astColor) !important;
            stroke: var(--astColor) !important;
        }

        ytd-app,
        .header.ytd-playlist-panel-renderer{
            background: rgb(calc(10 + (var(--astc0) / 255) * 20) calc(10 + (var(--astc1) / 255) * 20) calc(10 + (var(--astc2) / 255) * 20) );
        }

        h1.ytd-watch-metadata{
            color: rgb(calc(120 + (var(--astc0) / 255) * 135 ) calc(120 + (var(--astc1) / 255) * 135 ) calc(120 + (var(--astc2) / 255) * 135 ));
        }

        #search-icon-legacy.ytd-searchbox,
        #container.ytd-searchbox{
            border-color: var(--astColor);
        }

        .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
        .playlist-items.ytd-playlist-panel-renderer{
            background-color: rgb(var(--astc0) var(--astc1) var(--astc2) / 10%);
        }

        .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline,
        ytd-playlist-panel-video-renderer[selected][use-color-palette]{
            border-color: rgb(var(--astc0) var(--astc1) var(--astc2) / 20%);
        }

        ytd-watch-metadata{
            color: rgb(calc(120 + (var(--astc0) / 255) * 135) calc(120 + (var(--astc1) / 255) * 135) calc(120 + (var(--astc2) / 255) * 135));
        }

        #progress.ytd-thumbnail-overlay-resume-playback-renderer,
        .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
        .ytp-swatch-background-color{
            background-color: var(--astColor) !important;
        }

        ytd-exploratory-results-renderer.ytd-item-section-renderer, ytd-horizontal-card-list-renderer.ytd-item-section-renderer:not(:first-child), ytd-reel-shelf-renderer.ytd-item-section-renderer, ytd-shelf-renderer.ytd-item-section-renderer{
            border-top-color: var(--astColor);
            border-bottom-color: var(--astColor);
        }

        #thumbnail.ytd-thumbnail > yt-image > img{
            filter: saturate(var(--astbrilho)) !important;
        }

        `;

        $("#poseffects").innerHTML = style;
    }
    resetStyle() {
        $("#poseffects").innerHTML = "";
    }
    updateRoot() {
        $("#rootEfx").innerHTML = `
        *{
            --astColor: rgb(${COLOR});
            --astc0: ${COLOR[0]};
            --astc1: ${COLOR[1]};
            --astc2: ${COLOR[2]};
            --astbrilho: ${(0.5 + (BRILHO/3000))*100}%;
        }
        `;
    }
    resetRoot() {
        $("#rootEfx").innerHTML = ``;
    }
}

function getMedianColor(canvas) {
    const colors = [128, 128, 128];
    const width = canvas.width;
    const height = canvas.height;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let color = ctx.getImageData(i, j, 1, 1).data;
            colors.push(color);
        }
    }
    colors.sort((a, b) => a - b);
    return colors[Math.floor(colors.length / 2)];
}

function updateBrilho(analyser) {
    // Calculate AUDIO
    let actFREQ = 1;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < frequencyData.length; i++) {
        actFREQ += frequencyData[i];
    }

    // Set  History
    AUDIO.history.push(actFREQ);
    delete AUDIO.history[0];
    AUDIO.history = (AUDIO.history.filter((a)=>{return a}));

    // Define Delta
    AUDIO.deltaR = AUDIO.history[15] - AUDIO.history[0];

    // Set Delta Smooth value
    AUDIO.dt = AUDIO.dt + ((AUDIO.deltaR - AUDIO.dt)*1);
    BRILHO = AUDIO.dt;
}

function tick(video, analyser) {
    if (video.paused) return;

    updateBrilho(analyser);

    // Definir a cor média
    ctx.filter = "brightness(2) saturate(3)";
    ctx.drawImage(video, 0, 0, 16, 9);
    let c = getMedianColor(cv);
    COLOR = c;
    new STYLE().updateRoot();
}

window.onload = () => {
    let video = $("#movie_player > div.html5-video-container > video");

    // Start Analize Audio
    mediaSource = audioContext.createMediaElementSource(video);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.minDecibels = -90;
    mediaSource.connect(analyser);
    analyser.connect(audioContext.destination);

    $("head").appendChild(stel);
    $("head").appendChild(rootEfx);

    // Run Colors Video
    setInterval(() => {
        tick(video, analyser);
    });

    // Run Glow Video
    setInterval(() => {
        drawGlow(video);
    });

    video.onplay = video.onpause = (e) => {
        if (e.type == "pause") { new STYLE().resetStyle() } else { new STYLE().setStyle(); };
    }
};