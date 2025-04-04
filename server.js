const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 8888;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });
let drawings = [];
let users = new Set();

const userLocations = {};

wss.on('connection', (ws) => {
  users.add(ws);
  updateUserCount();

  ws.send(JSON.stringify({ type: 'init', data: drawings }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'draw') {
      drawings.push(data.data);
      broadcast({ type: 'draw', data: data.data }, ws);
    }

    if (data.type === 'clear') {
      drawings = [];
      broadcast({ type: 'clear' });
    }

    if (data.type === 'location') {
      userLocations[data.userId] = {
          location: data.location,
          color: data.color,
          ws: ws
      };
      
      broadcast({
          type: 'location',
          userId: data.userId,
          location: data.location,
          color: data.color
      });
    }
  });

  ws.on('close', () => {
    const userId = Object.keys(userLocations).find(
      key => userLocations[key].ws === ws
    );
  
    if (userId) {
        delete userLocations[userId];
        broadcast({ type: 'userDisconnected', userId });
    }
    
    users.delete(ws);
    updateUserCount();
  });
});

function broadcast(message, excludeWs = null) {
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function updateUserCount() {
  broadcast({ type: 'users', count: users.size });
}
