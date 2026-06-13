'use strict'


var gElMemeCanvas
var gMemeCtx
var gLinPos = { x: 20, y: 20 }
var gLineIdx
var gHoveredLineIdx = -1
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

        gHoveredLineIdx = -1
        elEditor.removeEventListener('click', onStopEdit)
        document.querySelector('.line-text-edit').removeEventListener('blur', onTextEditBlur)
    }
    )

    gElMemeCanvas.addEventListener('mouseleave', addStopEditListeners)



}

function onRemoveListeners(ev) {

    const child = ev.target.closest('button, input,select')
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
    gHoveredLineIdx = -1
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
        if (gIsEditMode && idx === selectedLineIdx) renderLine2(line, false, true)
        else if (gHoveredLineIdx >= 0 &&
            gHoveredLineIdx === idx) renderLine2(line, true, false)
        else renderLine2(line, false, false)
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

function renderLine2(line, isHovered, isSelected) {
    const { size, pos } = line

    gMemeCtx.font = `${line.size}px ${line.fontFamily}`;
    gMemeCtx.textAlign = line.texAlignment;

    if (line.texAlignment === 'right') gMemeCtx.textAlign = 'left';
    else if (line.texAlignment === 'left') gMemeCtx.textAlign = 'right'
    else gMemeCtx.textAlign = 'center'

    gMemeCtx.textBaseline = "top";

    const metrics = gMemeCtx.measureText(line.txt);
    const textWidth = metrics.width;
    gMemeCtx.strokeStyle = 'black'

    if (isSelected) {
        gMemeCtx.strokeStyle = "white";

        gMemeCtx.fillStyle = 'rgb(0 0 0 / 20%)'
        gMemeCtx.lineWidth = 0.5;
        const padding = 10;

        const rectStartPosX = getRectStartPos(line, textWidth, padding)
        const rectStartPosY = pos.y - padding
        const rectWidth = textWidth + (padding * 2)
        const rectHeight = size + (padding * 2)

        gMemeCtx.strokeRect(rectStartPosX, rectStartPosY, rectWidth, rectHeight)
        gMemeCtx.fillRect(rectStartPosX, rectStartPosY, rectWidth, rectHeight)
    }
    if (isHovered || isSelected) {
        gMemeCtx.strokeStyle = "red";

        // gMemeCtx.fillStyle = 'rgb(0 0 0 / 20%)'
        // gMemeCtx.lineWidth = 0.5;
        // const padding = 10;

        // gMemeCtx.strokeRect(pos.x - padding, pos.y - padding, textWidth + (padding * 2), size + (padding * 2))
        // gMemeCtx.fillRect(pos.x - padding, pos.y - padding, textWidth + (padding * 2), size + (padding * 2))
    }

    // gMemeCtx.strokeStyle = 'black'
    gMemeCtx.lineWidth = 4

    gMemeCtx.fillStyle = line.color;

    gMemeCtx.strokeText(line.txt, pos.x, pos.y)
    gMemeCtx.fillText(line.txt, pos.x, pos.y)
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

    gHoveredLineIdx++
    document.querySelector('.download-btn').classList.add('disabled')

    gIsEditMode = true
    if (gHoveredLineIdx > meme.lines.length - 1) gHoveredLineIdx = 0
    switchLines(gHoveredLineIdx)
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
    if (gHoveredLineIdx < 0) {
        console.log('changing gIsEdit')
        document.querySelector('.download-btn').classList.remove('disabled')
        renderLineEditor(true)

        gIsEditMode = false
        renderMeme()
    } else {
        document.querySelector('.download-btn').classList.add('disabled')

        gIsEditMode = true
        switchLines(gHoveredLineIdx)
        renderLineEditor(false)

        // renderMeme()
        clearTextEdit()
    }
}

function renderLineEditor(isReset) {
    const { lines, selectedLineIdx } = getMeme()
    const selectedLine = lines[selectedLineIdx]

    const elLineEditor = document.querySelector('.line-editor')
    const elLineEditorOptions = elLineEditor.querySelector('.line-editor-options')
    const LineEditorFont = elLineEditorOptions.querySelector('.line-editor-font')

    if (isReset) {
        LineEditorFont.selectedIndex = 0
        elLineEditorOptions.querySelectorAll('.alignment-btn').forEach(btn => btn.classList.remove('selected'))

    } else {
        const options = [...LineEditorFont.options]
        LineEditorFont.selectedIndex = options.findIndex(option => option.value === selectedLine.fontFamily)

        elLineEditorOptions.querySelectorAll('.alignment-btn').forEach(btn => btn.classList.remove('selected'))
        elLineEditorOptions.querySelector(`.align-${selectedLine.texAlignment}`).classList.add('selected')
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
    const {
        rectStartPosX,
        rectEndPosX,
        rectStartPosY,
        rectEndPosY
    } = getLinePixels(line)
    return (
        offsetX >= rectStartPosX * gScale &&
        offsetX <= rectEndPosX * gScale &&
        offsetY >= rectStartPosY * gScale &&
        offsetY <= rectEndPosY * gScale)
}

function getLinePixels(line) {
    const { pos, size } = line

    const padding = 10
    const metrics = gMemeCtx.measureText(line.txt);
    const textWidth = metrics.width;

    const rectStartPosX = getRectStartPos(line, textWidth, padding) + padding
    const rectEndPosX = rectStartPosX + textWidth
    const rectStartPosY = pos.y
    const rectEndPosY = rectStartPosY + size

    return {
        rectStartPosX,
        rectEndPosX,
        rectStartPosY,
        rectEndPosY
    }
}
function onHighlightLine(ev) {
    const { lines, selectedLineIdx, isLineSelected } = getMeme()
    if (isLineSelected) return
    gHighlightedLineIdx = selectedLineIdx

    gHoveredLineIdx = lines.findIndex(line => isMouseOnLine2(ev, line))
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

function onChangeFontFamily(elFontFamilySelect) {
    if (!gIsEditMode) return

    setLineFontFamily(elFontFamilySelect.value)
    renderMeme()
}

function onAlignText(alignment, elAlignTextBtn) {
    if (!gIsEditMode) return

    setLineTextAlign(alignment)
    renderMeme()

    document.querySelectorAll('.alignment-btn').forEach(btn => btn.classList.remove('selected'))
    elAlignTextBtn.classList.add('selected')
}