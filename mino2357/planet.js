"use strict";

const circleSize = 1;
const NUM = 1;
const dt = 0.001;

var e = 0.0;
var r = new Array(4);

var t = 0.0;

var canvas;
var ctx;

function add(x, y){
    var ans = new Array(4);
    for(var i=0; i<x.length; ++i){
        ans[i] = x[i] + y[i];
    }
    return ans;
}

function addWithScaler(x, scaler, y){
    var ans = [];
    for(var i=0; i<x.length; ++i){
        ans[i] = x[i] + scaler * y[i];
    }
    return ans;
}

function simulation_init(){
    e = Number(document.input_form.e.value);
    r = [1-e, 0, 0, Math.sqrt((1.0+e)/(1.0-e))];
}

function func_F(array){
    var x = array.slice(0, 2);
    var v = array.slice(2, 4);
    
    var ans = v;

    var R = Math.sqrt(x[0]*x[0]+x[1]*x[1]);

    ans.push(-x[0]/(R*R*R));
    ans.push(-x[1]/(R*R*R));

    return ans;
}

function simulation_step(){

    var k1 = new Array(4);
    var k2 = new Array(4);
    var k3 = new Array(4);
    var k4 = new Array(4);

    var t = 0;

    for(var i=0; t<10; ++i){
        k1 = func_F(r);
        k2 = func_F(addWithScaler(r, dt/2.0, k1));
        k3 = func_F(addWithScaler(r, dt/2.0, k2));
        k4 = func_F(addWithScaler(r, dt, k3));

        r = addWithScaler(r, dt/6.0, add(addWithScaler(addWithScaler(k1, 2.0, k2), 2.0, k3), k4))

        t += dt;
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
	draw_circle(500.0,500.0);
	var zoom = 100;
	for(var i=0;i<NUM;i++){
		draw_circle((r[0]*zoom)+500, (r[1]*zoom)+500);
	}
}

function step(){
	simulation_step();
	draw();
}

function simulation_start(){
    simulation_init();
	canvas = document.getElementById('planet');
	if(canvas.getContext){
		ctx = canvas.getContext('2d');
		setInterval(step, 1);
    }
}
