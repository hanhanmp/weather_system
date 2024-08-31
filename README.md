# weather_system 天气预警风险等级调整
选择风险等级，鼠标单击更改颜色  
如若要框选，每次框选前，需要点击按钮Start Box Select  
风险等级可以重复修改  
调整结束之后点击Save Map即可保存图片  

# 各个文件作用
1. HTML 文件

    功能: 定义网页的结构和内容。
    主要任务:
        创建地图的容器（如 <div id="map"></div>），用于显示 Leaflet 地图。
        包含其他必要的 HTML 元素，例如按钮、下拉菜单或图例，用于用户交互。
        引入 CSS 和 JS 文件，确保样式和功能正常加载。

2. CSS 文件

    功能: 定义网页的样式和布局。
    主要任务:
        设置地图容器的大小和外观，确保地图能够正确显示。
        定义不同风险等级的颜色样式，帮助用户识别不同区域的风险。
        美化其他界面元素，如按钮、图例和标签，以提升用户体验。

3. JS 文件

    功能: 实现网页的交互逻辑和功能。
    主要任务:
        初始化 Leaflet 地图，设置初始视图和基础图层。
        加载和处理地理数据（如城镇和县级数据），并将其展示在地图上。
        处理用户的交互事件，如点击地图区域、选择风险等级和框选功能。
        实现动态更新地图样式的逻辑，根据用户的选择改变区域的外观。
        提供保存地图状态的功能，允许用户将地图导出为图像。

# 代码解释及语法规则
## html文件代码解释
<!DOCTYPE html>
<!-- 声明文档类型，告知浏览器该文件是 HTML5 文档 -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- 设置字符编码为 UTF-8，支持多种语言字符 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 指定 Internet Explorer 渲染页面的方式 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 确保页面在移动设备上适配良好，设置视口宽度和缩放比例 -->
    <title>Risk Level Map Editor</title>
    <!-- 设置页面标题，显示在浏览器标签上 -->
    <link rel="stylesheet" href="styles.css">
    <!-- 引入外部 CSS 文件用于页面样式 -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <!-- 引入 Leaflet 的 CSS，Leaflet 是一个用于创建交互式地图的库 -->
</head>
<body>
    <div id="controls" class="top-right">
        <!-- 控制面板，包含风险级别选择和按钮 -->
        <h3>Risk Level Editor</h3>
        <!-- 标题 -->
        <select id="risk-level">
            <!-- 下拉选择框，用于选择风险级别 -->
            <option value="无风险">无风险</option>
            <option value="低">低</option>
            <option value="中">中</option>
            <option value="高">高</option>
            <option value="极高">极高</option>
        </select>
        <button onclick="startBoxSelect()">Start Box Select</button>
        <!-- 按钮，点击时调用 startBoxSelect() 函数 -->
        <button onclick="saveMap()">Save Map</button>
        <!-- 按钮，点击时调用 saveMap() 函数 -->
    </div>
    <div id="map" style="width: 800px; height: 800px; margin: auto; border: 1px solid black;"></div>
    <!-- 地图容器，设置固定宽高、居中显示和边框样式 -->
    
    <!-- Load Leaflet first -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <!-- 引入 Leaflet 的 JavaScript 文件，以便使用其地图功能 -->
    
    <!-- Then load the plugins -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <!-- 引入 html2canvas 插件，用于将网页内容转换为 Canvas 图像 -->
    <script src="https://unpkg.com/shpjs@latest/dist/shp.min.js"></script>
    <!-- 引入 shpjs 插件，用于处理 SHP 文件 -->
    
    <!-- Load your main script last -->
    <script src="script.js"></script>
    <!-- 引入自定义的主 JavaScript 文件，通常放在最后以确保其他库先加载 -->
</body>
</html>  

## html文件语法规则

