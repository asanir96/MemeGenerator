'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            pos: { x: 20, y: 20 },
            txt: 'This is a meme text',
            size: 20,
            color: 'white'
        },
        {
            pos: { x: 20, y: 60 },
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

function switchLines(idx) {
    if (idx >= 0) {
        gMeme.selectedLineIdx = idx
    }




    // gMeme.selectedLineIdx++
    // if (gMeme.selectedLineIdx > gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
}

function addLine() {
    gMeme.lines.push(_createLine())
}

function _createLine() {
    const { lines } = gMeme
    const prevPos = lines[lines.length - 1].pos

    return {
        pos: { x: prevPos.x, y: prevPos.y + 40 },
        txt: 'This is a meme text',
        size: 20,
        color: 'white'
    }
}