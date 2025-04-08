document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    let myAudio = getRequiredDOMElement('#audio');
    myAudio.volume=0.05;
    myAudio.play()
});
