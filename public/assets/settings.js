
function loadSettings() {
    const savedSettings = localStorage.getItem('paintSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.getElementById('defaultColor').value = settings.defaultColor;
        document.getElementById('lineWidth').value = settings.lineWidth;
        document.getElementById('widthValue').textContent = settings.lineWidth;
        document.getElementById('brushMode').value = settings.brushMode;
        document.getElementById('opacity').value = settings.opacity;
        document.getElementById('opacityValue').textContent = settings.opacity;
        document.getElementById('canvasBg').value = settings.canvasBg;
        document.getElementById('userName').value = settings.userName || '';
    }
}

function saveSettings() {
    const form = document.getElementById('settingsForm');
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

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('themePreference', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    applyTheme(savedTheme);
    return savedTheme;
}

function initSettingsPage() {
    loadSettings();

    const themeSelector = document.getElementById('theme');
    const currentTheme = loadTheme();
    themeSelector.value = currentTheme;
    
    themeSelector.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });
    

    document.getElementById('lineWidth').addEventListener('input', (e) => {
        document.getElementById('widthValue').textContent = e.target.value;
    });
    
    document.getElementById('opacity').addEventListener('input', (e) => {
        document.getElementById('opacityValue').textContent = e.target.value;
    });
    
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings();
        alert('Settings saved');
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        localStorage.clear();
        loadSettings();
        alert('Settings reset');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});
