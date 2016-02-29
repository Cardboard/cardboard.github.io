// Canvas Lord Shell
// Basic
// Created by Ian Jones (AKA W!TS)

canvasId="gameCanvas";

//System Events
function eventStart()
{
    debug = false;
    backgroundColor="WHITE";
    setGameSpeed(30);
    spriteAddStrip("player", "https://dl.dropboxusercontent.com/u/1039058/content/player.png", 2);
    objectAdd("player", "player", 17, 17, 0);
    objectAdd("enemy", "none", 0, 0, 0);
    keyAdd("up", 38);
    keyAdd("down", 40);
    keyAdd("left", 37);
    keyAdd("right", 39);
    keyAdd("reset", 27);
    // create the level
    instanceAdd(320, 240, "player");
    // player vars
    invincible = false;
    dead = false;
    health = 3;
    hit_end = 0;
    hit_interval = 1000;
    hit = false;
    // game vars
    time_start = 0;
    time_total = 0;
    time_interval = 500;
    time_last = 0;
    score = 0;
}
function eventStep() {
    // update timer
    time_total += gamespeed;
    // add to score
    if (dead !== true) {
        score += 1;
    }
    // Enemy creation 
    if ((time_last + time_interval - time_start < time_total) && instanceExists("player") === true) {
        if (dead !== true) {
            instanceAdd(-32, -32, "enemy");
            time_last = time_total;
            // SPEED UP!
            if (time_total - time_start > 60000) {
                time_interval = 250;
            } 
            else if (time_total - time_start > 30000) {
                time_interval = 350;
            }
            else if (time_total - time_start > 10000) {
                time_interval = 450;
            }
            

        }
    }
    if (keyStatus("reset") == PRESSED) {
        resetGame();
    }
}

function eventDraw()
{
    if (dead !== true) {
        cxt.fillStyle='black';
        cxt.font = '12px courier new';
        cxt.textBaseline = 'top';
        cxt.fillText("score:" + score.toString(), 0,0);
        cxt.fillText("hp:" + health.toString(), 0,16);
    }
    else {
        cxt.fillStyle='blue';
        cxt.fillRect(0, 0, 600, 600)
        cxt.fillStyle = 'black';
        cxt.font = '72px courier new';
        cxt.textBaseline = 'top';
        cxt.fillText("score:" + score.toString(), 0,0);
    }

}

//Object Events
function objectEventCreate(instance)
{
    var objectType=instances[instance].name;
    var i=instance;
    var inst=instances[i];
    if (objectType=="player") {
        hitboxSet(i, 31, 31, 0, 0, "player");
    }
    if (objectType=="enemy") {
        hitboxSet(i, 32, 32, 0, 0, "enemy");
        // set up starting position, speed, and direction
        var x = 0;
        var y = 0;
        var speed = irandomRange(5,12);
        var direction = irandom(360);
        
        if (direction >= 0 && direction < 90) {
            x = -32;
            y = c.height;
        }
        if (direction >= 90 && direction < 180) {
            x = c.width;
            y = c.height;
        }
        if (direction >= 180 && direction < 270) {
            x = c.width;
            y = -32;
        }
        if (direction >= 270 && direction < 360) {
            x = -32;
            y = -32;
        }
        motionSet(i, speed, direction); // set speed of last enemy instance created
        inst.x = x;
        inst.y = y;
    }

}
function objectEventStep(instance)
{
    var objectType=instances[instance].name;
    var i=instance;
    var inst=instances[i];
    if (objectType=="player")
   {
        //Movement
        //This code is a smart way of checking the keys for 8-directional movement
        var xx=keyCheck("right")-keyCheck("left");
        var yy=keyCheck("down")-keyCheck("up");
        var speed=12;
        var dir=pointDirection(0,0,xx,yy,-1);
        //The -1 at the end indicates that if the two coordinates are the same -1 should be returned

        //If any keys were pressed determine how much the x and y of the player should change
        if (dir!=-1)
        {
           xx=lengthDirX(speed,dir);
           yy=lengthDirY(speed,dir);
        }

        //This code moves the x
        if (xx!==0)
        {
            inst.xprevious=inst.x;
        inst.x+=xx;
        }

        //This code moves the y
        if (yy!==0)
        {
            inst.yprevious=inst.y;
            inst.y+=yy;
        }
        //Player collides with an enemy
        var col=hitboxCollide(i,"enemy");
        if(col!=-1)
        {
            if (invincible === false) {
                health -= 1;
                hit_end = time_total + hit_interval;
                invincible = true;
                if (health <= 0) {
                    dead = true;
                }
            }
        }
        // update health timer if player was hit (and is invincible temporarily)
            
        if (invincible === true){
            if (time_total > hit_end) {
                invincible = false;
            }
            var ms = hit_end-time_total;
            if ((ms >= 0 && ms < 200) || (ms >= 400 && ms < 600) || (ms >= 800 && ms < 1000)) {
                inst.imageFrame = 1;
            }
            else if ((ms >= 200 && ms < 400) || (ms >= 600 && ms < 800)) {
                inst.imageFrame = 0;
            }
        } else { inst.imageFrame = 0;}
        //Border
        //This code just checks to see if the player has gone out of bounds (assuming the x and y offsets are set to the center of the sprite)
        if (inst.x<inst.xoffset)
       { 
            inst.x=inst.xoffset;
        }
        if (inst.x>c.width-inst.xoffset)
        {
            inst.x=c.width-inst.xoffset;
        }
        if (inst.y<inst.yoffset)
        {
            inst.y=inst.yoffset;
        }
        if (inst.y>c.height-inst.yoffset)
        {
            inst.y=c.height-inst.yoffset;
        }
    }
   

}
function objectEventDraw(instance)
{
    var objectType=instances[instance].name;
    var i=instance;
    var inst=instances[i];
    if (objectType=="enemy") {
        cxt.fillStyle="blue";
        fillRect(inst.x, inst.y, inst.x+32, inst.y+32);
    }
        

}

//Particles Events
function particleEventDraw(particle)
{
    var particleType=particles[particle].type;
    var i=particle;
    var part=particles[i];

}

//Custom Functions
function resetGame() {
    score = 0;
    dead = false;
    health = 3;
    start_time = time_total;
    time_interval = 500;
    time_last = 0;
}