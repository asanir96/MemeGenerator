'use strict'


var gElMemeCanvas
var gCurrMemeID
var gMousePos
var gMemeCtx
var gLinPos = { x: 20, y: 20 }
var gLineIdx
var gHoveredLineIdx = -1
var gHighlightedLineIdx = 0
var gIsEditMode = false
var gIsHighlightMode = false

function InitEditor() {
    // addEditorListeners()
}

function renderMeme(ev) {
    const meme = getSelectedMeme()
    const img = new Image()

    img.onload = () => {
        renderImg(img)
        gMemeCtx.scale(gScale, gScale)
        setMemeScale(gScale)
        renderLines(meme)
    }

    img.src = gImgs.find(img => img.id === meme.selectedImgId).url
}

function renderImg(img) {
    gElMemeCanvas.height = (img.naturalHeight / img.naturalWidth) * gElMemeCanvas.width
    gMemeCtx.drawImage(img, 0, 0, gElMemeCanvas.width, gElMemeCanvas.height)
}

function renderLines(meme) {
    const { lines, selectedLineIdx, scale } = meme

    lines.forEach((line, idx) => {
        var { isHovered } = line
        var isSelected = idx === selectedLineIdx

        renderLine(line, isHovered, isSelected, scale)
    });
}

function renderLine(line, isHovered, isSelected, scale) {
    const { size, pos } = line

    gMemeCtx.font = `${line.size}px ${line.fontFamily}`;
    gMemeCtx.textAlign = line.texAlignment;

    if (line.texAlignment === 'right') gMemeCtx.textAlign = 'left';
    else if (line.texAlignment === 'left') gMemeCtx.textAlign = 'right'
    else gMemeCtx.textAlign = 'center'

    gMemeCtx.textBaseline = "middle";

    const metrics = gMemeCtx.measureText(line.txt);
    const textWidth = metrics.width;

    gMemeCtx.strokeStyle = 'black'

    if (isSelected) {
        gMemeCtx.strokeStyle = "white";

        gMemeCtx.fillStyle = 'rgb(0 0 0 / 20%)'
        gMemeCtx.lineWidth = 0.5;
        const padding = 10;

        const rectStartPosX = getRectStartPos(line, textWidth, padding)
        const rectStartPosY = pos.y - ((size / 2)) - padding
        const rectWidth = textWidth + (padding * 2)
        const rectHeight = size + (padding * 2)

        gMemeCtx.strokeRect(rectStartPosX, rectStartPosY, rectWidth, rectHeight)
        gMemeCtx.fillRect(rectStartPosX, rectStartPosY, rectWidth, rectHeight)
    }

    if (isHovered || isSelected) {
        gMemeCtx.strokeStyle = "red";
    }

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

function onTextInput(ev) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx === null) return

    setLineTxt(ev.target.value)
    renderMeme()
}

function onTextClick(ev) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx === null) {
        setLineSelected(0)
        renderMeme()
    }
}
function onDownloadMeme(elLink, ev) {
    const meme = getSelectedMeme()
    const { selectedLine } = meme

    if (selectedLine !== null) {
        ev.preventDefault()
        return
    }

    elLink.href = gElMemeCanvas.toDataURL()
    elLink.download = `my-meme`
}

function onChangeFontSize(ev, direction) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx === null) return

    changeFontSize(direction)
    renderMeme(ev)
}

function onSwitchLine(ev) {
    const meme = getSelectedMeme()

    var { selectedLineIdx, lines } = meme

    selectedLineIdx = selectedLineIdx === null ? 0 : ++selectedLineIdx
    if (selectedLineIdx > lines.length - 1) selectedLineIdx = 0

    switchLines(selectedLineIdx)
    document.querySelector('.download-btn').classList.add('disabled')
    document.querySelector('.save-btn').classList.add('disabled')
    renderMeme(ev)
    clearTextEdit()
}

function clearTextEdit() {
    document.querySelector('.line-text-edit').value = "";

}

function onAddLine(ev) {
    const meme = getSelectedMeme()
    const { lines } = meme

    addLine()
    switchLines(lines.length - 1)
    renderMeme(ev)
}

