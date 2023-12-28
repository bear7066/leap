// var controller = new Leap.Controller();

// controller.on("frame", function(frame) {
//     if(frame.hands.length > 0) {
//         var hand = frame.hands[0];
//         var output = document.getElementById('output');
//         output.innerHTML = 'Hand detected. Palm position: ' 
//                            + hand.palmPosition.join(', ');
//     }
// });

// controller.connect();

// var pointer = document.getElementById('pointer');

// Leap.loop(function(frame) {
//     if (frame.pointables.length > 0) {
//         var pointable = frame.pointables[0];
//         var interactionBox = frame.interactionBox;
//         var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

//         var x = normalizedPosition[0] * window.innerWidth;
//         var y = window.innerHeight - normalizedPosition[1] * window.innerHeight;

//         pointer.style.left = x + 'px';
//         pointer.style.top = y + 'px';
//     }
// });

// test
Leap.loop(function(frame) {
    if (frame.pointables.length > 0) {
        var pointable = frame.pointables[0];
        var interactionBox = frame.interactionBox;

        if (interactionBox) {
            var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

            // 接下來的程式碼...
        } else {
            console.error('Interaction box is undefined.');
        }
    }
});
