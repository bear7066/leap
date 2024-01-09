
$(document).ready(function() {

    var pathPoints = []; // Stores the path of the mouse
    var pathSet = [];  // stores the userPath(s)
    //var isTracking = false; // Flag to turn on/off tracking
    var isPainting = false;
    var radiusPlotForAnalysis = []; // Array to store the sample #, radius plot for analysis
    var colorRadius = 30;
    var before_pathPoints = 0;

    var image = new Image();
    image.src = 'pen.png'; // Replace with your image path
    image.onload = function() {
        // Draw the image onto the canvas when it's loaded
        $('canvas').drawImage({
            source: image,
            x: 100, y: 100, // Coordinates where you want to place the image
            width: 30, height: 30, // Size of the image
            layer: true,
            name: 'imageOnCircle'
    }); 
    }

    // DRAW THE COLOR CIRCLE
    $('canvas').drawArc({
        fillStyle: '#00d', // Blue
        opacity: 1.0,
        x: 35,
        y: 35,
        radius: colorRadius,
        layer: true,
        name: 'blueCircle'
    });

    $('canvas').drawArc({
        fillStyle: '#f00', // Red
        opacity: 1.0,
        x: 35,
        y: 105,
        radius: colorRadius,
        layer: true,
        name: 'redCircle'
    });

    $('canvas').drawArc({
        fillStyle: '#ffd400', // Yellow
        opacity: 1.0,
        x: 35,
        y: 175,
        radius: colorRadius,
        layer: true,
        name: 'yellowCircle'
    });

    $('canvas').drawArc({
        fillStyle: '#7fb80e', // Green
        opacity: 1.0,
        x: 35,
        y: 245,
        radius: colorRadius,
        layer: true,
        name: 'greenCircle'
    });

    $('canvas').drawArc({
        fillStyle: 'fff', // Black
        opacity: 1.0,
        x: 35,
        y: 315,
        radius: colorRadius,
        layer: true,
        name: 'blackCircle'
    });

    // DRAW THE ERASER BOTTON
    $('canvas').drawArc({
        fillStyle: '#fff', // White
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        opacity: 1.0,
        x: 35,
        y: 385,
        radius: colorRadius,
        layer: true,
        name: 'eraserButton'
    });

    var colors = [$('canvas').getLayer('blueCircle'),$('canvas').getLayer('redCircle'),
        $('canvas').getLayer('yellowCircle'),$('canvas').getLayer('greenCircle'),
        $('canvas').getLayer('blackCircle'),$('canvas').getLayer('eraserButton')];

    // DRAW TEXT ON ERASER BUTTON
    $('canvas').drawText({
        fillStyle: '000', // Black
        x: 35,
        y: 385,
        width: 50,
        height: 40,
        text: 'Eraser',
        layer: true,
        name: 'eraserText',
        intangible: true
    });

    // LEAP MOTION TEXT POSITION
    $('canvas').drawText({
        fillStyle: '#000', // Black
        x: 100,
        y: 590,
        fontSize: 14,
        fontFamily: 'Verdana, sans-serif',
        text: "Leap",
        layer: true,
        name: 'leapxy'
    });

    // CREATE A PURPLE CIRCLE LAYER TO SEE THE FINGER POSITION
    $('canvas').drawArc({
        fillStyle: '#c0f', // Purple
        strokeStyle: 'black', // Border color
        strokeWidth: 2, // Border width
        radius: 10,
        layer: true,
        name: 'leapCursor',
        visible: false,
    });

    // 小鉛筆
    $('canvas').drawRect({
        fillStyle: '#0d6efd', // Gray color for pencil button
        x: 100, y: 100, // Adjust position as needed
        radius:10,
        cornerRadius: 10,
        width: 50, height: 50,
        layer: true,
        name: 'pencilButton'
    });

    // 存檔鍵
    // Draw the save button on the canvas
    // Draw the save button as a circle on the canvas
    $('canvas').drawArc({
        fillStyle: '#0d6efd', // Blue color
        x: 35, y: 450, // Adjust position as needed
        radius: 30, // Radius of the circle
        layer: true,
        name: 'saveButton'
    });

    $('canvas').drawText({
        fillStyle: '#fff', // White text
        x: 35, y: 450,
        fontSize: 15,
        fontFamily: 'Verdana, sans-serif',
        text: 'Save',
        layer: true,
        name: 'saveButtonText',
        intangible: true
    });
    
    function addUserPathLayer() {
        $('canvas').addLayer({
            name: `userPath${pathSet.length}`,
            type: 'line',
            strokeStyle: '#ddd', // set init color 'White'
            strokeWidth: 3,
            index: pathSet.length,
        });
    }


    function resetPath() {
        //pathPoints = [];
        pathSet = [];
        radiusPlotForAnalysis = [];
        isTracking = false;
        $('canvas').removeLayer('userPath');
        $('#results').html("");
        addUserPathLayer();
        $('canvas').drawLayers();
    }
    var hoverTimers = {};

    // SETUP AND OBTAIN DATA FROM LEAP MOTION
    Leap.loop({}, function(frame) {
        if (frame.pointables.length > 0) {

            var leapCursorLayer = $('canvas').getLayer('leapCursor');
            var saveButtonLayer = $('canvas').getLayer('saveButton');
            // var pencilButtonLayer = $('canvas').getLayer('pencilButton');

            leapCursorLayer.visible = true;

            //拇指的位置
            var pointerOnCanvas = {
                x: (frame.pointables[0].tipPosition[0]+200) * 2,  //$('canvas').width()*normalizedPosition[0],
                y: (frame.pointables[0].tipPosition[2]+100) * 2 //$('canvas').height()*(1 - normalizedPosition[1])
            };                

            var hand = frame.hands[0];
            
            pointerColor(hand);  //  在調色盤上握拳 -> pointer變成該顏色

            // 存檔判斷
            if (collisionTest(leapCursorLayer, saveButtonLayer)) {
                if (!saveButtonLayer.hoverStartTime) {
                    saveButtonLayer.hoverStartTime = new Date().getTime();
                } else if (new Date().getTime() - saveButtonLayer.hoverStartTime > 2000) {
                    saveCanvas(); // Call the save function
                    saveButtonLayer.hoverStartTime = null; // Reset the timer
                }
            } else {
                saveButtonLayer.hoverStartTime = null;
            }
            // 兩秒調色盤
            colors.forEach(function(colorLayer) {
                if (collisionTest(leapCursorLayer, colorLayer)) {
                    // 如果指標與顏色圖層碰撞，則啟動計時器
                    if (!hoverTimers[colorLayer.name]) {
                        hoverTimers[colorLayer.name] = setTimeout(function() {
                            showColorOptions(colorLayer.name); // 顯示顏色選項的函數
                        }, 1000); // 設置計時器為1秒
                    }
                } else {
                    // 如果指標離開顏色圖層，則清除計時器
                    if (hoverTimers[colorLayer.name]) {
                        clearTimeout(hoverTimers[colorLayer.name]);
                        delete hoverTimers[colorLayer.name];
                    }
                }
            });

            //  握拳 -> 畫畫
            if (hand.grabStrength === 1.0){
                if(isPainting == false){
                    isPainting = true;
                    addUserPathLayer();
                    pathSet.push($('canvas').getLayer(`userPath${pathSet.length}`));
                }
                paint(pathPoints, pointerOnCanvas, before_pathPoints);
            }else if (isPainting == true) {
                before_pathPoints = pathPoints.length;
                isPainting = false;
            }
            

            $('canvas').setLayer('leapxy', { text: '(' + pointerOnCanvas.x.toFixed() + ', ' + pointerOnCanvas.y.toFixed() + ')' });
            leapCursorLayer.x = pointerOnCanvas.x; // 若後面沒用到leapCursorLayer.x就刪掉這行
            leapCursorLayer.y = pointerOnCanvas.y; // 若後面沒用到leapCursorLayer.y就刪掉這行
            

             /*if (isPainting == true) {
                pathPoints.push([pointerOnCanvas.x, pointerOnCanvas.y]);
                var len = pathPoints.length;
                var pathLayer = $('canvas').getLayer('userPath');
                pathLayer['x' + len] = pathPoints[len - 1][0];
                pathLayer['y' + len] = pathPoints[len - 1][1];
            }*/

            $('canvas').drawLayers();
        } else {
            $('canvas').setLayer('leapxy', { text: 'No Finger!' });
            $('canvas').setLayer('leapCursor', { visible: false }).drawLayers();
        }
    });

    function collisionTest(obj1, obj2) {
        var sumOfRadii = obj1.radius + obj2.radius;
        var diffInX = obj2.x - obj1.x;
        var diffInY = obj2.y - obj1.y;
        var vectorMagnitude = Math.sqrt(diffInX * diffInX + diffInY * diffInY);
        return vectorMagnitude < sumOfRadii;
    }

    function pointerColor(hand){
        for ( var i=0 ; i<colors.length ; ++i ){
            if (hand.grabStrength === 1.0 && collisionTest($('canvas').getLayer('leapCursor'),colors[i]))
                    $('canvas').getLayer('leapCursor').fillStyle = colors[i].fillStyle;
        }
    }

    function paint(pathPoints,pointerOnCanvas,before_pathPoints){
        pathPoints.push([pointerOnCanvas.x, pointerOnCanvas.y]);
        var i = pathPoints.length - before_pathPoints;
        pathSet[pathSet.length-1].strokeStyle = $('canvas').getLayer('leapCursor').fillStyle;
        pathSet[pathSet.length-1]['x' + i] = pathPoints[i+before_pathPoints - 1][0];
        pathSet[pathSet.length-1]['y' + i] = pathPoints[i+before_pathPoints - 1][1];
    }

    function saveCanvas() {
        // Create a temporary canvas element
        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = $('canvas').width();
        tempCanvas.height = $('canvas').height();
    
        // Draw only the user's drawing (pathSet) onto the temporary canvas
        pathSet.forEach(function(pathLayer) {
            // Check if the layer is a line type
            if (pathLayer.type === 'line') {
                tempCtx.beginPath();
                tempCtx.strokeStyle = pathLayer.strokeStyle;
                tempCtx.lineWidth = pathLayer.strokeWidth;
    
                // Iterate over the points in the path
                var firstPoint = true;
                for (var prop in pathLayer) {
                    if (prop.startsWith('x') && pathLayer.hasOwnProperty(prop)) {
                        var x = pathLayer[prop];
                        var y = pathLayer['y' + prop.substring(1)];
                        if (firstPoint) {
                            tempCtx.moveTo(x, y);
                            firstPoint = false;
                        } else {
                            tempCtx.lineTo(x, y);
                        }
                    }
                }
                tempCtx.stroke();
            }
        });
    
        // Export the temporary canvas as an image
        var image = tempCanvas.toDataURL('image/png');
        var link = document.createElement('a');
        link.download = 'my-painting.png';
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    
    
    // 調色盤
    function showColorOptions(layerName) {
        // 根據 layerName 顯示相應的顏色選項
        // 例如，可以將相應顏色的圖層設置為可見
        $('canvas').setLayer(layerName, { visible: true }).drawLayers();
    }
    // function showColorPalette() {
    //     // Logic to show color palette
    //     // You can set the 'visible' property of color layers to true
    //     ['blueCircle', 'redCircle', 'yellowCircle', 'greenCircle', 'blackCircle', 'eraserButton'].forEach(function(layerName) {
    //         $('canvas').setLayer(layerName, { visible: true }).drawLayers();
    //     });
    // }

}); 