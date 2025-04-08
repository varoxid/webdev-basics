const WEBSOCKET_PORT = 8888;

window.onerror = (message) => {
    alert(`message: ${message}`);
    return true;
  };

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('themePreference', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    applyTheme(savedTheme);
    return savedTheme;
}

function getRequiredDOMElement(elementName) {
    let element = document.querySelector(elementName);
    if (element !== null) {
      return element;
    }
    throw new Error('Element not found: ' + elementName)
}
