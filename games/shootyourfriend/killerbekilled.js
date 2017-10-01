var view_left = [0, 0, 600, 400];
var view_right = [600, 0, 600, 400];

var top_positions = [[170, 8], [290, 0], [380, -5]];
var bot_positions = [[40, 200], [230, 200], [350, 200]];
var top_shoots = [[382, 100], [292, 110], [172, 115]];
var bot_shoots = [[115, 160], [308, 160], [427, 160]];

var gamestate = 'init';
var move_timer_time = 350;
var move_timer = move_timer_time;
var cool_timer_time = 150;
var cool_timer = cool_timer_time;
var reveal_timer_time = 350;
var reveal_timer = reveal_timer_time;
var dt = 0.0;

var init_complete = false;
var gameover = false;
var deadp1 = false;
var deadp2 = false;
var firingp1 = false;
var firingp2 = false;
var winner = 0;

var p1_move = [0,0]; // default is to not move
var p2_move = [0,0]; // default is to not move

// images
var bg_left;
var bg_right;
var top_p1 = {};
var top_p2 = {};
var bot_p1 = {};
var bot_p2 = {};
// more images
var top_cloud;
var bot_cloud;
var top_shot;
var bot_shot;
var win_screen = [];
// UI images
var ui = {};
var instructions = [];
var instr_i = 0;

// load audio
var sfx = {'applause_played': false,
       'ding1_played': false,
       'ding2_played': false,
       'cloud1_played': false,
       'cloud2_played': false,
       'shot_played': false
};
var music;

var p1 = {'pos': 1, 'state': 'stand', 'image': 'stand',
          'new_pos': 2, 'toggle_stand': false, 'toggle_shoot': false, 'reload': false, 'wait': false}
var p2 = {'pos': 1, 'state': 'stand', 'image': 'stand',
          'new_pos': 2, 'toggle_stand': false, 'toggle_shoot': false, 'reload': false, 'wait': false}

function draw_viewport(rect, pa, pb, bot_p, top_p) {

    // draw top character
    if (pb.pos == 0) { // RIGHT (reversed from normal)
        draw_sprite(canvas, top_p[pb.image], top_positions[2][0] + rect[0], top_positions[2][1]);
    } else if (pb.pos == 1) { // MIDDLE
        draw_sprite(canvas, top_p[pb.image], top_positions[1][0] + rect[0], top_positions[1][1]);
    } else if (pb.pos == 2) { // LEFT (reversed from normal)
        draw_sprite(canvas, top_p[pb.image], top_positions[0][0] + rect[0], top_positions[0][1]);
    }

    // draw shots fired
    // p1 shoot
    if (firingp1 == true) {
        // draw fire
        draw_sprite(canvas, bot_shot, bot_shoots[p1.pos][0], bot_shoots[p1.pos][1]); // left viewport
        draw_sprite(canvas, top_shot, view_right[0] + top_shoots[p1.pos][0], top_shoots[p1.pos][1]); // right viewport
    }
    // p2 shoot
    if (firingp2 == true) {
        // draw fire
        draw_sprite(canvas, bot_shot, view_right[0] + bot_shoots[p2.pos][0], bot_shoots[p2.pos][1]); // left viewport
        draw_sprite(canvas, top_shot, top_shoots[p2.pos][0], top_shoots[p2.pos][1]); // right viewport
    }

    // draw bot character
    if (pa.pos == 0) { // LEFT
        draw_sprite(canvas, bot_p[pa.image], bot_positions[0][0] + rect[0], bot_positions[0][1]);
    } else if (pa.pos == 1) { // MIDDLE
        draw_sprite(canvas, bot_p[pa.image], bot_positions[1][0] + rect[0], bot_positions[1][1]);
    } else if (pa.pos == 2) { // RIGHT
        draw_sprite(canvas, bot_p[pa.image], bot_positions[2][0] + rect[0], bot_positions[2][1]);
    }
}

