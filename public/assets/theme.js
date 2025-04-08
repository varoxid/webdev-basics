function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('themePreference', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    applyTheme(savedTheme);
    return savedTheme;
}
