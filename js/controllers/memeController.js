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
    const elEditor = document.querySelector('.editor')
    const elLineEditor = elEditor.querySelector('.line-editor')
    const elEditorActions = elEditor.querySelector('.editor-actions')
    const elBackBtn = elEditor.querySelector('.editor-back-btn')
    elEditor.addEventListener('click', onStopEdit)

    elLineEditor.addEventListener('mouseleave', addStopEditListeners)
    elLineEditor.addEventListener('mouseover', (e) => onRemoveListeners(e))

    elEditorActions.addEventListener('mouseleave', addStopEditListeners)
    elEditorActions.addEventListener('mouseover', (e) => onRemoveListeners(e))

    elBackBtn.addEventListener('mouseleave', addStopEditListeners)
    elBackBtn.addEventListener('mouseover', (e) => onRemoveListeners(e))


    document.querySelector('.line-text-edit').addEventListener('focus', (e) => {
        document.querySelector('.download-btn').classList.add('disabled')
        gIsEditMode = true
        renderMeme(e)
    })
    document.querySelector('.line-text-edit').addEventListener('input', (e) => {
        setLineTxt(e.target.value)
        renderMeme(e)

    })

    gElMemeCanvas.addEventListener('mousedown', (e) => onDown(e))
    document.querySelector('.line-text-edit').addEventListener('blur', onTextEditBlur)

    gElMemeCanvas.addEventListener('mousemove', (e) => {

        gCurrLineIdx = -1
        elEditor.removeEventListener('click', onStopEdit)
        document.querySelector('.line-text-edit').removeEventListener('blur', onTextEditBlur)
    }
    )

    gElMemeCanvas.addEventListener('mouseleave', addStopEditListeners)



}

function onRemoveListeners(ev) {

    const child = ev.target.closest('button, input')
    if (!child) return

    document.querySelector('.line-text-edit').removeEventListener('blur', onTextEditBlur)
    document.querySelector('.editor').removeEventListener('click', onStopEdit)
}

function addStopEditListeners() {
    document.querySelector('.line-text-edit').addEventListener('blur', onTextEditBlur)
    document.querySelector('.editor').addEventListener('click', onStopEdit)

}

function onStopEdit() {
    console.log('changing gIsEdit')
    gCurrLineIdx = -1
    document.querySelector('.download-btn').classList.remove('disabled')
    gIsEditMode = false

    renderMeme()
    clearTextEdit()
}

function onTextEditBlur() {
    console.log('changing gIsEdit')
    document.querySelector('.download-btn').classList.add('disabled')
    gIsEditMode = false
    renderMeme()
    clearTextEdit()
}
function renderMeme(ev) {
    const meme = getMeme()
    const img = new Image()
    img.onload = () => {
        renderImg(img)
        renderLines2()
    }

    img.src = gImgs.find(img => img.id === meme.selectedImgId).url
}

function renderImg(img) {
    gElMemeCanvas.height = (img.naturalHeight / img.naturalWidth) * gElMemeCanvas.width
    gMemeCtx.drawImage(img, 0, 0, gElMemeCanvas.width, gElMemeCanvas.height)
}

function renderLines2() {
    const { lines, selectedLineIdx } = getMeme()
    gMemeCtx.scale(gScale, gScale)

    lines.forEach((line, idx) => {
        if ((gCurrLineIdx >= 0 &&
            gCurrLineIdx === idx
        ) ||
            (gIsEditMode && idx === selectedLineIdx))
            renderLine2(line, true)
        else renderLine2(line, false)
    });
}

// function renderLines() {
//     const { lines } = getMeme()

//     lines.forEach(line => {
//         const { normSize, normX, normY } = getNormTextMeasures(line)

//         gMemeCtx.font = `${normSize}px impact`;
//         gMemeCtx.textAlign = "left";
//         gMemeCtx.textBaseline = "top";

//         const metrics = gMemeCtx.measureText(line.txt);
//         const textWidth = metrics.width;

//         gMemeCtx.strokeStyle = 'black'
//         gMemeCtx.lineWidth = 4

//         gMemeCtx.fillStyle = line.color;

//         gMemeCtx.strokeText(line.txt, normX, normY)
//         gMemeCtx.fillText(line.txt, normX, normY)
//     });
// }

