const fs = require("fs");
const axios = require("axios")
const cheerio = require("cheerio")
var sizeOfImage = require('image-size');
const fetch = require('node-fetch');

module.exports = {
    buildHtml,
    formatImageToHtml,
    renderImageRow,
    getImages,
    saveImageToLocalDisk
}

async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return cheerio.load(data)
}

async function getImages(inputUrl) {
    const results = []
    try {
        const $ = await fetchHTML(inputUrl);
        $('img').each((index, image) => {
            const imageSrc = $(image).attr('src')
            if (imageSrc && imageSrc.substring(0, 4) === 'http') {
                results.push(imageSrc)
            }
        })
        return results
    } catch (e) {
        console.error(e);
        console.log('there is an error here');
        process.exit(1);
    }
}

function buildHtml(imagesContainer) {
    return `
    <!DOCTYPE html><html><head>
    <link rel="stylesheet" href="../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
    </head>
    <body>
    <div class="main-container">
    <h1>Scrape the Web</h1>
        ${imagesContainer}
    </div>
    </body></html>
    `;
};

function formatImageToHtml(imageUrl, index, destination) {
    if (!fs.existsSync(`./${destination}/image-${index}.png`)) return;
    const imageWidth = sizeOfImage(`./${destination}/image-${index}.png`).width
    const imageHeight = sizeOfImage(`./${destination}/image-${index}.png`).height
    const imageFormat = imageUrl.substring(imageUrl.length - 3)
    return `
    <div class="row">
        <div class=image-container">
            <img src="${imageUrl}" />
        </div>
        <div class="details-container">
            <p>${imageUrl}</p>
            <p>Original Width - ${imageWidth}px</p>
            <p>Original Height - ${imageHeight}px</p>
            <p>Format - ${imageFormat}</p>
        </div>
    </div>
    `
}

function renderImageRow(formattedImages, inputUrl) {
    let strHTML = `<h3> Images from ${inputUrl}</h3> <div class="images-container">`;
    formattedImages.forEach(row => {
        strHTML += row
    })
    strHTML += `</div>`
    return strHTML
}

async function saveImageToLocalDisk(imageUrl, path) {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    fs.writeFileSync(path, buffer, () =>
        console.log('finished downloading!')
    );
}


