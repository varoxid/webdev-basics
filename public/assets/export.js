function handleLoadButtonEvent(previewCanvas) {
    const storedCanvas = localStorage.getItem('savedCanvas');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const previewCtx = previewCanvas.getContext('2d');

    if (storedCanvas) {
        const img = new Image();
        img.onload = () => {
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            
            const ratio = Math.min(
                previewCanvas.width / img.width,
                previewCanvas.height / img.height
            );
            const newWidth = img.width * ratio;
            const newHeight = img.height * ratio;
            const x = (previewCanvas.width - newWidth) / 2;
            const y = (previewCanvas.height - newHeight) / 2;
            
            previewCtx.drawImage(img, x, y, newWidth, newHeight);
            
            previewCanvas.style.display = 'block';
            previewPlaceholder.style.display = 'none';
            
            document.getElementById('exportBtn').disabled = false;
        };
        img.src = storedCanvas;
    } else {
        alert('No images in local storage');
    }
}

function initExportPage() {
    initTheme();

    const previewCanvas = document.getElementById('imagePreview');
    
    //TODO: move to settings
    previewCanvas.width = 800;
    previewCanvas.height = 500;
    
    document.getElementById('loadBtn').addEventListener('click', () => {
        handleLoadButtonEvent(previewCanvas);
    });
    
    document.getElementById('exportBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `image-${new Date().toISOString().slice(0,10)}.jpg`;
        link.href = previewCanvas.toDataURL('image/jpeg', 0.9);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    document.getElementById('clearBtn').addEventListener('click', () => {
        localStorage.removeItem('savedCanvas');
        previewCanvas.style.display = 'none';
        document.getElementById('previewPlaceholder').style.display = 'block';
        document.getElementById('exportBtn').disabled = true;
        alert('Local Storage cleared!');
    });
}

document.addEventListener('DOMContentLoaded', initExportPage);