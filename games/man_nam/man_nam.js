var man, nam, mirror, not_mirror;
var man_x = 0, man_y_default = 45, man_y = man_y_default;
var nam_x = 500;
var man_x_start = man_x;
var nam_x_start = nam_x;

var step;

var draw_text;
var draw_alt_text;
var font_size = 12;

// man-in-mirror "nam" moves opposite the direction player moves.
// mirror drawn first, then nam, then the rest of the bg (not_mirror),
// then finally the player. this keep nam from 'leaving' the mirror.
// lastly, draw text if there is any

function draw()
{
	draw_sprite(canvas, mirror, 300, 30);
	draw_sprite(canvas, nam, nam_x, man_y);
	if (draw_text) textout_centre(canvas, font, "you suck", 400, 60+man_x/5, font_size, makecol(100,0,0));
	if (draw_text) textout_centre(canvas, font, "& are stupid", 400, 150+man_x/5, font_size, makecol(100,0,0));
	if (draw_alt_text) textout_centre(canvas, font, "believe in", 400, 150, 8, makecol(128, 200, 255));
	if (draw_alt_text) textout_centre(canvas, font, "yourself", 400, 190, 8, makecol(128, 200, 255));
	draw_sprite(canvas, not_mirror, 0, 0);
	draw_sprite(canvas, man, man_x, man_y);
}
	
function update()
{
	if (key[KEY_RIGHT]) {
		man_x += 2;
		nam_x -= 2;
		man_y = man_walk_height();
	}
	if (key[KEY_LEFT]) {
		man_x -= 2;
		nam_x += 2;
		man_y = man_walk_height();
	}
	if (released[KEY_LEFT] || released[KEY_RIGHT]) {
	    man_y = man_y_default;
		man_x_start = man_x
		nam_x_start = nam_x;
	}
	if (man_x > 1570) { 
		draw_alt_text = true;
	} else {
		draw_alt_text = false;
	}
	if (man_x > 170 && man_x < 2000) {
		draw_text = true;
		font_size = man_x / 25;
	} else {
		draw_text = false;
	}
}

function man_walk_height()
{
	var new_y = 5 * -Math.sin((man_x - man_x_start) / 10) + man_y_default;
	if (Math.round(new_y) == man_y_default - 5 && man_x < 1570) play_sample(step);
	return new_y;
}


function main()
{
	enable_debug('debug');
	allegro_init_all("canvas_id", 640, 480);
	// images
	man = load_bmp("data/man.png");
	nam = load_bmp("data/nam.png");
	mirror = load_bmp("data/mirror.png");
	not_mirror = load_bmp("data/not_mirror.png");
	// audio
	step = load_sample("data/step.wav");
	
	ready(function(){
		loop(function(){
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();