// JavaScript source code
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.height -= 87;

var c = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
}

var click = {
    x: undefined,
    y: undefined
}

var MaxRadius = 50;
var MinRadius = 20;

/* ****************************** */
/* ******* EVENT LISTENER ******* */
/* ****************************** */
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('click', function (event) {
    click.x = event.x;
    click.y = event.y;
    //console.log(click);
})


/* ****************************** */
/* *** Create and draw circles ** */
/* ****************************** */
function Circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.stroke();
    }

    this.update = function () {
        if ((this.x + this.radius > innerWidth) || (this.x - this.radius < 0)) {
            this.dx = -this.dx;
        }

        if ((this.y + this.radius > innerHeight) || (this.y - this.radius < 0)) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // interactivity with mouse hover event
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radius < MaxRadius) {
                this.radius += 0.7;
            }
        }
        else if (this.radius > MinRadius) {
            this.radius -= 1;
        }

        // interactivity with click event
        if (click.x - this.x < 20 && click.x - this.x > -20 && click.y - this - y < 60 && click.y - this.y > -60) {
            console.log(click);
            //c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        }
        this.draw();
    }
}

/* ****************************** */
/* *** Calculate random color *** */
/* ****************************** */
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

// Array of circle objects
var circleArray = [];

// fill out the array with random circles
for (var i = 0; i < 150; i++) {
    var radius = 30;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5);
    var dy = (Math.random() - 0.5);
    var color = random_rgba();

    circleArray.push(new Circle(x, y, dx, dy, radius, color));
}

/* ****************************** */
/* *** animate the canvas page ** */
/* ****************************** */
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

/* ****************************** */
/* * initialize the canvas page * */
/* ****************************** */
function initialize() {
    // Register an event listener to
    // call the resizeCanvas() function each time
    // the window is resized.
    window.addEventListener('resize', resizeCanvas, false);
    // Draw canvas border for the first time.
    resizeCanvas();
}

/* ****************************** */
/* **  resize the canvas       ** */
/* ****************************** */
// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.height -= 87;
    animate();
}
initialize();
//animate();