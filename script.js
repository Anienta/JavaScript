'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-02-19T23:36:17.929Z',
    '2023-02-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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


/////FUNCTIONS
const formatMovementDate = function(date, locale) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date)

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    //   const day = `${date.getDate()}`.padStart(2, 0);
    //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
    //   const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
}

//Formatting currency
const formatCur = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {style: 'currency',
  currency: currency,}).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //coping movements and sorting
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, currentAccount.locale);

    const formatedMov = formatCur(mov, acc.locale, acc.currency);


    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i +1}${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatedMov}</div>
  </div>`;
  containerMovements.insertAdjacentHTML('afterbegin', html);
  })
};


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);;
}


const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements.filter(mov => mov < 0).reduce ((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(outcomes), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov >0).map(mov => mov*acc.interestRate/100).filter(mov => mov >= 1).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

//UPDATE UI (movements, balance, summary)
const updateUI = function (acc) {
  displayMovements(acc);
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

    //Create current date and time
    const now = new Date();
    const options = {
      hour:'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    //const locale = navigator.language;
    //locale could be replaced by currentAccount.locale

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
  }});

  // FAKE always logged in //
  currentAccount = account1;
  updateUI(currentAccount);
  containerApp.style.opacity = 100;


  //SET Time Parameters
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;



//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  //clear input field
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc &&currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {

    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

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

  const amount = Math.floor(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //add movement and date
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

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
  displayMovements(currentAccount, !sorted);
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

// checkDogs(dogsJulia, dogsKate);

////////////////////
//CHALLENGE #2

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => age <= 2 ? 2 * age : age *4 + 16);
  const adults = humanAge.filter(humanAge => humanAge >= 18);
  const average = adults.reduce((acc, adults) => acc + adults, 0) / adults.length;
  
  // console.log(average);;
};
// calcAverageHumanAge([5,2,4,1,15,8,3]);

//////////////////////
//CHALLENGE #3

const calcAverageHumanAgeChain = ages =>
ages.map(age => age <= 2? 2*age : age *4 +16).filter(humanAge => humanAge >= 18).reduce((acc, adults, i, arr) => acc + adults/arr.length, 0);

const avg1 = calcAverageHumanAgeChain([5,2,4,1,15,8,3]);
const avg2 = calcAverageHumanAgeChain([16,6,10,5,6,1,4]);
console.log(avg1, avg2);

//CHALLENGE
const x100 = Array.from({length: 100}, () => Math.trunc(Math.random() *6)+1);

// console.log(x100);

//////////////////
//CHALLENGE #4

//TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
//1
const calcFoodOK = function(dogs) {
  dogs.forEach(dog => dog.recommendedFood = dog.weight ** 0.75 * 28);
};
calcFoodOK(dogs);
console.log(dogs);

//2
const dogSarah = function (dogs) {
  dogs.filter(dogs => dogs.owners.includes('Sarah')).map(dogs => dogs.curFood >  dogs.recommendedFood? console.log("Sarah's dog is eating too much"): console.log("Sarah's dog is eating too little") 
  );
};

dogSarah(dogs);

//3
const ownersEatTooMuch = dogs.filter(dogs =>  dogs.curFood > dogs.recommendedFood).flatMap(dogs => dogs.owners);

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs.filter(dogs =>  dogs.curFood < dogs.recommendedFood).flatMap(dogs => dogs.owners);

console.log(ownersEatTooLittle);

//4
console.log(`${ownersEatTooMuch.join(" and ")} dogs eat too much.`);
console.log(`${ownersEatTooLittle.join(" and ")} dogs eat too little.`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//6
console.log(dogs.includes(dogs.curFood <= 1.1 * dogs.recommendedFood && dogs.curFood >= 0.9 * dogs.recommendedFood));

const eatingOK = dog => dog.curFood <= 1.1 * dog.recommendedFood && dog.curFood >= 0.9 * dog.recommendedFood;
console.log(dogs.some(eatingOK));

//7
const dogsEatingOK = dogs.filter(eatingOK).flatMap(dog => dog.owners);
console.log(dogsEatingOK);

//8
const dogsSorted = dogs.slice().sort((a,b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);

//Number format experimenting
const num = 54999616.6;
const options = {
  style: 'unit',
  unit: 'liter',
};
console.log(navigator.language, ': ', new Intl.NumberFormat(navigator.language, options).format(num));