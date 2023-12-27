// canvas.js
// This javascript is used to manage the tracer canvas 
// Developed by George Marzloff (george@marzloffmedia.com)

// This is a single line javascript comment.

/*  This is a javascript comment
	across multiple lines. */

$( document ).ready(function() {	// when the html file finishes loading in the browser, run this method.
									// for our purposes, a method is synonymous with function (a set of instructions).
       
   	var startPoint = {x:100, y:200};		// starting coordinates for the path in pixels, 
   											// relative to the top-left corner of the canvas (0,0)
   											// +x = rightward, +y = downward
	
	var endPoint = {x:700, y:startPoint.y};	// set x to 700 pixels and use the same y as the startPoint

	var hoverTargetsRadius = 20; // how big should the green and blue circles' radii be?
	var pathPoints = [];				 // creates an array (a list) of all the points that make the cursor's path
	var isTracking = false;			 // flag to turn on/off cursor tracking. Keep off (false) to start.

	addUserPathLayer();		// Run a function to setup an empty layer for userPath without any points yet.
							// look for function addUserPathLayer() below to see the instructions
	
	// Create a grey straight "guide line" to appear after the cursor reaches the target to compare it to the target
	$('canvas').drawLine({
		x1: startPoint.x + hoverTargetsRadius, 	// line starts on the right edge of the green starting circle (circle center + radius length)
		y1: startPoint.y,						// line starts in the vertical middle of the green starting circle
		x2: endPoint.x - hoverTargetsRadius, 	// line finishes on the left side of the blue target circle
		y2: endPoint.y,							// line finishes in the vertical middle of the blue target circle
		layer:true,									// create a new drawing layer on the canvas
		strokeWidth: 3,							// 3px thick line
		strokeStyle: '#aaa', 				// #aaa is hexcode for a gray
		visible: false,							// hide the line for now
		name: 'guideline'						// we can refer to this layer as 'guideline' later on
	});

	// Draw the starting circle on the canvas using drawArc method
	$('canvas').drawArc({
	  fillStyle: '#0a0', 						// code for a shade of green
	  x: startPoint.x, 							
	  y: startPoint.y,
	  radius: hoverTargetsRadius,		// defined at the top
	  layer: true,
	  name: 'startCircle',
	  mouseover: function() {					// when the cursor moves over the starting shape, run this function
	    $(this).animateLayer('startCircle', {	// animate the color to a brighter green in 250ms. 
	      fillStyle: '#0d0'						// This isn't necessary for the code to work, but is a subtle way to let user know 
	    }, 250);											// 'something is happening' to improve the user experience
	   
	  	resetPath();									// run resetPath() function (find it below)
	  	isTracking = true;						// now set isTracking to true! the cursorTracker's mousemove function will work now
	  	showGuideline(false);					// hide the grey guideline (find the function below)
	  },
	  mouseout: function() {
	  	 $(this).animateLayer('startCircle', {	// when the cursor moves out of the starting shape, run this function
	  	  	fillStyle: '#0a0'					// animate the color back to the original green in 250ms.
	  	}, 250);								
	  }
	});

	// Draw the target blue circle on the canvas using drawArc method. Very similar code to the starting circle above.
	$('canvas').drawArc({
	  fillStyle: '#00d', 						// code for a shade of blue
	  x: endPoint.x, 
	  y: endPoint.y,
	  radius: hoverTargetsRadius,
	  layer: true,
	  name: 'targetCircle',
	  mouseover: function() {
	    $(this).animateLayer('targetCircle', {
	      fillStyle: '#55f'				// code for a lighter shade of blue
	    }, 250);

	    if(isTracking){
		    isTracking = false;						
		    showGuideline(true);		// show the grey guideline (find the function below)
		    analyzePerformance();		// see the analyzePerformance() function below
			}
	  },
	  mouseout: function() {
	  	 $(this).animateLayer('targetCircle', {
	  	  	fillStyle: '#00d'			// animate back to the original blue
	  	}, 250);
	  }

	});

	// Create a layer containing the text instructions at the top of the canvas using .drawText() method
	$('canvas').drawText({
	  fillStyle: '#000',	// color code for black
	  x: 400, y: 20,			// position relative to the canvas
	  fontSize: 16,
	  text: 'Mouseover the green circle and draw a straight line to the blue circle.',
	  layer: true,
	  name: 'resetText'
	});

	$('canvas').mousemove(function(event){	// every time the mouse moves in the canvas, run these instructions
   
		if(isTracking == true){  	// only run if isTracking is true (i.e. cursor hit the green circle)
			
			// corrects the absolute cursor position (pageX & pageY) to the cursor position 
			// ** relative to the top left (origin) of the canvas **
			var rect = $('canvas').offset();		
			var cursor_x = event.pageX - rect.left;	
			var cursor_y = event.pageY - rect.top;	

			// add the cursor point [cursor_x,cursor_y] to the end of the pathPoints array to store the path's data
			// it creates a nested (multi-dimensional) array: each point is an array inside the pathPoints array 
			pathPoints.push([cursor_x, cursor_y]);	

			var i = pathPoints.length;
			var pathLayer = $('canvas').getLayer('userPath');	

			// Now add properties to the userPath layer (we temporarily call it pathLayer for convenience). 
			// point #1 adds x1 & y1 properties, point #2 adds x2 & y2 properties, etc
			// if there are 5 items in pathPoints, pathLayer['x'+i] turns into pathLayer['x5']
			// Note: the item index in an array starts with 0, i.e. pathPoints[0] = the 1st element. 
			pathLayer['x'+i] = pathPoints[i-1][0];	 // x-coordinate is stored in pathPoints[i-1][0]
			pathLayer['y'+i] = pathPoints[i-1][1];	 // y-coordinate is stored in pathPoints[i-1][1]
		}	
	});

	function addUserPathLayer(){
		// Creates a layer for the red userPath, but it will not appear
		// until it knows where to draw the line (defined by properties such as x1,y1,x2,y2,etc.
		// These properties are added in the cursorTracker's mousemove function above. 

		$('canvas').addLayer({
			name: 'userPath',
			type: 'line',
			strokeStyle: '#f00',	// color code for red
			strokeWidth: 3
		});
	}

	function resetPath(){
		// clear the pathPoints array, delete the userPath layer and replace it with a new blank userPath layer
	  	pathPoints = [];
	  	isTracking = false;
	  	$('canvas').removeLayer('userPath');
	  	addUserPathLayer();
	}

	function showGuideline(show){
		// the variable 'show' can be true or false. we set the value of the 'visible' property to it
		// and re-draws all layers to update the canvas.
		$('canvas').setLayer('guideline', {visible: show}).drawLayers();
	}

	function analyzePerformance(){

		// We will calculate the average deviation in the y-direction of all the points in the userPath. 
		// average = (sum of the deviations) / (number of points)

		var sumOfDeviations = 0;	// create the sum variable with starting value of 0

		// next is a for loop. Using 'i' as a counter starting at 0, it will run the instructions within the { }.
		// It increases the counter by 1, and loops again. This continues while i < pathPoints.length (size of the array)
		// to account for every point in the path. 

		for(i=0; i<pathPoints.length; i++){
			// a straight line parallel to the x-axis simplifies the math: 
			// we just need to find the absolute difference in y pixels for every i-th x pixel.
			
			var deviationY = pathPoints[i][1] - startPoint.y;	// pathPoints[i][1] represents the y position for point i
																// every y position on the straight-line path = startPoint.y

			// Add the absolute value of the deviationY. (adding negative deviations would mess up the math)
			sumOfDeviations = sumOfDeviations + Math.abs(deviationY); 
		}

		// Now update the contents of the html element with id 'results' (It is the <h3> heading after the canvas)
		// Math.round(number) rounds a number to the ones place to remove decimals.
		$('#results').html('Average Deviation: ' + Math.round(sumOfDeviations/pathPoints.length) + ' pixels');
		
		// This will change the HTML to be <h3 id="results">Average Deviation: 12 pixels</h3> for example.
	}
});