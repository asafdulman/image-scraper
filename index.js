const fs = require("fs");
const ora = require('ora');
const program = require('commander');
const open = require('open');
const { getImages, formatImageToHtml, renderImageRow, saveImageToLocalDisk, buildHtml } = require("./utils");

program
    .command('images-task')
    .description('Download and render images by path')
    .option('-d, --destination <destination>', 'path to save images')
    .option('-i, --inputUrl <inputUrl>', 'url to fetch images from')
    .action(async (source) => {
        if (!source.destination) {
            throw new Error('Must provide destination');
        }
        if (!source.inputUrl) {
            throw new Error('Must provide inputUrl');
        }

        const { inputUrl, destination } = source;

        if (inputUrl && destination) {
            fs.mkdirSync(destination);
            const spinner = ora(`Loading... (fetching images from ${inputUrl})`);
            spinner.start();
            const imagesArr = await getImages(inputUrl);
            spinner.text = `Loading... (saving images to ${destination})`;
            const errors = [];
            await Promise.all(imagesArr.map(async (image, index) => {
                if (image) {
                    const validUrl = image.substring(0, 4);
                    if (image && validUrl === 'http') {
                        try {
                            await saveImageToLocalDisk(image, `./${destination}/image-${index}.png`);
                        } catch (err) {
                            errors.push(image)
                        }
                    }
                }
            }));

            if (errors.length) console.log(`\nfailed fetching images: ${errors}`)
            spinner.stop();

            const formattedImages = imagesArr.map((image, index) => {
                return formatImageToHtml(image, index, destination)
            })

            fs.appendFile(`./${destination}/index.html`, buildHtml(renderImageRow(formattedImages, inputUrl)), function (err) {
                if (err) throw err;
                console.log('Saved!');
                console.log(`open ./${destination}/index.html in browser for results!`);
                open(`./${destination}/index.html`)
            })
        }
    });

program.parse(process.argv);