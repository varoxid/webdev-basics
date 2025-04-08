let isDrawing = false;
let lastX = 0;
let lastY = 0;
const ws = new WebSocket(`ws://${window.location.hostname}:8888`);

function updateTime() {
    const now = new Date();
    getRequiredDOMElement('#currentTime').textContent = now.toLocaleTimeString();
}

function initInfoPanel(ws) {
    const panel = getRequiredDOMElement('#infoPanel2');
    const header = getRequiredDOMElement('.info-panel-header');
    const closeBtn = getRequiredDOMElement('.close-panel');

    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = '';
    });

    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        localStorage.setItem('panelVisible', 'false');
    });

    const savedPos = localStorage.getItem('panelPosition');
    const isVisible = localStorage.getItem('panelVisible') !== 'false';

    if (savedPos) {
        const { x, y } = JSON.parse(savedPos);
        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
    }

    if (!isVisible) {
        panel.style.display = 'none';
    }

    panel.addEventListener('mouseup', () => {
        if (isDragging) {
            localStorage.setItem('panelPosition', JSON.stringify({
                x: parseInt(panel.style.left),
                y: parseInt(panel.style.top)
            }));
        }
    });

    setInterval(updateTime, 1500);
    updateTime();

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'users') {
            getRequiredDOMElement('#usersCount').textContent = data.count;
        }
    };
}

function initCanvas(ctx, canvas) {
    ctx.fillStyle = canvas.style.backgroundColor || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw(ctx, x1, y1, x2, y2, color, width) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function getPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (event.clientX) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    } else {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    }

    return [x, y];
}

function handleEvents(ctx, canvas, ws) {
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'draw') {
            const { x1, y1, x2, y2, color, width } = data.data;
            draw(ctx, x1, y1, x2, y2, color, width);
        }

        if (data.type === 'clear') {
            initCanvas(ctx, canvas);
        }

        if (data.type === 'init') {
            initCanvas(ctx, canvas);
            data.data.forEach(item => {
                draw(ctx, item.x1, item.y1, item.x2, item.y2, item.color, item.width);
            });
        }

        if (data.type === 'users') {
            getRequiredDOMElement('#usersCount').textContent = data.count;
        }
    };
}

function updateCanvas(ctx, canvas) {
    const savedCanvas = localStorage.getItem('savedCanvas');
    if (savedCanvas) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedCanvas;
    } else {
        initCanvas(ctx, canvas);
    }
}

function stopDrawing() {
    isDrawing = false;
}

function startDrawing(e) {
    isDrawing = true;
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const canvas = getRequiredDOMElement('#paintCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = getRequiredDOMElement('#color');
    const brushSize = getRequiredDOMElement('#brushSize');
    const brushSizeValue = getRequiredDOMElement('#brushSizeValue');

    const savedSettings = localStorage.getItem('paintSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        colorPicker.value = settings.defaultColor || '#000000';
        brushSize.value = settings.lineWidth || 5;
        brushSizeValue.textContent = settings.lineWidth || 5;
        canvas.style.backgroundColor = settings.canvasBg || '#ffffff';
        getRequiredDOMElement('#userNameDisplay').textContent = settings.userName || 'Anonymous';
    }

    initInfoPanel(ws);
    handleEvents(ctx, canvas, ws);
    updateCanvas(ctx, canvas);

    canvas.addEventListener('mousedown', e => {
        startDrawing(e);
        [lastX, lastY] = getPosition(canvas, e);
    });
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    getRequiredDOMElement('#clearBtn').addEventListener('click', () => {
        if (confirm('Clear the canvas?')) {
            initCanvas(ctx, canvas);
            ws.send(JSON.stringify({ type: 'clear' }));
        }
    });

    getRequiredDOMElement('#saveBtn').addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png');
        localStorage.setItem('savedCanvas', dataURL);
        alert('Saved in local storage');
    });

    brushSize.addEventListener('input', () => {
        brushSizeValue.textContent = brushSize.value;
    });

    function drawLine(e) {
        if (!isDrawing) {
            return;
        }

        const [currentX, currentY] = getPosition(canvas, e);

        draw(ctx, lastX, lastY, currentX, currentY, colorPicker.value, brushSize.value);

        ws.send(JSON.stringify({
            type: 'draw',
            data: {
                x1: lastX,
                y1: lastY,
                x2: currentX,
                y2: currentY,
                color: colorPicker.value,
                width: brushSize.value
            }
        }));

        [lastX, lastY] = [currentX, currentY];
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        isDrawing = true;
        [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    }

    function handleTouchMove(e) {
        if (!isDrawing) {
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        const [currentX, currentY] = getPosition(canvas, touch);

        draw(ctx, lastX, lastY, currentX, currentY, colorPicker.value, brushSize.value);

        ws.send(JSON.stringify({
            type: 'draw',
            data: {
                x1: lastX,
                y1: lastY,
                x2: currentX,
                y2: currentY,
                color: colorPicker.value,
                width: brushSize.value
            }
        }));

        [lastX, lastY] = [currentX, currentY];
    }

    ws.onclose = () => {
        alert('The connection to the server has been lost');
    };
});
