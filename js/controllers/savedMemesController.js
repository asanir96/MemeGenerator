'use strict'
function initMemes() {
}

function onOpenMemesSection() {
    setSelectedMemeIdx()
    gElMemeCanvas.width = 300
    gElMemeCanvas.height = 150

    gScale = 1
    loadMemesFromStorage()

    // Switch between sections
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.memes').classList.remove('hidden')

    // Highlighting relevant nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('selected'))
    document.querySelector('.nav-btn.open-memes').classList.add('selected')
    renderSavedMemes()
}

function renderSavedMemes() {
    const memes = getMemes().memeList

    document.querySelector('.memes').innerHTML = memes.map(meme => {
        if (meme.dataUrl) {
            return `
        <div class="saved-meme position-relative">
            <button class="saved-meme-action-btn delete-meme" onclick="onDeleteMeme('${meme.id}')">
                <i class="fa-solid fa-trash"></i>
            </button>
            <button class="saved-meme-action-btn edit-meme" onclick="onMemeSelect('${meme.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <img class="saved-meme-img" src="${meme.dataUrl}" alt="" >
        </div>        `
        }
    }).join('')
        ;
}

function onMemeSelect(memeId) {

    setSelectedMemeIdx(memeId)
    showEditor(gCurrMemeID)
}


function onDeleteMeme(memeId){
    deleteMeme(memeId)
    renderSavedMemes()
}