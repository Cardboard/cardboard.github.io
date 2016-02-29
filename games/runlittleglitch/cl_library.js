// CanvasLord Library
// Version 1.02
// © 2011 Ian Jones (AKA W!TS)
// NOTICE: You must give credit to Ian Jones if you use any substantial amount of code from this source file.

//Declare Events
window.addEventListener("load",engineStart);
document.addEventListener("mousemove",getMouseCoordinates);
document.addEventListener("keydown",keyPress);
document.addEventListener("keypress",keyPress);
document.addEventListener("keyup",keyRelease);

//Declare Constants
const CLVERSION=1.02;
const RELEASED=-1;
const DORMANT=0;
const HELD=1;
const PRESSED=2;
const KEY_LEFT=37;
const KEY_UP=38;
const KEY_RIGHT=39;
const KEY_DOWN=40;
const KEY_SPACE=32;
const NOONE=-1;
const NONE="none";
const TILENONE=0;
const TILEX=1;
const TILEY=2;
const TILEBOTH=3;

//FUNCTIONS
    //Basic Functions
	function irandom(x) { return Math.round(x*Math.random()); }
	function irandomRange(min,max) { return min+Math.round((max-min)*Math.random()) }
	function sign(x) { if (x == 0) { return 0; } else if (x < 0) { return -1; } else { return 1; } }
	function pointDistance(x1,y1,x2,y2) { return Math.round(Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))); }
	function pointDirection(x1,y1,x2,y2,ov) { if (ov==undefined) { ov=0; } var rv=Math.round(360-(180*(Math.atan((y2-y1)/(x2-x1))/Math.PI))); if(x2<x1) { rv-=180; } if(rv<0) { rv+=359; } while(rv>=360) { rv-=360; } if (x1==x2 && y1==y2) { return ov; } else { return rv; } }
	function angleDifference(angle1,angle2) { return ((((angle1-angle2)%360)+540)%360-180); }
	function lengthDirX(length,dir) { return length*Math.cos(dir*Math.PI/180); }
	function lengthDirY(length,dir) { return -length*Math.sin(dir*Math.PI/180); }
	function choose() { return arguments[irandom(arguments.length-1)]; }
	function colorRandom(min,max) { return "rgb("+irandomRange(min,max)+","+irandomRange(min,max)+","+irandomRange(min,max)+")"; }
	function colorMakeRGB(r,g,b) { return "rgb("+r+","+g+","+b+")"; }
	function colorMakeHSL(h,s,l) { return "hsl("+h+","+Math.round(s)+"%,"+Math.round(l)+"%)"; }
	function colorMakeHSV(h255,s255,v255)
	{
		var h=h255/255;
		var s=s255/255;
		var v=v255/255;
		if ( s == 0 )                       //HSV from 0 to 1
		{
		   var r = v255;
		   var g = v255;
		   var b = v255;
		}
		else
		{
		   var var_h = h * 6;
		   if ( var_h == 6 ) { var_h = 0; }      //H must be < 1
		   var var_i = Math.floor( var_h )  ;           //Or ... var_i = floor( var_h )
		   var var_1 = v * ( 1 - s );
		   var var_2 = v * ( 1 - s * ( var_h - var_i ) );
		   var var_3 = v * ( 1 - s * ( 1 - ( var_h - var_i ) ) );

		   if      ( var_i == 0 ) { var_r = v     ; var_g = var_3 ; var_b = var_1 }
		   else if ( var_i == 1 ) { var_r = var_2 ; var_g = v     ; var_b = var_1 }
		   else if ( var_i == 2 ) { var_r = var_1 ; var_g = v     ; var_b = var_3 }
		   else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = v     }
		   else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = v     }
		   else                   { var_r = v     ; var_g = var_1 ; var_b = var_2 }

		   var r = Math.round(var_r * 255);                  //RGB results from 0 to 255
		   var g = Math.round(var_g * 255);
		   var b = Math.round(var_b * 255);
		}
		return "rgb("+r+","+g+","+b+")";
	}
	function randomColor(min,max) { return "#"+(min+irandom(max-min))+(min+irandom(max-min))+(min+irandom(max-min)); }
	function clearCanvas() { cxt.clearRect(0,0,c.width,c.height); }
	function alarmSet(code,steps) { var alarmTimeout=setTimeout(code,steps*gamespeed); }
	function setFPS() { if (debugPlaying==true) { fps=sts; } sts=0; }
	function setGamespeed(milliseconds) { gamespeed=milliseconds; clearInterval(stepInterval); stepInterval=setInterval("engineStep()",gamespeed); }
	function setGameSpeed(spd) { gamespeed=1000/spd; clearInterval(stepInterval); stepInterval=setInterval("engineStep()",gamespeed); }
	function sortDepth(a,b) { return b.depth-a.depth; }
	//Mouse Functions
	function getMouseCoordinates(e) { if (e.pageX != undefined && e.pageY != undefined) { trueMouseX = e.pageX; trueMouseY = e.pageY; } else { trueMouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; trueMouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; } trueMouseX -= c.offsetLeft; trueMouseY -= c.offsetTop; if(trueMouseX<0 || trueMouseX>c.width || trueMouseY<0 || trueMouseY>c.height) { mouseStatus=-1; } }
	function mouseClick() { mouseStatus=2; }
	function mouseRelease() { mouseStatus=-1; }
	function mouseUpdate() { mouseX=trueMouseX+cameraX; mouseY=trueMouseY+cameraY; if (mouseStatus==2) { mouseStatus=1; } if (mouseStatus==-1) { mouseStatus=0; } }
	//Key Functions
	function keyAdd(name,keycode) { var i=keys.length; keys[i]=new Object(); keys[i].keycode=keycode; keys[i].status=0; keys[i].name=name; }
	function keyPress(e) { var evtobj=window.event? event : e; var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode; var i=0; while(i<keys.length) { if(unicode==keys[i].keycode && keys[i].status<=0) { keys[i].status=2; } i++; } keyLastPressed=unicode; /* DEBUGGER */ if (debug==true && unicode==192) { debugToggle(); } }
	function keyRelease(e) { var evtobj=window.event? event : e; var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode; var i=0; while(i<keys.length) { if(unicode==keys[i].keycode && keys[i].status>=1) { keys[i].status=-1; } i++; } keyLastReleased=unicode; }
	function keyUpdate() { var i=0; while(i<keys.length) { if(keys[i].status==-1) { keys[i].status=0; } else if(keys[i].status==2) { keys[i].status=1; } i++; } }
	function keyStatus(name) { var i=0; while(i<keys.length) { if(keys[i].name==name) { return keys[i].status; } i++; } }
	function keyValue(name) { var i=0; while(i<keys.length) { if(keys[i].name==name) { return keys[i].status; } i++; } }
	function keyCheck(name) { var i=0; while(i<keys.length) { if(keys[i].name==name) { if (keys[i].status<=0) { return 0; } else { return 1; } } i++; } }
	function keyChange(name,keycode) { var i=0; while(i<keys.length) { if(keys[i].name==name) { keys[i].status=0; keys[i].keycode=keycode; } i++; } }
	//Multitouch Functions
	function touchStart(e) { touches=e.touches; touchUpdate(2); }
	function touchMove(e) { touches=e.touches; touchUpdate(2); }
	function touchEnd(e) { touches=e.touches; touchUpdate(-1); }
	function touchUpdate(m)
		{
		for(t=0;t<touches.length;t++)
			{
			touches[t].trueX=touches[t].pageX+document.body.scrollLeft+document.documentElement.scrollLeft-c.offsetLeft;
			touches[t].trueY=touches[t].pageY+document.body.scrollTop+document.documentElement.scrollTop-c.offsetTop;
			touches[t].x=touches[t].trueX+cameraX;
			touches[t].y=touches[t].trueY+cameraY;
			if (touches[t].status==undefined) { touches[t].status=0; }
			if (m==2 && touches[t].status==0) { touches[t].status=2; }
			else if (m==-1 && touches[t].status==1) { touches[t].status=-1; }
			}
		}
	function touchCorrect() { for(t=0;t<touches.length;t++) { if(touches[t].status==-1) { touches[t].status=0; } else if(touches[t].status==2) { touches[t].status=1; } } }
	function touchCount() { return touches.length; }
	//Sprite Functions
	function spriteAdd(name,url) { var i=sprites.length; sprites[i]=new Image(); sprites[i].name=name; sprites[i].src=url; sprites[i].frames=1; }
	function spriteAddStrip(name,url,frames) { var i=sprites.length; sprites[i]=new Image(); sprites[i].name=name; sprites[i].src=url; sprites[i].frames=frames; }
	function spriteLoaded(name) { var s=spriteGet(name); return s.complete; }
	function spriteGet(name) { var i=0; while(i<sprites.length) { if(sprites[i].name==name) { return sprites[i]; break; } i++; } }
		//The next two functions are not functioning yet... Literally. They do nothing but slow it down by a few nanoseconds. D:
	function spriteSetColorRGB(sprite,r,g,b) { for(w=0;w<sprites.length;w++) { if (sprites[w].name==sprite) { alert(w); var pix=sprites[w].data; } }
    for (var q = 0, n = pix.length; q < n; q += 4) {
    pix[q  ] = r;   // red
    pix[q+1] = g;   // green
    pix[q+2] = b;   // blue
    }
	alert(pix);
	for(w=0;w<sprites.length;w++) { if (sprites[w].name==sprite) { sprites[w].data=pix; } }
	}
	function spriteSetColorHSV(sprite,h255,s255,v255) {
	var h=h255/255;
		var s=s255/255;
		var v=v255/255;
		if ( s == 0 )                       //HSV from 0 to 1
		{
		   var r = Math.round(v * 255);
		   var g = Math.round(v * 255);
		   var b = Math.round(v * 255);
		}
		else
		{
		   var var_h = h * 6;
		   if ( var_h == 6 ) { var_h = 0; }      //H must be < 1
		   var var_i = Math.floor( var_h )  ;           //Or ... var_i = floor( var_h )
		   var var_1 = v * ( 1 - s );
		   var var_2 = v * ( 1 - s * ( var_h - var_i ) );
		   var var_3 = v * ( 1 - s * ( 1 - ( var_h - var_i ) ) );

		   if      ( var_i == 0 ) { var_r = v     ; var_g = var_3 ; var_b = var_1 }
		   else if ( var_i == 1 ) { var_r = var_2 ; var_g = v     ; var_b = var_1 }
		   else if ( var_i == 2 ) { var_r = var_1 ; var_g = v     ; var_b = var_3 }
		   else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = v     }
		   else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = v     }
		   else                   { var_r = v     ; var_g = var_1 ; var_b = var_2 }

		   var r = Math.round(var_r * 255);                  //RGB results from 0 to 255
		   var g = Math.round(var_g * 255);
		   var b = Math.round(var_b * 255);
		}
	for(w=0;w<sprites.length;w++) { if (sprites[w].name==sprite) { var pix=sprites[w].data } }
    for (var q = 0, n = pix.length; q < n; q += 4) {
    pix[q  ] = r;   // red
    pix[q+1] = g;   // green
    pix[q+2] = b;   // blue
    }
	for(w=0;w<sprites.length;w++) { if (sprites[w].name==sprite) { sprites[w]=pix; } }
 }
	function spriteDraw(sprite,x,y)	{
									var i=spriteGet(sprite);
									cxt.drawImage(i,0,0,(i.width/i.frames),i.height,x-cameraX,y-cameraY,i.width,i.height);
									}
	function spriteDrawExt(sprite,x,y,frame,xoffset,yoffset,xscale,yscale,angle,alpha) {
																			var s=spriteGet(sprite);
																			var ii=cxt.globalAlpha;
																			cxt.globalAlpha=alpha;
																			cxt.save();
																		   cxt.translate(x-cameraX+((s.width/s.frames)*xscale/2),y-cameraY+(s.height*yscale/2));
																		   cxt.rotate(-((angle)/(180/Math.PI)) );
																		   cxt.translate(-(x-cameraX+((s.width/s.frames)*xscale/2)),-(y-cameraY+(s.height*yscale/2)));
																		   cxt.drawImage(s,frame*(s.width/s.frames),0,(s.width/s.frames),s.height,x-xoffset-cameraX,y-yoffset-cameraY,(s.width/s.frames)*xscale,s.height*yscale);
																		   cxt.restore();
																			cxt.globalAlpha=ii;
																			}
	function spriteDrawAngle(sprite,x,y,angle) {
							   cxt.save();
							   var s=spriteGet(sprite);
							   cxt.translate(x-cameraX+((s.width/s.frames)/2),y-cameraY+(s.height/2));
							   cxt.rotate(-((angle)/(180/Math.PI)) );
							   cxt.translate(-(x-cameraX+((s.width/s.frames)/2)),-(y-cameraY+(s.height/2)));
							   cxt.drawImage(s,0,0,(s.width/s.frames),s.height,x-cameraX,y-cameraY,s.width/s.frames,s.height);
							   cxt.restore();
							   }
	function spriteDrawAngleScaled(sprite,x,y,xscale,yscale,angle) {
							   cxt.save();
							   var s=spriteGet(sprite);
							   cxt.translate(x-cameraX+((s.width/s.frames)*xscale/2),y-cameraY+(s.height*yscale/2));
							   cxt.rotate(-((angle)/(180/Math.PI)) );
							   cxt.translate(-(x-cameraX+((s.width/s.frames)*xscale/2)),-(y-cameraY+(s.height*yscale/2)));
							   cxt.drawImage(s,0,0,(s.width/s.frames),s.height,x-cameraX,y-cameraY,(s.width/s.frames)*xscale,s.height*yscale);
							   cxt.restore();
							   }
		//spriteDrawAngleAtPoint() does not seem to be functioning properly yet
	function spriteDrawAngleAtPoint(sprite,x,y,xvertex,yvertex,angle) {
							   cxt.save();
							   var s=spriteGet(sprite);
							   cxt.translate(x-xvertex,y-yvertex);
							   cxt.rotate(-((angle-90)/(180/Math.PI)) );
							   cxt.translate(-(x-(s.width-xvertex)),-(y-(s.height-yvertex)));
							   cxt.drawImage(s,x-xvertex,y-yvertex);
							   cxt.restore();
							   }
	//Object Functions
	function objectAdd(name,sprite,xoffset,yoffset,depth) { var i=objects.length; objects[i]=new Object(); objects[i].name=name; objects[i].sprite=sprite; objects[i].alpha=1; objects[i].xoffset=xoffset; objects[i].yoffset=yoffset; objects[i].xscale=1; objects[i].yscale=1; objects[i].friction=0; objects[i].width=0;objects[i].height=0; objects[i].depth=depth; objects[i].mask=0; objects[i].maskX=0; objects[i].maskY=0; objects[i].imageSpeed=1; }
	function objectAddExt(name,sprite,width,height,alpha,xoffset,yoffset,xscale,yscale,friction,mask,depth) { var i=objects.length; objects[i]=new Object(); objects[i].name=name; objects[i].sprite=sprite; objects[i].alpha=alpha; objects[i].xoffset=xoffset; objects[i].yoffset=yoffset; objects[i].xscale=xscale; objects[i].yscale=yscale; objects[i].friction=friction; objects[i].width=width; objects[i].height=height; objects[i].mask=mask; objects[i].maskX=0; objects[i].maskY=0; objects[i].depth=depth; objects[i].imageSpeed=1; }
	function objectGet(name) { var i=0; while(i<objects.length) { if(objects[i].name==name) { return i; break; } i++; } }
	//Instance Functions
	function instanceAdd(x,y,name) {
									var i=instances.length;
									var ii=objectGet(name);
									instances[i]=new Object();
									instances[i].id=i;
									instances[i].active=true;
									instances[i].name=name;
									instances[i].x=x;
									instances[i].y=y;
									instances[i].maskX=0;
									instances[i].maskY=0;
									instances[i].hspeed=0;
									instances[i].vspeed=0;
									instances[i].xoffset=objects[ii].xoffset;
									instances[i].yoffset=objects[ii].yoffset;
									instances[i].xscale=objects[ii].xscale;
									instances[i].yscale=objects[ii].yscale;
									instances[i].friction=objects[ii].friction;
									instances[i].alpha=objects[ii].alpha;
									instances[i].sprite=objects[ii].sprite;
									instances[i].width=objects[ii].width;
									instances[i].height=objects[ii].height;
									instances[i].depth=objects[ii].depth;
									instances[i].imageFrame=0;
									instances[i].imageSpeed=objects[ii].imageSpeed;
									instances[i].imageAngle=0;
									objectEventCreate(i);
									return i;
									}
	function instanceExists(object) { var i=0; while(i<instances.length) { if(instances[i].name==object) { return true; break; } i++; } return false; }
	function instanceCount(object) { var i=0; var ii=0; while(i<instances.length) { if(instances[i].name==object) { ii++; } i++; } return ii; }
	function instanceFind(object,n) { var i=0; var ii=0; while(i<instances.length) { if(instances[i].name==object) { ii++; if(ii==n){return i; break;} } i++; } return -1; }
	function instanceDestroy(instance) { instances.splice(instance,1); for(x=0;x<instances.length;x++) { instances[x].id=x; } }
	function instancesClear() { instances.splice(0,instances.length); }
	//Background Functions
	function backgroundAdd(name,url) { var i=backgrounds.length; backgrounds[i]=new Image(); backgrounds[i].name=name; backgrounds[i].src=url; backgrounds[i].tile=0; }
	function backgroundGet(name) { var i=0; while(i<backgrounds.length) { if(backgrounds[i].name==name) { return i; break; } i++; } }
	function backgroundSet(name,width,height,tile) { var i=backgroundGet(name); if(width!=-1){backgrounds[i].width=width;} if(height!=-1){backgrounds[i].height=height;} backgrounds[i].tile=tile; }
	function backgroundLoaded(name) { var s=backgroundGet(name); return backgrounds[s].complete; }