function draw() {
    // draw background    
    draw_sprite(canvas, bg_left, view_left[0], view_left[1]);
    draw_sprite(canvas, bg_right, view_right[0], view_right[1]);


    draw_viewport(view_left, p1, p2, bot_p1, top_p2);
    draw_viewport(view_right, p2, p1, bot_p2, top_p1);

    // UI
    var y_offset1 = 40; // offset for gamestate

    // draw ammo UI elements
    var x = 515;
    var y = 360;
    if (p1.reload == false) {
        draw_sprite(canvas, ui.has_ammo, x, y);
    } else {
        draw_sprite(canvas, ui.no_ammo, x, y);
    }
    x = 610;
    y = 360;
    if (p2.reload == false) {
        draw_sprite(canvas, ui.has_ammo, x, y);
    } else {
        draw_sprite(canvas, ui.no_ammo, x, y);
    }


    if (winner != 0) {
        // display the winner's win-screen
        draw_sprite(canvas, win_screen[winner], 0, 0);
    }


    // display the current game "phase"
    //textout_centre(canvas, font, gamestate,
    //               view_right[0], y_offset1, 40, makecol(0, 0, 0), makecol(255,255,255), 1);


    // draw INIT
    if (gamestate == 'init') {
        draw_sprite(canvas, instructions[instr_i], 0, 0);
    }
    // draw QUERY
    else if (gamestate == 'query') {
        // DISPLAY LARGE NUMBER IMAGES INSTEAD OF TEXT
        var x = 0;
        var y = 0;
        if (move_timer < move_timer_time * (1/4)) {
            draw_sprite(canvas, ui.no0, x, y); // left viewport
            draw_sprite(canvas, ui.no0, view_right[0] + x, y); // right viewport
        } else if (move_timer < move_timer_time * (2/4)) {
            draw_sprite(canvas, ui.no1, x, y); // left viewport
            draw_sprite(canvas, ui.no1, view_right[0] + x, y); // right viewport
        } else if (move_timer < move_timer_time * (3/4)) {
            draw_sprite(canvas, ui.no2, x, y); // left viewport
            draw_sprite(canvas, ui.no2, view_right[0] + x, y); // right viewport
        } else if (move_timer < move_timer_time * (4/4)) {
            draw_sprite(canvas, ui.no3, x, y); // left viewport
            draw_sprite(canvas, ui.no3, view_right[0] + x, y); // right viewport
        }
        // visually tell the players if they have or haven't made a move
        if (p1_move[0] != 0 || p1_move[1] != 0) {
            if (!sfx.ding1_played) {
                play_sample(sfx.ding);
                sfx.ding1_played = true;
            }
            draw_sprite(canvas, ui.has_moved, 300, 150);
        } else {
            sfx.ding1_played = false;
        }
        if (p2_move[0] != 0 || p2_move[1] != 0) {
            if (!sfx.ding2_played) {
                play_sample(sfx.ding);
                sfx.ding2_played = true;
            }
            draw_sprite(canvas, ui.has_moved, view_right[0] + 300, 150);
        } else {
            sfx.ding2_played = false;
        }
    } else if (gamestate == 'reveal') {
        sfx.ding1_played = false;
        sfx.ding2_played = false;

    // draw COOLDOWN
    } else if (gamestate == 'cooldown') {
    }
}

function reverse_pos(pos) {
    if (pos == 0) return 2;
    if (pos == 1) return 1;
    if (pos == 2) return 0;
}

