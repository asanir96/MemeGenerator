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

    window.addEventListener("resize", () => {
        if (!elEditor.classList.contains('hidden')) renderMeme(true)

        if (window.innerWidth > 740) {
            document.querySelector('.main-nav').style.transform = "translateX(0%)"
        } else {
            document.querySelector('.main-nav').style.transform = "translateX(100%)"

        }



    })

    elEditor.addEventListener('mousedown', onEditorDown, true)

    document.querySelector('.line-text-edit').addEventListener('input', onTextInput)
    document.querySelector('.line-text-edit').addEventListener('focus', onTextClick)

}

function onEditorDown(ev) {
    const meme = getSelectedMeme()
    const { selectedLineIdx } = meme

    const elClickTarget = ev.target
    console.log(elClickTarget)
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

function onShowNav(ev) {
    const ElMainNav = document.querySelector('.main-nav')
    ElMainNav.style.transform = "translateX(0%)"
    ElMainNav.style.opacity = "1"

}

function onOpenSection(section) {
    if (section === 'memes') onOpenMemesSection()
    else if (section === 'gallery') onOpenGallery()

    if (window.innerWidth < 740) {
        document.querySelector('.main-nav').style.transform = "translateX(100%)"
    }
}