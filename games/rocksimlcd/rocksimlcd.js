var pos = 1; // 0, 1, 2
var rock_img = [];
var action_timer = 0;
var action_timer_time = 10;
var snake_img = [];
var snake_timer_0 = 0;
var snake_timer_1 = 0;
var snake_timer_2 = 0;
var snake_timer_min = 50;
var snake_timer_max = 250;
var score;
var bg;
var score = 0;
var jump = false;
var move;
var appear;
var kill;

function draw() {
    draw_sprite(canvas, bg, 0, 0);

    if (snake_timer_0 <= 0) {
        draw_sprite(canvas, snake_img[0], 108, 115);
    }
    if (snake_timer_1 <= 0) {
        draw_sprite(canvas, snake_img[1], 180, 298);
    }
    if (snake_timer_2 <= 0) {
        draw_sprite(canvas, snake_img[2], 283, 183);
    }
    if (pos == 0 && jump == false) {
        draw_sprite(canvas, rock_img[0], 156, 126);
    }
    if (pos == 0 && jump) {
        draw_sprite(canvas, rock_img[0], 149-40, 126);
    }
    if (pos == 1 && jump == false) {
        draw_sprite(canvas, rock_img[1], 290, 337);
    }
    if (pos == 1 && jump) {
        draw_sprite(canvas, rock_img[1], 290-110, 337);
    }
    if (pos == 2 && jump == false) {
        draw_sprite(canvas, rock_img[2], 392, 205);
    }
    if (pos == 2 && jump) {
        draw_sprite(canvas, rock_img[2], 392-90, 205);
    }

    textout(canvas,font,"SCORE: " + score, 410, 120, 10, makecol(0,0,0));
    textout_centre(canvas,font,"ROCK SIMULATOR '95", 300, 60 , 14, makecol(0,0,0));

}

function update() {
    if (action_timer == 0 && jump == true) jump = false;
    if (key[KEY_LEFT] && action_timer <= 0) {
        play_sample(move);
        jump = false;
        if (pos == 1) pos = 0;
        if (pos == 2) pos = 1;
        action_timer = action_timer_time;
    }
    if (key[KEY_RIGHT] && action_timer <= 0) {
        play_sample(move);
        jump = false;
        if (pos == 1) pos = 2;
        if (pos == 0) pos = 1;
        action_timer = action_timer_time;
    }
    if (key[KEY_SPACE] && action_timer <= 0) {
        jump = true;
        action_timer = action_timer_time;
        if (snake_timer_0 <= 0 && pos == 0) {

            snake_timer_0 = Math.random() * (snake_timer_max - snake_timer_min) + snake_timer_min;
            score += 1;
            play_sample(kill);
        }
        if (snake_timer_1 <= 0 && pos == 1) {
            snake_timer_1 = Math.random() * (snake_timer_max - snake_timer_min) + snake_timer_min;
            score += 1;
            play_sample(kill);
        }
        if (snake_timer_2 <= 0 && pos == 2) {
            snake_timer_2 = Math.random() * (snake_timer_max - snake_timer_min) + snake_timer_min;
            score += 1;
            play_sample(kill);
        }
    }

    // timers
    if (action_timer > 0) action_timer -= 1;
    if (snake_timer_0 > 0) snake_timer_0 -= 1;
    if (snake_timer_1 > 0) snake_timer_1 -= 1;
    if (snake_timer_2 > 0) snake_timer_2 -= 1;
    if (snake_timer_0 < 0) {
        play_sample(appear);
        snake_timer_0 = 0;
    }
    if (snake_timer_1 < 0) {
        play_sample(appear);
        snake_timer_1 = 0;
    }
    if (snake_timer_2 < 0) {
        play_sample(appear);
        snake_timer_2 = 0;
    }
}

function main()
{
    enable_debug('debug');
    allegro_init_all('canvas_id', 640, 480); 
    // images
    bg = load_bmp('data/bg.png');
    rock_img = [load_bmp('data/rock0.png'), load_bmp('data/rock1.png'), load_bmp('data/rock2.png')];
    snake_img = [load_bmp('data/snake0.png'), load_bmp('data/snake1.png'), load_bmp('data/snake2.png')];
    // sound
    move = load_sample('data/move.wav');
    appear = load_sample('data/appear.wav');
    kill = load_sample('data/kill.wav');
    // set snake timers at start
    snake_timer_0 = Math.random() * (snake_timer_max - snake_timer_min) + snake_timer_min;
    snake_timer_1 = Math.random() * (snake_timer_max - snake_timer_min) + snake_timer_min;
    snake_timer_2 = Math.random() * (snake_timer_max - snake_timer_min) + snake_timer_min;
    //
    ready(function() {
        loop(function() {
            update();
            draw();
        }, BPS_TO_TIMER(60));
    });

    return 0;
}
END_OF_MAIN(); 
