const playerNameInput = document.querySelector("#player-name");

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
    "UNCOOL",
    "GODLY",
    "OP",
    "POOR",
    "THE",
  ]);
  const animal = randomFromArray([
    "BEAR",
    "DOG",
    "CAT",
    "FOX",
    "LAMB",
    "LION",
    "BOAR",
    "GOAT",
    "VOLE",
    "SEAL",
    "PUMA",
    "MULE",
    "BULL",
    "BIRD",
    "BUG",
    "MONKEY",
    "DRAGON",
    "ANT",
    "SNAKE",
  ]);
  return `${prefix} ${animal}`;
}
let name;
if(localStorage.getItem("Name") == null)
{
	localStorage.setItem("Name", createName());
}
name = localStorage.getItem("Name");
playerNameInput.value = name;

playerNameInput.addEventListener("change", (e) => {
  const newName = e.target.value || createName();
  playerNameInput.value = newName;
  localStorage.setItem("Name", newName);
})
let position = 0;
function loopAnimation() {
  let front = ((window.innerWidth / 100) * position) + "px"
  let back = ((window.innerWidth / 100) * (position - 100)) + "px";
  position++;
  if(position == 101) {
    position = 0;
    document.querySelector("#bg1").style.transition = "none";
    document.querySelector("#bg2").style.transition = "none";
  }
  document.querySelector("#bg1").style.transform = "translate3d(" + front + ", 0, 0)"
  document.querySelector("#bg2").style.transform = "translate3d(" + back + ", 0, 0)"
  if(position == 1) {
    document.querySelector("#bg1").style.transition = "transform 1s";
    document.querySelector("#bg2").style.transition = "transform 1s";
  }
  setTimeout(() => {
    loopAnimation();
  }, 500);
}

loopAnimation()