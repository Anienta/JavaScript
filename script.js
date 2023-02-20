'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  //coping movements and sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i +1}${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
  containerMovements.insertAdjacentHTML('afterbegin', html);
  })
};


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}


const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements.filter(mov => mov < 0).reduce ((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements.filter(mov => mov >0).map(mov => mov*acc.interestRate/100).filter(mov => mov >= 1).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

//UPDATE UI (movements, balance, summary)
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

//Welcomig

const welcoming = function (acc) {
  acc === currentAccount? labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}` :
  labelWelcome.textContent = 'Log in to get started';
};


createUsernames(accounts);

//LOGIN IN
let currentAccount;
btnLogin.addEventListener('click', function(e) {
  //preventing automatic reloading
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    
    welcoming(currentAccount);

    //UI visible
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //removing cursor
    inputLoginPin.blur();

    updateUI(currentAccount);
  }});


//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  //clear input field
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc &&currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

//CLOSING account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    //account index that is going to be deleted
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //delete account
    console.log(index);
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;

    welcoming();
  }

      //clear input fields
      inputCloseUsername.value = inputClosePin.value = '';
});

//Getting a loan
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }

  //Clear input field
  inputLoanAmount.value = '';
})

//SORTING button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//CHALLENGE #1

const dogsJulia = [2, 5, 1, 7, 4];
const dogsKate = [3, 2, 4, 9, 1];

 const checkDogs = function (julia, kate) {
  const juliaNew = julia.slice();
  juliaNew.splice(0, 1);
  juliaNew.splice(-2);
  const allDogs = juliaNew.concat(kate);
  allDogs.forEach(function (dogAge, i) {
    dogAge > 3 ? console.log(`Dog number ${i + 1} is an adult, and is ${dogAge} years old`) : console.log(`Dog number ${i + 1} is still a puppy🐕`);
  });
 }

checkDogs(dogsJulia, dogsKate);

////////////////////
//CHALLENGE #2

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => age <= 2 ? 2 * age : age *4 + 16);
  const adults = humanAge.filter(humanAge => humanAge >= 18);
  const average = adults.reduce((acc, adults) => acc + adults, 0) / adults.length;
  
  console.log(average);;
};
calcAverageHumanAge([5,2,4,1,15,8,3]);

//////////////////////
//CHALLENGE #3

const calcAverageHumanAgeChain = ages =>
ages.map(age => age <= 2? 2*age : age *4 +16).filter(humanAge => humanAge >= 18).reduce((acc, adults, i, arr) => acc + adults/arr.length, 0);

const avg1 = calcAverageHumanAgeChain([5,2,4,1,15,8,3]);
const avg2 = calcAverageHumanAgeChain([16,6,10,5,6,1,4]);
console.log(avg1, avg2);

//CHALLENGE
const x100 = Array.from({length: 100}, () => Math.trunc(Math.random() *6)+1);

console.log(x100);



