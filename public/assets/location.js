let userMap;
let userMarker;
let userLocation = null;
const userMarkers = {};
const ws = new WebSocket(`ws://${window.location.hostname}:${WEBSOCKET_PORT}`);

//TODO: generate colors
const userColors = [
    '#FFAB40', '#FF4081', '#FFAB40', '#7C4DFF'
];

function initLocationPage() {
    initTheme();
    initMap();
    initWsConnection();
    resolveGeolocation();
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

function initWsConnection() {
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

function resolveGeolocation() {
    const statusElement = getRequiredDOMElement('#locationStatus');
    
    if (!navigator.geolocation) {
        statusElement.textContent = "Unsupported";
        return;
    }
    
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            userLocation = { latitude, longitude };
            
            getRequiredDOMElement('#coordinates').textContent =
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
            
            upsertMarker(latitude, longitude);
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

function upsertMarker(lattitude, longitude) {
    const coordinates = ol.proj.fromLonLat([longitude, lattitude]);
    
    if(userMarker) {
        userMarker.getGeometry().setCoordinates(coordinates);
    } else {
        userMarker = createMarker(coordinates)
        
        const vectorSource = new ol.source.Vector({
            features: [userMarker]
        });
        
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
        
        userMap.addLayer(vectorLayer);
    }
    
    userMap.getView().setCenter(coordinates);
}

function createMarker(coords) {
    const marker = new ol.Feature({
        geometry: new ol.geom.Point(coords)
    });

    marker.setStyle(createMarkerStyle());

    return marker; 
}

function createMarkerStyle() {
    const userColor = getUserColor(localStorage.getItem('userId'));
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({ color: userColor }),
            stroke: new ol.style.Stroke({ color: '#000', width: 1 })
        })
    });
}

function updateUserLocation(userId, location, color) {
    if(userMarkers[userId]) {
        userMarkers[userId].setLatLng([location.latitude, location.longitude]);
    } else {
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
    }
    
    updateUserList();
}

function removeUserMarker(userId) {
    if (userMarkers[userId]) {
        userMap.removeLayer(userMarkers[userId]);
        delete userMarkers[userId];
    }
    updateUserList();
}

function updateUserList() {
    const usersList = getRequiredDOMElement('#usersList');
    usersList.innerHTML = '';
    
    Object.keys(userMarkers).forEach(userId => {
        const color = userMarkers[userId].options.color;
        const coords = userMarkers[userId].getLatLng();
        
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        // TODO: remove hardcoded html
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
