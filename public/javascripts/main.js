
var pointLst = []; 
/*
Some variables, including a canvas for drawing, a drawing context for
the canvas, a flag (boolean) to indicate drawing, x and y points for drawing, and a
final flag (dot_flag, boolean) to support starting a new stroke by clearing contents.
*/
var canvas, drawdiv, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

/*
Horrible variable names: Do as I do, not as I say. x is your drawing color and y is the 
stroke width when drawing. So a black stroke that is 2 pixels wide.
*/
var x = "black",
    y = 2;

/*
function init gets called on launch. It sets up the drawing context for the canvas, ctx and
it adds "listeners" to the canvas to allow the canvast to receive mouse events. Mouse events 
will be handled by a function findxy. Note that findxy gets two aprameters, the "event", i.e. 
was it a move, a mousedown, a mouseup, or a mouseout event, and the event parameters, "e" which
has useful things like x,y components of the mouse.
*/
function init() {
    canvas = document.getElementById('can');
    drawdiv = document.getElementById('sketch');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    // Touch
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        findxy('move',mouseEvent);
      }, false);
      canvas.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        findxy('down',mouseEvent);
      }, false);
      
      
      

    // MOUSE
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

/*
This helper function gets contents from the Clipboard. It will typically prompt you for permissionto read from the clipboard. When it gets content from the clipboard, it will 
paste it into the points list and it will draw the points on the screen.
*/
async function getClipboardContents(){
    try{
        const text = await navigator.clipboard.readText();
        document.getElementById("points").textContent = text;
        draw_all();
    } catch (err){
        console.error('Failed');
    }
}

/*
    Record points *** MAIN *******
*/
function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
    document.getElementById("points").textContent += '['+currX+','+currY+'],';
}

/*
This function is a bit complex. It basically parses a list of points and draws the 
entire list of points. It does this by filling an "array", a "list" in racket using
a strong parsing function that strips everything out of the string except numbers
(that's the allpoints = mystring ... line) and then goes through and draws all of 
those points (that's the for loop).
*/
function draw_all() {
    var mystring = document.getElementById("points").textContent;
    var allpoints = mystring.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/g).map(Number);
    if ((allpoints.length > 1) && ((allpoints.length % 2) == 0)){
        var i;
        ctx.beginPath();
        ctx.moveTo(allpoints[0], allpoints[1]);
        for (i=1; i<(allpoints.length/2); i++) {
            ctx.lineTo(allpoints[2*i], allpoints[2*i+1]);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
        }
        ctx.closePath();
        create_image()
    }
}

/*
Clear everything.
*/
function erase() {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
    document.getElementById("points").textContent = '';
}

/*
Copies the points drawn on the display to the clipboard. You can use this to then paste your list of points into Dr Racket.
*/
function copy() {
    document.getElementById("points").select();
    document.execCommand('copy');
    // Use RE to convert Txt -> Array 
}

/*
A past wrapper function. Calls the getClipboardContents function to do the work.
*/
function paste() {	
    erase();
    getClipboardContents();
}

/*
Creates a small image of the stroke you have drawn. You can use your Racket code to create
a recognizer for any set of gestures you want (e.g. the numbers 1 to 10, etc.). If you do this
you might want little "images" that you can paste somewhere to show people what the gestures
your recognizer accepts look like.
*/
function create_image() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

/*
this is the function that handles mouse events. Basically it reads as follows:
1. If the event is a mousedown event (the user presses down on the mouse button),
then we clear the rectangle and start a new points list. We also set previous x and y
to the current position, and we get ready to draw a line by setting our flags to true.
We also create a small dot, a rectangle, of size 2, 2 at the current point on the 
beginning of the line. 
2. If the even is up or out (i.e. we released the mouse button or moved out of the
region), then we want to stop drawing. We also show the image of what was drawn.
3. Otherwise, it is a mousemove function. If we are drawing (i.e. the flag is true, set 
on mouse down, the first if statement above), then we set our points and call the draw 
function.
*/
function findxy(res, e) {
    if (res == 'down') {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("points").textContent = '[';
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - (canvas.offsetTop + drawdiv.offsetTop - window.pageYOffset);

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        if (flag)
        {
            document.getElementById("points").textContent += ']\n';
            create_image();
        }
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - (canvas.offsetTop + drawdiv.offsetTop - window.pageYOffset);
            draw();
        }
    }
}


