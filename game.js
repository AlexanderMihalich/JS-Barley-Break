'use strict';

const field = document.querySelector('.field');
const popup = document.querySelector('.popup');
const gameOver = document.querySelector('.gameover');
const tapContainer = document.querySelector('.tap');
const wpapperBg = document.querySelector('.wrapper');
const bg = new Image();
bg.src = './img/bg.jpg';
if (wpapperBg) {
	wpapperBg.classList.add('_loaded');
}

let tapCounter = 0; // taps
let timer;
let emptyPos = { // position
	x: 0,
	y: 0,
};

// array of numbers game barley-break
const numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

// ================================== main task ===============================
const moveTiles = (tile) => {
	const savePosY = tile.style.top.replace(/\%/g, '');
	const savePosX = tile.style.left.replace(/\%/g, '');
	const diffX = Math.abs(savePosX - emptyPos.x);
	const diffY = Math.abs(savePosY - emptyPos.y);

	if (diffY + diffX > 25) return;

	tile.style.top = emptyPos.y + '%';
	tile.style.left = emptyPos.x + '%';
	tile.top = emptyPos.y;
	tile.left = emptyPos.x;
	emptyPos.y = savePosY;
	emptyPos.x = savePosX;

	// count of each tap
	tapContainer.textContent = ++tapCounter;

	const tiles = [...document.querySelectorAll('.tile')];

	// finish game
	const isFinishGame = tiles.every((item) => {
		return (item.top * 4 * 4 + (item.left * 4 + 100)) / 100 == item.dataset.tileNumber
	});
	setTimeout(() => {
		if (isFinishGame) {
			const minute = timeMinute < 10 ? '0' + timeMinute : timeMinute;
			const second = timeSecond < 9 ? '0' + ++timeSecond : ++timeSecond;
			popup.style.height = '100%';
			gameOver.style.display = 'flex';
			wpapperBg.classList.add('_active')
			clearInterval(timer);
			document.querySelector('.time-end').textContent = `${minute}:${second}`;
			document.querySelector('.tap-end').textContent = `${tapCounter}`;
		}
	}, 300)
};

const renderTiles = (num) => {
	const tile = document.createElement('div');
	tile.classList.add('tile');
	tile.setAttribute('data-tile-number', numbers[num - 1] + 1);
	tile.innerHTML = `<div class="tile-item">${numbers[num - 1] + 1}</div>`;
	field.append(tile);

	const posX = (num % 4) * 100 * 0.25;
	const posY = ((num - (num % 4)) / 4) * 100 * 0.25;

	tile.style.top = `${posY}%`;
	tile.style.left = `${posX}%`;

	tile.top = posY;
	tile.left = posX;
	tile.number = numbers[num - 1] + 1;

	return tile;
};

const startGame = () => {
	for (let i = 1; i <= 15; i++) {
		renderTiles(i);
	}
	const tiles = document.querySelectorAll('.tile');
	setTimeout(() => {
		for (let i = 0; i < tiles.length; i++) {
			const top = tiles[i].top;
			const left = tiles[i].left;
			tiles[i].style.top = tiles[tiles.length - 1 - i].top + '%';
			tiles[i].style.left = tiles[tiles.length - 1 - i].left + '%';
			tiles[tiles.length - 1 - i].style.top = top + '%';
			tiles[tiles.length - 1 - i].style.left = left + '%';

			tiles[i].top = tiles[tiles.length - 1 - i].top;
			tiles[i].left = tiles[tiles.length - 1 - i].left;
			tiles[tiles.length - 1 - i].top = top;
			tiles[tiles.length - 1 - i].left = left;

			tiles[i].addEventListener('click', () => {
				moveTiles(tiles[i]);
			});
		}
	}, 500);

	timer = time();
	pause();
};

const newGame = () => {
	field.innerHTML = '';
	nullFiftin();
	startGame();
};

const stopGame = () => {
	field.innerHTML = 'To begin the game please press button <br> start';
	nullFiftin();
};

const timeBlock = document.querySelector('.time');
let pauseCheck = false; // check button pause
let timeMinute = 0;
let timeSecond = 0;

const nullFiftin = () => {
	emptyPos.x = 0;
	emptyPos.y = 0;
	numbers.sort(() => Math.random() - 0.5);
	pauseCheck = false;
	clearInterval(timer);
	timeBlock.textContent = '00:00';
	timeMinute = 0;
	timeSecond = 0;
	tapCounter = 0;
	tapContainer.textContent = '0';
}

bg.onload = () => {
	// document.querySelector('.container').classList.add('_appear');

	document.querySelector('.container_hide').style.opacity = 1;
	document.querySelector('#startGame').addEventListener('click', () => {
		newGame();
	});
	document.querySelector('#stopGame').addEventListener('click', () => {
		stopGame();
	});
	document.querySelector('#newGame').addEventListener('click', () => {
		wpapperBg.classList.remove('_active')
		popup.style.height = '0%';
		gameOver.style.display = 'none';
		newGame();
	});
}
// ================================== main task ===============================

//========================= additional functionality ==========================
const time = () => {
	const timer = setInterval(() => {
		const minute = timeMinute < 10 ? '0' + timeMinute : timeMinute;
		const second = timeSecond < 9 ? '0' + ++timeSecond : ++timeSecond;

		if (timeSecond > 59) {
			++timeMinute;
			timeSecond = 0;
		}

		timeBlock.textContent = `${minute}:${second}`;
	}, 1000);

	return timer;
};

const pause = () => {
	const popUpPauseScreen = document.querySelector('.popup-pause');

	document.querySelector('#pause').addEventListener('click', () => {
		if (!pauseCheck) {
			popup.style.height = '100%';
			popUpPauseScreen.style.display = 'flex';
			wpapperBg.classList.add('_active')
			pauseCheck = true;
			clearInterval(timer);
		}
	});

	document.querySelector('#continue').addEventListener('click', () => {
		if (pauseCheck) {
			popup.style.height = '0%';
			popUpPauseScreen.style.display = 'none';
			wpapperBg.classList.remove('_active')
			timer = time();
			pauseCheck = false;
		}
	});
};
//========================= additional functionality ==========================
