//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyBHMeVP8eRfY1fjYjhbAOlGl2Nsf98yv7A",
  authDomain: "bending-batol.firebaseapp.com",
  databaseURL: "https://bending-batol-default-rtdb.firebaseio.com",
  projectId: "bending-batol",
  storageBucket: "bending-batol.appspot.com",
  messagingSenderId: "330766978139",
  appId: "1:330766978139:web:85be1931dcc7a8759a837e"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//My code
const arenaMapData = {
  minX: 0,
  maxX: 15,
  minY: 0,
  maxY: 13,
  blockedSpaces: {
    "1x1": false
  }
};
const desertMapData = {
  minX: 0,
  maxX: 15,
  minY: 0,
  maxY: 13,
  blockedSpaces: {
    "1x1": false
  }
};
const beachMapData = {
  minX: 0,
  maxX: 15,
  minY: 0,
  maxY: 13,
  blockedSpaces: {
    "1x1": false
  }
};

let redZoneTime = 0;
let myLocation = "Arena";
let myWater = 0;
let myAir = 0;
let myAttackIdx = 16;
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: undefined, y: undefined};
let mouseTile = {x: undefined, y: undefined};
let myBending;
let attackWater = null;
let attackAirVaccum = null;
let projectionSelf = null;
let EarthBlockId = 0;
let rockId = 0;
let FireId = 0;
let WaterId = 0;
let EarthBlockCount = 0;
let LavaId = 0;
let LightningId = 0;
let fireRowId = 0;
let windId = 0;
let waterWhipId = 0;
let direction = null;
let myMoveId = 0;
let cooldown = 0;
let shockTimes = 0;
let playerTorrent = [];
let octopusArms = [];
let playerAirShield = [];
let torrentPos = [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}, {x: -1, y: 2}, {x: -2, y: 1}, {x: -2, y: 0}, {x: -2, y: -1}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}, {x: 2, y: -1}];
let octopusPos = [{x: 3, y: 1}, {x: 2, y: 3}, {x: -1, y: 3}, {x: -3, y: 2}, {x: -3, y: -1}, {x: -2, y: -3}, {x: 1, y: -3}, {x: 3, y: -2}];
let waterArms = [];
let experience = -1;
let SandId = 0;
let isFireBreath = false;
let currentDir = {x: 1, y: 0};
let shotEncase = null;
let shotTorrent = false;
let redirect = false;
let redirected = false;
let holdingPlayer = null;
let friendbend = null;
let holdKeep = 0;
let ExplodeId = 0;
let WaterShieldId = 0;
let redDam = 0;
let myBinds = [null, null, null];
let bindMove = null;
let redZoneXpos = 0;
let WaterMoves = ["Water Manipulation", "Torrent", "Healing Water", "Octopus Form", "Ice Freeze", "Water Arms", "Quick Shield", "Friendbending", "Draw Moisture", "Water Whip"];
let EarthMoves = ["Earth Pillar", "Earth Wall", "Raise Land", "Lava Crevice", "Earth Boulder", "Lava Disk", "Lava Encase", "Quicksand", "Earth Crawl"];
let AirMoves = ["Suffocate", "Wind", "Air Shield", "Wind Cloak", "Wind Slice", "Tornado", "Shockwave", "Spirit Projection", "Air Cleanse"];
let FireMoves = ["Blaze", "Incinerate", "Wall of Fire", "Fireball", "Lighting Blast", "Fire Breath", "Explosion", "Combust"];
let FireXP = [3, 0, 2, 1, 6, 5, 8, 10];
let AirXP = [3, 0, 1, 2, 1, 6, 2, 3, 5];
let WaterXP = [0, 3, 3, 4, 5, 6, 2, 9, 4, 1];
let EarthXP = [0, 1, 1, 5, 3, 4, 8, 6, 2];
let WaterDesc = [
  "Control water and shoot it at your opponents.", 
  "Grab water as a shield and shoot it off as offense", 
  "Use water to heal your injuries", 
  "Wrap water around yourself in the shape of an octopus to defend against attacks.", 
  "Freeze your opponent in a ball of ice", 
  "Water coats around your arms and you can use them as an extension of your arms", 
  "Quickly use water to make a shield to block incoming attacks.", 
  "An extremely advanced technique, consisting of controlling water in someone else.", 
  "Draw moisture out of the air, then you can use to perform waterbending moves", 
  "Use water as a whip to lash out at your opponents"
];
let EarthDesc = [
  "Raise the earth to block off people or hurt them if you raise ground under them.", 
  "Raise the earth to form a wall to block off people or hurt them if you raise ground under them.", 
  "Raise earth in a line in front of you.", 
  "Create a lava crevice in the floor, burning anyone in it.", 
  "Pull up a boulder and throw it at your opponents.", 
  "Shape molten lava into a disk and hurl it at your opponents.", 
  "Bring lava onto your opponents, then solidify it into a ball of stone, trapping them.", 
  "Turn the ground into quicksand, trapping your opponents before ending them.", 
  "Create bumps in the earth up to your opponent, hurting them."
];
let AirDesc = [
  "Suffocate your opponents in a bubble.", 
  "Shoot out a wind gust to blast others back.", 
  "Form an air shield around yourself.", 
  "The wind around you conceals you from anyone nearby.", 
  "Shoot out a thin air stream, damaging anyone in its path.", 
  "Create a huge tornado, bringing anyone close enough into a deadly vaccum", 
  "Blast all your opponents away using a powerful shockwave", 
  "Project a spirit clone of yourself as a decoy.", 
  "Cleanse the air around yourself or an ally to maybe heal them"
];
let FireDesc = [
  "Shoot out a huge flame to burn your enemies.", 
  "Burn any place at will.", 
  "Make a wall of fire to block out your opponents.", 
  "Shoot a flaming ball at your enemy.", 
  "Lighting shoots out from you to electorcute your enemies", 
  "Blast flames out of your mouth, incinerating anything in your path", 
  "A rare bending form, used only by masters, you can explode any place at will.", 
  "Shoot out a beam that will explode on impact"
];
let WaterInst = [
  "Click on water or ice to store it if it is close enough to it, and press space to make it follow your mouse.", 
  "Click on water or ice to store it if it is close enough to it, press space to make it circle you, and click to make it follow your mouse or press space again to put it back.", 
  "If you're close enough, click on water or ice and it'll heal you", 
  "Click on water or ice to store it if it is close enough to it, and press space to form the octopus.", 
  "Click on water or ice to store it if it is close enough to it, and press space to make it follow your mouse. When it collides with an opponent, they will freeze in a ball of ice.", 
  "Click on water or ice to store it if it is close enough to it, and press space to toggle the water arms. After toggling, click on someone close enough to your water arm tips to punch them.", 
  "Click in front of yourself if you are near water or have collected water to form a quick shield at your mouse.", 
  "Click on someone else to make them follow your mouse and click again to let them go.", 
  "Click on any tile to draw moisture out of it and form water for a few seconds", 
  "Click anywhere 7 tiles away from you to send a whip up to your mouse if you are near water or have collected water.", 
];
let EarthInst = [
  "Click on a tile to raise earth and click on it again to put it down.", 
  "Click on a tile to raise a wall at the tile.", 
  "Move in the direction you want to raise the line and then quickly press space.", 
  "Click on a tile not too far from you to open a crevice up to that point.", 
  "Click on the ground to bring up a boulder that will follow your mouse until it hits someone.", 
  "Click on a raised earth pillar to turn it into a molten disk that will follow your mouse until it hits someone.", 
  "Click on an earth pillar to turn it into lava that will follow your mouse. Upon contact with another player, it will encase the player in earth, or if you do not hit another player in time, you run out of energy and fail the move.", 
  "Click on any tile to turn it into quicksand.", 
  "Click anywhere 7 tiles away from you to bump up to that place"
];
let AirInst = [
  "Click on any tile to collect air, then press space to toggle a suffocation bubble that will damage anyone in it.", 
  "Click on any tile to collect air, then move in the direction you want to shoot the wind and then quickly press space.", 
  "Click on any tile to collect air, then press space to toggle an air shield.", 
  "Press space to toggle the cloak and turn invisible.", 
  "Move in the direction you want to shoot the air and then quickly press space.", 
  "Click anywhere to generate a tornado, it will take 2-3 seconds though, so be patient.", 
  "Press space to blast anyone near you away", 
  "Press space to toggle a projection that will follow your mouse.", 
  "Click on any player to have a 50% chance to heal them."
];
let FireInst = [
  "Move in the direction you want to shoot the fire and then quickly press space.", 
  "Click on a tile to burn it.", 
  "Click on a tile to burn a wall at the tile.", 
  "Move in the direction you want to shoot the fireball and then quickly press space.", 
  "Click on a tile not too far from you to shoot lightning at that point", 
  "Press space to toggle the fire breath.", 
  "Click on any tile to explode it.", 
  "Move in the direction you want to shoot and then quickly press space."
];

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

