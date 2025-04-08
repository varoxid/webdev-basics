
function initSettings() {
    const savedSettings = localStorage.getItem('paintSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        getRequiredElement(document.querySelector('#defaultColor')).value = settings.defaultColor;
        getRequiredElement(document.querySelector('#lineWidth')).value = settings.lineWidth;
        getRequiredElement(document.querySelector('#widthValue')).textContent = settings.lineWidth;
        getRequiredElement(document.querySelector('#brushMode')).value = settings.brushMode;
        getRequiredElement(document.querySelector('#opacity')).value = settings.opacity;
        getRequiredElement(document.querySelector('#opacityValue')).textContent = settings.opacity;
        getRequiredElement(document.querySelector('#canvasBg')).value = settings.canvasBg;
        getRequiredElement(document.querySelector('#userName')).value = settings.userName || '';
    }
}

function saveSettings() {
    const form = getRequiredElement(document.querySelector('#settingsForm'));
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

    const themeSelector = getRequiredElement(document.querySelector('#theme'));
    const currentTheme = initTheme();
    themeSelector.value = currentTheme;
    
    themeSelector.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });

    getRequiredElement(document.querySelector('#lineWidth')).addEventListener('input', (e) => {
        document.querySelector('#widthValue').textContent = e.target.value;
    });
    
    getRequiredElement(document.querySelector('#opacity')).addEventListener('input', (e) => {
        document.querySelector('#opacityValue').textContent = e.target.value;
    });
    
    getRequiredElement(document.querySelector('#settingsForm')).addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
        alert('Settings saved');
    });
    
    getRequiredElement(document.querySelector('#resetBtn')).addEventListener('click', () => {
        localStorage.clear();
        initSettings();
        alert('Settings reset');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});
