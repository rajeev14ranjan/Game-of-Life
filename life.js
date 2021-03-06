const noOfDots = 1250;
let population = new Array(noOfDots);
const row = 25,
  col = 50;
var int_id;

function onload() {
  initialPopulate();
  startGenerations();
}

function startGenerations() {
  int_id = setInterval(generate, 200);
}

function toggle() {
  let statusElt = document.getElementById('status');
  if (int_id) {
    clearInterval(int_id);
    int_id = null;
    toggleBtn.innerText = 'Start Iteration';
    statusElt.classList.remove("blinking");
  } else {
    startGenerations();
    toggleBtn.innerText = 'Stop Iteration';
    statusElt.classList.add("blinking");
  }
}

function getNeighbourLifeStatus(i) {
  //To get corner lines dots
  const coordinates = [
    i - (col + 1),
    i - col,
    i - (col - 1),
    i + 1,
    i + col + 1,
    i + col,
    i + col - 1,
    i - 1,
  ];
  return coordinates.map(i =>
    i < 0 || i > (noOfDots - 1) ? populatePaint[wrapTopBottom(i)] : population[i]
  );
}

function wrapTopBottom(i) {
  if ((i / row) >> (0 + 1) === col) {
    // on bottom line
    return i % row;
  } else if ((i / row) >> 0 === 0) {
    //on top line
    return row * (col - 1) + i;
  } else {
    //in middle
    return i;
  }
}

function initialPopulate() {
  for (let i = 0; i < noOfDots; i++) {
    let isLiving = Math.random() > 0.8;
    population[i] = isLiving;
    playGround.appendChild(getDot(i, isLiving));
  }
}

function getDot(index, living) {
  const spanElt = document.createElement('span');
  spanElt.classList.add(living ? 'l-dot' : 'd-dot');
  spanElt.setAttribute('data-index', index);
  spanElt.style.backgroundColor = getRandomColor();
  return spanElt;
}

function populatePaint() {
  for (let i = 0; i < noOfDots; i++) {
    changeDotStatus(i, population[i]);
  }
  const livingCount = population.filter(dot => dot).length;
  pCount.innerText = `There are ${livingCount} creature${livingCount ? 's' : ''} alive`;
}

function changeDotStatus(i, isLiving) {
  playGround.children[i].classList.remove(isLiving ? 'd-dot' : 'l-dot');
  playGround.children[i].classList.add(isLiving ? 'l-dot' : 'd-dot');
}

function getRandomColor() {
  const c = () => (Math.random() * 250) >> 0;
  const colString = [c(), c(), c()]
    .map(col => (col < 16 ? `0${col.toString(16)}` : col.toString(16)))
    .join('');

  return `#${colString}`;
}

function killAll() {
  toggle();
  population = new Array(noOfDots).fill(false);
  populatePaint();
}

function generate() {
  let currentPopulation = new Array(noOfDots).fill(false);
  for (let i = 0; i < noOfDots; i++) {
    let noOfLivingNeighbours = getNeighbourLifeStatus(i).filter(idx => idx)
      .length;

    currentPopulation[i] =
      (noOfLivingNeighbours === 2 && population[i]) ||
      noOfLivingNeighbours === 3;
  }

  population = currentPopulation;
  populatePaint();
}

function dotClicked(event) {
  const dot = event.target;
  if (dot) {
    const index = parseInt(dot.dataset.index);
    const living = dot.classList.contains('l-dot');
    population[index] = !living;
    changeDotStatus(index, !living);
  }
}
