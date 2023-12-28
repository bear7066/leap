// canvas.js
// This javascript is used to manage the cursor tracer canvas
// Developed by George Marzloff (george@marzloffmedia.com)

$(document).ready(function() {
    var spiral = new Spiral({ // Create a Spiral object
        startPoint: { x: 400, y: 210 }, // See Spiral() object in spiral.js
        numberOfLoops: 3.15,
        radiusGrowthRate: 0.15,
    });

    var hoverTargetsRadius = 15;
    var pathPoints = []; // Stores the path of the mouse
    var isTracking = false; // Flag to turn on/off tracking
    var radiusPlotForAnalysis = []; // Array to store the sample #, radius plot for analysis

    addUserPathLayer(); // Setup an empty layer for userPath

    // CREATE LAYER FOR SPIRAL GUIDELINE
    $('canvas').drawLine({
        strokeWidth: 3,
        strokeStyle: '#aaa', // Gray
        visible: true,
        name: 'guideline',
        layer: true
    });

    // ADD THE SPIRAL GUIDELINE POINTS TO THE LAYER AND DRAW IT
    $('canvas').setLayer('guideline', spiral.guidelinePoints).drawLayers();

    // Draw the starting circle on the canvas
    $('canvas').drawArc({
        fillStyle: '#0a0', // Green
        opacity: 0.75,
        x: spiral.startPoint.x,
        y: spiral.startPoint.y,
        radius: hoverTargetsRadius,
        layer: true,
        name: 'startCircle'
    });

    // DRAW THE TARGET CIRCLE
    $('canvas').drawArc({
        fillStyle: '#00d', // Blue
        opacity: 0.75,
        x: spiral.endPoint.x,
        y: spiral.endPoint.y,
        radius: hoverTargetsRadius,
        layer: true,
        name: 'targetCircle'
    });

    // DRAW INSTRUCTIONS TEXT
    $('canvas').drawText({
        fillStyle: '#000',
        x: 400,
        y: 20,
        fontSize: 14,
        fontFamily: 'Verdana, sans-serif',
        text: 'Mouseover the green circle and trace the spiral to the blue circle.',
        layer: true,
        name: 'instructionsText'
    });

    // DRAW RESET BUTTON
    $('canvas').drawRect({
        fillStyle: '#f00', // Red
        x: 60,
        y: 350,
        width: 50,
        height: 40,
        layer: true,
        name: 'resetButton',
        cornerRadius: 10,
        click: function() {
            resetPath();
        }
    });

    // DRAW TEXT ON RESET BUTTON
    $('canvas').drawText({
        fillStyle: '#fff', // White
        x: $('canvas').getLayer('resetButton').x,
        y: $('canvas').getLayer('resetButton').y,
        width: 50,
        height: 40,
        text: 'Reset',
        layer: true,
        name: 'resetText',
        intangible: true
    });

    // LEAP MOTION TEXT POSITION
    $('canvas').drawText({
        fillStyle: '#000', // Black
        x: 100,
        y: 20,
        fontSize: 14,
        fontFamily: 'Verdana, sans-serif',
        text: "Leap",
        layer: true,
        name: 'leapxy'
    });

    // CREATE A PURPLE CIRCLE LAYER TO SEE THE FINGER POSITION
    $('canvas').drawArc({
        fillStyle: '#c0f', // Purple
        radius: 10,
        layer: true,
        name: 'leapCursor',
        visible: false,
    });

    function addUserPathLayer() {
        $('canvas').addLayer({
            name: 'userPath',
            type: 'line',
            strokeStyle: '#f00', // Red
            strokeWidth: 3,
            index: 4
        });
    }

    function resetPath() {
        pathPoints = [];
        radiusPlotForAnalysis = [];
        isTracking = false;
        $('canvas').removeLayer('userPath');
        $('#results').html("");
        addUserPathLayer();
        $('canvas').drawLayers();
    }

    // SETUP AND OBTAIN DATA FROM LEAP MOTION
    Leap.loop({}, function(frame) {
        if (frame.pointables.length > 0) {
            var pointable = frame.pointables[0];
            var interactionBox = frame.interactionBox;
            var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

            var pointerOnCanvas = {
                x: $('canvas').width() * normalizedPosition[0],
                y: $('canvas').height() * (1 - normalizedPosition[1])
            };

            var leapCursorLayer = $('canvas').getLayer('leapCursor');

            // Check for fingertip movement and collision with startCircle
            if (((Math.round(pointerOnCanvas.x) != Math.round(leapCursorLayer.x)) ||
                    (Math.round(pointerOnCanvas.y) != Math.round(leapCursorLayer.y))) &&
                isTracking == false) {

                isTracking = collisionTest(leapCursorLayer, $('canvas').getLayer('startCircle'));
            } else if (isTracking == true && collisionTest(leapCursorLayer, $('canvas').getLayer('targetCircle')) == true) {
                isTracking = false;
                var analysis = new Analysis(radiusPlotForAnalysis);
                analysis.printResults();
            }

            $('canvas').setLayer('leapxy', { text: '(' + pointerOnCanvas.x.toFixed() + ', ' + pointerOnCanvas.y.toFixed() + ')' });
            leapCursorLayer.x = pointerOnCanvas.x;
            leapCursorLayer.y = pointerOnCanvas.y;
            leapCursorLayer.visible = true;

            if (isTracking == true) {
                pathPoints.push([pointerOnCanvas.x, pointerOnCanvas.y]);
                var i = pathPoints.length;
                var pathLayer = $('canvas').getLayer('userPath');
                pathLayer['x' + i] = pathPoints[i - 1][0];
                pathLayer['y' + i] = pathPoints[i - 1][1];
                radiusPlotForAnalysis.push({
                    x: pathPoints[i - 1][0] - spiral.startPoint.x,
                    y: pathPoints[i - 1][1] - spiral.startPoint.y
                });
            }

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
});