//Particle Functions
	function particleTypeAdd(name,xvariance,yvariance,minsize,maxsize,minlife,maxlife) { var i=particleTypes.length; particleTypes[i]=new Object(); particleTypes[i].name=name; particleTypes[i].xvariance=xvariance; particleTypes[i].yvariance=yvariance; particleTypes[i].minsize=minsize; particleTypes[i].maxsize=maxsize; particleTypes[i].minlife=minlife; particleTypes[i].maxlife=maxlife; }
	function particleTypeGet(name) { var i=0; while(i<particleTypes.length) { if(particleTypes[i].name==name) { return i; break; } i++; } }
	function particleAdd(type,x,y,hspeed,vspeed,color) { var i=particles.length; var ii=particleTypeGet(type); particles[i]=new Object(); particles[i].type=type; particles[i].x=x+irandom(-particleTypes[ii].xvariance)+irandom(particleTypes[ii].xvariance); particles[i].y=y+irandom(-particleTypes[ii].yvariance)+irandom(particleTypes[ii].yvariance); particles[i].hspeed=hspeed; particles[i].vspeed=vspeed; particles[i].color=color; particles[i].size=irandom(particleTypes[ii].maxsize-particleTypes[ii].minsize)+particleTypes[ii].minsize; particles[i].life=irandom(particleTypes[ii].maxlife-particleTypes[ii].minlife)+particleTypes[ii].minlife; }
	function particleDestroy(particle) { particles.splice(particle,1); }
	function particlesClear() { particles.splice(0,particles.length); }
	//Motion Functions
	function motionSet(instance,speed,direction) { instances[instance].hspeed=lengthDirX(speed,direction); instances[instance].vspeed=lengthDirY(speed,direction); }
	function motionAdd(instance,speed,direction) { var ENGINEVARx=lengthDirX(speed,direction)+instances[instance].hspeed; var ENGINEVARy=lengthDirY(speed,direction)+instances[instance].vspeed; var ENGINEVARdis=pointDistance(0,0,ENGINEVARx,ENGINEVARy); var ENGINEVARdir=pointDirection(0,0,ENGINEVARx,ENGINEVARy); instances[instance].hspeed=lengthDirX(ENGINEVARdis,ENGINEVARdir); instances[instance].vspeed=lengthDirY(ENGINEVARdis,ENGINEVARdir); }
	function motionAddXY(instance,x,y) { instances[instance].hspeed+=x; instances[instance].vspeed+=y; }
	function motionGetDir(instance) { return pointDirection(0,0,instances[instance].hspeed,instances[instance].vspeed); }
	function motionGetDis(instance) { return pointDistance(0,0,instances[instance].hspeed,instances[instance].vspeed); }
	//Collision Functions
	function hitboxSetMask(instance,mask) { instances[instance].mask=mask; }
	function hitboxSet(instance,width,height,x,y,mask) { instances[instance].width=width; instances[instance].height=height; instances[instance].maskX=x; instances[instance].maskY=y; instances[instance].mask=mask; }
	function hitboxCollide(instance,mask) { var i=0; while(i<instances.length) { if(instances[i].active==true && instances[i].mask==mask && i!=instance) { if((instances[instance].width/2+instances[i].width/2)>Math.abs((instances[instance].x-instances[instance].xoffset+instances[instance].maskX)-(instances[i].x-instances[i].xoffset+instances[i].maskX)) && (instances[instance].height/2+instances[i].height/2)>Math.abs((instances[instance].y-instances[instance].yoffset+instances[instance].maskY)-(instances[i].y-instances[i].yoffset+instances[i].maskY))) { return i; break; } } i++; } return -1; }
	function hitboxCollidePosition(instance,mask,x,y) { var i=0; while(i<instances.length) { if(instances[i].active==true && instances[i].mask==mask && i!=instance) { if((instances[instance].width/2+instances[i].width/2)>Math.abs((x-instances[instance].xoffset+instances[instance].maskX)-(instances[i].x-instances[i].xoffset+instances[i].maskX)) && (instances[instance].height/2+instances[i].height/2)>Math.abs((y-instances[instance].yoffset+instances[instance].maskY)-(instances[i].y-instances[i].yoffset+instances[i].maskY))) { return i; break; } } i++; } return -1; }
	function collidePosition(instance,mask,x,y) { var i=0; while(i<instances.length) { if(instances[i].active==true && instances[i].mask==mask && i!=instance) { if(instances[i].width>Math.abs(x-(instances[i].x-instances[i].xoffset+instances[i].maskX)) && (instances[i].height)>Math.abs(y-(instances[i].y-instances[i].yoffset+instances[i].maskY))) { return i; break; } } i++; } return -1; }
	function pointInRect(x1,y1,x2,y2,x3,y3) { if (x3>=Math.min(x1,x2) && x3<=Math.max(x1,x2) && y3>=Math.min(y1,y2) && y3<=Math.max(y1,y2)) { return true; } else { return false; } }
	//Drawing Functions
	function colorSet(color) { cxt.fillStyle=color; cxt.strokeStyle=color; }
	function fontReset() { cxt.textAlign="start"; cxt.textBaseline="alphabetic"; cxt.font="10px sans-serif"; }
	function textDraw(x,y,text) { cxt.fillText(text,x-cameraX,y-cameraY); }
	function textDrawAngle(x,y,text,angle) { cxt.save();
											 var s=cxt.measureText(text);
											 if (cxt.textAlign=="center") { s.width=0; }
											 else if (cxt.textAlign=="right") { s.width*=-1; }
											 cxt.translate(x-cameraX+(s.width/2),y-cameraY);
											 cxt.rotate(-((angle)/(180/Math.PI)) );
											 cxt.translate(-(x-cameraX+(s.width/2)),-(y-cameraY));
											 cxt.fillText(text,x-cameraX,y-cameraY);
											 cxt.restore(); }
	function strokeLine(x1,y1,x2,y2) { cxt.beginPath(); cxt.moveTo(x1-cameraX,y1-cameraY); cxt.lineTo(x2-cameraX,y2-cameraY); cxt.closePath(); cxt.stroke(); }
	function fillRect(x1,y1,x2,y2) { cxt.fillRect(Math.min(x1,x2)-cameraX,Math.min(y1,y2)-cameraY,Math.abs(x2-x1),Math.abs(y2-y1)); }
	function strokeRect(x1,y1,x2,y2) { cxt.strokeRect(Math.min(x1,x2)-cameraX,Math.min(y1,y2)-cameraY,Math.abs(x2-x1),Math.abs(y2-y1)); }
	function fillCircle(x,y,radius) { cxt.beginPath(); cxt.arc(x-cameraX,y-cameraY,radius,0,Math.PI*2,true); cxt.closePath(); cxt.fill(); }
	function strokeCircle(x,y,radius) { cxt.beginPath(); cxt.arc(x-cameraX,y-cameraY,radius,0,Math.PI*2,true); cxt.closePath(); cxt.stroke(); }
	function drawPolygon(x,y,dir,size,sides,fill)
	{
	cxt.beginPath();
	cxt.moveTo(x+lengthDirX(size,dir)-cameraX,y+lengthDirY(size,dir)-cameraY);
	for(s=1;s<sides;s++)
		{
		cxt.lineTo(x+lengthDirX(size,dir+s*(360/sides))-cameraX,y+lengthDirY(size,dir+s*(360/sides))-cameraY);
		}
	cxt.closePath();
	if (fill==true) { cxt.fill(); }
	if (fill==false) { cxt.stroke(); }
	}
	//Sound Functions
	function soundAdd(name,url,channels) { var ENGINEi=sounds.length; if (channels==undefined) { channels=8; } sounds[ENGINEi]=new Object(); sounds[ENGINEi].channels=channels; sounds[ENGINEi].channel=1; sounds[ENGINEi].name=name; sounds[ENGINEi].ae=new Array(); for(a=1;a<=channels;a++) { sounds[ENGINEi].ae[a]=new Audio(url); sounds[ENGINEi].ae[a].preload=true; } }
	function soundGet(name) { var i=0; while(i<sounds.length) { if(sounds[i].name==name) { return i; break; } i++; } }
	function soundPlay(name) { var i=soundGet(name); sounds[i].ae[sounds[i].channel].play(); sounds[i].channel++; if(sounds[i].channel>sounds[i].channels){sounds[i].channel=1;} }
	function soundLoaded(name) { if(sounds[soundGet(name)].ae[1].readyState==4) { return true; } else { return false; } }
	function loopAdd(name,url) { var ENGINEi=loops.length; loops[ENGINEi]=new Audio(url); loops[ENGINEi].name=name; loops[ENGINEi].addEventListener('ended',function(){this.currentTime=0;}); }
	function loopGet(name) { var i=0; while(i<loops.length) { if(loops[i].name==name) { return i; break; } i++; } }
	function loopPlay(name) { loops[loopGet(name)].play(); }
	function loopPause(name) { loops[loopGet(name)].pause(); }
	function loopIsPlaying(name) { var returnval=loops[loopGet(name)].paused; if(returnval==true){return false;} else{return true;} }
	function loopLoaded(name) { if (loops[loopGet(name)].readyState==4) { return true; } else { return false; } ; }
	//Degugger Functions
	function debugToggle() { if (debugShow==false) { debugShow=true; } else { debugShow=false; } }
	function debugPrint(line) { debugLines[debugLines.length]=line; }
	function debugClear() { debugLines.splice(0,debugLines.length); }
	
	//Event Functions
	function engineStart()
	{
	//ENGINE CODE
	document.getElementById(canvasId).addEventListener("mousedown",mouseClick);
	document.getElementById(canvasId).addEventListener("mouseup",mouseRelease);
	document.body.addEventListener('touchmove', function(event) { event.preventDefault(); }, false);
	document.getElementById(canvasId).addEventListener("touchstart",function(event) { touchStart(event) });
	document.getElementById(canvasId).addEventListener("touchmove",function(event) { event.preventDefault(); touchMove(event); });
	document.getElementById(canvasId).addEventListener("touchend",function(event) { touchEnd(event) });
	//Create important arrays
	sprites=new Array();
	objects=new Array();
	instances=new Array();
	keys=new Array();
	backgrounds=new Array();
	sounds=new Array();
	loops=new Array();
	particleTypes=new Array();
	particles=new Array();
	debugLines=new Array();
	//Set important variables
	c=document.getElementById(canvasId);
	cxt=c.getContext("2d");
	backgroundColor="none";
	backgroundImage="none";
	gamespeed=1000/60;
	sts=0;
	fps=Math.round(1000/gamespeed);
	debug=false;
	debugShow=false;
	debugText=true;
	debugPlaying=true;
	cameraX=0;
	cameraY=0;
	previousCameraAngle=90;
	cameraAngle=90;
	trueMouseX=0;
	trueMouseY=0;
	mouseX=0;
	mouseY=0;
	mouseStatus=0;
	keyLastPressed=-1;
	keyLastReleased=-1;
	touches=new Array();
	//Initiate the step event
	stepInterval=setInterval("engineStep()",gamespeed);
	fpsInterval=setInterval("setFPS()",1000);
	//USER CODE
	eventStart();
	}
	function engineStep()
	{
	//ENGINE CODE
	sts++;
	//INSTANCE CODE
	var i=0;
	var inst_length=instances.length;
	while(i<instances.length)
	{
	if (instances[i].active==true)
	{
	objectEventStep(i);
	if  (i>=0 && i<instances.length && (instances[i].hspeed!=0 || instances[i].vspeed!=0))
	{
	instances[i].x+=instances[i].hspeed;
	instances[i].y+=instances[i].vspeed;
	if(instances[i].friction>0)
		{
		var ENGINEVARdis=pointDistance(0,0,instances[i].hspeed,instances[i].vspeed);
		var ENGINEVARdir=pointDirection(0,0,instances[i].hspeed,instances[i].vspeed);
		ENGINEVARdis=ENGINEVARdis-instances[i].friction;
		if (ENGINEVARdis<0) { ENGINEVARdis=0; }
		instances[i].hspeed=lengthDirX(ENGINEVARdis,ENGINEVARdir);
		instances[i].vspeed=lengthDirY(ENGINEVARdis,ENGINEVARdir);
		}
	}
	}
	if (inst_length=instances.length) { i++; } else { inst_length=instances.length; }
	}
	//PARTICLE CODE
	var i=0;
	while(i<particles.length)
	{
	particleEventDraw(i);
	if(particles[i].hspeed!=0 || particles[i].vspeed!=0)
	{
	particles[i].x+=particles[i].hspeed;
	particles[i].y+=particles[i].vspeed;
	}
	if (particles[i].life<=0) { particleDestroy(i); } else { particles[i].life--; }
	i++;
	}
	//USER CODE
	eventStep();
	//ENGINE CODE
	engineDraw();
	mouseUpdate();
	keyUpdate();
	touchCorrect();
	}
	function engineDraw()
	{
	//ENGINE CODE
	cxt.translate(c.width/2,c.height/2);
	cxt.rotate(-((previousCameraAngle-90)/(180/Math.PI)) );
	cxt.translate(-c.width/2,-c.height/2);
	cxt.globalAlpha=1;
	if (backgroundColor=="none") { cxt.clearRect(0,0,c.width,c.height); }
	else { cxt.fillStyle=backgroundColor; cxt.fillRect(0,0,c.width,c.height); }
	if (backgroundImage!="none") {
								 var i=backgroundGet(backgroundImage);
								 if (backgrounds[i].tile==0) { cxt.drawImage(backgrounds[i],cameraX,cameraY,backgrounds[i].width,backgrounds[i].height); }
								 if (backgrounds[i].tile==1) { var xx=Math.min(-cameraX,cameraX); while(xx<-backgrounds[i].width) { xx+=backgrounds[i].width; } while(xx<c.width) { cxt.drawImage(backgrounds[i],xx,cameraY,backgrounds[i].width,backgrounds[i].height); xx+=backgrounds[i].width; } }
								 if (backgrounds[i].tile==2) { var yy=Math.min(-cameraY,cameraY); while(yy<-backgrounds[i].height) { yy+=backgrounds[i].height; }  while(yy<c.height) { cxt.drawImage(backgrounds[i],cameraY,yy,backgrounds[i].width,backgrounds[i].height); yy+=backgrounds[i].height; } }
								 if (backgrounds[i].tile==3) { var xx=Math.min(-cameraX,cameraX); while(xx<-backgrounds[i].width) { xx+=backgrounds[i].width; }  var yy=Math.min(-cameraY,cameraY); while(yy<-backgrounds[i].height) { yy+=backgrounds[i].height; } while(yy<c.height) { cxt.drawImage(backgrounds[i],xx,yy,backgrounds[i].width,backgrounds[i].height); xx+=backgrounds[i].width; if(xx>c.width) { xx=Math.min(-cameraX,cameraX);yy+=backgrounds[i].height; } } }
								 }
		//Rotate to the new cameraAngle
		cxt.translate(c.width/2,c.height/2);
		cxt.rotate(((cameraAngle-90)/(180/Math.PI)) );
		cxt.translate(-c.width/2,-c.height/2);
		previousCameraAngle=cameraAngle;
	//INSTANCE CODE
	var instancesSortedByDepth=instances.sort(sortDepth);
	var ii=0;
	while(ii<instancesSortedByDepth.length)
	{
	var i=instancesSortedByDepth[ii].id;
	if(i<instances.length)
	{
	if(instances[i].active==true)
	{
	objectEventDraw(i);
	if(instances[i].alpha!=0 && instances[i].sprite!="none")
		{
		spriteDrawExt(instances[i].sprite,Math.round(instances[i].x),Math.round(instances[i].y),Math.floor(instances[i].imageFrame),instances[i].xoffset,instances[i].yoffset,instances[i].xscale,instances[i].yscale,instances[i].imageAngle,instances[i].alpha);
		instances[i].imageFrame+=instances[i].imageSpeed;
		if (instances[i].imageFrame>=spriteGet(instances[i].sprite).frames) { instances[i].imageFrame=0; }
		}
	//Debugger stuff
	if (debugShow==true)
		{
		var a=cxt.globalAlpha;
		var s=cxt.strokeStyle;
		var l=cxt.lineWidth;
		cxt.globalAlpha=1;
		cxt.lineWidth=1;
		cxt.strokeStyle="lime";
		var x=Math.round(instances[i].x)+0.5;
		var y=Math.round(instances[i].y)+0.5;
		cxt.strokeRect(x-3-cameraX,y-3-cameraY,6,6);
		cxt.strokeStyle="red";
		var w=Math.round(instances[i].width);
		var h=Math.round(instances[i].height);
		cxt.strokeRect(x+Math.round(instances[i].maskX-instances[i].xoffset)-cameraX,y+Math.round(instances[i].maskY-instances[i].yoffset)-cameraY,w,h);
		cxt.globalAlpha=a;
		cxt.strokeStyle=s;
		cxt.lineWidth=l;
		}
	}
	}
	ii++;
	}
	for(i=0;i<particles.length;i++) { particleEventDraw(i); }
	//USER CODE
	eventDraw();
	debugDraw();
	}
