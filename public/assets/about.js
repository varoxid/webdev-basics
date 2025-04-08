document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    let myAudio = getRequiredElement(document.querySelector('#audio'));
    myAudio.volume=0.05;
    myAudio.play()
});
