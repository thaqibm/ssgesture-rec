// Canvas
var canvas,ctx;
const single_stroke = true; 
var canvas, drawdiv, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
	dot_flag = false,
	txt,
	prevTX,
	prevTY;

var X = "black", Y = 2;
function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = X;
    ctx.lineWidth = Y;
    ctx.stroke();
    ctx.closePath();
    document.getElementById("points").textContent += '['+currX+','+currY+'],';
}
// Variables to keep track of the mouse position and left-button status 
var mouseX,mouseY,mouseDown=0;

// Variables to keep track of the touch position
var touchX,touchY;

function drawDot(ctx,x,y,size) {
	// Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
	r=0; g=0; b=0; a=255;

	// Select a fill style
	ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

	// Draw a filled circle
	
	ctx.beginPath();
	ctx.moveTo(prevTX, prevTY);
	ctx.lineTo(touchX,touchY);
	ctx.strokeStyle = X;
    ctx.lineWidth = Y;
	ctx.stroke();
	ctx.closePath();
    document.getElementById("points").textContent += '['+x+','+y+'],';

} 

function clearCanvas(canvas,ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	txt.textContent = "";
	document.getElementById("canvasimg").src = "";
}

function sketchpad_mouseDown(e) {
	
	if(single_stroke){
		ctx.clearRect(0, 0, w, h);
		txt.textContent = '['
	}
	
	mouseDown=1;
	prevX = currX;
	prevY = currY;
	currX = e.clientX - canvas.offsetLeft;
	currY = e.clientY - (canvas.offsetTop - window.pageYOffset);
	flag=true; 

}

function sketchpad_mouseUp(e) {
	if(flag)
	{
		var n = txt.textContent.length;
		var s = txt.textContent;
		txt.textContent = s.substring(0,n-1)+ ']';

		create_image();
	}
	flag = false;
	mouseDown=0;

}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) { 
	// Update the mouse co-ordinates when moved
	getMousePos(e);

	// Draw a dot if the mouse button is currently being pressed
	if (mouseDown==1) {
		prevX = currX;
        prevY = currY;
        currX = e.offsetX
        currY = e.offsetY
		draw();
	}
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
	if (!e)
		var e = event;

	if (e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if (e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}
 }

// Draw something when a touch start is detected
function sketchpad_touchStart() {
	if(single_stroke){
		ctx.clearRect(0, 0, w, h);
		txt.textContent = '['
	}
	flag=true;
	// Update the touch co-ordinates
	getTouchPos();
	prevTX = touchX; prevTY=touchY;
	drawDot(ctx,touchX,touchY);

	// Prevents an additional mousedown event being triggered
	event.preventDefault();
}

// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) { 
	// Update the touch co-ordinates
	getTouchPos(e);

	// During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
	drawDot(ctx,touchX,touchY); 

	// Prevent a scrolling action as a result of this touchmove triggering.
	event.preventDefault();
}
function sketchpad_touchEnd(){
	if(flag)
	{
		var n = txt.textContent.length;
		var s = txt.textContent;
		txt.textContent = s.substring(0,n-1)+ ']\n';
		create_image();
	}
	flag = false;
}

// Get the touch position relative to the top-left of the canvas
// When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// "target.offsetTop" to get the correct values in relation to the top left of the canvas.
function getTouchPos(e) {
	if (!e)
		var e = event;

	if(e.touches) {
		if (e.touches.length == 1) { // Only deal with one finger
			var touch = e.touches[0]; // Get the information for finger #1
			prevTX = touchX;
			prevTY = touchY;
			touchX=touch.pageX-touch.target.offsetLeft;
			touchY=touch.pageY-touch.target.offsetTop;
		}
	}
}

function create_image() {
    document.getElementById("canvasimg").style.border = "2px solid";
	var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
	// Get the specific canvas element from the HTML document
	
	drawdiv = document.getElementById('sketch');
	canvas = document.getElementById('sketchpad');
	txt = document.getElementById('points');
	w = canvas.width;
    h = canvas.height;


	// If the browser supports the canvas tag, get the 2d drawing context for this canvas
	if (canvas.getContext)
		ctx = canvas.getContext('2d');

	// Check that we have a valid context to draw on/with before adding event handlers
	if (ctx) {
		// React to mouse events on the canvas, and mouseup on the entire document
		canvas.addEventListener('mousedown', (e) => sketchpad_mouseDown(e), false);
		canvas.addEventListener('mousemove', (e) => sketchpad_mouseMove(e), false);
		window.addEventListener('mouseup', (e) => sketchpad_mouseUp(e), false);
		window.addEventListener('mouseout', (e) => sketchpad_mouseUp(e), false);
		
		// React to touch events on the canvas
		canvas.addEventListener('touchstart', sketchpad_touchStart, false);
		canvas.addEventListener('touchmove', sketchpad_touchMove, false);
		canvas.addEventListener('touchend', sketchpad_touchEnd, false);
		

	}
}