<!DOCTYPE html>: 该声明用于定义文档类型，确保浏览器以标准模式渲染页面。HTML5 是当前的标准。
<html lang="en">: <html> 标签是 HTML 文档的根元素，lang 属性指定文档的语言。
<meta charset="UTF-8">: 指定文档字符编码，UTF-8 是一种能够表示几乎所有语言字符的编码方式。
<meta name="viewport" content="width=device-width, initial-scale=1.0">: 控制页面在移动设备上的显示，确保页面内容根据设备宽度缩放。
<link rel="stylesheet" href="...">: 用于引入外部样式表，rel 属性指定链接类型。
<script src="..."></script>: 用于引入外部 JavaScript 文件，通常放在文档末尾以提高加载效率。
<div>: 定义文档中的一个区块，通常用于组织内容。
<select> 和 <option>: <select> 创建下拉菜单，<option> 定义下拉菜单中的选项。
onclick: 事件处理器，当用户点击按钮时会触发指定的 JavaScript 函数。

## css文件代码解释

body {
    margin: 0; /* 去除默认的外边距 */
    padding: 0; /* 去除默认的内边距 */
    font-family: Arial, sans-serif; /* 设置全局字体为 Arial，后备为 sans-serif */
    background-color: white; /* 全局背景色设置为白色 */
}

#map {
    background-color: white; /* 确保地图背景为白色 */
}

#controls {
    position: absolute; /* 设置绝对定位，使其相对于最近的定位元素 */
    top: 10px; /* 距离顶部 10 像素 */
    right: 10px; /* 距离右侧 10 像素 */
    background-color: rgba(255, 255, 255, 0.8); /* 设置半透明白色背景 */
    padding: 10px; /* 内边距 10 像素 */
    border: 1px solid #ddd; /* 边框颜色为浅灰色 */
    z-index: 1000; /* 设置层级，确保其在其他元素之上 */
}

h3 {
    margin-top: 0; /* 去除 h3 元素顶部的外边距 */
}

select, button {
    width: 100%; /* 使选择框和按钮宽度为 100% */
    padding: 8px; /* 内边距 8 像素 */
    margin: 5px 0; /* 垂直方向外边距 5 像素，水平方向无外边距 */
}

## css文件语法规则

选择器:
    body, #map, #controls, h3, select, button: 这些是 CSS 选择器，选择相应的 HTML 元素进行样式应用。# 表示 ID 选择器。

属性:
    margin: 控制元素外边距，margin: 0; 表示没有外边距。
    padding: 控制元素内边距，padding: 0; 表示没有内边距。
    font-family: 设置字体类型。sans-serif 是一种无衬线字体，作为备选字体。
    background-color: 设置元素背景颜色。
    position: 控制元素的定位方式。absolute 使元素相对于最近的已定位祖先元素进行定位。
    z-index: 控制元素的层级，值越大，元素越在上层。

颜色:
    rgba(255, 255, 255, 0.8): 表示颜色的红、绿、蓝和透明度（alpha）。这里是半透明白色。

宽度和内外边距:
    width: 100%;: 元素宽度占其父元素的100%。
    margin: 5px 0;: 垂直方向外边距为5像素，水平方向为0。

## js文件代码解释

// Initialize the map
let map = L.map('map', {
    renderer: L.canvas(), // 使用 Canvas 渲染器以提高性能
    preferCanvas: true // 优先使用 Canvas
}).setView([28.3, 120.5], 8); // 设置地图中心和缩放级别

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, // 设置最大缩放级别
}).addTo(map); // 将图层添加到地图中

let townGeojsonLayer; // 存储城镇级别的 GeoJSON 图层
let countyGeojsonLayer; // 存储县级别的 GeoJSON 图层

