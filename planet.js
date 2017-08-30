/*const canvas = document.createElement('canvas');
const context= canvas.getContext('2d');
canvas.width = 500;
canvas.height= 500;
document.openChild(canvas);
*/
const circleSize = 1;

const NUM = 1;
var pos = [];
var vel = [];

const dt = 0.001;
var t = 0.0;

var canvas;
var ctx;

var Vector = function(_x, _y){
	this.x = _x;
	this.y = _y;
	this.get_x = function(){
		return this.x;
	}
	this.get_y = function(){
		return this.y;
	}
	this.set_x = function(_x){
		this.x = _x;
	}
	this.set_y = function(_y){
		this.y = _y;
	}
	this.add = function(v){
		this.x = this.x + v.x;
		this.y = this.y + v.y;
		return this;
	}
	this.multi = function(v){
		this.x = this.x * v.x;
		this.y = this.y * v.y;
		return this;
	}
	this.times = function(a){
		this.x = this.x * a;
		this.y = this.y * a;
		return this;
	}
}

function simulation_init(){
	for(var i=0;i<NUM;i++){
		pos[i] = new Vector(0.0, 0.0);
		vel[i] = new Vector(0.0, 0.0);
	}
	var e = Number(document.input_form.e.value);
	pos[0].set_x(1.0 - e);
	pos[0].set_y(0.0);
	vel[0].set_x(0.0);
	vel[0].set_y(Math.sqrt((1.0+e)/(1.0-e)));
}

function simulation_step(){
	function func(mode, pos, x){
		function f(x, y){
			var tmp = (x*x)+(y*y);
			tmp = tmp * tmp * tmp;
			tmp = Math.sqrt(tmp);
			tmp = -1 * tmp;
			return tmp;
		}
		var tmp = f(pos.get_x(), pos.get_y());
		if(tmp == 0.0){
			tmp = 0.0;
		}else if(mode == 0){
			tmp = pos.get_x() / tmp;
		}else{
			tmp = pos.get_y() / tmp;
		}
		return (new Vector(x.get_y(), tmp));
	}
	var zero_v = new Vector(0.0, 0.0);
	for(var i=0;i<NUM;i++){
		for(var j=0;j<2;j++){
			var x  = new Vector(0.0, 0.0);
			var k1 = new Vector(0.0, 0.0);
			var k2 = new Vector(0.0, 0.0);
			var k3 = new Vector(0.0, 0.0);
			var k4 = new Vector(0.0, 0.0);

			if(j==0){
				x.set_x(pos[i].get_x());
				x.set_y(vel[i].get_x());
			}else{
				x.set_x(pos[i].get_y());
				x.set_y(vel[i].get_y());
			}
			k1 = func(j, pos[i], x);
			k2 = func(j, pos[i], x.add(k1.times(dt/2.0)));
			k3 = func(j, pos[i], x.add(k2.times(dt/2.0)));
			k4 = func(j, pos[i], x.add(k3.times(dt)));
			var tmp = k1.add(k2.times(2.0));
			tmp.add(k3.times(2.0));
			tmp.add(k4);
			tmp.times(dt/6.0);
			x = x.add(tmp);
			if(j == 0){
				pos[i].set_x(x.get_x());
				vel[i].set_x(x.get_y());
			}else{
				pos[i].set_y(x.get_x());
				vel[i].set_y(x.get_y());
			}
			t = t + dt;
		}
	}
}

function background(){
	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function draw_circle(x, y){
	ctx.beginPath();
	ctx.fillStyle = '#3399FF';
	ctx.arc(x,y,circleSize,0,Math.PI*2.0,true);
	ctx.fill();
}

function draw(){
	//background();
	draw_circle(500.0,500.0);
	var zoom = 100;
	for(var i=0;i<NUM;i++){
		draw_circle((pos[i].get_x()*zoom)+500, (pos[i].get_y()*zoom)+500);
		console.log("t: %f, x: %f, y: %f", t, pos[i].get_x(), pos[i].get_y());
	}
}

function step(){
	simulation_step();
	draw();
//	alert("a");
}

function simulation_start(){
	simulation_init();
	canvas = document.getElementById('planet');
	if(canvas.getContext){
		ctx = canvas.getContext('2d');
		setInterval(step, 1);
	}
}
