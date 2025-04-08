
function initSettings() {
    const savedSettings = localStorage.getItem('paintSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        getRequiredDOMElement('#defaultColor').value = settings.defaultColor;
        getRequiredDOMElement('#lineWidth').value = settings.lineWidth;
        getRequiredDOMElement('#widthValue').textContent = settings.lineWidth;
        getRequiredDOMElement('#brushMode').value = settings.brushMode;
        getRequiredDOMElement('#opacity').value = settings.opacity;
        getRequiredDOMElement('#opacityValue').textContent = settings.opacity;
        getRequiredDOMElement('#canvasBg').value = settings.canvasBg;
        getRequiredDOMElement('#userName').value = settings.userName || '';
    }
}

function saveSettings() {
    const form = getRequiredDOMElement('#settingsForm');
    const formData = new FormData(form);
    
    const settings = {
        defaultColor: formData.get('defaultColor'),
        lineWidth: formData.get('lineWidth'),
        brushMode: formData.get('brushMode'),
        opacity: formData.get('opacity'),
        canvasBg: formData.get('canvasBg'),
        userName: formData.get('userName'),
        notifications: formData.get('notifications') === 'on',
    };
    
    localStorage.setItem('paintSettings', JSON.stringify(settings));
}

function initSettingsPage() {
    initSettings();

    const themeSelector = getRequiredDOMElement('#theme');
    const currentTheme = initTheme();
    themeSelector.value = currentTheme;
    
    themeSelector.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });

    getRequiredDOMElement('#lineWidth').addEventListener('input', (e) => {
        getRequiredDOMElement('#widthValue').textContent = e.target.value;
    });
    
    getRequiredDOMElement('#opacity').addEventListener('input', (e) => {
        getRequiredDOMElement('#opacityValue').textContent = e.target.value;
    });
    
    getRequiredDOMElement('#settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
        alert('Settings saved');
    });
    
    getRequiredDOMElement('#resetBtn').addEventListener('click', () => {
        localStorage.clear();
        initSettings();
        alert('Settings reset');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});