// 添加手动的经纬度网格线和标签
function addGraticule() {
    const latLines = []; // 存储纬度线
    const lngLines = []; // 存储经度线

    // 生成纬度线
    for (let lat = 27; lat <= 29; lat += 0.5) {
        latLines.push(L.polyline([[lat, 119], [lat, 122]], { color: '#888', weight: 0.5, opacity: 0.8 }).addTo(map));
        // 添加纬度标签
        L.marker([lat, 119], {
            icon: L.divIcon({
                className: 'lat-label',
                html: `<div style="transform: translate(-50%, -100%); font-size: 10px; color: #555;">${lat}° N</div>`
            })
        }).addTo(map);
    }

    // 生成经度线
    for (let lng = 119; lng <= 122; lng += 0.5) {
        lngLines.push(L.polyline([[27, lng], [29, lng]], { color: '#888', weight: 0.5, opacity: 0.8 }).addTo(map));
        // 添加经度标签
        L.marker([27, lng], {
            icon: L.divIcon({
                className: 'lng-label',
                html: `<div style="transform: translate(-50%, 0); font-size: 10px; color: #555;">${lng}° E</div>`
            })
        }).addTo(map);
    }
}

addGraticule(); // 调用函数以添加网格线和标签

// 加载城镇级别的 shapefile 并设置边界样式
shp('xiangzhen.zip').then(function(geojson) {
    townGeojsonLayer = L.geoJSON(geojson, {
        style: function (feature) {
            return {color: '#D3D3D3', weight: 0.6, opacity: 0.4}; // 较浅和较细的城镇边界
        },
        onEachFeature: function (feature, layer) {
            layer.on({
                click: onFeatureClick // 为每个图层添加点击事件
            });
        }
    }).addTo(map); // 将图层添加到地图中
});

// 加载县级别的 shapefile 并设置边界样式
shp('shp.zip').then(function(geojson) {
    countyGeojsonLayer = L.geoJSON(geojson, {
        style: function (feature) {
            return {color: '#696969', weight: 1, opacity: 1}; // 较深和较粗的县边界
        }
    }).addTo(map); // 将图层添加到地图中
});

// 点击事件处理函数以设置风险等级
function onFeatureClick(e) {
    const layer = e.target; // 获取被点击的图层
    layer.setStyle({
        fillColor: getColor(document.getElementById('risk-level').value), // 根据选择的风险等级设置填充颜色
        fillOpacity: 0.8, // 填充透明度
        color: '#777777', // 边框颜色
        weight: 1 // 边框宽度
    });
}

// 添加风险等级图例
function addLegend() {
    const legend = L.control({position: 'bottomleft'}); // 创建图例控件
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend'); // 创建图例容器
        div.innerHTML = `<h4>风险等级</h4>
                        <i style="background: #FF4500; width: 12px; height: 12px; display: inline-block;"></i> 极高<br>
                        <i style="background: #FFA500; width: 12px; height: 12px; display: inline-block;"></i> 高<br>
                        <i style="background: #FFD700; width: 12px; height: 12px; display: inline-block;"></i> 中<br>
                        <i style="background: #9ACD32; width: 12px; height: 12px; display: inline-block;"></i> 低<br>
                        <i style="background: #87CEEB; width: 12px; height: 12px; display: inline-block;"></i> 无风险<br>`;
        return div; // 返回图例容器
    };
    legend.addTo(map); // 将图例添加到地图
}

// 将图例添加到地图
addLegend();

// 保存地图的函数
function saveMap() {
    // 使用 html2canvas 将地图保存为高分辨率图像
    html2canvas(document.getElementById('map'), { scale: 2 }).then(canvas => {
        // 创建临时下载链接
        let link = document.createElement('a');
        link.href = canvas.toDataURL(); // 获取图像数据
        link.download = 'map.png'; // 文件名为 map.png
        link.click(); // 触发下载
    }).catch(error => {
        console.error('Error saving the map:', error); // 处理错误
    });
}

