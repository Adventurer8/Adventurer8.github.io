var t=0;
var dt0=0.1;
var dt=dt0;

let ship;
let power = 1;
let direct = 1;
let fuel;
let planet;
let asteroid;
var w;
var h;
let img;
let N=0;
let stopKey = 0;

function F(x) {
	return 10000/x/x;	// 5*sin(x/10);
}

function F1(x) {
	return -10/x/x * 5;
}

function F2(x) {
	return -10/x/x * 100;
}

function F3(x) {
	return 1/x;
}

// function preload() {
// 	img = loadImage('https://github.com/Adventurer8/Adventurer8.github.io/blob/main/assets/tieFighter.png');
// }

function setup () {
	w = windowWidth - 50;
	h = windowHeight - 50;
    createCanvas(w, h);
	ellipseMode(CENTER);
	rectMode(CENTER);
	// G = createGraphics(80,80);
	// G.image(img,0,0,80,80);
    textSize(30);
    // traslate(windowWidth/2,windowHight/2);
    
 	
    stroke(100,100);	
    fill(0,10);

    ship = new ball(400,300,0,0,F,20);
    planet = new ball(w/2,h/2,0,0,F,50);
    asteroid = [];

    for(let i=0; i<N; i++)
    asteroid[i] = new ball(0,720*random(),5*random(),1*random(),F,10+50*random());
	
	fuel = [];
}

function draw () {
	if(stopKey) {
		push();
		fill(255,10);
		stroke(100,10);
		rect(50,80,20,60);
		rect(90,80,20,60);
		text('pause',30,30);
		pop();
		return 0;
	}
	background(0,0,10);

	ship.displayShip();
	ship.move(dt);

	planet.displayAster(color(120,190,170,200));

	ship.force(planet, F);

	for(let i=0;i<N;i++){
		asteroid[i].displayAster();
		asteroid[i].move(dt);
		ship.force(asteroid[i]);
	}

	for(let i=0; i<fuel.length; i++) {
		fuel[i].displayFuel();
		fuel[i].move(dt);
		ship.force(fuel[i], F1);
		fuel[i].force(ship, F2);

		fuel[i].force(planet,F3);
		// for(let j=0; j<fuel.length;j++) {
		// 	if (i == j ) break;
		// 	fuel[i].force(fuel[j],F3);	
		// }
	}

	if(keyIsDown(37)) {	// <
		direct += 0.1;
	}
	if(keyIsDown(38)) {	// ^
			// ship.vx += power * sin(direct);
			// ship.vy += power * cos(direct);
		ship.displayFire();
		let rand = 0.3*(random()-0.5);
		fuel[fuel.length] = new ball(ship.x - 25*sin(direct+rand),ship.y-20*cos(direct+rand),ship.vx,ship.vy,F1);
	}
	if(keyIsDown(39)) {	// >
		direct -= 0.1;
	}
	if(keyIsDown(40)) {	// v
		ship.vx -= power * sin(direct);
		ship.vy -= power * cos(direct);
	}

	// if(keyIsPressed) switchKey();

	t+=dt;
}


class ball {
	constructor(x,y,vx=0,vy=0,Force=F,r=50,col=0) {
		this.r=r;
		this.d=2*r;
		this.px=x;
		this.py=y;
		this.x=x;
		this.y=y;
		this.vx=vx;
		this.vy=vy;
		this.F=Force;
		this.col=col;
		this.v=sqrt(pow(this.vx,2)+pow(this.vy,2));

		this.r0=r;
		this.d0=2*r;
		this.px0=x;
		this.py0=y;
		this.x0=x;
		this.y0=y;
		this.vx0=vx;
		this.vy0=vy;
		this.F0=Force;
		this.col0=col;
	}

	update(x=this.x0,y=this.y0,vx=this.vx0,vy=this.vy0,Force=this.F0,r=this.r0,col=this.col0) {
		this.r=r;
		this.d=2*r;
		this.px=x;
		this.py=y;
		this.x=x;
		this.y=y;
		this.vx=vx;
		this.vy=vy;
		this.F=Force;
		this.col=col;
		this.v=sqrt(pow(this.vx,2)+pow(this.vy,2));
	}

	displayFire() {
		push();
		fill(200,100,100,100);
		ellipse(this.x - 20*sin(direct),this.y-20*cos(direct), 20, 20);
		pop();
	}

	displayFuel() {
		push();
		fill(150+100*random(),50+50*random(),50+50*random(),100+50*random());
		ellipse(this.x,this.y, 4, 4);
		pop();
	}

	displayShip() {
		push();
		stroke(0);
		fill(255);
		ellipse(this.x,this.y,this.d,this.d);
		stroke(0,0,255);
		line(this.x,this.y,this.x + 30*sin(direct),this.y + 30*cos(direct));
		translate(this.x,this.y);
		rotate(PI-direct);
// 		image(G,-40,-40);
		pop()
	}

	displayAster(col) {
		push();
		stroke(0);
		fill(col);
		ellipse(this.x,this.y,this.d,this.d);
		stroke(0,0,255);
		line(this.x,this.y,this.x + 30*this.vx,this.y + 30*this.vy);
		pop()
	}

	move(dt) {
		this.px=this.x;
		this.py=this.y;
		this.x+=this.vx*dt;
		this.y+=this.vy*dt;
	}

	force(b, F = this.F) {
		this.F = F;
		let distant=dist(b.x,b.y,this.x,this.y);
		let deltaX=b.x-this.x;
		let deltaY=b.y-this.y;

		this.vx+=this.F(distant)*deltaX/distant;
		this.vy+=this.F(distant)*deltaY/distant;
	}

	det_v() {
		this.v=sqrt(pow(this.vx,2)+pow(this.vy,2));
		return this.v;
	}
}

function keyPressed() {
	// print(keyCode);
	// <37 ^38 >39 v40
	// enter=13 // shift=16 // ctrl=17 // alt=18
	if(keyCode == 17) stopKey = !stopKey;
}

function keyReleased() {
	
}

function mouseReleased() {
	// b1.update();
	// b2.update(mouseX,mouseY);
}

function switchKey() {
	switch (keyCode) {

		case 13: 	// enter
			break;

		case 16: 	// shift
			break;
		case 17: 	// ctrl
			break;
		case 18: 	// alt
			break;

  		case 32: 	// Space
			break;

		case 37: 	// <
			direct += 0.1;
			break;
		case 38: 	// ^
			ship.vx += power * sin(direct);
			ship.vy += power * cos(direct);
			break;
		case 39: 	// >
			direct -= 0.1;
			break;
		case 40: 	// v
			ship.vx -= power * sin(direct);
			ship.vy -= power * cos(direct);
			break;
		}
}
