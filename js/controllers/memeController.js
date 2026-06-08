'use strict'

var gImgs = [
    { id: 1, url: 'images/meme-imgs-various-ratios/2.jpg', keywords: ['funny'] },
    { id: 2, url: 'images/meme-imgs-various-ratios/003.jpg', keywords: ['funny', 'trump'] }
]
var gElMemeCanvas
var gMemeCtx

function onInit() {
    gElMemeCanvas = document.querySelector('canvas')
    gMemeCtx = gElMemeCanvas.getContext('2d')

    addEventListeners()
    renderMeme()
}

function addEventListeners() {
    document.querySelector('.line-editor').addEventListener('change', (e) => {
        setLineTxt(e.target.value)
        renderMeme()
    })
}

function renderMeme() {
    const meme = getMeme()

    const img = new Image()
    console.log(img)
    img.onload = () => {
        renderImg(img)
        renderLines(meme)
    }
    img.src = gImgs.find(img => img.id === meme.selectedImgId).url

}

function renderImg(img) {
    gElMemeCanvas.height = (img.naturalHeight / img.naturalWidth) * gElMemeCanvas.width
    gMemeCtx.drawImage(img, 0, 0, gElMemeCanvas.width, gElMemeCanvas.height)
}

function renderLines() {
    const { lines } = getMeme()

    lines.forEach(line => {
        console.log(line.txt)
        gMemeCtx.font = `${line.size} serif`;
        gMemeCtx.fillStyle = line.color;
        gMemeCtx.fillText(line.txt, 10, 10)
    });

}



