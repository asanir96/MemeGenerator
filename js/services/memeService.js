'use strict'
const STORAGE_KEY = 'memes'
var gMemes = {
    selectedMemeIdx: 0,
    memeList: []
}
const InitSize = 16
const InitTxt = 'This is a meme text'
const InitColor = 'white'
const InitFontFamily = 'Impact'
const InitTexAlignment = 'center'
loadMemesFromStorage()

function loadMemesFromStorage() {
    gMemes = loadFromStorage(STORAGE_KEY)

    if (!gMemes || gMemes.length === 0) {
        gMemes = {
            selectedMemeIdx: 0,
            memeList: []
        }
        createMeme()
    }
}

function createMeme() {
    const meme = {
        id: makeid(),
        selectedImgId: 1,
        selectedLineIdx: null,
        scale: 1,
        lines: []
    }

    const InitSize = 16
    const InitTxt = 'This is a meme text'
    const InitColor = 'white'
    const InitFontFamily = 'Impact'
    const InitTexAlignment = 'center'

    const InitPosFirst = { x: 150, y: 20 }
    const InitPosSecond = { x: 150, y: 150 }

    meme.lines.push(_createLine(InitTxt, InitSize, InitColor, InitFontFamily, InitTexAlignment, InitPosFirst))
    meme.lines.push(_createLine(InitTxt, InitSize, InitColor, InitFontFamily, InitTexAlignment, InitPosSecond))

    gMemes.memeList.push(meme)
    gMemes.selectedMemeIdx = gMemes.memeList.length - 1

    // _saveMemes()
}

function setSelectedMemeIdx(memeId) {
    if (!memeId) gMemes.selectedMemeIdx = null
    else gMemes.selectedMemeIdx = gMemes.memeList.findIndex(meme => meme.id === memeId)
}

function getMemes() {
    return gMemes
}

function getMeme(idx) {
    return gMemes.at(idx)
}

function getMemeById(memeId) {
    return gMemes.find(meme => meme.id === memeId)
}

function getMemeByIdx(memeIdx) {
    return gMemes.memeList.at(memeIdx)
}

function setSelectedMeme(memeId) {
    gMemes.selectedMemeIdx = gMemes.memeList.findIndex(meme => meme.id === memeId)
    console.log('gMemes.selectedMemeIdx', gMemes.selectedMemeIdx)
}

function setLineTxt(text) {
    const meme = getSelectedMeme()
    meme.lines[meme.selectedLineIdx].txt = text
    // _saveMemes()
}

function setLineFontFamily(family) {
    const meme = getSelectedMeme()
    meme.lines[meme.selectedLineIdx].fontFamily = family
}

function setImg(imgId) {
    const meme = getSelectedMeme()
    meme.selectedImgId = imgId
}

function changeFontSize(increment) {
    const meme = getSelectedMeme()

    meme.lines[meme.selectedLineIdx].size += increment
}

function switchLines(lineIdx) {
    const meme = getSelectedMeme()
    if (lineIdx !== null) {
        meme.selectedLineIdx = lineIdx
    }
}

function setLineSelected(lineIdx) {
    const meme = getSelectedMeme()
    meme.selectedLineIdx = lineIdx
}

function setLineTextAlign(alignment) {
    console.log('hi')
    const meme = getSelectedMeme()
    meme.lines[meme.selectedLineIdx].texAlignment = alignment

}

function addLine() {
    const meme = getSelectedMeme()

    const pos = { x: 150, y: 100 }
    meme.lines.push(_createLine(InitTxt, InitSize, InitColor, InitFontFamily, InitTexAlignment, pos))
    // _saveMemes()
}

function _createLine(txt, size, color, fontFamily, texAlignment, pos) {
    return {
        txt,
        size,
        color,
        fontFamily,
        texAlignment,
        pos,
        isHovered: false,
        isDrag: false
    }

}

function deleteLine(idx) {
    const meme = getSelectedMeme()
    const { lines } = meme
    lines.splice(idx, 1)
}

function _saveMemes() {
    saveToStorage(STORAGE_KEY, gMemes)
}

function setMemeData(data) {
    const meme = getSelectedMeme()
    meme.dataUrl = data
    _saveMemes()
}

function isLineHovered(mousePos, lineIdx, lineWidth) {
    const meme = getSelectedMeme()
    const { scale } = meme
    const { pos, texAlignment, size } = meme.lines[lineIdx]
    const scalePos = { x: (pos.x * scale), y: (pos.y * scale) }

    const distanceX = Math.abs(scalePos.x - mousePos.x)
    const distanceY = Math.abs(scalePos.y - mousePos.y)

    if (texAlignment === 'center') {
        return distanceX <= ((lineWidth / 2)) &&
            distanceY <= ((size / 2)) * scale
    } else {
        return distanceX <= (lineWidth) &&
            distanceY <= ((size / 2)) * scale
    }
}

function getSelectedMeme() {
    if (gMemes.selectedMemeIdx === null) return

    return gMemes.memeList[gMemes.selectedMemeIdx]
}


function getRectStartPos(line, textWidth, padding) {
    const { pos, texAlignment } = line

    switch (texAlignment) {
        case 'center':
            var rectStartPosX = pos.x - (textWidth / 2) - padding
            break;
        case 'left':
            var rectStartPosX = pos.x - (textWidth) - padding
            break;
        case 'right':
            var rectStartPosX = pos.x - padding
            break
    }
    return rectStartPosX
}

function setLineHovered(lineIdx, bool) {
    const meme = gMemes.memeList[gMemes.selectedMemeIdx]
    meme.lines[lineIdx].isHovered = bool
}

function setMemeScale(scale) {
    const meme = getSelectedMeme()
    meme.scale = scale
}

function setLineDrag(bool) {
    console.log('bool',bool)
    console.log('setting Line Drag false')
    const meme = getSelectedMeme()
    console.log('meme',meme)
    const { selectedLineIdx } = meme
    console.log('selectedLineIdx',selectedLineIdx)
    meme.lines[selectedLineIdx].isDrag = bool
    console.log(' meme.lines[selectedLineIdx].isDrag', meme.lines[selectedLineIdx].isDrag)
}

function moveLine(dx, dy) {
    console.log('hi')
    const meme = getSelectedMeme()
    const { selectedLineIdx, scale } = meme
    meme.lines[selectedLineIdx].pos.x += dx / scale
    meme.lines[selectedLineIdx].pos.y += dy / scale
}