function renderLine2(line, isBordered) {
    const { size, pos } = line

    gMemeCtx.font = `${line.size}px impact`;
    gMemeCtx.textAlign = "left";
    gMemeCtx.textBaseline = "top";

    const metrics = gMemeCtx.measureText(line.txt);
    const textWidth = metrics.width;

    if (isBordered) {
        gMemeCtx.strokeStyle = "grey";

        gMemeCtx.fillStyle = 'rgb(0 0 0 / 20%)'
        gMemeCtx.lineWidth = 0.5;
        const padding = 10;

        gMemeCtx.strokeRect(pos.x - padding, pos.y - padding, textWidth + (padding * 2), size + (padding * 2))
        gMemeCtx.fillRect(pos.x - padding, pos.y - padding, textWidth + (padding * 2), size + (padding * 2))
    }

    gMemeCtx.strokeStyle = 'black'
    gMemeCtx.lineWidth = 4

    gMemeCtx.fillStyle = line.color;

    gMemeCtx.strokeText(line.txt, pos.x, pos.y)
    gMemeCtx.fillText(line.txt, pos.x, pos.y)
}

// function renderLine(line, isBordered) {
//     const { normSize, normX, normY } = getNormTextMeasures(line)

//     gMemeCtx.font = `${normSize}px impact`;
//     gMemeCtx.textAlign = "left";
//     gMemeCtx.textBaseline = "top";

//     const metrics = gMemeCtx.measureText(line.txt);
//     const textWidth = metrics.width;

//     if (isBordered) {
//         gMemeCtx.strokeStyle = "grey";

//         gMemeCtx.fillStyle = 'rgb(0 0 0 / 20%)'
//         gMemeCtx.lineWidth = 0.5;
//         const padding = 10;

//         gMemeCtx.strokeRect(normX - padding, normY - padding, textWidth + (padding * 2), normSize + (padding * 2))
//         gMemeCtx.fillRect(normX - padding, normY - padding, textWidth + (padding * 2), normSize + (padding * 2))
//     }

//     gMemeCtx.strokeStyle = 'black'
//     gMemeCtx.lineWidth = 4

//     gMemeCtx.fillStyle = line.color;

//     gMemeCtx.strokeText(line.txt, normX, normY)
//     gMemeCtx.fillText(line.txt, normX, normY)
// }

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
    document.querySelector('.download-btn').classList.add('disabled')

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
        console.log('changing gIsEdit')
        document.querySelector('.download-btn').classList.remove('disabled')

        gIsEditMode = false
        renderMeme()
    } else {
        document.querySelector('.download-btn').classList.add('disabled')

        gIsEditMode = true
        switchLines(gCurrLineIdx)
        // renderMeme()
        clearTextEdit()
    }
}

function getTextWidth(line, scale) {
    const metrics = gMemeCtx.measureText(line.txt);
    return metrics.width * scale;
}

function isMouseOnLine(ev, line) {
    const { offsetX, offsetY } = ev
    const { scale, normSize, normX, normY } = getNormTextMeasures(line)

    const textWidth = getTextWidth(line, scale)

    return (
        offsetX >= normX &&
        offsetX <= normX + textWidth &&
        offsetY >= normY &&
        offsetY <= normY + normSize)
}

function isMouseOnLine2(ev, line) {
    const { offsetX, offsetY } = ev
    // const { scale, normSize, normX, normY } = getNormTextMeasures(line)
    const { size, pos } = line
    const metrics = gMemeCtx.measureText(line.txt);
    // console.log('offsetY',offsetY)
    // console.log('pos.y',pos.y)
    // console.log('pos.y + size',pos.y + size)
    // console.log('')
    // console.log('offsetX',offsetX)
    // console.log('pos.x',pos.x)
    // console.log('pos.x * gScale',pos.x *gScale)
    // console.log('(pos.x * gScale)+metrics.width',(pos.x+metrics.width)*gScale)
    // console.log('pos.x + metrics.width',pos.x + metrics.width)
    // console.log('')
    return (
        offsetX >= pos.x * gScale &&
        offsetX <= (pos.x + metrics.width) * gScale &&
        offsetY >= pos.y * gScale &&
        offsetY <= (pos.y + size) * gScale)
}

function onHighlightLine(ev) {
    const { lines, selectedLineIdx, isLineSelected } = getMeme()
    if (isLineSelected) return
    gHighlightedLineIdx = selectedLineIdx

    gCurrLineIdx = lines.findIndex(line => isMouseOnLine2(ev, line))
    renderMeme()
}

function onOpenGallery() {
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.gallery').classList.remove('hidden')
    gElMemeCanvas.width = 400
    gElMemeCanvas.height = 400
    gScale = 1
}

function getNormTextMeasures(line) {
    const { size, pos } = line
    const scale = gElMemeCanvas.width / gInitCanvasWidth

    const normSize = size * scale
    const normX = pos.x * gElMemeCanvas.width
    const normY = pos.y * gElMemeCanvas.height

    return { scale, normSize, normX, normY }
}