function debugDraw()
	{
	//Draw debug stuff
	if (debugShow==true)
		{
		cxt.save();
		cxt.translate(c.width/2,c.height/2);
		cxt.rotate(-((cameraAngle-90)/(180/Math.PI)) );
		cxt.translate(-c.width/2,-c.height/2);
		var a=cxt.globalAlpha;
		var f=cxt.fillStyle;
		var s=cxt.strokeStyle;
		var w=cxt.lineWidth;
		cxt.globalAlpha=0.5;
		cxt.fillStyle="black";
		cxt.fillRect(0,0,c.width,c.height);
		cxt.fillStyle="white";
		//cxt.font="36px Lucida Console";
		cxt.font="bold 14px Lucida Console";
		cxt.textBaseline="top";
		cxt.textAlign="left";
		cxt.fillText("CanvasLord v"+CLVERSION,8,8);
			//Buttons
			cxt.lineWidth=1;
			//Debug Text
			if (pointInRect(8,22,24,38,trueMouseX,trueMouseY)==true) { cxt.globalAlpha=1; } else { cxt.globalAlpha=0.5; }
			cxt.strokeStyle="white";
			cxt.strokeRect(8.5,22.5,16,16);
			cxt.beginPath();
			for(y=26.5;y<36.5;y+=2) { cxt.moveTo(12.5,y); cxt.lineTo(20.5,y); }
			cxt.stroke();
			cxt.closePath();
			if (debugText==true)
				{
				cxt.beginPath();
				cxt.moveTo(10.5,24.5); cxt.lineTo(22.5,36.5);
				cxt.moveTo(22.5,24.5); cxt.lineTo(10.5,36.5);
				cxt.stroke();
				cxt.closePath();
				if (mouseStatus==2 && cxt.globalAlpha==1) { debugText=false; mouseStatus=1; }
				}
			else
				{
				if (mouseStatus==2 && cxt.globalAlpha==1) { debugText=true; mouseStatus=1; }
				}
			//Play/Pause
			if (pointInRect(28,22,44,38,trueMouseX,trueMouseY)==true) { cxt.globalAlpha=1; } else { cxt.globalAlpha=0.5; }
			cxt.strokeRect(28.5,22.5,16,16);
			if (debugPlaying==false)
				{
				cxt.beginPath();
				cxt.moveTo(32.5,24.5);
				cxt.lineTo(40.5,30.5);
				cxt.lineTo(32.5,36.5);
				cxt.closePath();
				cxt.fill();
				if (mouseStatus==2 && cxt.globalAlpha==1) { clearInterval(stepInterval); stepInterval=setInterval("engineStep()",gamespeed); debugPlaying=true; mouseStatus=1; }
				}
			else
				{
				cxt.fillRect(32.5,26.5,3,8);
				cxt.fillRect(37.5,26.5,3,8);
				if (mouseStatus==2 && cxt.globalAlpha==1) { clearInterval(stepInterval); stepInterval=setInterval("engineDraw()",gamespeed); debugPlaying=false; mouseStatus=1; }
				}
			//Skip-Frame
			if (pointInRect(48,22,64,38,trueMouseX,trueMouseY)==true) { cxt.globalAlpha=1; } else { cxt.globalAlpha=0.5; }
			cxt.strokeRect(48.5,22.5,16,16);
			cxt.beginPath();
			cxt.moveTo(52.5,24.5);
			cxt.lineTo(60.5,30.5);
			cxt.lineTo(52.5,36.5);
			cxt.lineTo(54.5,30.5);
			cxt.closePath();
			cxt.fill();
			if (mouseStatus==2 && cxt.globalAlpha==1) { setTimeout("engineStep()",1); mouseStatus=1; }
		//cxt.font="bold 14px Lucida Console";
		cxt.globalAlpha=0.5;
		cxt.textAlign="right";
		cxt.fillText("FPS: "+fps+" / "+Math.round(1000/gamespeed),c.width-8,8);
		cxt.fillText("Instances: "+instances.length,c.width-8,20);
		cxt.textAlign="left";
		if (debugText==true)
			{
			var y=c.height-20;
			var i=debugLines.length-1;
			while(i>=0 && y>=36) { cxt.fillText(debugLines[i],8,y); y-=12; i--; }
			}
		else
			{
			cxt.fillText("mouse("+mouseX+","+mouseY+")",8,c.height-44);
			cxt.fillText("trueMouse("+trueMouseX+","+trueMouseY+")",8,c.height-32);
			cxt.fillText("camera("+cameraX+","+cameraY+","+cameraAngle+")",8,c.height-20);
			}
		cxt.globalAlpha=a;
		cxt.fillStyle=f;
		cxt.strokeStyle=s;
		cxt.lineWidth=w;
		cxt.restore();
		}
	}
