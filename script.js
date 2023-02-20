'use strict';

let secretNum = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
const displayMessage = function (message) {
    document.querySelector('.message').textContent = message;
}
const scoreChange = function (score) {
    document.querySelector('.score').textContent = score;
}
const backgroundColorChange = function (color) {
    document.querySelector('body').style.backgroundColor = color;
}
const hideOrShowSecretNumber = function (number) {
    document.querySelector('.number').textContent = number;
}
const changeFieldWidth = function (width) {
    document.querySelector('.number').style.width = width;
}
const resetingGuessValue = function (value) {
    document.querySelector('.guess').value = value;
}

document.querySelector('.check').addEventListener('click', function() {
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess, typeof guess);

    if (!guess) {
        displayMessage ('⛔ No number!');
    }
    else if (guess === secretNum) {
        hideOrShowSecretNumber (secretNum);
        displayMessage ('💪 Correct Number!');
        backgroundColorChange ('#60c347');
        changeFieldWidth ('30rem');
        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }
    }
    else if (guess !== secretNum) {
        if(score > 1) {
            score --;
            scoreChange (score);
            displayMessage (guess > secretNum ? 'Too high!' : 'Too low!');
        } else {
            displayMessage ('💩 You lost!');
            scoreChange (0);
        }
        
}
});

document.querySelector('.again').addEventListener('click', function () {
    score = 20;
    secretNum = Math.trunc(Math.random() * 20) + 1;
    displayMessage("Start guessing...");
    scoreChange (score);
    backgroundColorChange ('#222');
    hideOrShowSecretNumber ('?');
    changeFieldWidth ('15rem');
    resetingGuessValue ("");
});
