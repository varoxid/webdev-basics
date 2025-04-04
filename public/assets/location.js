let userMap;
let userMarker;
let userLocation = null;
const userMarkers = {};
let ws;
let map;

//TODO: generate colors
const userColors = [
    '#FFAB40', '#FF4081', '#FFAB40', '#7C4DFF'
];

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('themePreference', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    applyTheme(savedTheme);
    return savedTheme;
}

function initLocationPage() {
    const savedTheme = localStorage.getItem('themePreference') || 'light';
    document.body.className = savedTheme;
    
    loadTheme();
    initMap();
    connectWebSocket();
    requestGeolocation();
}

function initMap() {
    userMap = new ol.Map({
        target: 'userMap',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([37.6173, 55.7558]),
            zoom: 2
        })
    });
}

function connectWebSocket() {
    ws = new WebSocket(`ws://${window.location.hostname}:8888`);
    
    ws.onopen = () => {
        console.log('Connected to WebSocket server');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'location') {
            updateUserLocation(data.userId, data.location, data.color);
        } else if (data.type === 'userDisconnected') {
            removeUserMarker(data.userId);
        }
    };
    
    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };
}

function requestGeolocation() {
    const statusElement = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        statusElement.textContent = "Unsupported";
        return;
    }
    
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            userLocation = { latitude, longitude };
            
            document.getElementById('coordinates').textContent = 
                `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
            
            if (ws && ws.readyState === WebSocket.OPEN) {
                const userId = localStorage.getItem('userId') || generateUserId();
                localStorage.setItem('userId', userId);
                
                const userColor = getUserColor(userId);
                
                ws.send(JSON.stringify({
                    type: 'location',
                    userId,
                    location: userLocation,
                    color: userColor
                }));
            }
            
            updateMarker(latitude, longitude);
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        }
    );
}

function updateMarker(lat, lng) {
    const coords = ol.proj.fromLonLat([lng, lat]);
    
    if (!userMarker) {
        const userColor = getUserColor(localStorage.getItem('userId'));
        userMarker = new ol.Feature({
            geometry: new ol.geom.Point(coords)
        });
        
        const markerStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({ color: userColor }),
                stroke: new ol.style.Stroke({ color: '#000', width: 1 })
            })
        });
        
        userMarker.setStyle(markerStyle);
        
        const vectorSource = new ol.source.Vector({
            features: [userMarker]
        });
        
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
        
        userMap.addLayer(vectorLayer);
    } else {
        userMarker.getGeometry().setCoordinates(coords);
    }
    
    userMap.getView().setCenter(coords);
}

function updateUserLocation(userId, location, color) {
    if (!userMarkers[userId]) {
        userMarkers[userId] = L.circleMarker(
            [location.latitude, location.longitude], 
            {
                color: color,
                fillColor: color,
                fillOpacity: 0.6,
                radius: 6
            }
        ).addTo(userMap);
        
        userMarkers[userId].bindPopup(`User ${userId.slice(0, 6)}`);
    } else {
        userMarkers[userId].setLatLng([location.latitude, location.longitude]);
    }
    
    updateUsersList();
}

function removeUserMarker(userId) {
    if (userMarkers[userId]) {
        userMap.removeLayer(userMarkers[userId]);
        delete userMarkers[userId];
    }
    updateUsersList();
}

function updateUsersList() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    Object.keys(userMarkers).forEach(userId => {
        const color = userMarkers[userId].options.color;
        const coords = userMarkers[userId].getLatLng();
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <div class="user-color" style="background-color: ${color};"></div>
            <div>
                <strong>ID:</strong> ${userId.slice(0, 6)}...<br>
                <small>Latitude: ${coords.lat.toFixed(2)}, Longitude: ${coords.lng.toFixed(2)}</small>
            </div>
        `;
        usersList.appendChild(userItem);
    });
}

function generateUserId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
}

function getUserColor(userId) {
    const hash = Array.from(userId).reduce((hash, char) => {
        return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
    }, 0);
    
    return userColors[Math.abs(hash) % userColors.length];
}

document.addEventListener('DOMContentLoaded', initLocationPage);