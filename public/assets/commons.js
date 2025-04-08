const WEBSOCKET_PORT = 8888;
const WS = new WebSocket(`ws://${window.location.hostname}:${WEBSOCKET_PORT}`);

window.onerror = (message) => {
    alert(`message: ${message}`);
    return true;
};

function initWs() {
    WS.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    WS.onerror = (event) => {
        console.error('Websocket error: ', event);
    };
    
    WS.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };
}

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
