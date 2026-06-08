'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        txt: 'This is a meme text',
        size: 20,
        color: 'white'
    }
    ]
}

function getMeme() {
    return gMeme
}

function setLineTxt(text) {

    gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function changeFontSize(increment) {
    gMeme.lines[gMeme.selectedLineIdx].size += increment
    console.log(gMeme)
}