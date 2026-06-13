'use strict'

var gMeme
// var gMeme = {
//     selectedImgId: 1,
//     selectedLineIdx: 0,
//     lines: [
//         {
//             pos: { x: 20, y: 20 },
//             txt: 'This is a meme text',
//             size: 24,
//             color: 'white'
//         },
//         {
//             pos: { x: 20, y: 80 },
//             txt: 'This is a meme text',
//             size: 24,
//             color: 'white'
//         }

//     ]
// }

createMeme()
function createMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: []
    }
    gMeme.lines.push(_createLine())
    gMeme.lines.push(_createLine())
}

function getMeme() {
    return gMeme
}

function setLineTxt(text) {

    gMeme.lines[gMeme.selectedLineIdx].txt = text
}
function setLineFontFamily(family) {

    gMeme.lines[gMeme.selectedLineIdx].fontFamily = family
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function changeFontSize(increment) {
    gMeme.lines[gMeme.selectedLineIdx].size += increment
    console.log(gMeme.lines[gMeme.selectedLineIdx].size)
}

function switchLines(idx) {
    if (idx >= 0) {
        gMeme.selectedLineIdx = idx
    }
}

function setLineSelected(bool) {

    gMeme.isLineSelected = bool

}

function setLineTextAlign(alignment){
    gMeme.lines[gMeme.selectedLineIdx].texAlignment = alignment

}

function addLine() {
    gMeme.lines.push(_createLine())
}

function _createLine() {
    const { lines } = gMeme
    const line = {
        txt: 'This is a meme text',
        size: 16,
        color: 'white',
        fontFamily: 'Impact',
        texAlignment: 'center'
    }

    if (lines.length === 0) {
        line.pos = { x: 150, y: 20 }
    } else {
        const prevPos = lines[lines.length - 1].pos
        line.pos = { x: prevPos.x, y: prevPos.y + 60 }
    }

    return line
}