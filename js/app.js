'use strict'

function onInit() {
    initGallery()
    InitEditor()

    renderGallery()
    addEventListeners()
}

function addEventListeners() {
    addEditorListeners()
}

function addEditorListeners() {
    const elEditor = document.querySelector('.editor')
    const elLineEditor = elEditor.querySelector('.line-editor')
    const elEditorActions = elEditor.querySelector('.editor-actions')

    addClickHandler()

    elLineEditor.addEventListener('mouseleave', addClickHandler)
    elEditorActions.addEventListener('mouseleave', addClickHandler)

    elLineEditor.addEventListener('mouseover', removeClickHandler)
    elEditorActions.addEventListener('mouseover', removeClickHandler)


    document.querySelector('.line-text-edit').addEventListener('focus', (e) => {
        document.querySelector('.download-btn').classList.add('disabled')
        gIsEditMode = true
        renderMeme(e)
    })

    document.querySelector('.line-text-edit').addEventListener('input', onTextInput)
    document.querySelector('.line-text-edit').addEventListener('focus', onTextClick)

    gElMemeCanvas.addEventListener('mousedown', (e) => onDown(e))
    document.querySelector('.line-text-edit').addEventListener('blur', disableEdit)

    gElMemeCanvas.addEventListener('mousemove', (e) => {

        gHoveredLineIdx = -1
        elEditor.removeEventListener('click', onStopEdit)
        document.querySelector('.line-text-edit').removeEventListener('blur', disableEdit)
    }
    )

    gElMemeCanvas.addEventListener('mouseleave', addClickHandler)

}

function onRemoveListeners() {
    document.querySelector('.line-text-edit').removeEventListener('blur', disableEdit)
    document.querySelector('.editor').removeEventListener('click', onStopEdit)
}

function removeClickHandler(ev) {

    const child = ev.target.closest('button, input,select')
    if (!child) return

    document.querySelector('.line-text-edit').removeEventListener('blur', disableEdit)
    document.querySelector('.editor').removeEventListener('click', onStopEdit)
}

function addClickHandler() {
    document.querySelector('.line-text-edit').addEventListener('blur', disableEdit)
    document.querySelector('.editor').addEventListener('click', onStopEdit)

}

function onStopEdit() {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    document.querySelectorAll('.export-btn').forEach(btn => btn.classList.remove('disabled'))
    document.querySelector('.download-btn').classList.remove('disabled')
    setLineSelected(null)
    renderLineEditor(true)
    renderMeme()
    clearTextEdit()
}

function disableEdit() {
    document.querySelector('.download-btn').classList.add('disabled')
    gIsEditMode = false
    renderMeme()
    clearTextEdit()
}

function removeEditorListeners() {
    const elEditor = document.querySelector('.editor')
    const elLineEditor = elEditor.querySelector('.line-editor')
    const elEditorActions = elEditor.querySelector('.editor-actions')
    const elBackBtn = elEditor.querySelector('.editor-back-btn')

    elEditor.removeEventListener('click', onStopEdit)

    elLineEditor.removeEventListener('mouseleave', addClickHandler)
    elLineEditor.removeEventListener('mouseover', removeClickHandler)

    elEditorActions.removeEventListener('mouseleave', addClickHandler)
    elEditorActions.removeEventListener('mouseover', removeClickHandler)

    elBackBtn.removeEventListener('mouseleave', addClickHandler)
    elBackBtn.removeEventListener('mouseenter', removeClickHandler)
}

function getEvPos(ev) {
    // Check if it is a touch event
    if (TOUCH_EVENTS.includes(ev.type)) {
        ev.preventDefault() // Stop double-firing mouse fallback events

        const touch = ev.targetTouches[0]

        // Get the absolute position of the canvas on the screen
        const rect = gElCanvas.getBoundingClientRect()

        // Subtract canvas screen coordinates from touch screen coordinates
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        }
    } else {
        // Desktop mouse tracking stays lightweight
        return {
            x: ev.offsetX,
            y: ev.offsetY,
        }
    }
}