// 开始框选功能
function startBoxSelect() {
    map.dragging.disable(); // 禁用地图拖动
    let boxLayer; // 存储选择框图层

    map.on('mousedown', function(e) {
        if (boxLayer) {
            map.removeLayer(boxLayer); // 移除之前的选择框
        }
        let startPoint = e.latlng; // 记录开始点
        boxLayer = L.rectangle([startPoint, startPoint], {color: "#76c7c0", weight: 1}).addTo(map); // 创建选择框

        map.on('mousemove', onMouseMove); // 监听鼠标移动
        map.on('mouseup', onMouseUp); // 监听鼠标释放

        function onMouseMove(e) {
            boxLayer.setBounds([startPoint, e.latlng]); // 更新选择框边界
        }

        function onMouseUp(e) {
            map.off('mousemove', onMouseMove); // 移除鼠标移动事件
            map.off('mouseup', onMouseUp); // 移除鼠标释放事件
            map.dragging.enable(); // 恢复地图拖动

            let bounds = boxLayer.getBounds(); // 获取选择框边界
            townGeojsonLayer.eachLayer(function(layer) {
                if (bounds.intersects(layer.getBounds())) {
                    layer.setStyle({
                        fillColor: getColor(document.getElementById('risk-level').value), // 根据选择的风险等级设置填充颜色
                        fillOpacity: 0.8,
                        color: '#777777',
                        weight: 1
                    });
                }
            });

            // 移除选择框
            map.removeLayer(boxLayer);
        }
    });

    // 结束框选模式
    map.on('mouseup', function() {
        map.dragging.enable(); // 恢复地图拖动
    });
}

// 根据风险等级获取颜色
function getColor(risk) {
    switch (risk) {
        case '极高': return '#FF4500'; // 极高风险颜色
        case '高': return '#FFA500'; // 高风险颜色
        case '中': return '#FFD700'; // 中风险颜色
        case '低': return '#9ACD32'; // 低风险颜色
        case '无风险': return '#87CEEB'; // 无风险颜色
        default: return '#FFFFFF'; // 默认返回白色
    }
}

