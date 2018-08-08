var rockets = [];
var particles = [];
var rocketsLeft = 5;
var foo = 0;
var cooldown = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	strokeWeight(2);
}

function draw() {
	background(0);
	if (foo < 300) {foo++};
	if (cooldown > 0) {cooldown--};
	
	for (var i in rockets) {
		if (!rockets[i].isOutOfScreen()) {
			if (rockets[i].shouldBurst()) {
				rockets[i].burst();
				rockets.splice(i, 1);
			} else {
				rockets[i].run();
			}
		}
	}

	for (var i in particles) {
		if (particles[i].shouldDie()) {
			particles.splice(i, 1);
		} else {
			particles[i].run();
		}
	}
	
	if (foo % 24 == 0) {
		if (rocketsLeft > 0) {
			addRocket(-1);
			rocketsLeft--;
		}
	}
}

function touchStarted() {
	if (cooldown <= 0) {addRocket(mouseX); cooldown = 24;}
}

function addRocket(_x) {
	var x;
	var y = height - 10;
	if (_x <= 0) {x = random(0, width)} else {x = _x};
	rockets.push(new Rocket(x, y));
}

var Rocket = function(x, y) {
	this.x = x; this.y = y;
	this.v = {x: 0, y: -5};
	this.heightLimit = random(100, 250);
	this.particleLimit = 50;
	this.color = {
		r: Math.floor(random(255)),
		g: Math.floor(random(255)),
		b: Math.floor(random(255))
	}
	print(this.color.r, this.color.g, this.color.b);
	
	this.run = () => {
		this.update();
		this.draw();
	}
	
	this.draw = () => {
		strokeWeight(5);
		/*for (var i = 1; i <= 20; i++) {
			var trailY = this.y + i;
			var trailA = 1000 / (i*10);
			stroke(this.color.r, this.color.g, this.color.b, trailA);
			point(this.x, trailY);
		}*/
			stroke(this.color.r, this.color.g, this.color.b);
		point(this.x, this.y);
		strokeWeight(2);
	}
	
	this.update = () => {
		this.y += this.v.y;
	}
	
	this.isOutOfScreen = () => {
		return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
	}
	
	this.shouldBurst = () => {
		return this.y < this.heightLimit;
	}
	
	this.burst = () => {
		for (var i = 0; i <= this.particleLimit; i++) {
			particles.push(new Particle(this.x, this.y, this.color));
		}
	}
}

var Particle = function(x, y, c) {
	this.x = x; this.y = y;
	this.v = {x: random(-3, 3), y: random(-2, -5)};
	this.a = {x: 0, y: 0.1};
	this.opacity = 255;
	this.color = {
		r: c.r,
		g: c.g,
		b: c.b
	}
	
	this.run = () => {
		this.update();
		this.draw();
	}
	
	this.draw = () => {
		stroke(this.color.r, this.color.g, this.color.b, this.opacity);
		point(this.x, this.y);
	}
	
	this.update = () => {
		this.opacity -= 5;
		
		this.v.x += this.a.x;
		this.v.y += this.a.y;
		
		this.x += this.v.x;
		this.y += this.v.y;
	}
	
	this.shouldDie = () => {
		return this.opacity <= 0;
	}
}