document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color');
    const brushSize = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const usersCount = document.getElementById('usersCount');
    const userNameDisplay = document.getElementById('userNameDisplay');

    const savedSettings = localStorage.getItem('paintSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        colorPicker.value = settings.defaultColor || '#000000';
        brushSize.value = settings.lineWidth || 5;
        brushSizeValue.textContent = settings.lineWidth || 5;
        canvas.style.backgroundColor = settings.canvasBg || '#ffffff';
        userNameDisplay.textContent = settings.userName || 'Anonymous';
    }

    const ws = new WebSocket(`ws://${window.location.hostname}:8888`);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    initInfoPanel(ws);

    function initInfoPanel(ws) {
        const panel = document.getElementById('infoPanel');
        const header = panel.querySelector('.info-panel-header');
        const closeBtn = panel.querySelector('.close-panel');
        const timeElement = document.getElementById('currentTime');

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

        function updateTime() {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }

        setInterval(updateTime, 1500);
        updateTime();

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'users') {
                document.getElementById('usersCount').textContent = data.count;
            }
        };
    }

    function initCanvas() {
        ctx.fillStyle = canvas.style.backgroundColor || 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw(x1, y1, x2, y2, color, width) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'draw') {
            const { x1, y1, x2, y2, color, width } = data.data;
            draw(x1, y1, x2, y2, color, width);
        }

        if (data.type === 'clear') {
            initCanvas();
        }

        if (data.type === 'init') {
            initCanvas();
            data.data.forEach(item => {
                draw(item.x1, item.y1, item.x2, item.y2, item.color, item.width);
            });
        }

        if (data.type === 'users') {
            usersCount.textContent = data.count;
        }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    clearBtn.addEventListener('click', () => {
        if (confirm('Clear the canvas?')) {
            initCanvas();
            ws.send(JSON.stringify({ type: 'clear' }));
        }
    });

    saveBtn.addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png');
        localStorage.setItem('savedCanvas', dataURL);
        alert('Saved in local storage');
    });

    brushSize.addEventListener('input', () => {
        brushSizeValue.textContent = brushSize.value;
    });

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getPosition(e);
    }

    function drawLine(e) {
        if (!isDrawing) return;

        const [currentX, currentY] = getPosition(e);

        draw(lastX, lastY, currentX, currentY, colorPicker.value, brushSize.value);

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

    function stopDrawing() {
        isDrawing = false;
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        isDrawing = true;
        [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    }

    function handleTouchMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const [currentX, currentY] = getPosition(touch);

        draw(lastX, lastY, currentX, currentY, colorPicker.value, brushSize.value);

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

    function getPosition(event) {
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

    const savedCanvas = localStorage.getItem('savedCanvas');
    if (savedCanvas) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedCanvas;
    } else {
        initCanvas();
    }

    ws.onclose = () => {
        alert('The connection to the server has been lost');
    };
});
