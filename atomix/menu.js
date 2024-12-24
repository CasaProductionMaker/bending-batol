const firebaseConfig = {
  apiKey: "AIzaSyBZAeGYnKus0V4xYG_InWrOHUYfU9wuPmM",
  authDomain: "atomix-3d7c6.firebaseapp.com",
  databaseURL: "https://atomix-3d7c6-default-rtdb.firebaseio.com",
  projectId: "atomix-3d7c6",
  storageBucket: "atomix-3d7c6.firebasestorage.app",
  messagingSenderId: "160684388573",
  appId: "1:160684388573:web:dea0bbc8c1a9a4dae7ab34"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

if(localStorage.getItem("AtomixUser") == null)
{
  window.location.href = "login.html";
}
localStorage.removeItem("AtomixGame");
document.querySelector("#gamecode").value = "";

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
function generateGameCode() {
  let code = "";
  for (var i = 0; i < 5; i++) {
    code = code + randomFromArray(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
  }
  return code;
}

let gameCode = null;
let name;
if(localStorage.getItem("AtomixName") == null)
{
	localStorage.setItem("AtomixName", createName());
}
name = localStorage.getItem("AtomixName");
playerNameInput.value = name;
let currentBuild = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let electrons = ["Electron", "ChunkyElectron", "SpedElectron", "SmolElectron", "TankElectron", "SharpElectron", "MissileElectron", "Magnet", "Taser", "Solder", "Neutron", "HeavyElectron", "PiercingElectron", "Mirror", "QuantumParticle", "DeterioratingElectron", "Neutralizer"];

playerNameInput.addEventListener("change", (e) => {
  const newName = e.target.value || createName();
  playerNameInput.value = newName;
  name = newName;
  localStorage.setItem("AtomixName", newName);
  if(gameCode != null) firebase.database().ref("games/" + gameCode + "/playerlist/" + localStorage.getItem("AtomixUser")).set(name);
})

let promises = currentBuild.map((_, i) => {
  return firebase.database().ref("users/" + localStorage.getItem("AtomixUser") + "/build/" + i).once("value").then((snapshot) => {
    currentBuild[i] = electrons.indexOf(snapshot.val());
    document.querySelector("#slot" + (i + 1)).style.background = "url(images/electrons/" + electrons[currentBuild[i]] + ".png) no-repeat no-repeat";
  });
});

Promise.all(promises).then(() => {
  console.log("All data retrieved, ready to proceed");
  console.log(currentBuild)
}).catch((error) => {
  console.error("Error retrieving data: ", error);
});

function createGame() {
  gameCode = generateGameCode();
  firebase.database().ref("games/" + gameCode + "/playerlist/" + localStorage.getItem("AtomixUser")).set(name);
  firebase.database().ref("games/" + gameCode + "/host").set(localStorage.getItem("AtomixUser"));
  localStorage.setItem("AtomixGame", gameCode);
  document.querySelector("#gamecode").value = gameCode;
}

function joinGame() {
  //JOIN A GAME
  gameCode = document.querySelector("#gamecode").value;
  localStorage.setItem("AtomixGame", gameCode);
  firebase.database().ref("games/" + gameCode + "/playerlist/" + localStorage.getItem("AtomixUser")).set(name);
}

function scrollSlot(slot) {
  currentBuild[slot]++;
  if(currentBuild[slot] >= electrons.length) currentBuild[slot] = 0;
  firebase.database().ref("users/" + localStorage.getItem("AtomixUser") + "/build/" + slot).set(electrons[currentBuild[slot]])
  document.querySelector("#slot" + (slot + 1)).style.background = "url(images/electrons/" + electrons[currentBuild[slot]] + ".png) no-repeat no-repeat"
}