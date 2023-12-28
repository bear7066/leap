// var controller = new Leap.Controller();

// controller.on("frame", function(frame) {
//     if(frame.hands.length > 0) {
//         var hand = frame.hands[0];
//         var output = document.getElementById('output');
//         var interactionBox = frame.interactionBox;
//         if(interactionBox){
//             console.log("nice");
//         }else{
//             console.log("fork!");
//         }
        
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

// test 2: interactionBox

// Leap.loop(function(frame) {
//     if (frame.pointables.length > 0) {
//         var pointable = frame.pointables[0];
//         var interactionBox = frame.interactionBox;

//         if (interactionBox) {
//             var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

//             // 接下來的程式碼...
//         } else {
//             console.error('Interaction box is undefined.');
//         }
//     }
// });


// test 3: find that interactionBox is unavailable
var controller = new Leap.Controller();

controller.on("frame", function(frame) {
    var output = document.getElementById('output');

    if(frame.hands.length > 0) {
        var hand = frame.hands[0];
        var interactionBox = frame.interactionBox;

        if(interactionBox){
            output.innerHTML = 'Interaction box available';
        } else {
            output.innerHTML = 'Interaction box available';
        }

        output.innerHTML = 'Hand detected. Palm position: ' 
                           + hand.palmPosition.join(', ');
    } else {
        output.innerHTML = 'Waiting for hand detection...';
    }
});

controller.connect();
