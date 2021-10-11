## Description
This repo crwals a web page, download all the images in it, and create a html file to present the images, and their original details (url, size and format)

  
===========


Installation
--------
`npm i`

Help
----
`node index.js images-task --help`
```
Usage: index images-task [options]

download and render images by path

Options:
  -d, --destination <destination>  path to save images
  -i, --inputUrl <inputUrl>        url to fetch images from
  -h, --help                       display help for command
```

Run
-----
`node index.js images-task -i <inputUrl> -d <destination>`

Example
----
`node index.js images-task -i https://ynet.co.il -d testfolder`