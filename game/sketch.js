// Parameters
const scl = 20;
const indent = 2;
const fps = 16;
const set_timer = 80;
const LIFE = 3;


const BLACK = '#000000';
const BLUE = '#57afb1';
const PURPLE = '#a236ad';
const WHITE = '#cecaca';

const ORANGE = '#f7931a';
const BG_COLOR = '#2b2b37';
const BG_LIGHT_COLOR = '#43434c';


let field, xonix, enemy;
let enemies_coord, xonix_coord;

// Pics
let bitcoin;
let asic;

let canvas;
let button;
let screen = 0;
let inputNickname;
let inputTwitter;

let nickname;
let twitter;
let finalScore = 0;

function setup() {
	bitcoin = loadImage('assets/bitcoin.png');
	asic = loadImage('assets/asic.png');

	// You can use windowWidth & windowHeight for more adaptive window
	// 	 btw, don't forget about adding style of #sketch-holder
	canvas = createCanvas(800,600); 

	// Move the canvas so it’s inside our <div id="sketch-holder">.
	canvas.parent('sketch-holder');

	canvas.mousePressed(changeScreen);

	inputNickname = createInput("Nickname");
	//inputNickname.input(myInputEvent);
	inputNickname.parent('sketch-holder');
	inputNickname.style('display', 'none')
	//inputNickname.addClass('form-control');

	inputTwitter = createInput("Twitter account");
	inputTwitter.parent('sketch-holder');
	inputTwitter.style('display', 'none')
	//inputTwitter.addClass('form-control');
	
	button = createButton('submit');
	button.parent('sketch-holder');
	button.style('display', 'none');
	//button.addClass('btn btn-dark');
	button.mousePressed(submitInput);
}

function changeScreen() {
	if (screen === 0) {
		screen = 1;

		height -= indent*scl; // Space for console

		field = new Field();
		xonix = new Xonix();
		makeEnemies(); //new seaEnemy() и new landEnemy()
	
		frameRate(fps);
		field.default();
	}
}

function submitInput() {
	const path = 'http://127.0.0.1:8080'// TODO: replace to smth like 'https://changenow.io/bitcoin-halving/PLACEHOLDER';
	const postData = {nickname: nickname, twitter: twitter, score: finalScore};
	httpPost(path, 'json', postData, () => {screen = 0});
}

function draw() {
	if (screen === 0) { // welcome page
		/* Change welcome page here.
		 * If you want some buttons, set them in setup(), then draw here.
		 * You can add pics to bg, docs: 
		 * 		https://p5js.org/reference/#/p5/image
		 * 		https://p5js.org/examples/image-load-and-display-image.html
		 */
		background(BG_LIGHT_COLOR);
		fill(255);
		textAlign(CENTER);
		text('Welcome to BITCOIN Halving XONIX game!', width / 2, height / 2)
		text('click to start', width / 2, height / 2 + 20);

	} else if (screen === 1) { // game page
		// Decrement the number of lives
		if (xonix.isDead) {
			xonix.life--;
			xonix.toDefault();
			enemy[0].toDefault();
			seconds_left = set_timer;
		}

		// End of game
		if (xonix.life == 0) {
			finalScore = xonix.score;
			screen = 2;

			xonix.life = LIFE;
			xonix.score = 0;

			field.default();
			number_of_enemies = 3;
			makeEnemies();
		}

		// Next level
		if (field.complete_percent >= 75) {
			xonix.score += 500;
			xonix.life++;

			xonix.toDefault();
			enemy[0].toDefault();
			field.default();
			seconds_left = set_timer;

			number_of_enemies++;
			makeEnemies();
		}

		// Time's up
		if (seconds_left == 0) {
			xonix.isDead = true;
		}

		field.update(enemies_coord, xonix_coord);
		updateEnemies(field.array);
		xonix.update(field.array);

		game_console();

	} else if (screen === 2) { // submit result page
		background(BG_LIGHT_COLOR);
		fill(255);

		/**
		 * You can change text as text() method 
		 * 			docs: https://p5js.org/reference/#/p5/text
		 * 		or setup some createP('...') / createElement('h1', '...')
		 * 			docs: https://p5js.org/reference/#/p5/createP
		 * 				  https://p5js.org/reference/#/p5/createElement
		 * 
		 *  And sorry about positioning. This is really smelly code
		 */

		textAlign(CENTER);
		text('GAME OVER!', width / 2, height / 2);
		text('Your score: ' + finalScore, width / 2, height / 2 + 20);

		inputNickname.style('display', 'inline-block');
		inputNickname.position(width/2 + 20, height / 2 + 40);
		text('Add your nickname ', inputNickname.x - inputNickname.width/2 - 20, inputNickname.y + inputNickname.height/1.5);
	
		inputTwitter.style('display', 'inline-block');
		inputTwitter.position(width / 2 + 20, height / 2 + 80);
		text('Add your twitter name', inputTwitter.x - inputNickname.width/2 - 20, inputTwitter.y + inputTwitter.height/1.5);

		button.style('display', 'inline-block');
		button.position(width/2 - button.width/2, inputTwitter.y+80);


		nickname = inputNickname.value();
		twitter = inputTwitter.value();

		noLoop();
	}
}

let counter = 0;
function keyPressed() {
	if (keyCode === UP_ARROW) xonix.dir(0, -1);
	else if (keyCode === DOWN_ARROW) xonix.dir(0, 1);
	else if (keyCode === RIGHT_ARROW) xonix.dir(1, 0);
	else if (keyCode === LEFT_ARROW) xonix.dir(-1, 0);

	else if (keyCode === 32 && counter%2 == 0) {
		noLoop();
		counter++;

		clearInterval(timer);
	} else if (keyCode === 32 && counter%2 != 0) {
		loop();
		counter++;

		timer = setInterval(() => {seconds_left--;}, 1000);
	}
}

let startX, startY;
function touchStarted() {
	startX = mouseX;
	startY = mouseY;
	return false;
}

function touchEnded() {
	let deltaX = mouseX - startX;
	let deltaY = mouseY - startY;

	if (abs(deltaX) > abs(deltaY)) {
		if (deltaX > 0) xonix.dir(1, 0); //вправо
		else if (deltaX < 0) xonix.dir(-1, 0); //влево
	} else {
		if (deltaY > 0) xonix.dir(0, 1); //вниз
		else if (deltaY < 0) xonix.dir(0, -1); //вверх
	}

	startX = 0, startY = 0;
	return false;
}

//таймер
let seconds_left = set_timer;
let timer = setInterval(() => {seconds_left--;}, 1000);


function game_console() {

	//нарисовать консоль
	noStroke();
	fill(BG_COLOR);
	rect(0, height, width, indent*scl);

	//заполняем консоль
	fill(WHITE);
	textSize(scl);
	let h = height + (5/6)*indent*scl;

	//счет
	text("Score: " + xonix.score, 0.2 * width, h);

	//количество жизней
	text("Lives: " + xonix.life, 0.4 * width, h);

	//процент захваченного поля
	text("Completed: " + field.complete_percent + "%", 0.6 * width, h);

	//таймер
	text("Time left: " + seconds_left, 0.8 * width, h);
}
