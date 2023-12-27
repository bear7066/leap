$(document).ready(function () {
    var isTracking = false;
    var pathPoints = [];
    var radiusPlotForAnalysis = [];

    Leap.loop({}, function (frame) {
        var interactionBox = frame.interactionBox;
        if (frame && frame.interactionBox) {
            // Your existing code here
        } else {
            console.error('Invalid frame or missing interactionBox.');
        }
        
        if (frame.pointables.length > 0) {
            var pointable = frame.pointables[0];
            var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

            var pointerOnCanvas = {
                x: $('canvas').width() * normalizedPosition[0],
                y: $('canvas').height() * (1 - normalizedPosition[1])
            };

            var leapCursorLayer = $('canvas').getLayer('leapCursor');

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
            $('canvas').setLayer('leapCursor', { visible: false })
                .drawLayers();
        }
    });
});
