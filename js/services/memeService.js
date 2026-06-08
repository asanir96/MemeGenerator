'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        txt: 'This is a meme text',
        size: 20,
        color: 'black'
    }
    ]
}

function getMeme() {
    return gMeme
}

function setLineTxt(text) {

    gMeme.lines[0].txt = text
}