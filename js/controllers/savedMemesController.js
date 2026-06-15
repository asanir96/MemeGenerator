'use strict'

function onOpenMemesSection() {
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
        <img class="saved-meme-img" src="${meme.dataUrl}" alt="" onclick="showEditor('${meme.id}')">
        `
        }
    }).join('')
        ;
}
