function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('themePreference', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    applyTheme(savedTheme);
    return savedTheme;
}

function getRequiredElement(element) {
    if (element !== null) {
        return element;
    }

    alert('The element does not exists in the page.');
}

function getRequiredDOMElement(elementName) {
    let element = document.querySelector(elementName);
    if (element !== null) {
        return element;
    }

    alert('The element does not exists in the page: name=' + elementName);
}
