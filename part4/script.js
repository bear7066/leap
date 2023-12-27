var controller = new Leap.Controller();

controller.on("frame", function(frame) {
    if(frame.hands.length > 0) {
        var hand = frame.hands[0];
        var output = document.getElementById('output');
        output.innerHTML = 'Hand detected. Palm position: ' 
                           + hand.palmPosition.join(', ');
    }
});

controller.connect();