function update() {
    // INIT PHASE
    if (gamestate == 'init') {
        if (!init_complete) {
            gameover = false;
            winner = 0;
            deadp1 = false;
            deadp2 = false;

            p1 = {'pos': 1, 'state': 'stand', 'image': 'stand',
                      'new_pos': 2, 'toggle_stand': false, 'toggle_shoot': false, 'reload': false, 'wait': false}
            p2 = {'pos': 1, 'state': 'stand', 'image': 'stand',
                      'new_pos': 2, 'toggle_stand': false, 'toggle_shoot': false, 'reload': false, 'wait': false}
            move_timer = move_timer_time;

            init_complete = true;
        }

        // proceed once someone clicks space
        if (pressed[KEY_SPACE] == true) {
            play_sample(sfx.click);
            pressed[KEY_SPACE] = false;
            if (instr_i >= instructions.length-1) {
                gamestate = 'query';
            } else {
                instr_i += 1;
            }
        }
    // QUERY PHASE
    } else if (gamestate == 'query') {
        if (move_timer <= 0) {
            move_timer = 0;

            // check move validity
            if (p1_move[0] == 1 && p1.pos > 0) p1.new_pos = p1.pos - 1;
            if (p1_move[0] == 2 || p1_move[0] == 0) p1.new_pos = p1.pos; // don't move
            if (p1_move[0] == 3 && p1.pos <= 1) p1.new_pos = p1.pos + 1;
            if (p1_move[1] == 1 && p1.reload == false) {
                p1.toggle_shoot = true;
                if (p1.state == 'sit') p1.toggle_stand = true;
            }
            if (p1_move[1] == 2) p1.toggle_stand = true;
            if (p1.reload == true && p1.state == 'stand' && p1.wait == false) p1.wait = true;

            if (p2_move[0] == 1 && p2.pos > 0) p2.new_pos = p2.pos - 1;
            if (p2_move[0] == 2 || p2_move[0] == 0) p2.new_pos = p2.pos; // don't move
            if (p2_move[0] == 3 && p2.pos <= 1) p2.new_pos = p2.pos + 1;
            if (p2_move[1] == 1 && p2.reload == false) {
                p2.toggle_shoot = true;
                if (p2.state == 'sit') p2.toggle_stand = true;
            }
            if (p2_move[1] == 2) p2.toggle_stand = true;
            if (p2.reload == true && p2.state == 'stand' && p2.wait == false) p2.wait = true;


            // we can reset the move-holding variable once we've determined the future location/action of each player
            p1_move = [0, 0]; // reset move
            p2_move = [0, 0]; // reset move

            gamestate = 'reveal';
            cool_timer = cool_timer_time; // reset this timer for later
        // decrease the timer and get player moves
        } else {
            if (p1.reload == true && p1.state == 'stand' && p1.wait == true) { 
                p1.reload = false;
                p1.wait = false;
            }
            if (p2.reload == true && p2.state == 'stand' && p2.wait == true) {
                p2.reload = false;
                p2.wait = false;
            }
            move_timer -= dt/10;

            // get player1's move
            if (pressed[KEY_1]) {
                p1_move[0] = 1; 
            } else if (pressed[KEY_2]) {
                p1_move[0] = 2;
            } else if (pressed[KEY_3]) {
                p1_move[0] = 3;
                pressed[KEY_3] = false;
            } else if (pressed[KEY_TILDE]) {
                // allow toggling and overriding of sit/stand
                if (p1_move[1] == 2) {
                    p1_move[1] = 0;
                } else {
                    p1_move[1] = 2;
                }
                pressed[KEY_TILDE] = false;
            } else if (pressed[KEY_LSHIFT]) {
                // allow toggling and overriding of a fire command
                if (p1_move[1] == 1) {
                    p1_move[1] = 0;
                } else {
                    p1_move[1] = 1;
                }
            }

            // get player2's move
            if (pressed[KEY_9]) {
                p2_move[0] = 1; 
            } else if (pressed[KEY_0]) {
                p2_move[0] = 2;
            } else if (pressed[KEY_MINUS]) {
                p2_move[0] = 3;
                pressed[KEY_MINUS] = false;
            } else if (pressed[KEY_EQUALS]) {
                // allow toggling and overriding of sit/stand
                if (p2_move[1] == 2) {
                    p2_move[1] = 0;
                } else {
                    p2_move[1] = 2;
                }
                pressed[KEY_EQUALS] = false;
            } else if (pressed[KEY_RCONTROL]) {
                // allow toggling and overriding of a fire command
                if (p2_move[1] == 1) {
                    p2_move[1] = 0;
                } else {
                    p2_move[1] = 1;
                }
            }
        }
    // REVEAL PHASE
    } else if (gamestate == 'reveal') {
        if (winner != 0) {
            if (!sfx.applause_played) {
                play_sample(sfx.applause);
                sfx.applause_played = true;
            }
            reveal_timer = reveal_timer_time; // reset for next time
            init_complete = false;
            instr_i = 0;


            if (pressed[KEY_SPACE]) {
                play_sample(sfx.click);
                sfx.applause_played = false;
                gamestate = 'init';
            }
        } else {
            if (reveal_timer <= 0) {
                reveal_timer = 0;
                if (deadp1 == true && deadp2 == true) {
                    winner = 3;
                } else if (deadp1) {
                    winner = 2;
                } else if (deadp2) {
                    winner = 1;
                }
                //gamestate = 'cooldown';

                move_timer = move_timer_time; // reset this for later
                reveal_timer = reveal_timer_time;
                pressed = [];
                if (winner == 0) gamestate = 'query'; // return to the QUERY phase if there's no winner

            } else if (reveal_timer < reveal_timer_time * (1/6)) {
                //console.log("RESULTS");
                // p1 shoot
                if (p1.toggle_shoot == true) {
                    // check if p2 hit by shot
                    if (p1.pos == reverse_pos(p2.pos) && p2.state == 'stand') {
                        deadp2 = true;
                    }
                    p1.reload = true;
                    firingp1 = false;
                    p1.image = 'stand';
                    p1.toggle_shoot = false;
                }
                // p2 shoot
                if (p2.toggle_shoot == true) {
                    // check if p1 hit by shot
                    if (p2.pos == reverse_pos(p1.pos) && p1.state == 'stand') {
                        deadp1 = true;
                    }
                    p2.reload = true;
                    firingp2 = false;
                    p2.image = 'stand';
                    p2.toggle_shoot = false;
                }
                // reset the shot sound so it plays next time there's a shot
                sfx.shot_played = false;
                // end game if necessary
            } else if (reveal_timer < reveal_timer_time * (2/6)) {
                //console.log("SHOOT");
                if (p1.toggle_shoot == true) {
                    firingp1 = true;
                    p1.image = 'shoot';
                }
                if (p2.toggle_shoot == true) {
                    firingp2 = true;
                    p2.image = 'shoot';
                }
                // play shot sound
                if (firingp1 || firingp2) {
                    if (!sfx.shot_played) {
                        play_sample(sfx.shot);
                        sfx.shot_played = true;
                    }
                }
            } else if (reveal_timer < reveal_timer_time * (3/6)) {
                //console.log("NEW STATES");
                p1.image = p1.state;
                p2.image = p2.state;
				sfx.cloud2_played = false;
            } else if (reveal_timer < reveal_timer_time * (4/6)) {
                //console.log("POOF TO");
                p1.image = 'cloud';
                p2.image = 'cloud';

                if (!sfx.cloud2_played) {
                    play_sample(sfx.cloud2);
                    sfx.cloud2_played = true;
                }
            } else if (reveal_timer < reveal_timer_time * (5/6)) {
                //console.log("NOTHING");
                p1.image = 'gone';
                p2.image = 'gone';

                // update players' locations and states
                // p1
                p1.pos = p1.new_pos;
                p1.new_pos = p1.pos;
                if (p1.toggle_stand == true) {
                    if (p1.state == 'sit') { 
                        p1.state = 'stand';
                    } else if (p1.state == 'stand') {
                        p1.state = 'sit';
                    }
                    p1.toggle_stand = false;
                }
                // p2
                p2.pos = p2.new_pos;
                p2.new_pos = p2.pos;
                if (p2.toggle_stand == true) {
                    if (p2.state == 'sit') { 
                        p2.state = 'stand'; 
                    } else if (p2.state == 'stand') {
                        p2.state = 'sit';
                    }
                    p2.toggle_stand = false;
                }
            // reset cloud1 sound so it plays next time
            sfx.cloud1_played = false;

            } else if (reveal_timer < reveal_timer_time * (6/6)) {
                //console.log("POOF AWAY");
                if (!sfx.cloud1_played) {
                    play_sample(sfx.cloud1);
                    sfx.cloud1_played = true;
                }
                p1.image = 'cloud';
                p2.image = 'cloud';
            }
            reveal_timer -= dt/10;
        }
    // COOLDOWNPHASE 
    } else if (gamestate == 'cooldown') {
        // end of game stuff
        if (winner != 0) {
            console.log("winner = " + winner.toString());
            init_complete = false;
            instr_i = 0;
            gamestate = 'init';
        }
        if (cool_timer <= 0) {
            cool_timer = 0;
            gamestate = 'query';
            move_timer = move_timer_time; // reset this for later
            reveal_timer = reveal_timer_time;
            pressed = [];
        } else {
            cool_timer -= dt/10;
        }
    }
}

