'use strict'


var gElMemeCanvas
var gMemeCtx
var gLinPos = { x: 20, y: 20 }
var gLineIdx
var gSelectedLineIdx = 0

function renderMeme(ev) {
    const meme = getMeme()
    const img = new Image()
    img.onload = () => {
        renderImg(img)
        if (ev && (ev.type === 'input' || ev.type === 'focus' || ev.type === 'click')) {
            renderLineBorders()
        }
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
    const selectedLine = lines[selectedLineIdx]

    gMemeCtx.font = `${selectedLine.size}px serif`;

    const metrics = gMemeCtx.measureText(selectedLine.txt);
    const textWidth = metrics.width;

    gMemeCtx.strokeStyle = "red";
    gMemeCtx.fillStyle = 'rgb(0 0 0 / 30%)'
    gMemeCtx.lineWidth = 0.5;
    const padding = 10;

    gMemeCtx.strokeRect(selectedLine.pos.x, selectedLine.pos.y, textWidth + padding, selectedLine.size + padding)
    gMemeCtx.fillRect(selectedLine.pos.x, selectedLine.pos.y, textWidth + padding, selectedLine.size + padding)
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

function onDownloadMeme(elLink) {
    elLink.href = gElMemeCanvas.toDataURL()
    // Set a name for the downloaded file
    elLink.download = `my-meme`
}

function onChangeFontSize(ev, direction) {
    changeFontSize(direction)
    renderMeme(ev)
}

function onSwitchLine(ev) {
    const meme = getMeme()
    gSelectedLineIdx = meme.selectedLineIdx    
    gSelectedLineIdx++

    if (gSelectedLineIdx > meme.lines.length - 1) gSelectedLineIdx = 0
    switchLines(gSelectedLineIdx)
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