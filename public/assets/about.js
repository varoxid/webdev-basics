function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('themePreference', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    applyTheme(savedTheme);
    return savedTheme;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    document.body.className = savedTheme;

    loadTheme();

    let myAudio = document.querySelector('#audio')
    myAudio.volume=0.05;
    myAudio.play()
});