function renderLineEditor(isReset) {
    const meme = getSelectedMeme()
    console.log(meme)
    const { lines, selectedLineIdx } = meme
    const selectedLine = lines[selectedLineIdx]

    const elLineEditor = document.querySelector('.line-editor')
    const elLineEditorOptions = elLineEditor.querySelector('.line-editor-options')
    const LineEditorFont = elLineEditorOptions.querySelector('.line-editor-font')
    const elLineEditorTextInput = elLineEditor.querySelector('.line-text-edit')

    if (isReset) {
        LineEditorFont.selectedIndex = 0
        elLineEditorOptions.querySelectorAll('.alignment-btn').forEach(btn => btn.classList.remove('selected'))
        elLineEditorTextInput.value = ''

    } else {
        const options = [...LineEditorFont.options]
        LineEditorFont.selectedIndex = options.findIndex(option => option.value === selectedLine.fontFamily)

        elLineEditorOptions.querySelectorAll('.alignment-btn').forEach(btn => btn.classList.remove('selected'))
        elLineEditorOptions.querySelector(`.align-${selectedLine.texAlignment}`).classList.add('selected')

    }
}

function onCanvasHover(ev) {
    const meme = getSelectedMeme()
    const { lines, scale } = meme

    const draggedLineIdx = lines.findIndex(line => line.isDrag)
    if (draggedLineIdx >= 0) {
        onMove(ev)
        return
    }

    const { offsetX, offsetY } = ev
    const mousePos = { x: offsetX, y: offsetY }

    lines.forEach((line, lineIdx) => {
        const lineWidth = gMemeCtx.measureText(line.txt).width * scale
        if (isLineHovered(mousePos, lineIdx, lineWidth)) {
            document.body.style.cursor = 'grab'
            setLineHovered(lineIdx, true)
        }
        else {
            setLineHovered(lineIdx, false)
            document.body.style.cursor = 'auto'
        }
    })

    renderMeme()
}

function onCloseEditor(ev) {
    ev.stopPropagation()
    removeEditorListeners()
    openGallery()

    gElMemeCanvas.width = 300
    gElMemeCanvas.height = 150

    gScale = 1
}

function onAlignText(alignment, elAlignTextBtn) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx === null) return

    setLineTextAlign(alignment)
    renderMeme()

    document.querySelectorAll('.alignment-btn').forEach(btn => btn.classList.remove('selected'))
    elAlignTextBtn.classList.add('selected')
}

function onDeleteLine() {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx === null) return

    deleteLine(selectedLineIdx)

    setLineSelected(null)
    renderLineEditor(true)

    document.querySelectorAll('.export-btn').forEach(btn => btn.classList.remove('disabled'))

    renderMeme()
}

function onSaveMeme() {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx !== null) return

    saveMeme()
}

function saveMeme() {
    var data = gElMemeCanvas.toDataURL('image/jpeg', 0.5)

    setMemeData(data)
    gMemeCtx.scale(gScale, gScale)
}


function onDown(ev) {

    // Save the position we started from...
    // Get the event position from mouse or touch

    const meme = getSelectedMeme()
    const { lines, scale } = meme
    const hoveredLineIndex = lines.findIndex(line => line.isHovered)

    const { offsetX, offsetY } = ev
    gMousePos = { x: offsetX, y: offsetY }

    if (hoveredLineIndex < 0) {
        setLineSelected(null)
        renderLineEditor(true)

        document.querySelectorAll('.export-btn').forEach(btn => btn.classList.remove('disabled'))

        renderMeme()
        return
    }

    setLineSelected(hoveredLineIndex)
    renderLineEditor(false)

    document.querySelectorAll('.export-btn').forEach(btn => btn.classList.add('disabled'))
    setLineDrag(true)
    document.body.style.cursor = 'grabbing'
    renderMeme()
}

function onMove(ev) {
    const meme = getSelectedMeme()
    const { lines, selectedLineIdx } = meme
    const { isDrag } = lines[selectedLineIdx]

    if (!isDrag) return

    const { offsetX, offsetY } = ev
    const pos = { x: offsetX, y: offsetY }

    // Calc the delta, the diff we moved
    const dx = pos.x - gMousePos.x
    const dy = pos.y - gMousePos.y

    moveLine(dx, dy)

    // Save the last pos, we remember where we`ve been and move accordingly
    gMousePos = pos

    // The canvas is rendered again after every move
    renderMeme()
}

function onUp() {
    const meme = getSelectedMeme()
    if (meme.selectedLineIdx === null) return

    setLineDrag(false)
    document.body.style.cursor = 'grab'
}

function onChangeFontFamily(elFontSelection) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    if (selectedLineIdx === null) return

    const selectedFont = elFontSelection.value
    setLineFontFamily(selectedFont)
    renderMeme()
}

function onAddSticker(elStickerBtn) {
    onAddLine()
    setLineTxt(elStickerBtn.innerText)
}