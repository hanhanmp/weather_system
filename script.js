// Initialize the map
let map = L.map('map', {
    renderer: L.canvas(), // Use Canvas renderer for better performance
    preferCanvas: true
}).setView([28.3, 120.5], 8);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

let townGeojsonLayer;
let countyGeojsonLayer;

// Add manual latitude and longitude grid lines with labels
function addGraticule() {
    const latLines = [];
    const lngLines = [];

    for (let lat = 27; lat <= 29; lat += 0.5) {
        latLines.push(L.polyline([[lat, 119], [lat, 122]], { color: '#888', weight: 0.5, opacity: 0.8 }).addTo(map));
        // Add latitude labels
        L.marker([lat, 119], {
            icon: L.divIcon({
                className: 'lat-label',
                html: `<div style="transform: translate(-50%, -100%); font-size: 10px; color: #555;">${lat}° N</div>`
            })
        }).addTo(map);
    }

    for (let lng = 119; lng <= 122; lng += 0.5) {
        lngLines.push(L.polyline([[27, lng], [29, lng]], { color: '#888', weight: 0.5, opacity: 0.8 }).addTo(map));
        // Add longitude labels
        L.marker([27, lng], {
            icon: L.divIcon({
                className: 'lng-label',
                html: `<div style="transform: translate(-50%, 0); font-size: 10px; color: #555;">${lng}° E</div>`
            })
        }).addTo(map);
    }
}

addGraticule(); // Call the function to add grid lines and labels

// Load town-level shapefile and style boundaries
shp('xiangzhen.zip').then(function(geojson) {
    townGeojsonLayer = L.geoJSON(geojson, {
        style: function (feature) {
            return {color: '#D3D3D3', weight: 0.6, opacity: 0.4}; // Lighter and thinner for town
        },
        onEachFeature: function (feature, layer) {
            layer.on({
                click: onFeatureClick
            });
        }
    }).addTo(map);
});

// Load county-level shapefile and style boundaries
shp('shp.zip').then(function(geojson) {
    countyGeojsonLayer = L.geoJSON(geojson, {
        style: function (feature) {
            return {color: '#696969', weight: 1, opacity: 1}; // Softer and lighter for county boundaries
        }
    }).addTo(map);
});

// Function for feature click event to set the risk level
function onFeatureClick(e) {
    const layer = e.target;
    layer.setStyle({
        fillColor: getColor(document.getElementById('risk-level').value),
        fillOpacity: 0.8,
        color: '#777777',
        weight: 1
    });
}

// Add legend for risk levels
function addLegend() {
    const legend = L.control({position: 'bottomleft'});
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `<h4>风险等级</h4>
                         <i style="background: #FF4500; width: 12px; height: 12px; display: inline-block;"></i> 极高<br>
                         <i style="background: #FFA500; width: 12px; height: 12px; display: inline-block;"></i> 高<br>
                         <i style="background: #FFD700; width: 12px; height: 12px; display: inline-block;"></i> 中<br>
                         <i style="background: #9ACD32; width: 12px; height: 12px; display: inline-block;"></i> 低<br>
                         <i style="background: #87CEEB; width: 12px; height: 12px; display: inline-block;"></i> 无风险<br>`;
        return div;
    };
    legend.addTo(map);
}

// Add legend to the map
addLegend();

function saveMap() {
    // Use html2canvas to save the map as an image with higher resolution
    html2canvas(document.getElementById('map'), { scale: 2 }).then(canvas => {
        // Create a temporary download link
        let link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'map.png'; // File name as map.png
        link.click(); // Trigger the download
    }).catch(error => {
        console.error('Error saving the map:', error);
    });
}

// Start box select function
function startBoxSelect() {
    map.dragging.disable(); // Disable map dragging
    let boxLayer;

    map.on('mousedown', function(e) {
        if (boxLayer) {
            map.removeLayer(boxLayer);
        }
        let startPoint = e.latlng;
        boxLayer = L.rectangle([startPoint, startPoint], {color: "#76c7c0", weight: 1}).addTo(map);

        map.on('mousemove', onMouseMove);
        map.on('mouseup', onMouseUp);

        function onMouseMove(e) {
            boxLayer.setBounds([startPoint, e.latlng]);
        }

        function onMouseUp(e) {
            map.off('mousemove', onMouseMove);
            map.off('mouseup', onMouseUp);
            map.dragging.enable();

            let bounds = boxLayer.getBounds();
            townGeojsonLayer.eachLayer(function(layer) {
                if (bounds.intersects(layer.getBounds())) {
                    layer.setStyle({
                        fillColor: getColor(document.getElementById('risk-level').value),
                        fillOpacity: 0.8,
                        color: '#777777',
                        weight: 1
                    });
                }
            });

            // Remove selection box
            map.removeLayer(boxLayer);
        }
    });

    // End box select mode
    map.on('mouseup', function() {
        map.dragging.enable();
    });
}

// Function to get color based on risk level
function getColor(risk) {
    switch (risk) {
        case '极高': return '#FF4500'; 
        case '高': return '#FFA500';  
        case '中': return '#FFD700';  
        case '低': return '#9ACD32';  
        case '无风险': return '#87CEEB';
        default: return '#FFFFFF'; // White
    }
}
