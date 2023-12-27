// canvas.js
// This javascript is used to manage the cursor tracer canvas 
// Developed by George Marzloff (george@marzloffmedia.com)

$( document ).ready(function() {
  
  	var spiral = new Spiral({				// we create a Spiral object here.
		startPoint: {x: 400, y: 210},		// See Spiral() object in spiral.js
		numberOfLoops: 3.15,
		radiusGrowthRate: 0.15
	}); 		

	var hoverTargetsRadius = 15;			
	var pathPoints = [];					// stores the path of the mouse
	var isTracking = false;					// flag to turn on/off tracking

	var radiusPlotForAnalysis = [];			// create an array to store the sample #, radius plot for analysis later

	addUserPathLayer();						// Run a function to setup an empty layer for userPath without any points yet.
											// look for function addUserPathLayer() below to see the instructions
	
	// CREATE LAYER FOR SPIRAL GUIDELINE
	$('canvas').drawLine({
		strokeWidth: 3,
		strokeStyle: '#aaa', // gray
		visible: true,
		name: 'guideline',
		layer: true
	});

  	// ADD THE SPIRAL GUIDELINE POINTS TO THE LAYER AND DRAW IT
	$('canvas').setLayer('guideline', spiral.guidelinePoints)
	.drawLayers();

	// Draw the starting circle on the canvas using drawArc method
	$('canvas').drawArc({
	  fillStyle: '#0a0', // green
	  opacity: 0.75,
	  x: spiral.startPoint.x, 
	  y: spiral.startPoint.y,
	  radius: hoverTargetsRadius,
	  layer: true,
	  name: 'startCircle',
	  mouseover: function() {
	    $(this).animateLayer('startCircle', {
	      fillStyle: '#0d0'
	    }, 250);
	  	isTracking = true;

	  },
	  mouseout: function() {
	  	 $(this).animateLayer('startCircle', {
	  	  	fillStyle: '#0a0'
	  	}, 250);
	  }
	});

	// DRAW THE TARGET CIRCLE
	$('canvas').drawArc({
	  fillStyle: '#00d', // green
	  opacity: 0.75,
	  x: spiral.endPoint.x, 
	  y: spiral.endPoint.y,
	  radius: hoverTargetsRadius,
	  layer: true,
	  name: 'targetCircle',
	  mouseover: function() {
	    $(this).animateLayer('targetCircle', {
	      fillStyle: '#55f'
	    }, 250);
	    
	    if(isTracking){ 		// only trigger if we already hit the green circle
		    isTracking = false;
		    var analysis = new Analysis(radiusPlotForAnalysis);
		    analysis.printResults();
		}
	  },
	  mouseout: function() {
	  	 $(this).animateLayer('targetCircle', {
	  	  	fillStyle: '#00d'
	  	}, 250);
	  }

	});

	// DRAW INSTRUCTIONS TEXT
	$('canvas').drawText({
	  fillStyle: '#000',
	  x: 400, y: 20,
	  fontSize: 14,
	  fontFamily: 'Verdana, sans-serif',
	  text: 'Mouseover the green circle and trace the spiral to the blue circle.',
	  layer: true,
	  name: 'instructionsText'
	});

	// DRAW RESET BUTTON
	$('canvas').drawRect({
		fillStyle: '#f00',
		x: 60, y: 350,
		width: 50, height: 40,
		layer: true,
		name: 'resetButton',
		cornerRadius: 10,
		click: function(){
			resetPath();
		}
	});

	// DRAW TEXT ON RESET BUTTON
	$('canvas').drawText({
		fillStyle: '#fff',
		x: $('canvas').getLayer('resetButton').x,
		y: $('canvas').getLayer('resetButton').y,
		width: 50,
		height: 40,
		text: 'Reset',
		layer: true,
		name: 'resetText',
		intangible: true
	});

	// INSTRUCTIONS TRIGGERED WHEN MOUSE MOVES
  	$('canvas').mousemove(function(event){

  		if(isTracking){ 	
			// Create a path following the mouse
			// add a point to the path array
			var rect = $('canvas').offset();
			// correct mouse coordinates
			var cursor_x = event.pageX - rect.left;
			var cursor_y = event.pageY - rect.top;

			pathPoints.push([cursor_x, cursor_y]);	// .push() adds an element to end of an array

			var i = pathPoints.length;	// use this # to create the property name e.g. x1, x2, x3, etc
			var pathLayer = $('canvas').getLayer('userPath');	
			pathLayer['x'+i] = pathPoints[i-1][0];
			pathLayer['y'+i] = pathPoints[i-1][1];

			// .push() adds an element (in this case, an object) to the end of the array
			radiusPlotForAnalysis.push({x: pathPoints[i-1][0] - spiral.startPoint.x, 
									  y: pathPoints[i-1][1] - spiral.startPoint.y});
		}
  	});

	function addUserPathLayer(){
		$('canvas').addLayer({
			name: 'userPath',
			type: 'line',
			strokeStyle: '#f00',
			strokeWidth: 3,
			index: 4
		});
	}

	function resetPath(){
		// clear the points array, delete userPath and add a blank userPath layer
	  	pathPoints = [];
	  	radiusPlotForAnalysis = [];
	  	isTracking = false;
	  	$('canvas').removeLayer('userPath');
	  	$('#results').html("");
	  	addUserPathLayer();
	  	$('canvas').drawLayers();
	}
	
});