## js文件语法规则

    let map: 使用 let 声明一个变量 map，其作用域是块级的。
    L.map('map', {...}): 调用 Leaflet 库的 map 方法，创建一个新的地图实例。'map' 是目标 HTML 元素的 ID。
    setView([...], 8): 设置地图的中心坐标和缩放级别。

    L.tileLayer(...): 创建一个新的图层，使用 OpenStreetMap 的瓦片图像。
    addTo(map): 将创建的图层添加到 map 实例中。

    let townGeojsonLayer: 声明变量，用于存储城镇级别的 GeoJSON 图层。
    let countyGeojsonLayer: 同样声明一个变量用于县级别的 GeoJSON 图层。

    function addGraticule(): 定义一个名为 addGraticule 的函数，用于添加网格线。
    const latLines = []: 使用 const 声明一个常量数组，用于存储纬度线。
    const lngLines = []: 声明另一个常量数组，用于存储经度线。

    for (let lat = 27; lat <= 29; lat += 0.5): 使用 for 循环遍历纬度，从 27 到 29，步长为 0.5。
    latLines.push(...): 将创建的纬度线推入 latLines 数组。
    L.polyline(...): 创建一条多线段，表示纬度线。
    L.marker([...], {...}): 创建一个标记，显示纬度标签。
    **html: <div style="...">${lat}° N</div>**: 使用模板字符串生成 HTML 内容，${lat}` 会被实际的纬度值替换。

    for (let lng = 119; lng <= 122; lng += 0.5): 类似于纬度线的循环，生成经度线。
    lngLines.push(...): 将创建的经度线推入 lngLines 数组。

    addGraticule(): 调用之前定义的函数，执行添加网格线和标签的操作。

    shp('xiangzhen.zip').then(...): 使用 shp 函数加载 shapefile，返回一个 Promise。
    L.geoJSON(geojson, {...}): 创建一个新的 GeoJSON 图层，使用加载的地理数据。
    style: function (feature) {...}: 定义样式函数，根据每个特征返回样式对象。
    onEachFeature: function (feature, layer) {...}: 为每个特征添加事件处理器。

    function onFeatureClick(e): 定义一个处理点击事件的函数，接收事件对象 e。
    const layer = e.target: 获取被点击的图层对象。
    layer.setStyle({...}): 设置图层的样式，包括填充颜色、透明度和边框样式。

    function addLegend(): 定义一个函数，用于添加风险等级图例。
    L.control({...}): 创建一个 Leaflet 控件。
    legend.onAdd = function () {...}: 定义控件添加到地图时的操作。
    L.DomUtil.create(...): 创建一个 DOM 元素，作为图例的容器。

    addLegend(): 调用图例添加函数。

    function saveMap(): 定义一个函数，用于保存地图。
    html2canvas(...): 使用 html2canvas 库将指定元素转换为 Canvas。
    link.click(): 触发下载链接，下载生成的图像。

    function startBoxSelect(): 定义一个函数，用于启用框选功能。
    map.on('mousedown', function(e) {...}): 绑定鼠标按下事件，处理框选逻辑。
    boxLayer = L.rectangle([...]): 创建一个矩形作为选择框。
    map.off(...): 移除事件监听器，避免重复绑定。

    function getColor(risk): 定义一个函数，根据风险等级返回对应的颜色。
    switch: 根据 risk 的值选择不同的颜色返回。

## javascript语法
1. 变量声明

    let: 用于声明一个块级作用域的变量，可以被赋值和重新赋值。
    javascript

let x = 10; // 声明变量 x，并赋值为 10
x = 20; // 重新赋值

const: 用于声明一个常量，常量的值不能被重新赋值。
javascript

    const PI = 3.14; // 声明常量 PI，赋值为 3.14

2. 数据类型

JavaScript 有几种基本数据类型：

    Number: 数字类型（整数和浮点数）。

    String: 字符串，用单引号或双引号括起来。
    javascript

let name = "Alice"; // 字符串

Boolean: 布尔值，只有 true 和 false 两个值。

Object: 对象类型，可以存储多个值和更复杂的实体。
javascript

    let person = { name: "Alice", age: 25 }; // 对象

3. 函数定义

    函数声明:
    javascript

function sayHello() {
    console.log("Hello!");
}

函数表达式:
javascript

const sayHello = function() {
    console.log("Hello!");
};

箭头函数: ES6 提供的简洁语法。
javascript

    const sayHello = () => {
        console.log("Hello!");
    };

4. 控制结构

    条件语句: 使用 if, else if, 和 else。
    javascript

if (x > 10) {
    console.log("x is greater than 10");
} else {
    console.log("x is 10 or less");
}

循环: 常用的循环结构有 for 和 while。
javascript

    for (let i = 0; i < 5; i++) {
        console.log(i); // 输出 0 到 4
    }

5. 数组

    数组是一种用于存储多个值的对象。
    javascript

    let fruits = ["apple", "banana", "cherry"]; // 数组
    console.log(fruits[0]); // 输出 "apple"

6. 对象

    对象是键值对的集合。
    javascript

    let car = {
        brand: "Toyota",
        model: "Camry",
        year: 2020
    };
    console.log(car.brand); // 输出 "Toyota"

7. 事件处理

    使用 addEventListener 方法为元素绑定事件。
    javascript

    document.getElementById("myButton").addEventListener("click", function() {
        alert("Button clicked!");
    });

8. Promise

    Promise 用于处理异步操作，允许你在操作完成后执行某个回调。
    javascript

    let promise = new Promise((resolve, reject) => {
        // 异步操作
        if (/* 成功条件 */) {
            resolve("成功!");
        } else {
            reject("失败!");
        }
    });

    promise.then(result => {
        console.log(result); // 成功时执行
    }).catch(error => {
        console.error(error); // 失败时执行
    });

9. 模块

    ES6 引入了模块化，可以使用 import 和 export 语句。
    javascript

    // 在 module.js 中
    export function greet() {
        console.log("Hello!");
    }

    // 在其他文件中
    import { greet } from './module.js';
    greet(); // 调用 greet 函数

10. DOM 操作

    使用 document 对象来操作 HTML 元素。
    javascript

    let element = document.getElementById('myElement'); // 获取元素
    element.style.color = "blue"; // 设置样式

