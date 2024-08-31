// 初始化地图
let map = L.map('map', {
    renderer: L.canvas(), // 使用Canvas渲染器来提高绘制性能
    preferCanvas: true
}).setView([28.3, 120.5], 8);

// 添加 OpenStreetMap 瓦片层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

let geojsonLayer;


// Add manual latitude and longitude grid lines
function addGraticule() {
    const latLines = [];
    const lngLines = [];

    for (let lat = 27; lat <= 29; lat += 0.5) {
        latLines.push(L.polyline([[lat, 119], [lat, 122]], { color: '#888', weight: 0.5, opacity: 0.8 }));
    }

    for (let lng = 119; lng <= 122; lng += 0.5) {
        lngLines.push(L.polyline([[27, lng], [29, lng]], { color: '#888', weight: 0.5, opacity: 0.8 }));
    }

    latLines.forEach(line => line.addTo(map));
    lngLines.forEach(line => line.addTo(map));
}

addGraticule(); // Call the function to add grid lines

// 加载 shapefile
// Load shapefile
shp('xiangzhen.zip').then(function(geojson) {
    geojsonLayer = L.geoJSON(geojson, {
        onEachFeature: function (feature, layer) {
            layer.on({
                click: onFeatureClick
            });
        },
        style: function (feature) {
            // Different styles based on the feature level
            if (feature.properties.level === 'county') {
                return {color: '#333333', weight: 2}; // Darker and thicker for county
            } else if (feature.properties.level === 'town') {
                return {color: '#999999', weight: 0.5}; // Lighter and thinner for town
            }
            return {color: '#777777', weight: 1}; // Default style
        }
    }).addTo(map);
});


// 处理点击事件
function onFeatureClick(e) {
    const layer = e.target;

    // 重置图层样式，确保不受之前样式影响
    layer.setStyle({
        fillColor: getColor(document.getElementById('risk-level').value), // 直接设置目标颜色
        fillOpacity: 0.8, // 确保透明度一致
        color: '#777777',
        weight: 1
    });
}

// 在框选功能中也确保不重复叠加样式
function startBoxSelect() {
    map.dragging.disable(); // 禁用地图拖动
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
            geojsonLayer.eachLayer(function(layer) {
                if (bounds.intersects(layer.getBounds())) {
                    // 直接设置颜色，避免重复叠加
                    layer.setStyle({
                        fillColor: getColor(document.getElementById('risk-level').value),
                        fillOpacity: 0.8, // 统一透明度
                        color: '#777777',
                        weight: 1
                    });
                }
            });

            // 清除选择框
            map.removeLayer(boxLayer);
        }
    });

    // 结束框选模式
    map.on('mouseup', function() {
        map.dragging.enable();
    });
}

// 获取颜色函数
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


// 添加风险等级标签
function addLegend() {
    const legend = L.control({position: 'bottomleft'}); // 设置在左下角

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

// 添加图例到地图
addLegend();

function saveMap() {
    // 使用 html2canvas 将地图保存为图片
    html2canvas(document.getElementById('map')).then(canvas => {
        // 创建一个临时的下载链接
        let link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'map.png'; // 文件名为 map.png
        link.click(); // 触发下载
    }).catch(error => {
        console.error('Error saving the map:', error);
    });
}
