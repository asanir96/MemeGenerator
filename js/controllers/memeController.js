'use strict'


var gElMemeCanvas
var gMemeCtx
var gLinPos = { x: 20, y: 20 }
var gLineIdx
var gCurrLineIdx = -1
var gHighlightedLineIdx = 0
var gIsEditMode = false
var gIsHighlightMode = false

function addEventListeners() {
    document.querySelector('.line-text-edit').addEventListener('focus', (e) => {
        renderMeme(e)
    })
    document.querySelector('.line-text-edit').addEventListener('input', (e) => {
        setLineTxt(e.target.value)
        renderMeme(e)
    })
    document.querySelector('.line-text-edit').addEventListener('change', (e) => {
        setLineTxt(e.target.value)
        renderMeme(e)
        console.log(e.type)
        gIsEditMode = false

    })

    document.querySelector('canvas').addEventListener('mousedown', (e) => onDown(e))
    document.querySelector('canvas').addEventListener('mouseleave', (e) => gCurrLineIdx = -1
    )

}

function renderMeme(ev) {
    const meme = getMeme()
    const img = new Image()
    img.onload = () => {
        renderImg(img)
        renderLineBorders()
        renderLines(meme)
    }

    img.src = gImgs.find(img => img.id === meme.selectedImgId).url
}

function renderImg(img) {
    gElMemeCanvas.height = (img.naturalHeight / img.naturalWidth) * gElMemeCanvas.width
    gMemeCtx.drawImage(img, 0, 0, gElMemeCanvas.width, gElMemeCanvas.height)
}

function renderLineBorders() {
    const { lines, selectedLineIdx } = getMeme()

    lines.forEach((line, idx) => {
        if ((idx === gCurrLineIdx) ||
            (idx === selectedLineIdx && gIsEditMode)) {

            gMemeCtx.font = `${line.size}px serif`;

            const metrics = gMemeCtx.measureText(line.txt);
            const textWidth = metrics.width;

            gMemeCtx.strokeStyle = "red";
            gMemeCtx.fillStyle = 'rgb(0 0 0 / 30%)'
            gMemeCtx.lineWidth = 0.5;
            const padding = 10;

            gMemeCtx.strokeRect(line.pos.x - padding, line.pos.y - padding, textWidth + (padding * 2), line.size + (padding * 2))
            gMemeCtx.fillRect(line.pos.x - padding, line.pos.y - padding, textWidth + (padding * 2), line.size + (padding * 2))
        }
    })

}

function renderLines() {
    const { lines } = getMeme()
    lines.forEach(line => {
        gMemeCtx.font = `${line.size}px serif`;

        const metrics = gMemeCtx.measureText(line.txt);
        const textWidth = metrics.width;
        gMemeCtx.fillStyle = line.color;
        gMemeCtx.textAlign = "left";
        gMemeCtx.textBaseline = "top";
        gMemeCtx.fillText(line.txt, line.pos.x, line.pos.y)
    });
}

function onDownloadMeme(elLink, ev) {
    if (gIsEditMode) {
        ev.preventDefault()
        return
    }
    elLink.href = gElMemeCanvas.toDataURL()
    elLink.download = `my-meme`
}

function onChangeFontSize(ev, direction) {
    console.log(ev.type)
    if (!gIsEditMode) return

    changeFontSize(direction)
    renderMeme(ev)
}

function onSwitchLine(ev) {
    const meme = getMeme()
    const { selectedLineIdx, isLineSelected } = getMeme()
    if (isLineSelected) return

    gCurrLineIdx++
    gIsEditMode = true
    if (gCurrLineIdx > meme.lines.length - 1) gCurrLineIdx = 0
    switchLines(gCurrLineIdx)
    renderMeme(ev)
    clearTextEdit()
}

function clearTextEdit() {
    document.querySelector('.line-text-edit').value = "";

}

function onAddLine(ev) {
    const { lines } = getMeme()

    addLine()
    switchLines(lines.length - 1)
    renderMeme(ev)
}

function onDown(ev) {
    if (gCurrLineIdx < 0) {
        console.log('hi')
        gIsEditMode = false
        renderMeme()
    } else {
        gIsEditMode = true
        switchLines(gCurrLineIdx)
        clearTextEdit()
    }
    renderMeme()
}

function getTextWidth(line) {
    gMemeCtx.font = `${line.size}px serif`
    const metrics = gMemeCtx.measureText(line.txt);
    return metrics.width;
}

function isMouseOnLine(ev, line) {
    const { offsetX, offsetY } = ev

    return (
        offsetX >= line.pos.x &&
        offsetX <= line.pos.x + getTextWidth(line) &&
        offsetY >= line.pos.y &&
        offsetY <= line.pos.y + line.size)
}

function onHighlightLine(ev) {
    const { lines, selectedLineIdx, isLineSelected } = getMeme()
    if (isLineSelected) return
    gHighlightedLineIdx = selectedLineIdx

    gCurrLineIdx = lines.findIndex(line => isMouseOnLine(ev, line))
    renderMeme(ev)
    clearTextEdit()

}