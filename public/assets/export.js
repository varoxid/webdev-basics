function handleLoadButtonEvent(previewCanvas) {
    const storedCanvas = localStorage.getItem('savedCanvas');
    const previewPlaceholder = document.querySelector('#previewPlaceholder');
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
            
            document.querySelector('#exportBtn').disabled = false;
        };
        img.src = storedCanvas;
    } else {
        alert('No images in local storage');
    }
}

function initExportPage() {
    initTheme();

    const previewCanvas = document.querySelector('#imagePreview');
    
    //TODO: move to settings
    previewCanvas.width = 800;
    previewCanvas.height = 500;
    
    document.querySelector('#loadBtn').addEventListener('click', () => {
        handleLoadButtonEvent(previewCanvas);
    });
    
    document.querySelector('#exportBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `image-${new Date().toISOString().slice(0,10)}.jpg`;
        link.href = previewCanvas.toDataURL('image/jpeg', 0.9);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    document.querySelector('#clearBtn').addEventListener('click', () => {
        localStorage.removeItem('savedCanvas');
        previewCanvas.style.display = 'none';
        document.querySelector('#previewPlaceholder').style.display = 'block';
        document.querySelector('#exportBtn').disabled = true;
        alert('Local Storage cleared!');
    });
}

document.addEventListener('DOMContentLoaded', initExportPage);
