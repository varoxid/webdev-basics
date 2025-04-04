document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    let myAudio = document.querySelector('#audio')
    myAudio.volume=0.05;
    myAudio.play()
});