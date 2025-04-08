
function initSettings() {
    const savedSettings = localStorage.getItem('paintSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.querySelector('#defaultColor').value = settings.defaultColor;
        document.querySelector('#lineWidth').value = settings.lineWidth;
        document.querySelector('#widthValue').textContent = settings.lineWidth;
        document.querySelector('#brushMode').value = settings.brushMode;
        document.querySelector('#opacity').value = settings.opacity;
        document.querySelector('#opacityValue').textContent = settings.opacity;
        document.querySelector('#canvasBg').value = settings.canvasBg;
        document.querySelector('#userName').value = settings.userName || '';
    }
}

function saveSettings() {
    const form = document.querySelector('#settingsForm');
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

    const themeSelector = document.querySelector('#theme');
    const currentTheme = initTheme();
    themeSelector.value = currentTheme;
    
    themeSelector.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });

    document.querySelector('#lineWidth').addEventListener('input', (e) => {
        document.querySelector('#widthValue').textContent = e.target.value;
    });
    
    document.querySelector('#opacity').addEventListener('input', (e) => {
        document.querySelector('#opacityValue').textContent = e.target.value;
    });
    
    document.querySelector('#settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
        alert('Settings saved');
    });
    
    document.querySelector('#resetBtn').addEventListener('click', () => {
        localStorage.clear();
        initSettings();
        alert('Settings reset');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});
