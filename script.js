const gameContainer = document.getElementById("game");
let score = 0;
const scoreDiv = document.querySelector('.score');
let gameStart = false;

if (localStorage.getItem('highScore') === null) {
  localStorage.setItem('highScore', 0);
  localStorage.setItem('lowScore', 0);

}

function getInputRangeValue() {
  let userInput = -1;
  if (inputRange.value === '1') {
    userInput = 4;
  } else if (inputRange.value === '2') {
    userInput = 16;
  } else if (inputRange.value === '3') {
    userInput = 36;
  } else if (inputRange.value === '4') {
    userInput = 64;
  } else {
    userInput = 100;
  }
  console.log(userInput);
  return userInput;
}

// input range slider determines how many rows/columns of cards will be generated
const inputRange = document.querySelector(".range-slider");
inputRange.addEventListener("input", () => {
  if (gameStart === false) {
    createBoard();
  }

});
inputRange.addEventListener('mouseup', () => {
  if (gameStart === false) {
    gameContainer.innerHTML = '';
  }
});


function createBoard() {
  gameContainer.innerHTML = '';

  const numOfCards = getInputRangeValue()
  createColorsArr(numOfCards);
  // console.log("shuffledColors Array:", shuffledColors)
  createDivsForColors(shuffledColors, numOfCards);
}


const COLORS = [
  'aqua',
  'aquamarine',
  'red',
  'bisque',
  'black',
  'blue',
  'blueviolet',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'cornflowerblue',
  'orange',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgreen',
  'purple',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dodgerblue',
  'firebrick',
  'forestgreen',
  'fuchsia',
  'gold',
  'greenyellow',
  'hotpink',
  'indianred',
  'khaki',
  'lawngreen',
  'lightblue',
  'lightpink',
  'lightseagreen',
  'maroon',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen'
];

let shuffledColors = [];

function createColorsArr(numberOfCards) {
  // create a temporary array and assign shuffled version of the COLORS array
  const tempArr = shuffle(COLORS.slice(0));
  shuffledColors.length = 0;
  // remove items from beginning of tempArray so that: tempArr = numberOfCards / 2
  tempArr.splice(0, (50 - numberOfCards / 2));
  // concat tempArr to itself to create color pairs and shuffle the resulting array
  shuffledColors = shuffle(tempArr.concat(tempArr))
  // console.log(shuffledColors)
}


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray, numOfCards) {
  // create class name for CSS Grid
  let className = '';

  if (numOfCards === 4) {
    className = 'two';
  } else if (numOfCards === 16) {
    className = 'four';
  } else if (numOfCards === 36) {
    className = 'six';
  } else if (numOfCards === 64) {
    className = 'eight';
  } else if (numOfCards === 100) {
    className = 'ten';
  }

  gameContainer.classList.remove('two');
  gameContainer.classList.remove('four');
  gameContainer.classList.remove('six');
  gameContainer.classList.remove('eight');
  gameContainer.classList.remove('ten');
  gameContainer.classList.add(className);
  // newDiv.classList.add('four');

  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}


let lastTwoCards = [];
let waitingForWindow = false;
// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);

  console.log(event.target.classList[0]);

  console.log(event.target.classList)
  if (!waitingForWindow && (event.target !== lastTwoCards[0])) {
    lastTwoCards.push(event.target);
    // Clicking a card should change the background color to be the color of the class it has.
    // Users should only be able to change at most two cards at a time.
    // Clicking on two matching cards should be a “match” — those cards should stay face up.
    // When clicking two cards that are not a match, they should stay turned over for at least 1 second before they hide the color again. You should make sure to use a setTimeout so that you can execute code after one second.

    event.target.style.backgroundColor = event.target.classList[0];
    // if user clicked two cards in a row, then check if they match
    if (lastTwoCards.length === 2) {
      if (lastTwoCards[0].classList[0] === lastTwoCards[1].classList[0]) {
        console.log("Match!");
        lastTwoCards[0].removeEventListener('click', handleCardClick);
        lastTwoCards[1].removeEventListener('click', handleCardClick);
        lastTwoCards = [];

        // add 10 points to score
        score += 10;
        // update score UI
        scoreDiv.textContent = score;
      } else {
        waitingForWindow = true;
        // subtract 1 point from score
        score -= 1;
        // update score UI
        scoreDiv.textContent = score;
        setTimeout(() => {
          lastTwoCards[0].style.backgroundColor = '#535353';
          lastTwoCards[1].style.backgroundColor = '#535353';
          lastTwoCards = [];
          waitingForWindow = false;
        }, 1000);
      }
    }

  }
}


// add event listener to start and restart buttons
const start = document.querySelector('.start');
const restart = document.querySelector('.restart');

function addStartListener() {
  start.addEventListener('click', function temp() {
    createBoard();
    gameStart = true;
    start.removeEventListener('click', temp);
  });
}


restart.addEventListener('click', () => {
  gameStart = false;
  gameContainer.innerHTML = '';
  addStartListener(inputRange.value);
  score = 0;
  scoreDiv.textContent = score;

  // update local storage
  localStorage.setItem('highScore', score);
  localStorage.setItem('lowScore', score);
});

// WAIT for start button before calling this function!!!
// Restart button also calls this function

// when the DOM loads
// createDivsForColors(shuffledColors);
addStartListener();