function main() {
    enable_debug('debug');
    allegro_init_all('canvas', 1200, 400);

    // images
    bg_left = load_bmp('data/bg_left2.png');
    bg_right = load_bmp('data/bg_right2.png');

    top_p1['sit'] =  load_bmp('data/top_p1_sit.png');
    top_p1['stand'] =  load_bmp('data/top_p1_stand.png');
    top_p1['shoot'] =  load_bmp('data/top_p1_shoot.png');
    top_p1['cloud'] =  load_bmp('data/top_cloud.png');
    top_p1['gone'] =  load_bmp('data/gone.png');

    top_p2['sit'] =  load_bmp('data/top_p2_sit.png');
    top_p2['stand'] =  load_bmp('data/top_p2_stand.png');
    top_p2['shoot'] =  load_bmp('data/top_p2_shoot.png');
    top_p2['cloud'] =  load_bmp('data/top_cloud.png');
    top_p2['gone'] =  load_bmp('data/gone.png');

    bot_p1['sit'] =  load_bmp('data/bot_p1_sit.png');
    bot_p1['stand'] =  load_bmp('data/bot_p1_stand.png');
    bot_p1['shoot'] =  load_bmp('data/bot_p1_shoot.png');
    bot_p1['cloud'] =  load_bmp('data/bot_cloud.png');
    bot_p1['gone'] =  load_bmp('data/gone.png');

    bot_p2['sit'] =  load_bmp('data/bot_p2_sit.png');
    bot_p2['stand'] =  load_bmp('data/bot_p2_stand.png');
    bot_p2['shoot'] =  load_bmp('data/bot_p2_shoot.png');
    bot_p2['cloud'] =  load_bmp('data/bot_cloud.png');
    bot_p2['gone'] =  load_bmp('data/gone.png');

    bot_shot = load_bmp('data/bot_shot.png');
    top_shot = load_bmp('data/top_shot.png');

    win_screen[0] = '';
    win_screen[1] = load_bmp('data/win_screen1.png');
    win_screen[2] = load_bmp('data/win_screen2.png');
    win_screen[3] = load_bmp('data/win_screen3.png');

    ui['has_moved'] = load_bmp('data/has_moved.png');
    ui['has_ammo'] = load_bmp('data/has_ammo.png');
    ui['no_ammo'] = load_bmp('data/no_ammo.png');
    ui['no0'] = load_bmp('data/go.png');
    ui['no1'] = load_bmp('data/1.png');
    ui['no2'] = load_bmp('data/2.png');
    ui['no3'] = load_bmp('data/3.png');
    instructions = [load_bmp('data/instructions1.png'), load_bmp('data/instructions2.png')];

    // load audio
    sfx['shot'] = load_sample('data/shot.wav');
    sfx['ding'] = load_sample('data/ding.wav');
    sfx['cloud1'] = load_sample('data/cloud1.wav');
    sfx['cloud2'] = load_sample('data/cloud2.wav');
    sfx['click'] = load_sample('data/click.wav');
    sfx['applause'] = load_sample('data/applause.wav');

    music = load_sample('data/bgm.mp3');

    //
    ready(function() {
		play_sample(music, 1, 1.0, true);
		canvas.canvas.focus();
        loop(function() {
            update();
            draw();
        }, dt = BPS_TO_TIMER(60))
    });

    return 0;
}
END_OF_MAIN();
