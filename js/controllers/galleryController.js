'use strict'
var gImgs = [
    { id: 1, url: 'images/meme-imgs-various-ratios/2.jpg', keywords: ['funny'] },
    { id: 2, url: 'images/meme-imgs-various-ratios/003.jpg', keywords: ['funny', 'trump'] },
    { id: 3, url: 'images/meme-imgs-various-ratios/5.jpg', keywords: ['funny', 'baby'] }
]

function onInit() {
    gElMemeCanvas = document.querySelector('canvas')
    gMemeCtx = gElMemeCanvas.getContext('2d')

    renderGallery()
    addEventListeners()
}

function addEventListeners() {
    document.querySelector('.line-editor').addEventListener('change', (e) => {
        setLineTxt(e.target.value)
        renderMeme()
    })


}
function renderGallery() {
    const elGallery = document.querySelector('.gallery')

    elGallery.innerHTML = gImgs.map(img => {
        return `
        <img class="gallery-img" src="${img.url}" alt="" onclick="onImgSelect(${img.id})">
        `
    }).join('')
}

function onImgSelect(imgId) {
    setImg(imgId)
    showEditor()
}

function showEditor() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
    renderMeme()
}