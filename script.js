'use strict';

//define score Element and dice Element selector
const score0Element = document.getElementById('score--0');
const score1Element = document.getElementById('score--1');
const diceElement = document.querySelector('.dice');

//define buttons
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//define current score
const current0Element = document.getElementById('current--0');
const current1Element = document.getElementById('current--1');

//define player element 
const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');

let activePlayer, playing, currentScore;

//save main scores for player 0 and 1
const scores = [0,0];

//initialize game or reset
const reseting = function() {
    activePlayer = 0;
    playing = true;
    currentScore = 0;
    score0Element.textContent = 0;
    score1Element.textContent = 0;
    diceElement.classList.add('hidden');

    //set current score to 0
    current0Element.textContent = 0;
    current1Element.textContent = 0;
    player0Element.classList.remove('player--winner');
    player1Element.classList.remove('player--winner')
    player0Element.classList.add('player--active');
    player1Element.classList.remove('player--active');

    //hide dice on start
    diceElement.classList.add('hidden');

    //reseting scores
    scores[0] = 0;
    scores[1] = 0;

    activePlayer = 0;
    playing = true;
    
};

reseting();


//switching player
const switchingPlayer = function() {
        currentScore = 0;
        document.getElementById(`current--${activePlayer}`).textContent = 0;activePlayer = activePlayer === 0 ? 1 : 0;
        player0Element.classList.toggle('player--active');
        player1Element.classList.toggle('player--active');
};

//adding scores
const addingScore = function() {
    scores[activePlayer] += currentScore 
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
}

//User roll a dice
btnRoll.addEventListener('click', function() {
    if (playing) {
    //generatin random dice
    const dice = Math.trunc(Math.random() * 6) + 1;
    console.log(dice);

    //display dice
    diceElement.classList.remove('hidden');
    diceElement.src = `dice-${dice}.png`;

    //check if dice is 1
    if(dice !== 1) {
        currentScore += dice;
        document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    } else {
        switchingPlayer();
    }
}
});

btnHold.addEventListener('click', function() {
    if (playing) {
    //change score to current score
    addingScore();
    
    if (scores[activePlayer] >= 100)  {
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
        playing = false;
        diceElement.classList.add('hidden');
    } else {
    switchingPlayer();
    }
}
});

btnNew.addEventListener('click', reseting);