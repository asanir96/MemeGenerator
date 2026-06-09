'use strict'
var gImgs = [
    { id: 1, url: 'images/meme-imgs-various-ratios/2.jpg', keywords: ['funny'] },
    { id: 2, url: 'images/meme-imgs-various-ratios/003.jpg', keywords: ['funny', 'trump'] },
    { id: 3, url: 'images/meme-imgs-various-ratios/004.jpg', keywords: ['funny', 'dog'] },
    { id: 4, url: 'images/meme-imgs-various-ratios/5.jpg', keywords: ['funny', 'baby'] },
    { id: 5, url: 'images/meme-imgs-various-ratios/005.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'images/meme-imgs-various-ratios/006.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'images/meme-imgs-various-ratios/8.jpg', keywords: ['funny', 'willy wonka'] },
    { id: 8, url: 'images/meme-imgs-various-ratios/9.jpg', keywords: ['funny', 'baby'] },
    { id: 9, url: 'images/meme-imgs-various-ratios/12.jpg', keywords: ['funny'] },
    { id: 10, url: 'images/meme-imgs-various-ratios/19.jpg', keywords: ['funny'] },
    { id: 11, url: 'images/meme-imgs-various-ratios/Ancient-Aliens.jpg', keywords: ['funny', 'aliens'] },
    { id: 12, url: 'images/meme-imgs-various-ratios/drevil.jpg', keywords: ['funny', 'austin powers'] },
    { id: 13, url: 'images/meme-imgs-various-ratios/img2.jpg', keywords: ['funny'] },
    { id: 14, url: 'images/meme-imgs-various-ratios/img4.jpg', keywords: ['funny', 'trump'] },
    { id: 15, url: 'images/meme-imgs-various-ratios/img5.jpg', keywords: ['funny'] },
    { id: 16, url: 'images/meme-imgs-various-ratios/img6.jpg', keywords: ['funny', 'dog'] },
    { id: 17, url: 'images/meme-imgs-various-ratios/img11.jpg', keywords: ['funny', 'obama'] },
    { id: 18, url: 'images/meme-imgs-various-ratios/img12.jpg', keywords: ['funny'] },
    { id: 19, url: 'images/meme-imgs-various-ratios/leo.jpg', keywords: ['funny', 'leonardo dicaprio'] },
    { id: 20, url: 'images/meme-imgs-various-ratios/meme1.jpg', keywords: ['funny'] },
    { id: 21, url: 'images/meme-imgs-various-ratios/One-Does-Not-Simply.jpg', keywords: ['funny', 'lord of the rings'] },
    { id: 22, url: 'images/meme-imgs-various-ratios/Oprah-You-Get-A.jpg', keywords: ['funny', 'oprah'] },
    { id: 23, url: 'images/meme-imgs-various-ratios/patrick.jpg', keywords: ['funny', 'star trek'] },
    { id: 24, url: 'images/meme-imgs-various-ratios/putin.jpg', keywords: ['funny', 'putin'] },
    { id: 25, url: 'images/meme-imgs-various-ratios/X-Everywhere.jpg', keywords: ['funny', 'toy story'] },
]

function onInit() {
    gElMemeCanvas = document.querySelector('canvas')
    gMemeCtx = gElMemeCanvas.getContext('2d')

    renderGallery()
    addEventListeners()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElMemeCanvas.width = elContainer.clientWidth
}


function renderGallery() {
    const elGallery = document.querySelector('.gallery-container')

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
    document.querySelector('.main-search').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
    resizeCanvas()
    renderMeme()
    console.log(gElMemeCanvas.height)
}