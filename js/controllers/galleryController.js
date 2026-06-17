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
var gInitCanvasWidth
var gScale = 1

function initGallery() {
    loadMemesFromStorage()
    gScale = 1
    gElMemeCanvas = document.querySelector('canvas')
    gMemeCtx = gElMemeCanvas.getContext('2d')

    gMemeCtx.font = '16px impact'
    gMemeCtx.measureText('')

    gInitCanvasWidth = gElMemeCanvas.width
    renderGallery()
    addEditorListeners()
}


function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gScale = elContainer.clientWidth / gElMemeCanvas.width

    gElMemeCanvas.width = elContainer.clientWidth
    gElMemeCanvas.height = elContainer.clientHeight
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
    createMeme()
    const meme = getMemeByIdx(-1)
    setSelectedMemeIdx(meme.id)
    setImg(imgId)

    showEditor(gCurrMemeID)
}

function showEditor() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.memes').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')

    renderLineEditor(true)
    renderMeme(true)
}

function onOpenGallery() {
    openGallery()
}

function openGallery() {
    setSelectedMemeIdx(null)
    gElMemeCanvas.width = 300
    gElMemeCanvas.height = 150
    gScale = 1

    // Switch between sections
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.memes').classList.add('hidden')
    document.querySelector('.gallery').classList.remove('hidden')

    // Highlighting relevant nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('selected'))
    document.querySelector('.nav-btn.open-gallery').classList.add('selected')
}