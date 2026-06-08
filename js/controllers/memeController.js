'use strict'

var gImgs = [
    { id: 1, url: '/images/meme-imgs (various aspect ratios)/2.jpg', keywords: ['funny'] },
    { id: 2, url: 'images/meme-imgs (various aspect ratios)/003.jpg', keywords: ['funny', 'trump'] }
]
var gElMemeCanvas
var gMemeCtx

function onInit() {
    renderMeme()
}
function renderMeme() {
    gElMemeCanvas = document.querySelector('canvas')
    gMemeCtx = gElMemeCanvas.getContext('2d')

    const img = new Image()
    console.log(img)
    img.onload = () => renderImg(img)
    img.src = gImgs[0].url

}

function renderImg(img) {
    gElMemeCanvas.height = (img.naturalHeight / img.naturalWidth) * gElMemeCanvas.width
    gMemeCtx.drawImage(img, 0, 0, gElMemeCanvas.width, gElMemeCanvas.height)

    gMemeCtx.fillText("Hello world", 10, 50);
}

