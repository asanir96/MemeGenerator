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
    window.addEventListener("resize", () => renderMeme(true))

    const elEditor = document.querySelector('.editor')
    elEditor.addEventListener('mousedown', onEditorDown, true)

    document.querySelector('.line-text-edit').addEventListener('input', onTextInput)
    document.querySelector('.line-text-edit').addEventListener('focus', onTextClick)

}

function onEditorDown(ev) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    const elClickTarget = ev.target

    if (elClickTarget.closest('.canvas-container')) {
        onDown(ev)
        return
    }

    if (elClickTarget.closest('.download-btn')) {
        const elDownloadBtn = document.querySelector('.download-btn')
        onDownloadMeme(elDownloadBtn, ev)
        return
    }

    if ((!elClickTarget.closest('.line-action-btn') &&
        !elClickTarget.closest('.text-control'))) {
        console.log(elClickTarget.closest('.text-control'))
        disableEdit()
        renderLineEditor(true)
        return
    }

    if (elClickTarget.closest('.line-text-edit')) {
        return
    }

    if (elClickTarget.closest('.editor-back-btn')) {
        onCloseEditor(ev)
        return
    }
}