function isMobile() {
  return /Android|iPhone/i.test(navigator.userAgent);
}
function distanceBetween(one, two) {
  return Math.max(Math.abs(one.x - two.x), Math.abs(one.y - two.y));
}
function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
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
    "BENDER"
  ]);
  return `${prefix} ${animal}`;
}
function getCurrentMapData() {
  let cMap;
  if(myLocation == "Arena")
  {
    cMap = arenaMapData;
  }
  if(myLocation == "Desert")
  {
    cMap = desertMapData;
  }
  if(myLocation == "Beach")
  {
    cMap = beachMapData;
  }
  return cMap;
}
function isSolid(x, y, earthBlock) {
  const mapData = getCurrentMapData();
  let blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  Object.keys(earthBlock).forEach((key) => {
    const block = earthBlock[key];
    if(block.x == x && block.y == y && block.location == myLocation) blockedNextSpace = true;
  })
  return (
    blockedNextSpace || 
    x >= mapData.maxX || 
    x < mapData.minX || 
    y >= mapData.maxY || 
    y < mapData.minY
  )
}
function isWater(x, y, waterD) {
  let wetNextSpace = false;
  Object.keys(waterD).forEach((key) => {
    const block = waterD[key];
    if(block.x == x && block.y == y && block.location == myLocation) wetNextSpace = true;
  })
  return (
    wetNextSpace
  )
}
function distToWater(x, y, waterD) {
  let dist = 10000;
  Object.keys(waterD).forEach((key) => {
    const block = waterD[key];
    if(distanceBetween({x, y}, {x: block.x, y: block.y}) < dist && block.location == myLocation){
      dist = distanceBetween({x, y}, {x: block.x, y: block.y});
    }
  })
  return dist;
}
function isIce(x, y, waterD) {
  let wetNextSpace = false;
  Object.keys(waterD).forEach((key) => {
    const block = waterD[key];
    if(block.x == x && block.y == y && block.state == "ice" && block.location == myLocation) wetNextSpace = true
  })
  return (
    wetNextSpace
  )
}
function isSand(x, y, sandD) {
  let sandNextSpace = false;
  Object.keys(sandD).forEach((key) => {
    const block = sandD[key];
    if(block.x == x && block.y == y && block.location == myLocation) sandNextSpace = true
  })
  return (
    sandNextSpace
  )
}
function isAir(x, y, airD) {
  let dryNextSpace = false;
  Object.keys(airD).forEach((key) => {
    const block = airD[key];
    if(block.x == x && block.y == y && block.location == myLocation) dryNextSpace = true;
  })
  return (
    dryNextSpace
  )
}
function isLava(x, y, lavaD) {
  let lavaNextSpace = false;
  Object.keys(lavaD).forEach((key) => {
    const block = lavaD[key];
    if(block.x == x && block.y == y && block.location == myLocation) lavaNextSpace = true;
  })
  return (
    lavaNextSpace
  )
}
function getRandomSafeSpot(earthBlock) {
  let x = Math.floor(Math.random() * 13);
  let y = Math.floor(Math.random() * 11);
  while(isSolid(x, y, earthBlock))
  {
    x = Math.floor(Math.random() * 13);
    y = Math.floor(Math.random() * 11);
  }
  return {x, y};
}
function delay(milliseconds){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

(function() {

  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};
  let airVaccum = {};
  let airVaccumElements = {};
  let fireball = {};
  let fireballElements = {};
  let tornado = {};
  let tornadoElements = {};
  let explosion = {};
  let explosionElements = {};
  let combust = {};
  let combustElements = {};
  let airSlice = {};
  let airSliceElements = {};
  let wind = {};
  let windElements = {};
  let lava = {};
  let lavaElements = {};
  let lightning = {};
  let lightningElements = {};
  let rock = {};
  let rockElements = {};
  let sand = {};
  let sandElements = {};
  let water = {};
  let waterElements = {};
  let projection = {};
  let projectionElements = {};
  let fire = {};
  let fireElements = {};
  let earthCrawl = {};
  let earthCrawlElements = {};
  let earthBlock = {};
  let earthBlockElements = {};
  let redZone = {};
  let redZoneElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");
  const respawnContainer = document.querySelector(".respawn-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerColorButton = document.querySelector("#player-color");
  const chatSend = document.querySelector("#send-chat");
  const chatInput = document.querySelector("#chat-input");
  const chatDisplay = document.querySelector("#chat-display");
  const currentMove = document.querySelector("#current-move");
  const coolDown = document.querySelector("#cool-down");
  const MoveDesc = document.querySelector(".description");
  const MoveInst = document.querySelector(".instructions");

  function oneSecondLoop() {
    if(players[playerId] != null) {
      if(players[playerId].isDead > 0 && !isButton) {
        const buttonElement = document.createElement("div");
        buttonElement.classList.add("respawnButton");
        buttonElement.innerHTML = (`
          <a href="index.html"><button id="continue">Continue</button></a>
        `)
        const respawnButton = buttonElement.querySelector("#continue");
        respawnContainer.appendChild(buttonElement);
        isButton = true;
      }
      if(players[playerId].isSpectator)
      {
        redZoneTime++;
        if(redZoneTime === 30)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 40)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 50)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 60)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 70)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 80)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 90)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 100)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 110)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 120)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 130)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 140)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 150)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 160)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        if(redZoneTime === 170)
        {
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzb" + redZoneXpos + "x" + i).set({
              x: redZoneXpos, 
              y: i, 
              location: "Beach", 
              id: "rzb" + redZoneXpos + "x" + i
            })
          };
          for (var i = 0; i < 13; i++) {
            firebase.database().ref("red-zone/rzd" + (14-redZoneXpos) + "x" + i).set({
              x: 14-redZoneXpos, 
              y: i, 
              location: "Desert", 
              id: "rzd" + (14-redZoneXpos) + "x" + i
            })
          };
          redZoneXpos++;
        }
        firebase.database().ref().update({
          redZoneTime
        })
      }
    }
    Object.keys(redZone).forEach((key) => {
      const theRedZone = redZone[key];
      if(theRedZone.x == players[playerId].x && theRedZone.y == players[playerId].y && theRedZone.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = 1;
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    if(octopusArms.length > 0 && myBending == "Water" && myMoveId == 3)
    {
      myAttackIdx++;
      if(myAttackIdx == 16)
      {
        myAttackIdx = 16;
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
        for(let i in playerTorrent)
        {
          firebase.database().ref(`water/${playerId+i}`).remove();
        }
        for(let i in octopusArms)
        {
          firebase.database().ref(`water/${playerId+"octo"+i}`).remove();
        }
        playerTorrent = [];
        octopusArms = [];
      }
    }
    cooldown--;
    if(cooldown < 0)
    {
      cooldown = 0;
    }
    coolDown.innerText = "Cooldown: " + cooldown;
    if(holdingPlayer != null && waterArms.length > 0)
    {
      holdKeep++;
    }
    if(holdKeep > 3)
    {
      holdKeep = 0;
      holdingPlayer = null;
    }

    //repeat
    setTimeout(() => {
      oneSecondLoop();
    }, 1000);  
  }
  function fourthSecondLoop() {
    if(myBending == "Water")
    {
      if(myAttackIdx < 16 && myMoveId == 0)
      {
        const key = playerId;
        if(mouseTile.x > attackWater.x)
        {
          attackWater.x += 1;
        }
        if(mouseTile.x < attackWater.x)
        {
          attackWater.x -= 1;
        }
        if(mouseTile.y > attackWater.y)
        {
          attackWater.y += 1;
        }
        if(mouseTile.y < attackWater.y)
        {
          attackWater.y -= 1;
        }
        const waterRef = firebase.database().ref(`water/${key}`);
        waterRef.update({
          x: attackWater.x, 
          y: attackWater.y, 
          useable: false, 
          id: playerId
        })
        myAttackIdx++;
        let playerToAttack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          //console.log(key)
          if(characterState.x === attackWater.x && characterState.y === attackWater.y && characterState.location === water[playerId].location)
          {
            playerToAttack = key;
          }
        })
        Object.keys(fire).forEach((key) => {
          const fireToPutOut = fire[key];
          if(fireToPutOut.x === attackWater.x && fireToPutOut.y === attackWater.y)
          {
            firebase.database().ref(`fire/${key}`).remove();
          }
        })
        if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
        {
          myAttackIdx = 16;
          playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
          var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
        }
        if(myAttackIdx == 16)
        {
          firebase.database().ref(`water/${key}`).remove();
          myWater = 0;
          cooldown = 1;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
      if(myAttackIdx < 16 && myMoveId == 4)
      {
        const key = playerId;
        if(mouseTile.x > attackWater.x)
        {
          attackWater.x += 1;
        }
        if(mouseTile.x < attackWater.x)
        {
          attackWater.x -= 1;
        }
        if(mouseTile.y > attackWater.y)
        {
          attackWater.y += 1;
        }
        if(mouseTile.y < attackWater.y)
        {
          attackWater.y -= 1;
        }
        const waterRef = firebase.database().ref(`water/${key}`);
        waterRef.update({
          x: attackWater.x, 
          y: attackWater.y, 
          useable: false, 
          id: playerId
        })
        myAttackIdx++;
        let playerToAttack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === attackWater.x && characterState.y === attackWater.y && characterState.location === water[playerId].location)
          {
            playerToAttack = key;
          }
        })
        Object.keys(fire).forEach((key) => {
          const fireToPutOut = fire[key];
          if(fireToPutOut.x === attackWater.x && fireToPutOut.y === attackWater.y && fireToPutOut.location === water[playerId].location)
          {
            firebase.database().ref(`fire/${key}`).remove();
          }
        })
        if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
        {
          myAttackIdx = 16;
          playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
          var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
        }
        if(myAttackIdx == 16)
        {
          firebase.database().ref(`water/${key}`).update({
            state: "ice"
          });
          firebase.database().ref(`water/${key}ice1`).set({
            x: attackWater.x + 1, 
            y: attackWater.y, 
            useable: false, 
            id: playerId + "ice1", 
            state: "ice", 
            location: water[playerId].location
          });
          firebase.database().ref(`water/${key}ice2`).set({
            x: attackWater.x - 1, 
            y: attackWater.y, 
            useable: false, 
            id: playerId + "ice2", 
            state: "ice", 
            location: water[playerId].location
          });
          firebase.database().ref(`water/${key}ice3`).set({
            x: attackWater.x, 
            y: attackWater.y + 1, 
            useable: false, 
            id: playerId + "ice3", 
            state: "ice", 
            location: water[playerId].location
          });
          firebase.database().ref(`water/${key}ice4`).set({
            x: attackWater.x, 
            y: attackWater.y - 1, 
            useable: false, 
            id: playerId + "ice4", 
            state: "ice", 
            location: water[playerId].location
          });
          myWater = 0;
          cooldown = 2;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
      if(myAttackIdx < 16 && myMoveId == 1 && shotTorrent)
      {
        const key = playerId;
        if(mouseTile.x > attackWater.x)
        {
          attackWater.x += 1;
        }
        if(mouseTile.x < attackWater.x)
        {
          attackWater.x -= 1;
        }
        if(mouseTile.y > attackWater.y)
        {
          attackWater.y += 1;
        }
        if(mouseTile.y < attackWater.y)
        {
          attackWater.y -= 1;
        }
        const waterRef = firebase.database().ref(`water/${key}`);
        waterRef.update({
          x: attackWater.x, 
          y: attackWater.y, 
          useable: false, 
          id: playerId
        })
        myAttackIdx++;
        let playerToAttack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === attackWater.x && characterState.y === attackWater.y && characterState.location === water[playerId].location)
          {
            playerToAttack = key;
          }
        })
        Object.keys(fire).forEach((key) => {
          const fireToPutOut = fire[key];
          if(fireToPutOut.x === attackWater.x && fireToPutOut.y === attackWater.y && fireToPutOut.location === water[playerId].location)
          {
            firebase.database().ref(`fire/${key}`).remove();
          }
        })
        if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
        {
          myAttackIdx = 16;
          playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
          var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
        }
        if(myAttackIdx == 16)
        {
          firebase.database().ref(`water/${key}`).remove();
          myWater = 0;
          shotTorrent = false;
          cooldown = 4;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
      if(myAttackIdx < 16 && myMoveId == 1 && !shotTorrent)
      {
        for(let i in playerTorrent)
        {
          playerTorrent[i].x = players[playerId].x + torrentPos[playerTorrent[i].i].x;
          playerTorrent[i].y = players[playerId].y + torrentPos[playerTorrent[i].i].y;
          playerTorrent[i].i++;
          if(playerTorrent[i].i > 11)
          {
            playerTorrent[i].i = 0;
          }
          const waterRef = firebase.database().ref(`water/${playerId+i}`);
          waterRef.update({
            x: playerTorrent[i].x, 
            y: playerTorrent[i].y, 
            location: myLocation
          })
          let playerToAttack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === playerTorrent[i].x && characterState.y === playerTorrent[i].y && characterState.location === myLocation)
            {
              playerToAttack = key;
            }
          })
          Object.keys(fire).forEach((key) => {
            const fireToPutOut = fire[key];
            if(fireToPutOut.x === playerTorrent[i].x && fireToPutOut.y === playerTorrent[i].y && fireToPutOut.location === myLocation)
            {
              firebase.database().ref(`fire/${key}`).remove();
            }
          })
          if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
          {
            playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
            var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            let lastX = players[playerToAttack].x;
            let lastY = players[playerToAttack].y;
            playerToAttackRef.update({
              x: players[playerToAttack].x + (players[playerToAttack].x > players[playerId].x ? 1 : -1), 
              y: players[playerToAttack].y + (players[playerToAttack].y > players[playerId].y ? 1 : -1), 
              health: players[playerToAttack].health - damage
            })
            if(isSolid(players[playerToAttack].x, players[playerToAttack].y, earthBlock))
            {
              playerToAttackRef.update({
                x: lastX, 
                y: lastY
              })
            }
          }
        }
      }
      if(myAttackIdx < 16 && myMoveId == 3)
      {
        for(let i in playerTorrent)
        {
          playerTorrent[i].x = players[playerId].x + torrentPos[playerTorrent[i].i].x;
          playerTorrent[i].y = players[playerId].y + torrentPos[playerTorrent[i].i].y;
          const waterRef = firebase.database().ref(`water/${playerId+i}`);
          waterRef.update({
            x: playerTorrent[i].x, 
            y: playerTorrent[i].y, 
            location: myLocation
          })
          let playerToAttack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === playerTorrent[i].x && characterState.y === playerTorrent[i].y && characterState.location === water[playerId + i].location)
            {
              playerToAttack = key;
            }
          })
          Object.keys(fire).forEach((key) => {
            const fireToPutOut = fire[key];
            if(fireToPutOut.x === playerTorrent[i].x && fireToPutOut.y === playerTorrent[i].y && fireToPutOut.location === water[playerId+i].location)
            {
              firebase.database().ref(`fire/${key}`).remove();
            }
          })
          if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
          {
            playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
            var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            let lastX = players[playerToAttack].x;
            let lastY = players[playerToAttack].y;
            playerToAttackRef.update({
              x: players[playerToAttack].x + (players[playerToAttack].x > players[playerId].x ? 1 : -1), 
              y: players[playerToAttack].y + (players[playerToAttack].y > players[playerId].y ? 1 : -1), 
              health: players[playerToAttack].health - damage
            })
            if(isSolid(players[playerToAttack].x, players[playerToAttack].y, earthBlock))
            {
              playerToAttackRef.update({
                x: lastX, 
                y: lastY
              })
            }
          }
        }
        for(let i in octopusArms)
        {
          octopusArms[i].x = players[playerId].x + octopusPos[i].x;
          octopusArms[i].y = players[playerId].y + octopusPos[i].y;
          const waterRef = firebase.database().ref(`water/${playerId+"octo"+i}`);
          waterRef.update({
            x: octopusArms[i].x, 
            y: octopusArms[i].y, 
            location: myLocation
          })
          let playerToAttack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === octopusArms[i].x && characterState.y === octopusArms[i].y && characterState.location === water[playerId+"octo"+i].location)
            {
              playerToAttack = key;
            }
          })
          Object.keys(fire).forEach((key) => {
            const fireToPutOut = fire[key];
            if(fireToPutOut.x === octopusArms[i].x && fireToPutOut.y === octopusArms[i].y && fireToPutOut.location === water[playerId+"octo"+i].location)
            {
              firebase.database().ref(`fire/${key}`).remove();
            }
          })
          if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
          {
            playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
            var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            let lastX = players[playerToAttack].x;
            let lastY = players[playerToAttack].y;
            playerToAttackRef.update({
              x: players[playerToAttack].x + (players[playerToAttack].x > players[playerId].x ? 1 : -1), 
              y: players[playerToAttack].y + (players[playerToAttack].y > players[playerId].y ? 1 : -1), 
              health: players[playerToAttack].health - damage
            })
            if(isSolid(players[playerToAttack].x, players[playerToAttack].y, earthBlock))
            {
              playerToAttackRef.update({
                x: lastX, 
                y: lastY
              })
            }
          }
        }
      }
      if(myAttackIdx < 16 && myMoveId == 5)
      {
        waterArms[0] = {x: players[playerId].x + currentDir.x + currentDir.y, y: players[playerId].y + currentDir.y + currentDir.x};
        waterArms[1] = {x: players[playerId].x + currentDir.x - currentDir.y, y: players[playerId].y + currentDir.y - currentDir.x};
        waterArms[2] = {x: players[playerId].x + (currentDir.x + currentDir.y) * 2, y: players[playerId].y + (currentDir.y + currentDir.x) * 2};
        waterArms[3] = {x: players[playerId].x + (currentDir.x - currentDir.y) * 2, y: players[playerId].y + (currentDir.y - currentDir.x) * 2};
        waterArms[4] = {x: players[playerId].x + ((currentDir.x + currentDir.y) * 2) + currentDir.x, y: players[playerId].y + ((currentDir.y + currentDir.x) * 2) + currentDir.y};
        waterArms[5] = {x: players[playerId].x + ((currentDir.x - currentDir.y) * 2) + currentDir.x, y: players[playerId].y + ((currentDir.y - currentDir.x) * 2) + currentDir.y};
        waterArms[6] = {x: players[playerId].x + ((currentDir.x + currentDir.y) * 2) + currentDir.x + currentDir.x, y: players[playerId].y + ((currentDir.y + currentDir.x) * 2) + currentDir.y + currentDir.y};
        waterArms[7] = {x: players[playerId].x + ((currentDir.x - currentDir.y) * 2) + currentDir.x + currentDir.x, y: players[playerId].y + ((currentDir.y - currentDir.x) * 2) + currentDir.y + currentDir.y};
        for (var i = 0; i < 8; i++) {
          const waterRef = firebase.database().ref(`water/${playerId+"arms"+i}`);
          waterRef.update({
            x: waterArms[i].x, 
            y: waterArms[i].y, 
            location: myLocation
          })
        }
      }
      if(friendbend != null && myMoveId == 7)
      {
        myAttackIdx++;
        if(myAttackIdx == 16)
        {
          friendbend = null;
          cooldown = 6;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
    }
    if(myBending == "Air")
    {
      if(myAttackIdx < 16 && myMoveId == 0)
      {
        let playerToAttack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === attackAirVaccum.x && characterState.y === attackAirVaccum.y && characterState.location === myLocation)
          {
            playerToAttack = key;
          }
        })
        if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
        {
          playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
          var damage = randomFromArray([0, 0, 0, 0, 1, 1, 1, 1, 1, 1]);
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
        }
      }
      if(myAttackIdx < 16 && myMoveId == 5)
      {
        let pos = {x: tornado[playerId].x, y: tornado[playerId].y};
        if(mouseTile.x > pos.x)
        {
          pos.x += 1;
        }
        if(mouseTile.x < tornado[playerId].x)
        {
          pos.x -= 1;
        }
        if(mouseTile.y > tornado[playerId].y)
        {
          pos.y += 1;
        }
        if(mouseTile.y < tornado[playerId].y)
        {
          pos.y -= 1;
        }
        const key = playerId;
        const tornadoRef = firebase.database().ref(`tornado/${key}`);
        tornadoRef.update({
          x: pos.x, 
          y: pos.y, 
          useable: false, 
          id: playerId
        })
      }
      {
        Object.keys(wind).forEach((key) => {
          const theWind = wind[key];
          const windRef = firebase.database().ref(`wind/${key}`);
          if(theWind.useable)
          {
            windRef.update({
              x: theWind.x + theWind.direction.x, 
              y: theWind.y + theWind.direction.y
            })
          }
          if(isSolid(theWind.x, theWind.y, earthBlock))
          {
            windRef.remove();
          }
        })
      }
    }
    if(myBending == "Earth")
    {
      if(myMoveId == 6 && lava[playerId+"torrent"] != null && shotEncase != null)
      {
        if(mouseTile.x > shotEncase.x)
        {
          shotEncase.x += 1;
        }
        if(mouseTile.x < shotEncase.x)
        {
          shotEncase.x -= 1;
        }
        if(mouseTile.y > shotEncase.y)
        {
          shotEncase.y += 1;
        }
        if(mouseTile.y < shotEncase.y)
        {
          shotEncase.y -= 1;
        }
        firebase.database().ref("lava/" + playerId+"torrent").update({
          x: shotEncase.x, 
          y: shotEncase.y, 
          location: myLocation
        });
        let playerToAttack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === shotEncase.x && characterState.y === shotEncase.y && characterState.location === myLocation)
          {
            playerToAttack = key;
          }
        })
        if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead)
        {
          playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
          var damage = randomFromArray([1, 1, 1, 2]);
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
          firebase.database().ref("lava/" + playerId+"torrent").remove();
          firebase.database().ref(`earth-block/${playerId}encase`).set({
            x: shotEncase.x, 
            y: shotEncase.y, 
            useable: false, 
            dis: true, 
            id: playerId + "encase", 
            location: myLocation
          });
          firebase.database().ref(`earth-block/${playerId}encase1`).set({
            x: shotEncase.x + 1, 
            y: shotEncase.y, 
            useable: false, 
            dis: true, 
            id: playerId + "encase1", 
            location: myLocation
          });
          firebase.database().ref(`earth-block/${playerId}encase2`).set({
            x: shotEncase.x - 1, 
            y: shotEncase.y, 
            useable: false, 
            dis: true, 
            id: playerId + "encase2", 
            location: myLocation
          });
          firebase.database().ref(`earth-block/${playerId}encase3`).set({
            x: shotEncase.x, 
            y: shotEncase.y + 1, 
            useable: false, 
            dis: true, 
            id: playerId + "encase3", 
            location: myLocation
          });
          firebase.database().ref(`earth-block/${playerId}encase4`).set({
            x: shotEncase.x, 
            y: shotEncase.y - 1, 
            useable: false, 
            dis: true, 
            id: playerId + "encase4", 
            location: myLocation
          });
          cooldown = 5;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
    }
    {
      Object.keys(airSlice).forEach((key) => {
        const theSlice = airSlice[key];
        const airSliceRef = firebase.database().ref(`air-slice/${key}`);
        if(theSlice.player == playerId)
        {
          airSliceRef.update({
            x: theSlice.x + theSlice.direction.x, 
            y: theSlice.y + theSlice.direction.y
          })
          if(isSolid(theSlice.x, theSlice.y, earthBlock) || isWater(theSlice.x, theSlice.y, water))
          {
            airSliceRef.remove();
          }
          Object.keys(players).forEach((key) => {
            const thePlayer = players[key];
            const thisPlayerRef = firebase.database().ref(`players/${key}`);
            if(theSlice.x === thePlayer.x && theSlice.y === thePlayer.y && theSlice.location === thePlayer.location)
            {
              if(!isSolid(thePlayer.x + theSlice.direction.x, thePlayer.y + theSlice.direction.y, earthBlock))
              {
                thisPlayerRef.update({
                  health: thePlayer.health - 1
                });
              }
            }
          })
        }
      })
    }
    {
      Object.keys(fireball).forEach((key) => {
        const theBall = fireball[key];
        const fireballRef = firebase.database().ref(`fireball/${key}`);
        if(theBall.player == playerId)
        {
          fireballRef.update({
            x: theBall.x + theBall.direction.x, 
            y: theBall.y + theBall.direction.y
          })
          if(isSolid(theBall.x, theBall.y, earthBlock) || isWater(theBall.x, theBall.y, water))
          {
            fireballRef.remove();
          }
          Object.keys(players).forEach((key) => {
            const thePlayer = players[key];
            const thisPlayerRef = firebase.database().ref(`players/${key}`);
            if(theBall.x === thePlayer.x && theBall.y === thePlayer.y && theBall.location === thePlayer.location)
            {
              if(!isSolid(thePlayer.x + theBall.direction.x, thePlayer.y + theBall.direction.y, earthBlock))
              {
                thisPlayerRef.update({
                  health: thePlayer.health - 1
                });
              }
            }
          })
        }
      })
    }
    Object.keys(fire).forEach((key) => {
      const theFire = fire[key];
      if(theFire.x == players[playerId].x && theFire.y == players[playerId].y && theFire.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 0, 0, 1, 1, 1, 1, 1]);
        if(theFire.id.includes(playerId) && theFire.protect != null) damage = 0;
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    Object.keys(explosion).forEach((key) => {
      const theExplosion = explosion[key];
      if(distanceBetween({x: theExplosion.x, y: theExplosion.y}, {x: players[playerId].x, y: players[playerId].y}) < 4 && theExplosion.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = 3 - distanceBetween({x: theExplosion.x, y: theExplosion.y}, {x: players[playerId].x, y: players[playerId].y});
        damage -= randomFromArray([1, 2, 2]);
        if(damage < 0) damage = 0;
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    Object.keys(sand).forEach((key) => {
      const theSand = sand[key];
      if(theSand.x == players[playerId].x && theSand.y == players[playerId].y && theSand.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 1, 1, 1, 1]);
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    Object.keys(lava).forEach((key) => {
      const theLava = lava[key];
      if(theLava.x == players[playerId].x && theLava.y == players[playerId].y && theLava.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    Object.keys(earthCrawl).forEach((key) => {
      const theLava = earthCrawl[key];
      if(theLava.x == players[playerId].x && theLava.y == players[playerId].y && theLava.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 0, 0, 1, 1, 1, 1]);
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    Object.keys(lightning).forEach((key) => {
      const theLightning = lightning[key];
      const date = new Date();
      if(theLightning.x == players[playerId].x && theLightning.y == players[playerId].y && !redirected && theLightning.location == myLocation)
      {
        redirect = true;
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
        redDam = damage;
        me.update({
          health: players[playerId].health - damage
        })
        setTimeout(() => {
          redirect = false;
          redirected = false;
        }, 1000);
      }
    })

    Object.keys(tornado).forEach((key) => {
      const theTornado = tornado[key];
      if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: theTornado.x, y: theTornado.y}) < 4 && theTornado.id != playerId && theTornado.location == myLocation)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        me.update({
          x: players[playerId].x + (theTornado.x > players[playerId].x ? 1 : -1), 
          y: players[playerId].y + (theTornado.y > players[playerId].y ? 1 : -1), 
          health: players[playerId].health - damage
        })
      }
    })

    //repeat
    setTimeout(() => {
      fourthSecondLoop();
    }, 250);
  }
  function eighthSecondLoop() {
    Object.keys(combust).forEach((key) => {
      const theCombust = combust[key];
      const combustRef = firebase.database().ref(`combust/${key}`);
      if(theCombust.player == playerId)
      {
        combustRef.update({
          x: theCombust.x + theCombust.direction.x, 
          y: theCombust.y + theCombust.direction.y
        })
        if(isSolid(theCombust.x, theCombust.y, earthBlock))
        {
          combustRef.update({
            x: theCombust.x - theCombust.direction.x, 
            y: theCombust.y - theCombust.direction.y
          })
          let explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x, 
            y: theCombust.y - theCombust.direction.y, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x + 1, 
            y: theCombust.y - theCombust.direction.y, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x - 1, 
            y: theCombust.y - theCombust.direction.y, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x, 
            y: theCombust.y - theCombust.direction.y + 1, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x, 
            y: theCombust.y - theCombust.direction.y - 1, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x + 1, 
            y: theCombust.y - theCombust.direction.y + 1, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x - 1, 
            y: theCombust.y - theCombust.direction.y + 1, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x + 1, 
            y: theCombust.y - theCombust.direction.y - 1, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x - 1, 
            y: theCombust.y - theCombust.direction.y - 1, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x + 2, 
            y: theCombust.y - theCombust.direction.y, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x - 2, 
            y: theCombust.y - theCombust.direction.y, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x, 
            y: theCombust.y - theCombust.direction.y + 2, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
          explodeRef.set({
            x: theCombust.x - theCombust.direction.x, 
            y: theCombust.y - theCombust.direction.y - 2, 
            useable: true, 
            id: playerId + ExplodeId, 
            location: myLocation
          })
          ExplodeId++;
          cooldown = 7;
          coolDown.innerText = "Cooldown: " + cooldown;
          combustRef.remove();
        }
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(theCombust.x === thePlayer.x && theCombust.y === thePlayer.y && theCombust.location === thePlayer.location)
          {
            let explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x, 
              y: theCombust.y, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x + 1, 
              y: theCombust.y, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x - 1, 
              y: theCombust.y, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x, 
              y: theCombust.y + 1, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x, 
              y: theCombust.y - 1, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x + 1, 
              y: theCombust.y + 1, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x - 1, 
              y: theCombust.y + 1, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x + 1, 
              y: theCombust.y - 1, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x - 1, 
              y: theCombust.y - 1, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x + 2, 
              y: theCombust.y, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x - 2, 
              y: theCombust.y, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x, 
              y: theCombust.y + 2, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
            explodeRef.set({
              x: theCombust.x, 
              y: theCombust.y - 2, 
              useable: true, 
              id: playerId + ExplodeId, 
              location: myLocation
            })
            ExplodeId++;
            cooldown = 7;
            coolDown.innerText = "Cooldown: " + cooldown;
            combustRef.remove();
          }
        })
      }
    })
    //repeat
    setTimeout(() => {
      eighthSecondLoop();
    }, 125);
  }
  function tickLoop() {
    for(let x in waterElements)
    {
      if(water[x] != null) waterElements[x].querySelector(".Water_sprite").setAttribute("data-location", water[x].location == myLocation ? "some" : "none");
    }
    for(let x in redZoneElements)
    {
      if(redZone[x] != null) 
      {
        redZoneElements[x].querySelector(".RedZone_sprite").setAttribute("data-location", redZone[x].location == myLocation ? "some" : "none");
        redZoneElements[x].setAttribute("data-location", redZone[x].location == myLocation ? "some" : "none");
      }
    }
    for(let x in fireElements)
    {
      if(fire[x] != null) fireElements[x].querySelector(".Fire_sprite").setAttribute("data-location", fire[x].location == myLocation ? "some" : "none");
    }
    for(let x in fireballElements)
    {
      if(fireball[x] != null) fireballElements[x].querySelector(".Fireball_sprite").setAttribute("data-location", fireball[x].location == myLocation ? "some" : "none");
    }
    for(let x in lightningElements)
    {
      if(lightning[x] != null) lightningElements[x].querySelector(".Lightning_sprite").setAttribute("data-location", lightning[x].location == myLocation ? "some" : "none");
    }
    for(let x in explosionElements)
    {
      if(explosion[x] != null) explosionElements[x].querySelector(".Explosion_sprite").setAttribute("data-location", explosion[x].location == myLocation ? "some" : "none");
    }
    for(let x in combustElements)
    {
      if(combust[x] != null) combustElements[x].querySelector(".Combust_sprite").setAttribute("data-location", combust[x].location == myLocation ? "some" : "none");
    }
    for(let x in windElements)
    {
      if(wind[x] != null) windElements[x].querySelector(".Wind_sprite").setAttribute("data-location", wind[x].location == myLocation ? "some" : "none");
    }
    for(let x in airSliceElements)
    {
      if(airSlice[x] != null) airSliceElements[x].querySelector(".AirSlice_sprite").setAttribute("data-location", airSlice[x].location == myLocation ? "some" : "none");
    }
    for(let x in tornadoElements)
    {
      if(tornado[x] != null) tornadoElements[x].querySelector(".Tornado_sprite").setAttribute("data-location", tornado[x].location == myLocation ? "some" : "none");
    }
    for(let x in projectionElements)
    {
      if(projection[x] != null) projectionElements[x].querySelector(".Projection_sprite").setAttribute("data-location", projection[x].location == myLocation ? "some" : "none");
    }
    for(let x in airVaccumElements)
    {
      if(airVaccum[x] != null) airVaccumElements[x].querySelector(".AirVaccum_sprite").setAttribute("data-location", airVaccum[x].location == myLocation ? "some" : "none");
    }
    for(let x in earthBlockElements)
    {
      if(earthBlock[x] != null) earthBlockElements[x].querySelector(".EarthBlock_sprite").setAttribute("data-location", earthBlock[x].location == myLocation ? "some" : "none");
    }
    for(let x in rockElements)
    {
      if(rock[x] != null) rockElements[x].querySelector(".Rock_sprite").setAttribute("data-location", rock[x].location == myLocation ? "some" : "none");
    }
    for(let x in lavaElements)
    {
      if(lava[x] != null) lavaElements[x].querySelector(".Lava_sprite").setAttribute("data-location", lava[x].location == myLocation ? "some" : "none");
    }
    for(let x in sandElements)
    {
      if(sand[x] != null) sandElements[x].querySelector(".Sand_sprite").setAttribute("data-location", sand[x].location == myLocation ? "some" : "none");
    }
    for(let x in earthCrawlElements)
    {
      if(earthCrawl[x] != null) earthCrawlElements[x].querySelector(".EarthCrawl_sprite").setAttribute("data-location", earthCrawl[x].location == myLocation ? "some" : "none");
    }
    if(players[playerId] != null) {
      if(players[playerId].health <= 0) {
        cooldown = 1;
        playerRef.update({
          isDead: true
        })
      }
    }
    if(myBending == "Air")
    {
      if(myAttackIdx < 16 && myMoveId == 0)
      {
        const key = playerId;
        if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, mouseTile) < 5)
        {
          attackAirVaccum.x = mouseTile.x;
          attackAirVaccum.y = mouseTile.y;
        }
        const airVaccumRef = firebase.database().ref(`air-vaccum/${key}`);
        airVaccumRef.update({
          x: attackAirVaccum.x, 
          y: attackAirVaccum.y, 
          useable: false, 
          id: playerId, 
          location: myLocation
        })
      }
      if(myAttackIdx < 16 && myMoveId == 7)
      {
        const key = playerId;
        projectionSelf.x = mouseTile.x;
        projectionSelf.y = mouseTile.y;
        const airVaccumRef = firebase.database().ref(`projection/${key}`);
        airVaccumRef.update({
          x: projectionSelf.x, 
          y: projectionSelf.y, 
          location: myLocation
        })
      }
      Object.keys(wind).forEach((key) => {
        const theWind = wind[key];
        const windRef = firebase.database().ref(`wind/${key}`);
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(theWind.x === thePlayer.x && theWind.y === thePlayer.y && theWind.location == thePlayer.location)
          {
            if(!isSolid(thePlayer.x + theWind.direction.x, thePlayer.y + theWind.direction.y, earthBlock))
            {
              thisPlayerRef.update({
                x: thePlayer.x + theWind.direction.x, 
                y: thePlayer.y + theWind.direction.y
              });
            }
          }
        })
      })
    }
    if(myBending == "Earth")
    {
      if(myAttackIdx < 16 && myMoveId == 4)
      {
        const key = playerId;
        const rockRef = firebase.database().ref(`rock/${key}`);
        rockRef.update({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: false, 
          id: playerId, 
          location: myLocation
        })
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(mouseTile.x === thePlayer.x && mouseTile.y === thePlayer.y && thePlayer.location === myLocation)
          {
            thisPlayerRef.update({
              health: thePlayer.health - 1
            });
            myAttackIdx = 16;
            firebase.database().ref(`rock/${playerId}`).remove();
            cooldown = 3;
            coolDown.innerText = "Cooldown: " + cooldown;
          }
        })
      }
      if(myAttackIdx < 16 && myMoveId == 5)
      {
        const key = playerId;
        const rockRef = firebase.database().ref(`rock/${key}`);
        rockRef.update({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: false, 
          id: playerId, 
          location: myLocation
        })
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(mouseTile.x === thePlayer.x && mouseTile.y === thePlayer.y && thePlayer.location === myLocation)
          {
            thisPlayerRef.update({
              health: thePlayer.health - randomFromArray([1, 1, 1, 1, 1, 1, 1, 1, 1, 2])
            });
            myAttackIdx = 16;
            firebase.database().ref(`rock/${playerId}`).remove();
            cooldown = 3;
            coolDown.innerText = "Cooldown: " + cooldown;
          }
        })
      }
    }
    if(myBending == "Water")
    {
      if(holdingPlayer != null && myMoveId == 5 && waterArms.length > 0)
      {
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(thePlayer.id == holdingPlayer)
          {
            thisPlayerRef.update({
              x: waterArms[6].x, 
              y: waterArms[6].y
            });
            if(currentDir.y != 0)
            {
              thisPlayerRef.update({
                x: waterArms[7].x, 
                y: waterArms[7].y
              });
            }
          }
        })
      }
      if(friendbend != null && myMoveId == 7)
      {
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(thePlayer.id == friendbend)
          {
            thisPlayerRef.update({
              x: mouseTile.x, 
              y: mouseTile.y
            })
          }
        })
      }
    }
    Object.keys(airSlice).forEach((key) => {
      const theSlice = airSlice[key];
      const airSliceRef = firebase.database().ref(`air-slice/${key}`);
      Object.keys(players).forEach((key) => {
        const thePlayer = players[key];
        const thisPlayerRef = firebase.database().ref(`players/${key}`);
        if(theSlice.x === thePlayer.x && theSlice.y === thePlayer.y && airSlice.location === thePlayer.location)
        {
          if(!isSolid(thePlayer.x + theSlice.direction.x, thePlayer.y + theSlice.direction.y, earthBlock))
          {
            thisPlayerRef.update({
              health: thePlayer.health - 1
            });
            airSliceRef.remove();
          }
        }
      })
    })
    Object.keys(fireball).forEach((key) => {
      const theBall = fireball[key];
      const fireballRef = firebase.database().ref(`fireball/${key}`);
      Object.keys(players).forEach((key) => {
        const thePlayer = players[key];
        const thisPlayerRef = firebase.database().ref(`players/${key}`);
        if(theBall.x === thePlayer.x && theBall.y === thePlayer.y && theBall.location === thePlayer.location)
        {
          if(!isSolid(thePlayer.x + theBall.direction.x, thePlayer.y + theBall.direction.y, earthBlock))
          {
            thisPlayerRef.update({
              health: thePlayer.health - 1
            });
            fireballRef.remove();
          }
        }
      })
    })
    let MoveDescList;
    let MoveInstList;
    if(myBending == "Water") MoveDescList = WaterDesc;
    if(myBending == "Air") MoveDescList = AirDesc;
    if(myBending == "Earth") MoveDescList = EarthDesc;
    if(myBending == "Fire") MoveDescList = FireDesc;
    if(myBending == "Water") MoveInstList = WaterInst;
    if(myBending == "Air") MoveInstList = AirInst;
    if(myBending == "Earth") MoveInstList = EarthInst;
    if(myBending == "Fire") MoveInstList = FireInst;
    MoveDesc.innerText = MoveDescList[myMoveId];
    MoveInst.innerText = MoveInstList[myMoveId];
    //repeat
    setTimeout(() => {
      tickLoop();
    }, 1);
  }
  function setupWater(waterRef) {
    if(Object.values(water).length < 1)
    {
      waterRef.update({
        "tl": {x: 3, y: 5, useable: true, id: "tl", state: "water", location: "Arena"}, 
        "tr": {x: 3, y: 9, useable: true, id: "tr", state: "water", location: "Arena"}, 
        "bl": {x: 11, y: 5, useable: true, id: "bl", state: "water", location: "Arena"}, 
        "br": {x: 11, y: 9, useable: true, id: "br", state: "water", location: "Arena"}, 
        "b00": {x: 0, y: 0, useable: true, id: "b00", state: "water", location: "Beach"}, 
        "b01": {x: 0, y: 1, useable: true, id: "b01", state: "water", location: "Beach"}, 
        "b02": {x: 0, y: 2, useable: true, id: "b02", state: "water", location: "Beach"}, 
        "b03": {x: 0, y: 3, useable: true, id: "b03", state: "water", location: "Beach"}, 
        "b04": {x: 0, y: 4, useable: true, id: "b04", state: "water", location: "Beach"}, 
        "b05": {x: 0, y: 5, useable: true, id: "b05", state: "water", location: "Beach"}, 
        "b06": {x: 0, y: 6, useable: true, id: "b06", state: "water", location: "Beach"}, 
        "b07": {x: 0, y: 7, useable: true, id: "b07", state: "water", location: "Beach"}, 
        "b08": {x: 0, y: 8, useable: true, id: "b08", state: "water", location: "Beach"}, 
        "b09": {x: 0, y: 9, useable: true, id: "b09", state: "water", location: "Beach"}, 
        "b010": {x: 0, y: 10, useable: true, id: "b010", state: "water", location: "Beach"}, 
        "b011": {x: 0, y: 11, useable: true, id: "b011", state: "water", location: "Beach"}, 
        "b012": {x: 0, y: 12, useable: true, id: "b012", state: "water", location: "Beach"}, 
        "b10": {x: 1, y: 0, useable: true, id: "b10", state: "water", location: "Beach"}, 
        "b11": {x: 1, y: 1, useable: true, id: "b11", state: "water", location: "Beach"}, 
        "b12": {x: 1, y: 2, useable: true, id: "b12", state: "water", location: "Beach"}, 
        "b13": {x: 1, y: 3, useable: true, id: "b13", state: "water", location: "Beach"}, 
        "b14": {x: 1, y: 4, useable: true, id: "b14", state: "water", location: "Beach"}, 
        "b15": {x: 1, y: 5, useable: true, id: "b15", state: "water", location: "Beach"}, 
        "b16": {x: 1, y: 6, useable: true, id: "b16", state: "water", location: "Beach"}, 
        "b17": {x: 1, y: 7, useable: true, id: "b17", state: "water", location: "Beach"}, 
        "b18": {x: 1, y: 8, useable: true, id: "b18", state: "water", location: "Beach"}, 
        "b19": {x: 1, y: 9, useable: true, id: "b19", state: "water", location: "Beach"}, 
        "b110": {x: 1, y: 10, useable: true, id: "b110", state: "water", location: "Beach"}, 
        "b111": {x: 1, y: 11, useable: true, id: "b111", state: "water", location: "Beach"}, 
        "b112": {x: 1, y: 12, useable: true, id: "b112", state: "water", location: "Beach"}, 
        "b20": {x: 2, y: 0, useable: true, id: "b20", state: "water", location: "Beach"}, 
        "b21": {x: 2, y: 1, useable: true, id: "b21", state: "water", location: "Beach"}, 
        "b22": {x: 2, y: 2, useable: true, id: "b22", state: "water", location: "Beach"}, 
        "b23": {x: 2, y: 3, useable: true, id: "b23", state: "water", location: "Beach"}, 
        "b24": {x: 2, y: 4, useable: true, id: "b24", state: "water", location: "Beach"}, 
        "b25": {x: 2, y: 5, useable: true, id: "b25", state: "water", location: "Beach"}, 
        "b26": {x: 2, y: 6, useable: true, id: "b26", state: "water", location: "Beach"}, 
        "b27": {x: 2, y: 7, useable: true, id: "b27", state: "water", location: "Beach"}, 
        "b28": {x: 2, y: 8, useable: true, id: "b28", state: "water", location: "Beach"}, 
        "b29": {x: 2, y: 9, useable: true, id: "b29", state: "water", location: "Beach"}, 
        "b210": {x: 2, y: 10, useable: true, id: "b210", state: "water", location: "Beach"}, 
        "b211": {x: 2, y: 11, useable: true, id: "b211", state: "water", location: "Beach"}, 
        "b212": {x: 2, y: 12, useable: true, id: "b212", state: "water", location: "Beach"}, 
        "b30": {x: 3, y: 0, useable: true, id: "b30", state: "water", location: "Beach"}, 
        "b31": {x: 3, y: 1, useable: true, id: "b31", state: "water", location: "Beach"}, 
        "b32": {x: 3, y: 2, useable: true, id: "b32", state: "water", location: "Beach"}, 
        "b33": {x: 3, y: 3, useable: true, id: "b33", state: "water", location: "Beach"}, 
        "b34": {x: 3, y: 4, useable: true, id: "b34", state: "water", location: "Beach"}, 
        "b35": {x: 3, y: 5, useable: true, id: "b35", state: "water", location: "Beach"}, 
        "b36": {x: 3, y: 6, useable: true, id: "b36", state: "water", location: "Beach"}, 
        "b37": {x: 3, y: 7, useable: true, id: "b37", state: "water", location: "Beach"}, 
        "b38": {x: 3, y: 8, useable: true, id: "b38", state: "water", location: "Beach"}, 
        "b39": {x: 3, y: 9, useable: true, id: "b39", state: "water", location: "Beach"}, 
        "b310": {x: 3, y: 10, useable: true, id: "b310", state: "water", location: "Beach"}, 
        "b311": {x: 3, y: 11, useable: true, id: "b311", state: "water", location: "Beach"}, 
        "b312": {x: 3, y: 12, useable: true, id: "b312", state: "water", location: "Beach"}, 
        "b40": {x: 4, y: 0, useable: true, id: "b40", state: "water", location: "Beach"}, 
        "b41": {x: 4, y: 1, useable: true, id: "b41", state: "water", location: "Beach"}, 
        "b42": {x: 4, y: 2, useable: true, id: "b42", state: "water", location: "Beach"}, 
        "b43": {x: 4, y: 3, useable: true, id: "b43", state: "water", location: "Beach"}, 
        "b44": {x: 4, y: 4, useable: true, id: "b44", state: "water", location: "Beach"}, 
        "b45": {x: 4, y: 5, useable: true, id: "b45", state: "water", location: "Beach"}, 
        "b46": {x: 4, y: 6, useable: true, id: "b46", state: "water", location: "Beach"}, 
        "b47": {x: 4, y: 7, useable: true, id: "b47", state: "water", location: "Beach"}, 
        "b48": {x: 4, y: 8, useable: true, id: "b48", state: "water", location: "Beach"}, 
        "b49": {x: 4, y: 9, useable: true, id: "b49", state: "water", location: "Beach"}, 
        "b410": {x: 4, y: 10, useable: true, id: "b410", state: "water", location: "Beach"}, 
        "b411": {x: 4, y: 11, useable: true, id: "b411", state: "water", location: "Beach"}, 
        "b412": {x: 4, y: 12, useable: true, id: "b412", state: "water", location: "Beach"}, 
        "b50": {x: 5, y: 0, useable: true, id: "b50", state: "water", location: "Beach"}, 
        "b51": {x: 5, y: 1, useable: true, id: "b51", state: "water", location: "Beach"}, 
        "b52": {x: 5, y: 2, useable: true, id: "b52", state: "water", location: "Beach"}, 
        "b55": {x: 5, y: 5, useable: true, id: "b55", state: "water", location: "Beach"}, 
        "b58": {x: 5, y: 8, useable: true, id: "b58", state: "water", location: "Beach"}, 
        "b511": {x: 5, y: 11, useable: true, id: "b511", state: "water", location: "Beach"}, 
        "b512": {x: 5, y: 12, useable: true, id: "b512", state: "water", location: "Beach"}, 
        "b60": {x: 6, y: 0, useable: true, id: "b60", state: "water", location: "Beach"}, 
        "b612": {x: 6, y: 12, useable: true, id: "b612", state: "water", location: "Beach"}
      })
    }
  }
  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!isSolid(newX, newY, earthBlock) && !players[playerId].isDead && players[playerId].health > 0 && !isIce(newX, newY, water) && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT') {
      if(!(isLava(oldX, oldY, lava) && Math.random() > 0.5) && !isIce(oldX, oldY, water))
      {
        if(!(octopusArms.length > 0 && Math.random() > 0.5))
        {
          if(!(isSand(oldX, oldY, sand) && Math.random() > 0.2))
          {
            //move to the next space
            players[playerId].x = newX;
            players[playerId].y = newY;
            if (xChange === 1) {
              players[playerId].direction = "right";
            }
            if (xChange === -1) {
              players[playerId].direction = "left";
            }
            playerRef.set(players[playerId]);
            Object.keys(wind).forEach((key) => {
              const theWind = wind[key];
              if(theWind.x == players[playerId].x && theWind.y == players[playerId].y && theWind.location == myLocation)
              {
                me = firebase.database().ref("players/" + playerId);
                var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
                me.update({
                  health: players[playerId].health - damage, 
                  x: oldX, 
                  y: oldY
                })
              }
            })
            Object.keys(lightning).forEach((key) => {
              const theLightning = lightning[key];
              if(theLightning.x == players[playerId].x && theLightning.y == players[playerId].y && theLightning.location == myLocation)
              {
                me = firebase.database().ref("players/" + playerId);
                var damage = randomFromArray([1, 2]);
                me.update({
                  health: players[playerId].health - damage
                })
              }
            })
            if(myMoveId == 2 && playerAirShield.length > 0)
            {
              playerAirShield[0] = {x: players[playerId].x + 2, y: players[playerId].y - 1, dir: {x: 1, y: 0}};
              playerAirShield[1] = {x: players[playerId].x + 2, y: players[playerId].y, dir: {x: 1, y: 0}};
              playerAirShield[2] = {x: players[playerId].x + 2, y: players[playerId].y + 1, dir: {x: 1, y: 0}};
              playerAirShield[3] = {x: players[playerId].x + 1, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
              playerAirShield[4] = {x: players[playerId].x, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
              playerAirShield[5] = {x: players[playerId].x - 1, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
              playerAirShield[6] = {x: players[playerId].x - 2, y: players[playerId].y + 1, dir: {x: -1, y: 0}};
              playerAirShield[7] = {x: players[playerId].x - 2, y: players[playerId].y, dir: {x: -1, y: 0}};
              playerAirShield[8] = {x: players[playerId].x - 2, y: players[playerId].y - 1, dir: {x: -1, y: 0}};
              playerAirShield[9] = {x: players[playerId].x - 1, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
              playerAirShield[10] = {x: players[playerId].x, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
              playerAirShield[11] = {x: players[playerId].x + 1, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
              for(let i = 0; i < playerAirShield.length; i++)
              {
                const airRef = firebase.database().ref(`wind/${playerId+i}`);
                airRef.update({
                  x: playerAirShield[i].x, 
                  y: playerAirShield[i].y, 
                  useable: false, 
                  direction: playerAirShield[i].dir, 
                  id: playerId+i, 
                  location: myLocation
                })
              }
            }
          }
        }
      }
    }
    if (isSolid(newX, newY, earthBlock) && !players[playerId].isDead && players[playerId].health > 0 && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT') {
      if(!(isLava(oldX, oldY, lava) && Math.random() > 0.5) && !isIce(oldX, oldY, water))
      {
        if(!(octopusArms.length > 0 && Math.random() > 0.5))
        {
          if(!(isSand(oldX, oldY, sand) && Math.random() > 0.2))
          {
            const mapData = getCurrentMapData();
            if(myLocation == "Arena" && newX == mapData.maxX)
            {
              myLocation = "Desert";
              players[playerId].x = 0;
              playerRef.set(players[playerId]);
              gameContainer.setAttribute("data-location", myLocation);
            } else if(myLocation == "Desert" && newX == -1)
            {
              myLocation = "Arena";
              players[playerId].x = mapData.maxX - 1;
              playerRef.set(players[playerId]);
              gameContainer.setAttribute("data-location", myLocation);
            } else if(myLocation == "Arena" && newX == -1)
            {
              myLocation = "Beach";
              players[playerId].x = mapData.maxX - 1;
              playerRef.set(players[playerId]);
              gameContainer.setAttribute("data-location", myLocation);
            } else if(myLocation == "Beach" && newX == mapData.maxX)
            {
              myLocation = "Arena";
              players[playerId].x = 0;
              playerRef.set(players[playerId]);
              gameContainer.setAttribute("data-location", myLocation);
            }
            playerRef.update({
              location: myLocation
            })
            Object.keys(wind).forEach((key) => {
              const theWind = wind[key];
              if(theWind.x == players[playerId].x && theWind.y == players[playerId].y)
              {
                me = firebase.database().ref("players/" + playerId);
                var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
                me.update({
                  health: players[playerId].health - damage, 
                  x: oldX, 
                  y: oldY
                })
              }
            })
            Object.keys(lightning).forEach((key) => {
              const theLightning = lightning[key];
              if(theLightning.x == players[playerId].x && theLightning.y == players[playerId].y)
              {
                me = firebase.database().ref("players/" + playerId);
                var damage = randomFromArray([1, 2]);
                me.update({
                  health: players[playerId].health - damage
                })
              }
            })
            if(myMoveId == 2 && playerAirShield.length > 0)
            {
              playerAirShield[0] = {x: players[playerId].x + 2, y: players[playerId].y - 1, dir: {x: 1, y: 0}};
              playerAirShield[1] = {x: players[playerId].x + 2, y: players[playerId].y, dir: {x: 1, y: 0}};
              playerAirShield[2] = {x: players[playerId].x + 2, y: players[playerId].y + 1, dir: {x: 1, y: 0}};
              playerAirShield[3] = {x: players[playerId].x + 1, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
              playerAirShield[4] = {x: players[playerId].x, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
              playerAirShield[5] = {x: players[playerId].x - 1, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
              playerAirShield[6] = {x: players[playerId].x - 2, y: players[playerId].y + 1, dir: {x: -1, y: 0}};
              playerAirShield[7] = {x: players[playerId].x - 2, y: players[playerId].y, dir: {x: -1, y: 0}};
              playerAirShield[8] = {x: players[playerId].x - 2, y: players[playerId].y - 1, dir: {x: -1, y: 0}};
              playerAirShield[9] = {x: players[playerId].x - 1, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
              playerAirShield[10] = {x: players[playerId].x, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
              playerAirShield[11] = {x: players[playerId].x + 1, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
              for(let i = 0; i < playerAirShield.length; i++)
              {
                const airRef = firebase.database().ref(`wind/${playerId+i}`);
                airRef.update({
                  x: playerAirShield[i].x, 
                  y: playerAirShield[i].y, 
                  useable: false, 
                  direction: playerAirShield[i].dir, 
                  id: playerId+i
                })
              }
            }
          }
        }
      }
    }
    direction = {x: xChange, y: yChange};
    currentDir = {x: xChange, y: yChange};
    if(myBending == "Fire" && myMoveId == 5 && isFireBreath)
    {
      for(var i = 1; i < 5; i++) {
        let breathRef = firebase.database().ref("fire/" + playerId + FireId);
        if(isSolid(players[playerId].x + currentDir.x * i, players[playerId].y + currentDir.y * i, earthBlock) || isWater(players[playerId].x + currentDir.x * i, players[playerId].y + currentDir.y * i, water)) break;
        breathRef.set({
          x: players[playerId].x + currentDir.x * i, 
          y: players[playerId].y + currentDir.y * i, 
          useable: false, 
          id: playerId + FireId, 
          location: myLocation, 
          protect: true
        });
        FireId++;
      }
      fBID++;
      if(fBID > 50)
      {
        isFireBreath = false;
      }
      cooldown = 3;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    setTimeout(() => {
      direction = null;
    }, 300);
  }
  function handleAttack() {
    if(myWater > 0 && myBending == "Water" && myMoveId == 0 && cooldown == 0)
    {
      //Attack
      attackWater = {x: players[playerId].x, y: players[playerId].y};
      myAttackIdx = 0;
      const waterRef = firebase.database().ref(`water/${playerId}`);
      waterRef.set({
        x: attackWater.x, 
        y: attackWater.y, 
        useable: false, 
        id: playerId, 
        state: "water", 
        location: myLocation
      })
      console.log(myLocation)
    }
    if(myWater > 0 && myBending == "Water" && myMoveId == 4 && cooldown == 0)
    {
      //Attack
      attackWater = {x: players[playerId].x, y: players[playerId].y};
      myAttackIdx = 0;
      const waterRef = firebase.database().ref(`water/${playerId}`);
      waterRef.set({
        x: attackWater.x, 
        y: attackWater.y, 
        useable: false, 
        id: playerId, 
        state: "water", 
        location: myLocation
      })
    }
    if(myWater > 0 && myBending == "Water" && myMoveId == 5 && cooldown == 0)
    {
      waterArms[0] = {x: players[playerId].x + currentDir.x + currentDir.y, y: players[playerId].y + currentDir.y + currentDir.x};
      waterArms[1] = {x: players[playerId].x + currentDir.x - currentDir.y, y: players[playerId].y + currentDir.y - currentDir.x};
      waterArms[2] = {x: players[playerId].x + (currentDir.x + currentDir.y) * 2, y: players[playerId].y + (currentDir.y + currentDir.x) * 2};
      waterArms[3] = {x: players[playerId].x + (currentDir.x - currentDir.y) * 2, y: players[playerId].y + (currentDir.y - currentDir.x) * 2};
      waterArms[4] = {x: players[playerId].x + ((currentDir.x + currentDir.y) * 2) + currentDir.x, y: players[playerId].y + ((currentDir.y + currentDir.x) * 2) + currentDir.y};
      waterArms[5] = {x: players[playerId].x + ((currentDir.x - currentDir.y) * 2) + currentDir.x, y: players[playerId].y + ((currentDir.y - currentDir.x) * 2) + currentDir.y};
      waterArms[6] = {x: players[playerId].x + ((currentDir.x + currentDir.y) * 2) + currentDir.x + currentDir.x, y: players[playerId].y + ((currentDir.y + currentDir.x) * 2) + currentDir.y + currentDir.y};
      waterArms[7] = {x: players[playerId].x + ((currentDir.x - currentDir.y) * 2) + currentDir.x + currentDir.x, y: players[playerId].y + ((currentDir.y - currentDir.x) * 2) + currentDir.y + currentDir.y};
      for (var i = 0; i < 8; i++) {
        const waterRef = firebase.database().ref(`water/${playerId+"arms"+i}`);
        waterRef.set({
          x: waterArms[i].x, 
          y: waterArms[i].y, 
          useable: false, 
          id: playerId+"arms"+i, 
          state: "water", 
          location: myLocation
        })
      }
      myAttackIdx = 0;
      myWater = 0;
    } else if(myBending == "Water" && myMoveId == 5 && waterArms.length > 0)
    {
      myAttackIdx = 16;
      cooldown = 5;
      coolDown.innerText = "Cooldown: " + cooldown;
      for(let i in waterArms)
      {
        firebase.database().ref(`water/${playerId+"arms"+i}`).remove();
      }
      waterArms = [];
    }
    if(playerTorrent.length == 0 && myWater > 0 && myBending == "Water" && myMoveId == 1 && cooldown == 0)
    {
      //Attack
      playerTorrent[0] = {x: players[playerId].x + 2, y: players[playerId].y + 1, i: 1};
      playerTorrent[1] = {x: players[playerId].x + 2, y: players[playerId].y, i: 0};
      playerTorrent[2] = {x: players[playerId].x - 2, y: players[playerId].y - 1, i: 7};
      playerTorrent[3] = {x: players[playerId].x - 2, y: players[playerId].y, i: 6};
      playerTorrent[4] = {x: players[playerId].x + 1, y: players[playerId].y + 2, i: 2};
      playerTorrent[5] = {x: players[playerId].x, y: players[playerId].y + 2, i: 3};
      playerTorrent[6] = {x: players[playerId].x - 1, y: players[playerId].y + 2, i: 4};
      playerTorrent[7] = {x: players[playerId].x - 2, y: players[playerId].y + 1, i: 5};
      myAttackIdx = 0;
      for(let i = 0; i < playerTorrent.length; i++)
      {
        const waterRef = firebase.database().ref(`water/${playerId+i}`);
        waterRef.set({
          x: playerTorrent[i].x, 
          y: playerTorrent[i].y, 
          useable: false, 
          id: playerId+i, 
          state: "water", 
          location: myLocation
        })
      }
    } else if(playerTorrent.length > 0 && myBending == "Water" && myMoveId == 1)
    {
      myAttackIdx = 16;
      cooldown = 3;
      coolDown.innerText = "Cooldown: " + cooldown;
      for(let i in playerTorrent)
      {
        firebase.database().ref(`water/${playerId+i}`).remove();
      }
      playerTorrent = [];
    }
    if(playerTorrent.length == 0 && myWater > 0 && myBending == "Water" && myMoveId == 3 && cooldown == 0)
    {
      //Attack
      playerTorrent[0] = {x: players[playerId].x + 2, y: players[playerId].y + 1, i: 1};
      playerTorrent[1] = {x: players[playerId].x + 2, y: players[playerId].y, i: 0};
      playerTorrent[2] = {x: players[playerId].x - 2, y: players[playerId].y - 1, i: 7};
      playerTorrent[3] = {x: players[playerId].x - 2, y: players[playerId].y, i: 6};
      playerTorrent[4] = {x: players[playerId].x + 1, y: players[playerId].y + 2, i: 2};
      playerTorrent[5] = {x: players[playerId].x, y: players[playerId].y + 2, i: 3};
      playerTorrent[6] = {x: players[playerId].x - 1, y: players[playerId].y + 2, i: 4};
      playerTorrent[7] = {x: players[playerId].x - 2, y: players[playerId].y + 1, i: 5};
      playerTorrent[8] = {x: players[playerId].x - 1, y: players[playerId].y - 2, i: 8};
      playerTorrent[9] = {x: players[playerId].x, y: players[playerId].y - 2, i: 9};
      playerTorrent[10] = {x: players[playerId].x + 1, y: players[playerId].y - 2, i: 10};
      playerTorrent[11] = {x: players[playerId].x + 2, y: players[playerId].y - 1, i: 11};
      myAttackIdx = 0;
      for(let i = 0; i < playerTorrent.length; i++)
      {
        const waterRef = firebase.database().ref(`water/${playerId+i}`);
        waterRef.set({
          x: playerTorrent[i].x, 
          y: playerTorrent[i].y, 
          useable: false, 
          id: playerId+i, 
          state: "water", 
          location: myLocation
        })
      }
      octopusArms[0] = {x: players[playerId].x + 3, y: players[playerId].y + 1};
      octopusArms[1] = {x: players[playerId].x + 2, y: players[playerId].y + 3};
      octopusArms[2] = {x: players[playerId].x - 1, y: players[playerId].y + 3};
      octopusArms[3] = {x: players[playerId].x - 3, y: players[playerId].y + 2};
      octopusArms[4] = {x: players[playerId].x - 3, y: players[playerId].y - 1};
      octopusArms[5] = {x: players[playerId].x - 2, y: players[playerId].y - 3};
      octopusArms[6] = {x: players[playerId].x + 1, y: players[playerId].y - 3};
      octopusArms[7] = {x: players[playerId].x + 3, y: players[playerId].y - 2};
      for(let i = 0; i < octopusArms.length; i++)
      {
        const waterRef = firebase.database().ref(`water/${playerId+"octo"+i}`);
        waterRef.set({
          x: octopusArms[i].x, 
          y: octopusArms[i].y, 
          useable: false, 
          id: playerId+"octo"+i, 
          state: "water", 
          location: myLocation
        })
      }
    } else if(playerTorrent.length > 0 && myBending == "Water" && myMoveId == 3)
    {
      myAttackIdx = 16;
      cooldown = 4;
      coolDown.innerText = "Cooldown: " + cooldown;
      for(let i in playerTorrent)
      {
        firebase.database().ref(`water/${playerId+i}`).remove();
      }
      for(let i in octopusArms)
      {
        firebase.database().ref(`water/${playerId+"octo"+i}`).remove();
      }
      playerTorrent = [];
      octopusArms = [];
    }
    if(myAir > 0 && myBending == "Air" && myMoveId == 0 && cooldown == 0)
    {
      //Attack
      attackAirVaccum = {x: players[playerId].x, y: players[playerId].y};
      myAttackIdx = 0;
      const airVaccumRef = firebase.database().ref(`air-vaccum/${playerId}`);
      airVaccumRef.set({
        x: attackAirVaccum.x, 
        y: attackAirVaccum.y, 
        useable: false, 
        id: playerId, 
        location: myLocation
      })
      myAir = 0;
    } else if(myAir < 1 && myBending == "Air" && myMoveId == 0)
    {
      //Attack
      myAttackIdx = 16;
      attackAirVaccum = null;
      firebase.database().ref(`air-vaccum/${playerId}`).remove();
      cooldown = 4;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Air" && myMoveId == 7 && cooldown == 0 && projectionSelf == null)
    {
      //Attack
      projectionSelf = {x: players[playerId].x, y: players[playerId].y};
      myAttackIdx = 0;
      const projectionSelfRef = firebase.database().ref(`projection/${playerId}`);
      projectionSelfRef.set({
        x: projectionSelf.x, 
        y: projectionSelf.y, 
        useable: false, 
        id: playerId, 
        location: myLocation
      })
    } else if(myBending == "Air" && myMoveId == 7)
    {
      //Attack
      myAttackIdx = 16;
      projectionSelf = null;
      firebase.database().ref(`projection/${playerId}`).remove();
      cooldown = 2;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myAir > 0 && myBending == "Air" && myMoveId == 2 && cooldown == 0)
    {
      //Attack
      playerAirShield[0] = {x: players[playerId].x + 2, y: players[playerId].y - 1, dir: {x: 1, y: 0}};
      playerAirShield[1] = {x: players[playerId].x + 2, y: players[playerId].y, dir: {x: 1, y: 0}};
      playerAirShield[2] = {x: players[playerId].x + 2, y: players[playerId].y + 1, dir: {x: 1, y: 0}};
      playerAirShield[3] = {x: players[playerId].x + 1, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
      playerAirShield[4] = {x: players[playerId].x, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
      playerAirShield[5] = {x: players[playerId].x - 1, y: players[playerId].y + 2, dir: {x: 0, y: 1}};
      playerAirShield[6] = {x: players[playerId].x - 2, y: players[playerId].y + 1, dir: {x: -1, y: 0}};
      playerAirShield[7] = {x: players[playerId].x - 2, y: players[playerId].y, dir: {x: -1, y: 0}};
      playerAirShield[8] = {x: players[playerId].x - 2, y: players[playerId].y - 1, dir: {x: -1, y: 0}};
      playerAirShield[9] = {x: players[playerId].x - 1, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
      playerAirShield[10] = {x: players[playerId].x, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
      playerAirShield[11] = {x: players[playerId].x + 1, y: players[playerId].y - 2, dir: {x: 0, y: -1}};
      for(let i = 0; i < playerAirShield.length; i++)
      {
        const airRef = firebase.database().ref(`wind/${playerId+i}`);
        airRef.set({
          x: playerAirShield[i].x, 
          y: playerAirShield[i].y, 
          useable: false, 
          direction: playerAirShield[i].dir, 
          id: playerId+i, 
          location: myLocation
        })
      }
      myAir = 0;
    } else if(myAir < 1 && myBending == "Air" && myMoveId == 2)
    {
      //Attack
      for(let i in playerAirShield)
      {
        firebase.database().ref(`wind/${playerId+i}`).remove();
      }
      playerAirShield = [];
      cooldown = 4;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myAir > 0 && myBending == "Air" && direction != null && myMoveId == 1 && cooldown == 0)
    {
      //Attack
      for(var i = 1; i < 2; i++) {
        const windRef = firebase.database().ref(`wind/${playerId + windId}`);
        if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), earthBlock))
        {
          windRef.set({
            x: players[playerId].x + (direction.x * i), 
            y: players[playerId].y + (direction.y * i), 
            useable: true, 
            direction, 
            id: playerId + windId, 
            location: myLocation
          })
          windId++;
        }
      }
      for(var i = 1; i < 2; i++) {
        const windRef = firebase.database().ref(`wind/${playerId + windId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x, earthBlock))
        {
          windRef.set({
            x: players[playerId].x + (direction.x * i) + direction.y, 
            y: players[playerId].y + (direction.y * i) + direction.x, 
            useable: true, 
            direction, 
            id: playerId + windId, 
            location: myLocation
          })
          windId++;
        }
      }
      for(var i = 1; i < 2; i++) {
        const windRef = firebase.database().ref(`wind/${playerId + windId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x, earthBlock))
        {
          windRef.set({
            x: players[playerId].x + (direction.x * i) - direction.y, 
            y: players[playerId].y + (direction.y * i) - direction.x, 
            useable: true, 
            direction, 
            id: playerId + windId, 
            location: myLocation
          })
          windId++;
        }
      }
      for(var i = 1; i < 2; i++) {
        const windRef = firebase.database().ref(`wind/${playerId + windId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2, earthBlock))
        {
          windRef.set({
            x: players[playerId].x + (direction.x * i) + direction.y * 2, 
            y: players[playerId].y + (direction.y * i) + direction.x * 2, 
            useable: true, 
            direction, 
            id: playerId + windId, 
            location: myLocation
          })
          windId++;
        }
      }
      for(var i = 1; i < 2; i++) {
        const windRef = firebase.database().ref(`wind/${playerId + windId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2, earthBlock))
        {
          windRef.set({
            x: players[playerId].x + (direction.x * i) - direction.y * 2, 
            y: players[playerId].y + (direction.y * i) - direction.x * 2, 
            useable: true, 
            direction, 
            id: playerId + windId, 
            location: myLocation
          })
          windId++;
        }
      }
      myAir = 0;
      cooldown = 1;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Air" && myMoveId == 6 && cooldown == 0)
    {
      //Attack
      Object.keys(players).forEach((key) => {
        const thePlayer = players[key];
        const thisPlayerRef = firebase.database().ref(`players/${key}`);
        if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: thePlayer.x, y: thePlayer.y}) < 4 && thePlayer.id != playerId && !isSolid(thePlayer.x + (thePlayer.x > players[playerId].x ? 1 : -1), thePlayer.y + (thePlayer.y > players[playerId].y ? 1 : -1), earthBlock) && thePlayer.location == myLocation)
        {
          thisPlayerRef.update({
            x: thePlayer.x + (thePlayer.x > players[playerId].x ? 1 : -1), 
            y: thePlayer.y + (thePlayer.y > players[playerId].y ? 1 : -1)
          });
        }
      })
      shockTimes++;
      if(shockTimes % 4 == 0) cooldown = 1;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Fire" && direction != null && myMoveId == 0 && cooldown == 0)
    {
      let blocked = false;
      for(var i = 1; i < 6; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), earthBlock) && !isWater(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), water) && !isAir(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), wind))
        {
          fireRef.set({
            x: players[playerId].x + (direction.x * i), 
            y: players[playerId].y + (direction.y * i), 
            useable: false, 
            id: playerId + fireRowId, 
            location: myLocation
          })
          fireRowId++;
        } else {
          if(i < 2)
          {
            blocked = true;
          }
          break;
        }
      }
      let sblocked = false;
      for(var i = 2; i < 6; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x, earthBlock) && !isWater(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x, water) && !isAir(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x, wind) && !blocked)
        {
          fireRef.set({
            x: players[playerId].x + (direction.x * i) + direction.y, 
            y: players[playerId].y + (direction.y * i) + direction.x, 
            useable: false, 
            id: playerId + fireRowId, 
            location: myLocation
          })
          fireRowId++;
        } else {
          if(i < 4)
          {
            sblocked = true;
          }
          break;
        }
      }
      for(var i = 2; i < 6; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x, earthBlock) && !isWater(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x, water) && !isAir(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x, wind) && !blocked)
        {
          fireRef.set({
            x: players[playerId].x + (direction.x * i) - direction.y, 
            y: players[playerId].y + (direction.y * i) - direction.x, 
            useable: false, 
            id: playerId + fireRowId, 
            location: myLocation
          })
          fireRowId++;
        } else {
          if(i < 4)
          {
            sblocked = true;
          }
          break;
        }
      }
      for(var i = 4; i < 5; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2, earthBlock) && !isWater(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2, water) && !isAir(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2, wind) && !sblocked)
        {
          fireRef.set({
            x: players[playerId].x + (direction.x * i) + direction.y * 2, 
            y: players[playerId].y + (direction.y * i) + direction.x * 2, 
            useable: false, 
            id: playerId + fireRowId, 
            location: myLocation
          })
          fireRowId++;
        } else {
          break;
        }
      }
      for(var i = 4; i < 5; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2, earthBlock) && !isWater(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2, water) && !isAir(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2, wind) && !sblocked)
        {
          fireRef.set({
            x: players[playerId].x + (direction.x * i) - direction.y * 2, 
            y: players[playerId].y + (direction.y * i) - direction.x * 2, 
            useable: false, 
            id: playerId + fireRowId, 
            location: myLocation
          })
          fireRowId++;
        } else {
          break;
        }
      }
      cooldown = 6;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Fire" && direction != null && myMoveId == 3 && cooldown == 0)
    {
      let ballRef = firebase.database().ref("fireball/" + playerId + FireId);
      ballRef.set({
        x: players[playerId].x + direction.x, 
        y: players[playerId].y + direction.y, 
        direction, 
        useable: false, 
        id: playerId + FireId, 
        player: playerId, 
        location: myLocation
      });
      FireId++;
      cooldown = 1;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Fire" && direction != null && myMoveId == 7 && cooldown == 0)
    {
      let ballRef = firebase.database().ref("combust/" + playerId + FireId);
      ballRef.set({
        x: players[playerId].x + direction.x, 
        y: players[playerId].y + direction.y, 
        direction, 
        useable: false, 
        id: playerId + FireId, 
        player: playerId, 
        location: myLocation
      });
      FireId++;
      cooldown = 5;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Fire" && myMoveId == 5 && cooldown == 0 && !isFireBreath)
    {
      for(var i = 1; i < 5; i++) {
        let breathRef = firebase.database().ref("fire/" + playerId + FireId);
        if(isSolid(players[playerId].x + currentDir.x * i, players[playerId].y + currentDir.y * i, earthBlock) || isWater(players[playerId].x + currentDir.x * i, players[playerId].y + currentDir.y * i, water)) break
        breathRef.set({
          x: players[playerId].x + currentDir.x * i, 
          y: players[playerId].y + currentDir.y * i, 
          useable: false, 
          id: playerId + FireId, 
          location: myLocation
        });
        FireId++;
      }
      fBID = 0;
      isFireBreath = true;
    } else if(myBending == "Fire" && myMoveId == 5 && isFireBreath) {
      isFireBreath = false;
    }
    if(myBending == "Air" && direction != null && myMoveId == 4 && cooldown == 0)
    {
      let sliceRef = firebase.database().ref("air-slice/" + playerId + windId);
      sliceRef.set({
        x: players[playerId].x + direction.x, 
        y: players[playerId].y + direction.y, 
        direction, 
        useable: false, 
        id: playerId + windId, 
        player: playerId, 
        location: myLocation
      });
      windId++;
      cooldown = 1;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Earth" && direction != null && myMoveId == 2 && cooldown == 0)
    {
      for(var i = 1; i < 6; i++) {
        const earthRef = firebase.database().ref(`earth-block/${playerId + EarthBlockId}`);
        if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), earthBlock) && !isWater(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), water) && !isAir(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), wind) && EarthBlockCount < 12)
        {
          console.log("test")
          earthRef.set({
            x: players[playerId].x + (direction.x * i), 
            y: players[playerId].y + (direction.y * i), 
            useable: false, 
            id: playerId + EarthBlockId, 
            location: myLocation
          })
          let Attack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === players[playerId].x + (direction.x * i) && characterState.y === players[playerId].y + (direction.y * i) && characterState.location === myLocation)
            {
              Attack = key;
            }
          })
          if(Attack != null && !players[playerId].isDead && !players[Attack].isDead)
          {
            playerToAttackRef = firebase.database().ref("players/" + Attack);
            var damage = 1;
            playerToAttackRef.update({
              health: players[Attack].health - damage
            })
          }
          EarthBlockId++;
          EarthBlockCount++;
        } else {
          break;
        }
      }
      cooldown = 3;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Air" && cooldown == 0 && myMoveId == 3 && players[playerId].cloak == "none")
    {
      playerRef.update({
        cloak: "wind"
      })
    } else if(myBending == "Air" && cooldown == 0 && myMoveId == 3 && players[playerId].cloak == "wind")
    {
      playerRef.update({
        cloak: "none"
      })
      cooldown = 2;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
  }
  function switchMove() {
    if(myBending == "Air")
    {
      if(myMoveId == 0 && attackAirVaccum != null)
      {
        myAttackIdx = 16;
        attackAirVaccum = null;
        firebase.database().ref(`air-vaccum/${playerId}`).remove();
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 7 && projectionSelf != null)
      {
        myAttackIdx = 16;
        projectionSelf = null;
        firebase.database().ref(`projection/${playerId}`).remove();
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 2 && playerAirShield.length > 0)
      {
        for(let i in playerAirShield)
        {
          firebase.database().ref(`wind/${playerId+i}`).remove();
        }
        playerAirShield = [];
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 3)
      {
        playerRef.update({
          cloak: "none"
        })
      }
      if(myMoveId == 5)
      {
        myAttackIdx = 16;
      }
    }
    if(myBending == "Earth")
    {
      if(myMoveId == 4 && rock[playerId] != null)
      {
        myAttackIdx = 16;
        firebase.database().ref(`rock/${playerId}`).remove();
        cooldown = 3;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 5 && rock[playerId] != null)
      {
        myAttackIdx = 16;
        firebase.database().ref(`rock/${playerId}`).remove();
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
    }
    if(myBending == "Fire")
    {
      if(myMoveId == 5)
      {
        isFireBreath = false;
      }
    }
    if(myBending == "Water")
    {
      if(myMoveId == 0 && myAttackIdx < 16)
      {
        firebase.database().ref(`water/${playerId}`).remove();
        myAttackIdx = 16;
        myWater = 0;
        cooldown = 1;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 1 && playerTorrent.length > 0)
      {
        myAttackIdx = 16;
        cooldown = 3;
        coolDown.innerText = "Cooldown: " + cooldown;
        for(let i in playerTorrent)
        {
          firebase.database().ref(`water/${playerId+i}`).remove();
        }
        playerTorrent = [];
      }
      if(myMoveId == 1 && shotTorrent)
      {
        firebase.database().ref(`water/${playerId}`).remove();
        myAttackIdx = 16;
        myWater = 0;
        cooldown = 3;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 3 && playerTorrent.length > 0)
      {
        myAttackIdx = 16;
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
        for(let i in playerTorrent)
        {
          firebase.database().ref(`water/${playerId+i}`).remove();
        }
        for(let i in octopusArms)
        {
          firebase.database().ref(`water/${playerId+"octo"+i}`).remove();
        }
        playerTorrent = [];
        octopusArms = [];
      }
      if(myMoveId == 4 && myAttackIdx < 16)
      {
        myAttackIdx = 16;
        let key = playerId;
        firebase.database().ref(`water/${key}`).update({
          state: "ice"
        });
        firebase.database().ref(`water/${key}ice1`).set({
          x: attackWater.x + 1, 
          y: attackWater.y, 
          useable: false, 
          id: playerId + "ice1", 
          state: "ice", 
          location: myLocation
        });
        firebase.database().ref(`water/${key}ice2`).set({
          x: attackWater.x - 1, 
          y: attackWater.y, 
          useable: false, 
          id: playerId + "ice2", 
          state: "ice", 
          location: myLocation
        });
        firebase.database().ref(`water/${key}ice3`).set({
          x: attackWater.x, 
          y: attackWater.y + 1, 
          useable: false, 
          id: playerId + "ice3", 
          state: "ice", 
          location: myLocation
        });
        firebase.database().ref(`water/${key}ice4`).set({
          x: attackWater.x, 
          y: attackWater.y - 1, 
          useable: false, 
          id: playerId + "ice4", 
          state: "ice", 
          location: myLocation
        });
        myWater = 0;
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myMoveId == 5 && waterArms.length > 0)
      {
        myAttackIdx = 16;
        cooldown = 5;
        coolDown.innerText = "Cooldown: " + cooldown;
        for(let i in waterArms)
        {
          firebase.database().ref(`water/${playerId+"arms"+i}`).remove();
        }
        waterArms = [];
      }
      if(myMoveId == 5 && holdingPlayer != null)
      {
        holdingPlayer = null;
      }
      if(myMoveId == 7 && friendbend != null)
      {
        friendbend = null;
      }
    }
    myMoveId++;
    let moveList;
    let xpList;
    if(myBending == "Water") moveList = WaterMoves;
    if(myBending == "Air") moveList = AirMoves;
    if(myBending == "Earth") moveList = EarthMoves;
    if(myBending == "Fire") moveList = FireMoves;
    if(myBending == "Water") xpList = WaterXP;
    if(myBending == "Air") xpList = AirXP;
    if(myBending == "Earth") xpList = EarthXP;
    if(myBending == "Fire") xpList = FireXP;
    for(var t = 0; t < 10; t++) {
      if(xpList[myMoveId] > experience) myMoveId++;
    }
    if(myMoveId > moveList.length - 1) myMoveId = 0;
    for(var t = 0; t < 10; t++) {
      if(xpList[myMoveId] > experience) myMoveId++;
    }
    currentMove.innerText = "Current Move: " + moveList[myMoveId];
  }
  function setMove(move) {
    switchMove();
    myMoveId = move;
    let moveList;
    if(myBending == "Water") moveList = WaterMoves;
    if(myBending == "Air") moveList = AirMoves;
    if(myBending == "Earth") moveList = EarthMoves;
    if(myBending == "Fire") moveList = FireMoves;
    if(myMoveId > moveList.length - 1) myMoveId = 0;
    currentMove.innerText = "Current Move: " + moveList[myMoveId];
  }
  function regenLoop() {
    if(players[playerId] != null)
    {
      if(!players[playerId].isDead && players[playerId].health < 5)
      {
        playerRef.update({
          health: players[playerId].health + 1
        })
      }
      if(myBending == "Earth")
      {
        EarthBlockCount--;
        if(EarthBlockCount < 0) EarthBlockCount = 0;
      }
    }
    experience++;
    setTimeout(() => {
      regenLoop();
    }, 30000);
  }
  function HoldPlayer() {
    if(myBending == "Water" && waterArms.length > 0 && holdingPlayer == null)
    {
      Object.keys(players).forEach((key) => {
        const thePlayer = players[key];
        const thisPlayerRef = firebase.database().ref(`players/${key}`);
        if(distanceBetween({x: waterArms[7].x, y: waterArms[7].y}, {x: thePlayer.x, y: thePlayer.y}) <= 2 && myLocation == thePlayer.location)
        {
          thisPlayerRef.update({
            x: waterArms[6].x, 
            y: waterArms[6].y
          });
          holdingPlayer = thePlayer.id;
        }
        if(distanceBetween({x: waterArms[6].x, y: waterArms[6].y}, {x: thePlayer.x, y: thePlayer.y}) <= 2 && myLocation == thePlayer.location)
        {
          thisPlayerRef.update({
            x: waterArms[6].x, 
            y: waterArms[6].y
          });
          holdingPlayer = thePlayer.id;
        }
      })
    } else if(myBending == "Water" && waterArms.length > 0 && holdingPlayer != null){
      holdingPlayer = null;
    }
  }
  function bindCurrentMove() {
    if(document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT') {
      bindMove = 1;
      setTimeout(() => {
        bindMove = null;
      }, 2000)
    }
  }
  function setBind(num) {
    if(document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT' && bindMove != null) {
      bindMove = num;
      myBinds[bindMove] = myMoveId;
      bindMove = null;
    }
  }
  function attemptBindMove(move){
    if(bindMove != null)
    {
      setBind(move);
    } else {
      setMove(myBinds[move]);
    }
  }

  function initGame() {

    new DoubleKeyPressListener("ArrowUp", "KeyW", () => handleArrowPress(0, -1))
    new DoubleKeyPressListener("ArrowDown", "KeyS", () => handleArrowPress(0, 1))
    new DoubleKeyPressListener("ArrowLeft", "KeyA", () => handleArrowPress(-1, 0))
    new DoubleKeyPressListener("ArrowRight", "KeyD", () => handleArrowPress(1, 0))
    new KeyPressListener("Space", () => handleAttack())
    new KeyPressListener("KeyQ", () => switchMove())
    new KeyPressListener("KeyB", () => bindCurrentMove())
    new KeyPressListener("Digit1", () => attemptBindMove(0))
    new KeyPressListener("Digit2", () => attemptBindMove(1))
    new KeyPressListener("Digit3", () => attemptBindMove(2))
    new KeyPressListener("ShiftLeft", () => HoldPlayer())

    const allPlayersRef = firebase.database().ref(`players`);
    const allWaterRef = firebase.database().ref(`water`);
    const allAirVaccumRef = firebase.database().ref(`air-vaccum`);
    const allWindRef = firebase.database().ref(`wind`);
    const allFireballRef = firebase.database().ref(`fireball`);
    const allAirSliceRef = firebase.database().ref(`air-slice`);
    const allEarthBlockRef = firebase.database().ref(`earth-block`);
    const allRockRef = firebase.database().ref(`rock`);
    const allFireRef = firebase.database().ref(`fire`);
    const allLavaRef = firebase.database().ref(`lava`);
    const allSandRef = firebase.database().ref(`sand`);
    const allLightningRef = firebase.database().ref(`lightning`);
    const allTornadoRef = firebase.database().ref(`tornado`);
    const allExplosionRef = firebase.database().ref(`explosion`);
    const allProjectionRef = firebase.database().ref(`projection`);
    const allCombustRef = firebase.database().ref(`combust`);
    const allEarthCrawlRef = firebase.database().ref(`earth-crawl`);
    const allRedZoneRef = firebase.database().ref(`red-zone`);

    allPlayersRef.on("value", (snapshot) => {
      //change
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.setAttribute("data-color", characterState.color);
        el.setAttribute("data-direction", characterState.direction);
        el.querySelector(".Character_health_bar").setAttribute("data-health", characterState.health);
        el.setAttribute("data-cloak", characterState.cloak);
        if(characterState.location != myLocation)
        {
          el.setAttribute("data-cloak", "wind");
        }
        const left = 16 * characterState.x + "px";
        const top = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //new nodes
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character", "grid-cell");
      if(addedPlayer.id === playerId)
      {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
        <div class="Character_shadow grid-cell"></div>
        <div class="Character_sprite grid-cell"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
        </div>
        <div class="Character_you-arrow"></div>
        <div class="Character_health_bar"></div>
      `);


      playerElements[addedPlayer.id] = characterElement;
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      characterElement.setAttribute("data-color", addedPlayer.color);
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      characterElement.setAttribute("data-cloak", addedPlayer.cloak);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
    })
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })

    allWaterRef.on("value", (snapshot) => {
      water = snapshot.val() || {};
      Object.keys(water).forEach((key) => {
        const waterState = water[key];
        let el = waterElements[waterState.id];
        el.querySelector(".Water_sprite").setAttribute("data-state", waterState.state);
        if(waterState.state == "ice")
        {
          setTimeout(() => {
            firebase.database().ref(`water/${waterState.id}`).remove();
          }, 5000);
        }
        const left = 16 * waterState.x + "px";
        const top = 16 * waterState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allWaterRef.on("child_added", (snapshot) => {
      const water = snapshot.val();
      const key = water.id;
      water[key] = true;

      // Create the DOM Element
      const waterElement = document.createElement("div");
      waterElement.classList.add("Water", "grid-cell");
      waterElement.innerHTML = `
        <div class="Water_sprite grid-cell"></div>
      `;
      waterElement.querySelector(".Water_sprite").setAttribute("data-state", water.state);
      // Position the Element
      const left = 16 * water.x + "px";
      const top = 16 * water.y + "px";
      waterElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      //Add onclick
      if(water.useable)
      {
        waterElement.querySelector(".Water_sprite").addEventListener("click", () => {
          if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: water.x, y: water.y}) <= 2 && myBending == "Water" && players[playerId].location == water.location)
          {
            myWater = 1;
          }
        })
      }

      // Keep a reference for removal later and add to DOM
      waterElements[key] = waterElement;
      gameContainer.appendChild(waterElement);

      if(water.delete) {
        setTimeout(() => {
          firebase.database().ref(`water/${water.id}`).remove();
        }, 1000);
      }
    })
    allWaterRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(waterElements[keyToRemove]);
      delete waterElements[keyToRemove];
    })

    allFireRef.on("value", (snapshot) => {
      fire = snapshot.val() || {};
      Object.keys(fire).forEach((key) => {
        const fireState = fire[key];
        let el = fireElements[fireState.id];
        const left = 16 * fireState.x + "px";
        const top = 16 * fireState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allFireRef.on("child_added", (snapshot) => {
      const fire = snapshot.val();
      const key = fire.id;
      fire[key] = true;

      // Create the DOM Element
      const fireElement = document.createElement("div");
      fireElement.classList.add("Fire", "grid-cell");
      fireElement.innerHTML = `
        <div class="Fire_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * fire.x + "px";
      const top = 16 * fire.y + "px";
      fireElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      fireElements[key] = fireElement;
      gameContainer.appendChild(fireElement);

      setTimeout(() => {
        firebase.database().ref(`fire/${fire.id}`).remove();
      }, 2000);
    })
    allFireRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(fireElements[keyToRemove]);
      delete fireElements[keyToRemove];
    })

    allAirVaccumRef.on("value", (snapshot) => {
      airVaccum = snapshot.val() || {};
      Object.keys(airVaccum).forEach((key) => {
        const airVaccumState = airVaccum[key];
        let el = airVaccumElements[airVaccumState.id];
        const left = 16 * airVaccumState.x + "px";
        const top = 16 * airVaccumState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allAirVaccumRef.on("child_added", (snapshot) => {
      const airVaccum = snapshot.val();
      const key = airVaccum.id;
      airVaccum[key] = true;

      // Create the DOM Element
      const airVaccumElement = document.createElement("div");
      airVaccumElement.classList.add("AirVaccum", "grid-cell");
      airVaccumElement.innerHTML = `
        <div class="AirVaccum_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * airVaccum.x + "px";
      const top = 16 * airVaccum.y + "px";
      airVaccumElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      airVaccumElements[key] = airVaccumElement;
      gameContainer.appendChild(airVaccumElement);
    })
    allAirVaccumRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(airVaccumElements[keyToRemove]);
      delete airVaccumElements[keyToRemove];
    })

    allWindRef.on("value", (snapshot) => {
      wind = snapshot.val() || {};
      Object.keys(wind).forEach((key) => {
        const windState = wind[key];
        let el = windElements[windState.id];
        const left = 16 * windState.x + "px";
        const top = 16 * windState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allWindRef.on("child_added", (snapshot) => {
      const wind = snapshot.val();
      const key = wind.id;
      wind[key] = true;

      // Create the DOM Element
      const windElement = document.createElement("div");
      windElement.classList.add("Wind", "grid-cell");
      windElement.innerHTML = `
        <div class="Wind_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * wind.x + "px";
      const top = 16 * wind.y + "px";
      windElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      windElements[key] = windElement;
      gameContainer.appendChild(windElement);
    })
    allWindRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(windElements[keyToRemove]);
      delete windElements[keyToRemove];
    })

    allExplosionRef.on("value", (snapshot) => {
      explosion = snapshot.val() || {};
      Object.keys(explosion).forEach((key) => {
        const explosionState = explosion[key];
        let el = explosionElements[explosionState.id];
        const left = 16 * explosionState.x + "px";
        const top = 16 * explosionState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allExplosionRef.on("child_added", (snapshot) => {
      const explosion = snapshot.val();
      const key = explosion.id;
      explosion[key] = true;

      // Create the DOM Element
      const explosionElement = document.createElement("div");
      explosionElement.classList.add("Explosion", "grid-cell");
      explosionElement.innerHTML = `
        <div class="Explosion_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * explosion.x + "px";
      const top = 16 * explosion.y + "px";
      explosionElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      explosionElements[key] = explosionElement;
      gameContainer.appendChild(explosionElement);

      Object.keys(earthBlock).forEach((key) => {
        let current = earthBlock[key];
        if(current.x == explosion.x && current.y == explosion.y && Math.random() < 0.5)
        {
          firebase.database().ref("earth-block/" + current.id).remove();
        }
      })

      setTimeout(() => {
        firebase.database().ref(`explosion/${explosion.id}`).remove();
      }, 250);
    })
    allExplosionRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(explosionElements[keyToRemove]);
      delete explosionElements[keyToRemove];
    })

    allCombustRef.on("value", (snapshot) => {
      combust = snapshot.val() || {};
      Object.keys(combust).forEach((key) => {
        const combustState = combust[key];
        let el = combustElements[combustState.id];
        const left = 16 * combustState.x + "px";
        const top = 16 * combustState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allCombustRef.on("child_added", (snapshot) => {
      const combust = snapshot.val();
      const key = combust.id;
      combust[key] = true;

      // Create the DOM Element
      const combustElement = document.createElement("div");
      combustElement.classList.add("Combust", "grid-cell");
      combustElement.innerHTML = `
        <div class="Combust_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * combust.x + "px";
      const top = 16 * combust.y + "px";
      combustElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      combustElements[key] = combustElement;
      gameContainer.appendChild(combustElement);
    })
    allCombustRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(combustElements[keyToRemove]);
      delete combustElements[keyToRemove];
    })

    allSandRef.on("value", (snapshot) => {
      sand = snapshot.val() || {};
      Object.keys(sand).forEach((key) => {
        const sandState = sand[key];
        let el = sandElements[sandState.id];
        const left = 16 * sandState.x + "px";
        const top = 16 * sandState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allSandRef.on("child_added", (snapshot) => {
      const sand = snapshot.val();
      const key = sand.id;
      sand[key] = true;

      // Create the DOM Element
      const sandElement = document.createElement("div");
      sandElement.classList.add("Sand", "grid-cell");
      sandElement.innerHTML = `
        <div class="Sand_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * sand.x + "px";
      const top = 16 * sand.y + "px";
      sandElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      sandElements[key] = sandElement;
      gameContainer.appendChild(sandElement);

      setTimeout(() => {
        firebase.database().ref(`sand/${sand.id}`).remove();
      }, 6000);
    })
    allSandRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(sandElements[keyToRemove]);
      delete sandElements[keyToRemove];
    })

    allTornadoRef.on("value", (snapshot) => {
      tornado = snapshot.val() || {};
      Object.keys(tornado).forEach((key) => {
        const tornadoState = tornado[key];
        let el = tornadoElements[tornadoState.id];
        const left = 16 * tornadoState.x + "px";
        const top = 16 * tornadoState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allTornadoRef.on("child_added", (snapshot) => {
      const tornado = snapshot.val();
      const key = tornado.id;
      tornado[key] = true;

      // Create the DOM Element
      const tornadoElement = document.createElement("div");
      tornadoElement.classList.add("Tornado", "grid-cell");
      tornadoElement.innerHTML = `
        <div class="Tornado_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * tornado.x + "px";
      const top = 16 * tornado.y + "px";
      tornadoElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      tornadoElements[key] = tornadoElement;
      gameContainer.appendChild(tornadoElement);
    })
    allTornadoRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(tornadoElements[keyToRemove]);
      delete tornadoElements[keyToRemove];
    })

    allProjectionRef.on("value", (snapshot) => {
      projection = snapshot.val() || {};
      Object.keys(projection).forEach((key) => {
        const projectionState = projection[key];
        let el = projectionElements[projectionState.id];
        const left = 16 * projectionState.x + "px";
        const top = 16 * projectionState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allProjectionRef.on("child_added", (snapshot) => {
      const projection = snapshot.val();
      const key = projection.id;
      projection[key] = true;

      // Create the DOM Element
      const projectionElement = document.createElement("div");
      projectionElement.classList.add("Projection", "grid-cell");
      projectionElement.innerHTML = `
        <div class="Projection_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * projection.x + "px";
      const top = 16 * projection.y + "px";
      projectionElement.querySelector(".Projection_sprite").setAttribute("data-direction", players[playerId].direction);
      projectionElement.querySelector(".Projection_sprite").setAttribute("data-color", players[playerId].color);
      projectionElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      projectionElements[key] = projectionElement;
      gameContainer.appendChild(projectionElement);
    })
    allProjectionRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(projectionElements[keyToRemove]);
      delete projectionElements[keyToRemove];
    })

    allRockRef.on("value", (snapshot) => {
      rock = snapshot.val() || {};
      Object.keys(rock).forEach((key) => {
        const rockState = rock[key];
        let el = rockElements[rockState.id];
        const left = 16 * rockState.x + "px";
        const top = 16 * rockState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allRockRef.on("child_added", (snapshot) => {
      const rock = snapshot.val();
      const key = rock.id;
      rock[key] = true;

      // Create the DOM Element
      const rockElement = document.createElement("div");
      rockElement.classList.add("Rock", "grid-cell");
      rockElement.innerHTML = `
        <div class="Rock_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * rock.x + "px";
      const top = 16 * rock.y + "px";
      rockElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      rockElement.querySelector(".Rock_sprite").setAttribute("data-type", rock.type);

      // Keep a reference for removal later and add to DOM
      rockElements[key] = rockElement;
      gameContainer.appendChild(rockElement);
    })
    allRockRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(rockElements[keyToRemove]);
      delete rockElements[keyToRemove];
    })

    allFireballRef.on("value", (snapshot) => {
      fireball = snapshot.val() || {};
      Object.keys(fireball).forEach((key) => {
        const fireballState = fireball[key];
        let el = fireballElements[fireballState.id];
        const left = 16 * fireballState.x + "px";
        const top = 16 * fireballState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allFireballRef.on("child_added", (snapshot) => {
      const fireball = snapshot.val();
      const key = fireball.id;
      fireball[key] = true;

      // Create the DOM Element
      const fireballElement = document.createElement("div");
      fireballElement.classList.add("Fireball", "grid-cell");
      fireballElement.innerHTML = `
        <div class="Fireball_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * fireball.x + "px";
      const top = 16 * fireball.y + "px";
      fireballElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      fireballElements[key] = fireballElement;
      gameContainer.appendChild(fireballElement);
    })
    allFireballRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(fireballElements[keyToRemove]);
      delete fireballElements[keyToRemove];
    })

    allAirSliceRef.on("value", (snapshot) => {
      airSlice = snapshot.val() || {};
      Object.keys(airSlice).forEach((key) => {
        const airSliceState = airSlice[key];
        let el = airSliceElements[airSliceState.id];
        const left = 16 * airSliceState.x + "px";
        const top = 16 * airSliceState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allAirSliceRef.on("child_added", (snapshot) => {
      const airSlice = snapshot.val();
      const key = airSlice.id;
      airSlice[key] = true;

      // Create the DOM Element
      const airSliceElement = document.createElement("div");
      airSliceElement.classList.add("AirSlice", "grid-cell");
      airSliceElement.innerHTML = `
        <div class="AirSlice_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * airSlice.x + "px";
      const top = 16 * airSlice.y + "px";
      airSliceElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      airSliceElements[key] = airSliceElement;
      gameContainer.appendChild(airSliceElement);
    })
    allAirSliceRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(airSliceElements[keyToRemove]);
      delete airSliceElements[keyToRemove];
    })

    allLavaRef.on("value", (snapshot) => {
      lava = snapshot.val() || {};
      Object.keys(lava).forEach((key) => {
        const lavaState = lava[key];
        let el = lavaElements[lavaState.id];
        const left = 16 * lavaState.x + "px";
        const top = 16 * lavaState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allLavaRef.on("child_added", (snapshot) => {
      const lava = snapshot.val();
      const key = lava.id;
      lava[key] = true;

      // Create the DOM Element
      const lavaElement = document.createElement("div");
      lavaElement.classList.add("Lava", "grid-cell");
      lavaElement.innerHTML = `
        <div class="Lava_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * lava.x + "px";
      const top = 16 * lava.y + "px";
      lavaElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      lavaElements[key] = lavaElement;
      gameContainer.appendChild(lavaElement);

      setTimeout(() => {
        firebase.database().ref(`lava/${lava.id}`).remove();
      }, 5000);
    })
    allLavaRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(lavaElements[keyToRemove]);
      delete lavaElements[keyToRemove];
    })

    allEarthCrawlRef.on("value", (snapshot) => {
      earthCrawl = snapshot.val() || {};
      Object.keys(earthCrawl).forEach((key) => {
        const earthCrawlState = earthCrawl[key];
        let el = earthCrawlElements[earthCrawlState.id];
        const left = 16 * earthCrawlState.x + "px";
        const top = 16 * earthCrawlState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allEarthCrawlRef.on("child_added", (snapshot) => {
      const earthCrawl = snapshot.val();
      const key = earthCrawl.id;
      earthCrawl[key] = true;

      // Create the DOM Element
      const earthCrawlElement = document.createElement("div");
      earthCrawlElement.classList.add("EarthCrawl", "grid-cell");
      earthCrawlElement.innerHTML = `
        <div class="EarthCrawl_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * earthCrawl.x + "px";
      const top = 16 * earthCrawl.y + "px";
      earthCrawlElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      earthCrawlElements[key] = earthCrawlElement;
      gameContainer.appendChild(earthCrawlElement);

      setTimeout(() => {
        firebase.database().ref(`earth-crawl/${earthCrawl.id}`).remove();
      }, 5000);
    })
    allEarthCrawlRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(earthCrawlElements[keyToRemove]);
      delete earthCrawlElements[keyToRemove];
    })

    allLightningRef.on("value", (snapshot) => {
      lightning = snapshot.val() || {};
      Object.keys(lightning).forEach((key) => {
        const lightningState = lightning[key];
        let el = lightningElements[lightningState.id];
        const left = 16 * lightningState.x + "px";
        const top = 16 * lightningState.y + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allLightningRef.on("child_added", (snapshot) => {
      const lightning = snapshot.val();
      const key = lightning.id;
      lightning[key] = true;

      // Create the DOM Element
      const lightningElement = document.createElement("div");
      lightningElement.classList.add("Lightning", "grid-cell");
      lightningElement.innerHTML = `
        <div class="Lightning_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * lightning.x + "px";
      const top = 16 * lightning.y + "px";
      lightningElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      lightningElements[key] = lightningElement;
      gameContainer.appendChild(lightningElement);

      setTimeout(() => {
        firebase.database().ref(`lightning/${lightning.id}`).remove();
      }, 1000);
    })
    allLightningRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(lightningElements[keyToRemove]);
      delete lightningElements[keyToRemove]; 
    })

    allEarthBlockRef.on("value", (snapshot) => {
      earthBlock = snapshot.val() || {};
    });
    allEarthBlockRef.on("child_added", (snapshot) => {
      const earthBlock = snapshot.val();
      const key = earthBlock.id;
      earthBlock[key] = true;

      // Create the DOM Element
      const earthBlockElement = document.createElement("div");
      earthBlockElement.classList.add("EarthBlock", "grid-cell");
      earthBlockElement.innerHTML = `
        <div class="EarthBlock_sprite grid-cell" id="EarthBlock"></div>
      `;

      // Position the Element
      const left = 16 * earthBlock.x + "px";
      const top = 16 * earthBlock.y + "px";
      earthBlockElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      earthBlockElement.querySelector(".EarthBlock_sprite").addEventListener("click", () => {
        if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: earthBlock.x, y: earthBlock.y}) <= 3 && myBending == "Earth" && earthBlock.location == myLocation)
        {
          firebase.database().ref(`earth-block/${earthBlock.id}`).remove();
          EarthBlockCount--;
          if(EarthBlockCount < 0) EarthBlockCount = 0;
        }
      })
      if(earthBlock.dis)
      {
        setTimeout(() => {
          firebase.database().ref(`earth-block/${earthBlock.id}`).remove();
        }, 8000);
      }

      // Keep a reference for removal later and add to DOM
      earthBlockElements[key] = earthBlockElement;
      gameContainer.appendChild(earthBlockElement);
    })
    allEarthBlockRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(earthBlockElements[keyToRemove]);
      delete earthBlockElements[keyToRemove];
    })

    allRedZoneRef.on("value", (snapshot) => {
      redZone = snapshot.val() || {};
    });
    allRedZoneRef.on("child_added", (snapshot) => {
      const redZone = snapshot.val();
      const key = redZone.id;
      redZone[key] = true;

      // Create the DOM Element
      const redZoneElement = document.createElement("div");
      redZoneElement.classList.add("RedZone", "grid-cell");
      redZoneElement.innerHTML = `
        <div class="RedZone_sprite grid-cell" id="RedZone"></div>
      `;

      // Position the Element
      const left = 16 * redZone.x + "px";
      const top = 16 * redZone.y + "px";
      redZoneElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      redZoneElements[key] = redZoneElement;
      gameContainer.appendChild(redZoneElement);
    })
    allRedZoneRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(redZoneElements[keyToRemove]);
      delete redZoneElements[keyToRemove];
    })

    playerNameInput.addEventListener("change", (e) => { 
      const newName = e.target.value || createName();
      const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
      const date = new Date();
      chatRef.set({
        message: players[playerId].name + " has renamed to " + newName, 
        time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
        day:  date.getDate()
      })
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      });
      localStorage.setItem("Name", newName);
    })
    playerColorButton.addEventListener("click", () => {
      const mySkinIndex = playerColors.indexOf(players[playerId].color);
      const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
      playerRef.update({
        color: nextColor
      });
    })
    chatSend.addEventListener("click", () => {
      const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
      const date = new Date();
      var inputMessage = chatInput.value;
      chatRef.set({
        message: inputMessage + " | " + players[playerId].name, 
        time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
        day: date.getDate()
      })
      chatInput.value = "";
    })
    const chatRef = firebase.database().ref(`chat`);

    chatRef.on("child_added", (snapshot) => {
      //new nodes
      const addedMessage = snapshot.val();
      const date = new Date();
      if(addedMessage.time >= date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds() && addedMessage.day == date.getDate())
      {
        const messageElement = document.createElement("div");
        messageElement.classList.add("Chat-message");
        messageElement.innerHTML = addedMessage.message;

        chatDisplay.appendChild(messageElement);
      }
    })

    document.querySelector("#up-move").addEventListener("click", () => {
      if(isMobile())
        handleArrowPress(0, -1);
    })
    document.querySelector("#down-move").addEventListener("click", () => {
      if(isMobile())
        handleArrowPress(0, 1)
    })
    document.querySelector("#left-move").addEventListener("click", () => {
      if(isMobile())
        handleArrowPress(-1, 0)
    })
    document.querySelector("#right-move").addEventListener("click", () => {
      if(isMobile())
        handleArrowPress(1, 0)
    })
    document.querySelector("#attack").addEventListener("click", () => handleAttack())

    window.addEventListener('mousemove', (event) => {
      mousePos = {x: event.clientX, y: event.clientY};
      screenDim = {x: window.innerWidth, y: window.innerHeight};
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((mousePos.x - margin.x) / 48), y: Math.floor((mousePos.y - margin.y) / 48)};
      //1919, 977
      if(mouseTile.x > arenaMapData.maxX - 1) mouseTile.x = arenaMapData.maxX - 1;
      if(mouseTile.y > arenaMapData.maxY - 1) mouseTile.y = arenaMapData.maxY - 1;
      if(mouseTile.x < arenaMapData.minX) mouseTile.x = arenaMapData.minX;
      if(mouseTile.y < arenaMapData.minY) mouseTile.y = arenaMapData.minY;
    });
    document.onclick = async function(event) {
      if(event === undefined) event = window.event;
      var target = "target" in event ? event.target : event.srcElement;
      if(myBending == "Air")
      {
        myAir = 1;
      }
      if(myBending == "Air" && myMoveId == 8)
      {
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(mouseTile.x === thePlayer.x && mouseTile.y === thePlayer.y && thePlayer.health < 5 && thePlayer.location === myLocation)
          {
            let thisDamage = randomFromArray([0, 1]);
            firebase.database().ref("players/" + thePlayer.id).update({
              health: players[thePlayer.id].health + thisDamage
            })
            cooldown += 2;
            coolDown.innerText = "Cooldown: " + cooldown;
          }
        })
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 4 && myMoveId == 0 && EarthBlockCount < 12 && cooldown == 0 && !isWater(mouseTile.x, mouseTile.y, water))
      {
        const earthBlockRef = firebase.database().ref(`earth-block/${playerId + EarthBlockId}`);
        earthBlockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + EarthBlockId, 
          location: myLocation 
        })
        let Attack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === mouseTile.x && characterState.y === mouseTile.y && characterState.location === myLocation)
          {
            Attack = key;
          }
        })
        if(Attack != null && !players[playerId].isDead && !players[Attack].isDead)
        {
          myAttackIdx = 16;
          playerToAttackRef = firebase.database().ref("players/" + Attack);
          var damage = 1;
          playerToAttackRef.update({
            health: players[Attack].health - damage
          })
        }
        EarthBlockId++;
        EarthBlockCount++;
        cooldown = 1;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Fire" && myMoveId == 6 && cooldown == 0 && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5)
      {
        let explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x + 1, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x - 1, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x, 
          y: mouseTile.y + 1, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x, 
          y: mouseTile.y - 1, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x + 1, 
          y: mouseTile.y + 1, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x - 1, 
          y: mouseTile.y + 1, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x + 1, 
          y: mouseTile.y - 1, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x - 1, 
          y: mouseTile.y - 1, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x + 2, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x - 2, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x, 
          y: mouseTile.y + 2, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        explodeRef = firebase.database().ref(`explosion/${playerId + ExplodeId}`);
        explodeRef.set({
          x: mouseTile.x, 
          y: mouseTile.y - 2, 
          useable: true, 
          id: playerId + ExplodeId, 
          location: myLocation
        })
        ExplodeId++;
        cooldown = 8;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 7 && myMoveId == 7 && cooldown == 0)
      {
        const sandRef = firebase.database().ref(`sand/${playerId + SandId}`);
        sandRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + SandId, 
          location: myLocation
        })
        SandId++;
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 7 && myMoveId == 3 && cooldown == 0)
      {
        let lavaPos = {x: players[playerId].x, y: players[playerId].y};
        let leng = distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y});
        for (var i = 0; i < leng; i++) {
          if(mouseTile.x > lavaPos.x)
          {
            lavaPos.x += 1;
          }
          if(mouseTile.x < lavaPos.x)
          {
            lavaPos.x -= 1;
          }
          if(mouseTile.y > lavaPos.y)
          {
            lavaPos.y += 1;
          }
          if(mouseTile.y < lavaPos.y)
          {
            lavaPos.y -= 1;
          }
          const lavaRef = firebase.database().ref(`lava/${playerId + LavaId}`);
          lavaRef.set({
            x: lavaPos.x, 
            y: lavaPos.y, 
            useable: true, 
            id: playerId + LavaId, 
            location: myLocation
          })
          LavaId++;
          await delay(150);
        }
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 7 && myMoveId == 8 && cooldown == 0)
      {
        let crawlPos = {x: players[playerId].x, y: players[playerId].y};
        let leng = distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y});
        for (var i = 0; i < leng; i++) {
          if(mouseTile.x > crawlPos.x)
          {
            crawlPos.x += 1;
          }
          if(mouseTile.x < crawlPos.x)
          {
            crawlPos.x -= 1;
          }
          if(mouseTile.y > crawlPos.y)
          {
            crawlPos.y += 1;
          }
          if(mouseTile.y < crawlPos.y)
          {
            crawlPos.y -= 1;
          }
          const crawlRef = firebase.database().ref(`earth-crawl/${playerId + LavaId}`);
          crawlRef.set({
            x: crawlPos.x, 
            y: crawlPos.y, 
            useable: true, 
            id: playerId + LavaId, 
            location: myLocation
          })
          LavaId++;
          await delay(100);
        }
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Water" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 7 && myMoveId == 9 && cooldown == 0 && distToWater(players[playerId].x, players[playerId].y, water) <= 2)
      {
        let whipPos = {x: players[playerId].x, y: players[playerId].y};
        let leng = distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y});
        for (var i = 0; i < leng; i++) {
          if(mouseTile.x > whipPos.x)
          {
            whipPos.x += 1;
          }
          if(mouseTile.x < whipPos.x)
          {
            whipPos.x -= 1;
          }
          if(mouseTile.y > whipPos.y)
          {
            whipPos.y += 1;
          }
          if(mouseTile.y < whipPos.y)
          {
            whipPos.y -= 1;
          }
          const whipRef = firebase.database().ref(`water/${playerId + waterWhipId}`);
          whipRef.set({
            x: whipPos.x, 
            y: whipPos.y, 
            useable: true, 
            state: "water", 
            delete: true, 
            id: playerId + waterWhipId, 
            location: myLocation
          })
          waterWhipId++;
          Object.keys(players).forEach((key) => {
            const thePlayer = players[key];
            const thisPlayerRef = firebase.database().ref(`players/${key}`);
            if(whipPos.x === thePlayer.x && whipPos.y === thePlayer.y && thePlayer.location === myLocation)
            {
              let thisDamage = randomFromArray([0, 1, 1]);
              firebase.database().ref("players/" + thePlayer.id).update({
                health: players[thePlayer.id].health - thisDamage
              })
            }
          })
          await delay(100);
        }
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Fire" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 8 && redirect && cooldown == 0)
      {
        redirected = true;
        playerRef.update({
          health: players[playerId].health + redDam
        })
        let lightningPos = {x: players[playerId].x, y: players[playerId].y};
        for (var i = 0; i < distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}); i++) {
          if(mouseTile.x > lightningPos.x)
          {
            lightningPos.x += 1;
          }
          if(mouseTile.x < lightningPos.x)
          {
            lightningPos.x -= 1;
          }
          if(mouseTile.y > lightningPos.y)
          {
            lightningPos.y += 1;
          }
          if(mouseTile.y < lightningPos.y)
          {
            lightningPos.y -= 1;
          }
          const lightningRef = firebase.database().ref(`lightning/${playerId + LightningId}`);
          lightningRef.set({
            x: lightningPos.x, 
            y: lightningPos.y, 
            useable: true, 
            id: playerId + LightningId, 
            location: myLocation
          })
          LightningId++;
        }
        cooldown = 3;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Fire" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 7 && myMoveId == 4 && cooldown == 0)
      {
        let lightningPos = {x: players[playerId].x, y: players[playerId].y};
        for (var i = 0; i < distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}); i++) {
          if(mouseTile.x > lightningPos.x)
          {
            lightningPos.x += 1;
          }
          if(mouseTile.x < lightningPos.x)
          {
            lightningPos.x -= 1;
          }
          if(mouseTile.y > lightningPos.y)
          {
            lightningPos.y += 1;
          }
          if(mouseTile.y < lightningPos.y)
          {
            lightningPos.y -= 1;
          }
          const lightningRef = firebase.database().ref(`lightning/${playerId + LightningId}`);
          lightningRef.set({
            x: lightningPos.x, 
            y: lightningPos.y, 
            useable: true, 
            id: playerId + LightningId, 
            location: myLocation
          })
          LightningId++;
        }
        cooldown = 5;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Fire" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && myMoveId == 1 && cooldown == 0 && !isSolid(mouseTile.x, mouseTile.y, earthBlock) && !isWater(mouseTile.x, mouseTile.y, water))
      {
        const fireRef = firebase.database().ref(`fire/${playerId + FireId}`);
        fireRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + FireId, 
          location: myLocation
        })
        FireId++;
        cooldown = FireId % 6 == 0 ? 1 : 0;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Water" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && myMoveId == 8 && cooldown == 0 && !isSolid(mouseTile.x, mouseTile.y, earthBlock) && !isWater(mouseTile.x, mouseTile.y, water))
      {
        const waterRef = firebase.database().ref(`water/${playerId + WaterId}`);
        waterRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          state: "water", 
          delete: true, 
          id: playerId + WaterId, 
          location: myLocation
        })
        WaterId++;
        cooldown = WaterId % 2 == 0 ? 2 : 0;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && myMoveId == 1 && EarthBlockCount < 8 && cooldown == 0)
      {
        for(let idx = -2; idx < 3; idx++){
          let change = {x: Math.abs(players[playerId].x - mouseTile.x), y: Math.abs(players[playerId].y - mouseTile.y)};
          let changeIsX = 0;
          let changeIsY = 0;
          if(change.x >= change.y)
          {
            changeIsX = 1;
          }
          if(change.y > change.x)
          {
            changeIsY = 1;
          }
          if(isSolid(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, earthBlock) || isWater(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, water)) continue;
          const earthBlockRef = firebase.database().ref(`earth-block/${playerId + EarthBlockId}`);
          earthBlockRef.set({
            x: mouseTile.x + idx * changeIsY, 
            y: mouseTile.y + idx * changeIsX, 
            useable: true, 
            id: playerId + EarthBlockId, 
            location: myLocation
          })
          let Attack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === mouseTile.x + idx * changeIsY && characterState.y === mouseTile.y + idx * changeIsX && characterState.location === myLocation)
            {
              Attack = key;
            }
          })
          if(Attack != null && !players[playerId].isDead && !players[Attack].isDead)
          {
            myAttackIdx = 16;
            playerToAttackRef = firebase.database().ref("players/" + Attack);
            var damage = 1;
            playerToAttackRef.update({
              health: players[Attack].health - damage
            })
          }
          EarthBlockId++;
          EarthBlockCount++;
          cooldown = 2;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
      if(myBending == "Fire" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && myMoveId == 2 && cooldown == 0)
      {
        for(let idx = -2; idx < 3; idx++){
          let change = {x: Math.abs(players[playerId].x - mouseTile.x), y: Math.abs(players[playerId].y - mouseTile.y)};
          let changeIsX = 0;
          let changeIsY = 0;
          if(change.x >= change.y)
          {
            changeIsX = 1;
          }
          if(change.y > change.x)
          {
            changeIsY = 1;
          }
          if(isSolid(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, earthBlock) || isWater(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, water)) continue;
          const fireRef = firebase.database().ref(`fire/${playerId + FireId}`);
          fireRef.set({
            x: mouseTile.x + idx * changeIsY, 
            y: mouseTile.y + idx * changeIsX, 
            useable: true, 
            id: playerId + FireId, 
            location: myLocation
          })
          FireId++;
          cooldown = 2;
          coolDown.innerText = "Cooldown: " + cooldown;
        }
      }
      if(playerTorrent.length > 0 && myWater > 0 && myBending == "Water" && myMoveId == 1)
      {
        //Attack
        attackWater = {x: playerTorrent[2].x, y: playerTorrent[2].y};
        myAttackIdx = 0;
        const waterRef = firebase.database().ref(`water/${playerId}`);
        waterRef.set({
          x: attackWater.x, 
          y: attackWater.y, 
          useable: false, 
          id: playerId, 
          state: "water", 
          location: myLocation
        })
        shotTorrent = true;
        for(let i in playerTorrent)
        {
          firebase.database().ref(`water/${playerId+i}`).remove();
        }
        playerTorrent = [];
      }
      if(myBending == "Water" && myMoveId == 2 && isWater(mouseTile.x, mouseTile.y, water) && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 4 && cooldown == 0 && players[playerId].health < 5)
      {
        playerRef.update({
          health: players[playerId].health + 1
        })
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Water" && myMoveId == 6 && distToWater(players[playerId].x, players[playerId].y, water) <= 2 && cooldown == 0)
      {
        for(let idx = -1; idx < 2; idx++){
          let change = {x: Math.abs(players[playerId].x - mouseTile.x), y: Math.abs(players[playerId].y - mouseTile.y)};
          let changeIsX = 0;
          let changeIsY = 0;
          if(change.x >= change.y)
          {
            changeIsX = 1;
          }
          if(change.y > change.x)
          {
            changeIsY = 1;
          }
          if(isSolid(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, earthBlock)) continue;
          const waterRef = firebase.database().ref(`water/${playerId + WaterShieldId}`);
          waterRef.set({
            x: mouseTile.x + idx * changeIsY, 
            y: mouseTile.y + idx * changeIsX, 
            useable: true, 
            state: "water", 
            delete: true, 
            id: playerId + WaterShieldId, 
            location: myLocation
          })
          WaterShieldId++;
        }
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Water" && myMoveId == 6 && myWater > 0 && cooldown == 0)
      {
        for(let idx = -1; idx < 2; idx++){
          let change = {x: Math.abs(players[playerId].x - mouseTile.x), y: Math.abs(players[playerId].y - mouseTile.y)};
          let changeIsX = 0;
          let changeIsY = 0;
          if(change.x >= change.y)
          {
            changeIsX = 1;
          }
          if(change.y > change.x)
          {
            changeIsY = 1;
          }
          if(isSolid(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, earthBlock)) continue;
          const waterRef = firebase.database().ref(`water/${playerId + WaterShieldId}`);
          waterRef.set({
            x: mouseTile.x + idx * changeIsY, 
            y: mouseTile.y + idx * changeIsX, 
            useable: true, 
            state: "water", 
            delete: true, 
            id: playerId + WaterShieldId, 
            location: myLocation
          })
          WaterShieldId++;
        }
        myWater = 0;
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && myMoveId == 4 && cooldown == 0 && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 2 && !isWater(mouseTile.x, mouseTile.y, water))
      {
        let rockRef = firebase.database().ref("rock/" + playerId);
        rockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          type: "boulder", 
          useable: false, 
          id: playerId, 
          location: myLocation
        });
        myAttackIdx = 0;
        cooldown = 1;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && myMoveId == 5 && cooldown == 0 && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 2 && target.id == "EarthBlock")
      {
        let rockRef = firebase.database().ref("rock/" + playerId);
        rockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          type: "disk", 
          useable: false, 
          id: playerId, 
          location: myLocation
        });
        myAttackIdx = 0;
        cooldown = 2;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Earth" && myMoveId == 6 && cooldown == 0 && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 2 && target.id == "EarthBlock")
      {
        let caseRef = firebase.database().ref("lava/" + playerId+"torrent");
        caseRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: false, 
          id: playerId+"torrent", 
          location: myLocation
        });
        shotEncase = {x: mouseTile.x, y: mouseTile.y};
        myAttackIdx = 0;
        cooldown = 7;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Air" && myMoveId == 5 && cooldown == 0 && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && tornado[playerId] == null)
      {
        setTimeout(() => {
          let tornadoRef = firebase.database().ref("tornado/" + playerId);
          tornadoRef.set({
            x: mouseTile.x, 
            y: mouseTile.y, 
            useable: false, 
            id: playerId, 
            location: myLocation
          });
          myAttackIdx = 0;
          setTimeout(() => {
            firebase.database().ref("tornado/" + playerId).remove();
            myAttackIdx = 16;
            cooldown = 2;
            coolDown.innerText = "Cooldown: " + cooldown;
          }, 15000);
        }, Math.random() * 1000 + 2);
      }
      if(myBending == "Water" && waterArms.length > 0 && distanceBetween({x: waterArms[6].x, y: waterArms[6].y}, {x: mouseTile.x, y: mouseTile.y}) <= 2 && !players[playerId].isDead)
      {
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(mouseTile.x === thePlayer.x && mouseTile.y === thePlayer.y && myLocation === thePlayer.location)
          {
            thisPlayerRef.update({
              health: thePlayer.health - 1
            });
          }
        })
      } else if(myBending == "Water" && waterArms.length > 0 && distanceBetween({x: waterArms[7].x, y: waterArms[7].y}, {x: mouseTile.x, y: mouseTile.y}) <= 2 && !players[playerId].isDead)
      {
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(mouseTile.x === thePlayer.x && mouseTile.y === thePlayer.y && myLocation === thePlayer.location)
          {
            thisPlayerRef.update({
              health: thePlayer.health - 1
            });
          }
        })
      }
      if(myBending == "Water" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && !players[playerId].isDead && myMoveId == 7 && friendbend == null)
      {
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(distanceBetween({x: thePlayer.x, y: thePlayer.y}, {x: mouseTile.x, y: mouseTile.y}) < 2 && myLocation == thePlayer.location)
          {
            friendbend = thePlayer.id;
            myAttackIdx = 0;
          }
        })
      } else if(myBending == "Water" && myMoveId == 7 && friendbend != null)
      {
        friendbend = null;
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Water" && isWater(mouseTile.x, mouseTile.y, water))
      {
        //myWater = 1;
      }
    };
    setMove(0);
    if(myBending == "Fire") myMoveId = 1;
    if(myBending == "Air") myMoveId = 1;
    let moveList;
    if(myBending == "Water") moveList = WaterMoves;
    if(myBending == "Air") moveList = AirMoves;
    if(myBending == "Earth") moveList = EarthMoves;
    if(myBending == "Fire") moveList = FireMoves;
    currentMove.innerText = "Current Move: " + moveList[myMoveId];

    setupWater(allWaterRef);
    oneSecondLoop();
    fourthSecondLoop();
    eighthSecondLoop();
    tickLoop();
    regenLoop();
  }
  firebase.auth().onAuthStateChanged((user) =>{
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      let name;
      if(localStorage.getItem("Name") == null)
      {
        localStorage.setItem("Name", createName());
      }
      name = localStorage.getItem("Name");
      playerNameInput.value = name;

      const {x, y} = getRandomSafeSpot(earthBlock);


      playerRef.set({
        id: playerId,
        name, 
        direction: "right",
        color: randomFromArray(playerColors),
        x,
        y,
        health: 5, 
        isDead: false, 
        bending: localStorage.getItem("Bending"), 
        cloak: "none", 
        location: myLocation, 
        isSpectator: false
      })

      myBending = localStorage.getItem("Bending");

      const date = new Date();

      const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
      chatRef.set({
        message: name + " has joined the game", 
        time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
        day: date.getDate()
      })

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();

      //Begin the game now that we are signed in
      initGame();
    } else {
      //You're logged out.
    }
  })
  firebase.auth().signInAnonymously().catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
  });
})();