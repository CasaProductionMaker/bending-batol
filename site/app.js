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
const mapData = {
  minX: 0,
  maxX: 15,
  minY: 0,
  maxY: 13,
  blockedSpaces: {
    "1x1": false
  }
};

let myWater = 0;
let myAir = 0;
let myAttackIdx = 16;
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: undefined, y: undefined};
let mouseTile = {x: undefined, y: undefined};
let myBending;
let attackWater = null;
let attackAirVaccum = null;
let EarthBlockId = 0;
let rockId = 0;
let FireId = 0;
let EarthBlockCount = 0;
let LavaId = 0;
let fireRowId = 0;
let windId = 0;
let direction = null;
let myMoveId = 0;
let cooldown = 0;
let playerTorrent = [];
let octopusArms = [];
let playerAirShield = [];
let torrentPos = [{x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}, {x: -1, y: 2}, {x: -2, y: 1}, {x: -2, y: 0}, {x: -2, y: -1}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}, {x: 2, y: -1}];
let octopusPos = [{x: 3, y: 1}, {x: 2, y: 3}, {x: -1, y: 3}, {x: -3, y: 2}, {x: -3, y: -1}, {x: -2, y: -3}, {x: 1, y: -3}, {x: 3, y: -2}];
let shotTorrent = false;
let WaterMoves = ["Water Manipulation", "Torrent", "Healing Water", "Octopus Form", "Ice Freeze"];
let EarthMoves = ["Earth Pillar", "Earth Wall", "Raise Land", "Lava Crevice", "Earth Boulder"];
let AirMoves = ["Suffocate", "Wind", "Air Shield", "Wind Cloak", "Wind Slice"];
let FireMoves = ["Blaze", "Incinerate", "Wall of Fire", "Fireball"];
let WaterDesc = [
  "Control water and shoot it at your opponents.", 
  "Grab water as a shield and shoot it off as offense", 
  "Use water to heal your injuries", 
  "Wrap water around yourself in the shape of an octopus to defend against attacks.", 
  "Freeze your opponent in a ball of ice"
];
let EarthDesc = [
  "Raise the earth to block off people or hurt them if you raise ground under them.", 
  "Raise the earth to form a wall to block off people or hurt them if you raise ground under them.", 
  "Raise earth in a line in front of you.", 
  "Create a lava crevice in the floor, burning anyone in it.", 
  "Pull up a boulder and throw it at your opponents."
];
let AirDesc = [
  "Suffocate your opponents in a bubble.", 
  "Shoot out a wind gust to blast others back.", 
  "Form an air shield around yourself.", 
  "The wind around you conceals you from anyone nearby.", 
  "Shoot out a thin air stream, damaging anyone in its path."
];
let FireDesc = [
  "Shoot out a huge flame to burn your enemies.", 
  "Burn any place at will.", 
  "Make a wall of fire to block out your opponents.", 
  "Shoot a flaming ball at your enemy."
];
let WaterInst = [
  "Click on water or ice to store it if it is close enough to it, and press space to make it follow your mouse.", 
  "Click on water or ice to store it if it is close enough to it, press space to make it circle you, and click to make it follow your mouse or press space again to put it back.", 
  "If you're close enough, click on water or ice and it'll heal you", 
  "Click on water or ice to store it if it is close enough to it, and press space to form the octopus.", 
  "Click on water or ice to store it if it is close enough to it, and press space to make it follow your mouse. When it collides with an opponent, they will freeze in a ball of ice."
];
let EarthInst = [
  "Click on a tile to raise earth and click on it again to put it down.", 
  "Click on a tile to raise a wall at the tile.", 
  "Move in the direction you want to raise the line and then quickly press space.", 
  "Click on a tile not too far from you to open a crevice up to that point.", 
  "Click on the ground to bring up a boulder that will follow your mouse."
];
let AirInst = [
  "Click on any tile to collect air, then press space to toggle a suffocation bubble that will damage anyone in it.", 
  "Click on any tile to collect air, then move in the direction you want to shoot the wind and then quickly press space.", 
  "Click on any tile to collect air, then press space to toggle an air shield.", 
  "Press space to toggle the cloak and turn invisible.", 
  "Move in the direction you want to shoot the air and then quickly press space."  
];
let FireInst = [
  "Move in the direction you want to shoot the fire and then quickly press space.", 
  "Click on a tile to burn it.", 
  "Click on a tile to burn a wall at the tile.", 
  "Move in the direction you want to shoot the fireball and then quickly press space."
];

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

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
  return mapData;
}
function isSolid(x, y, earthBlock) {
  const mapData = getCurrentMapData();
  let blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  Object.keys(earthBlock).forEach((key) => {
    const block = earthBlock[key];
    if(block.x == x && block.y == y) blockedNextSpace = true;
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
  const mapData = getCurrentMapData();
  let wetNextSpace = false;
  Object.keys(waterD).forEach((key) => {
    const block = waterD[key];
    if(block.x == x && block.y == y) wetNextSpace = true;
  })
  return (
    wetNextSpace
  )
}
function isIce(x, y, waterD) {
  const mapData = getCurrentMapData();
  let wetNextSpace = false;
  Object.keys(waterD).forEach((key) => {
    const block = waterD[key];
    if(block.x == x && block.y == y && block.state == "ice") wetNextSpace = true
  })
  return (
    wetNextSpace
  )
}
function isAir(x, y, airD) {
  const mapData = getCurrentMapData();
  let dryNextSpace = false;
  Object.keys(airD).forEach((key) => {
    const block = airD[key];
    if(block.x == x && block.y == y) dryNextSpace = true;
  })
  return (
    dryNextSpace
  )
}
function isLava(x, y, lavaD) {
  const mapData = getCurrentMapData();
  let lavaNextSpace = false;
  Object.keys(lavaD).forEach((key) => {
    const block = lavaD[key];
    if(block.x == x && block.y == y) lavaNextSpace = true;
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

(function() {

	let playerId;
	let playerRef;
  let players = {};
  let playerElements = {};
  let airVaccum = {};
  let airVaccumElements = {};
  let fireball = {};
  let fireballElements = {};
  let airSlice = {};
  let airSliceElements = {};
  let wind = {};
  let windElements = {};
  let lava = {};
  let lavaElements = {};
  let rock = {};
  let rockElements = {};
  let water = {};
  let waterElements = {};
  let fire = {};
  let fireElements = {};
  let earthBlock = {};
  let earthBlockElements = {};
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
        setTimeout(() => {
          const buttonElement = document.createElement("div");
          buttonElement.classList.add("respawnButton");
          buttonElement.innerHTML = (`
            <button id="respawn">Respawn</button>
          `)
          const respawnButton = buttonElement.querySelector("#respawn");
          respawnButton.addEventListener("click", () => {
            isButton = false;
            respawnContainer.querySelector(".respawnButton").remove();
            const {x, y} = getRandomSafeSpot(earthBlock);
            playerRef.update({
              isDead: false, 
              health: 5, 
              x, 
              y
            })
          })
          respawnContainer.appendChild(buttonElement);
        }, 30000);
        isButton = true;
      }
    }
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
          if(characterState.x === attackWater.x && characterState.y === attackWater.y)
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
          if(characterState.x === attackWater.x && characterState.y === attackWater.y)
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
          firebase.database().ref(`water/${key}`).update({
            state: "ice"
          });
          firebase.database().ref(`water/${key}ice1`).set({
            x: attackWater.x + 1, 
            y: attackWater.y, 
            useable: false, 
            id: playerId + "ice1", 
            state: "ice"
          });
          firebase.database().ref(`water/${key}ice2`).set({
            x: attackWater.x - 1, 
            y: attackWater.y, 
            useable: false, 
            id: playerId + "ice2", 
            state: "ice"
          });
          firebase.database().ref(`water/${key}ice3`).set({
            x: attackWater.x, 
            y: attackWater.y + 1, 
            useable: false, 
            id: playerId + "ice3", 
            state: "ice"
          });
          firebase.database().ref(`water/${key}ice4`).set({
            x: attackWater.x, 
            y: attackWater.y - 1, 
            useable: false, 
            id: playerId + "ice4", 
            state: "ice"
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
          if(characterState.x === attackWater.x && characterState.y === attackWater.y)
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
            y: playerTorrent[i].y
          })
          let playerToAttack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === playerTorrent[i].x && characterState.y === playerTorrent[i].y)
            {
              playerToAttack = key;
            }
          })
          Object.keys(fire).forEach((key) => {
            const fireToPutOut = fire[key];
            if(fireToPutOut.x === playerTorrent[i].x && fireToPutOut.y === playerTorrent[i].y)
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
            y: playerTorrent[i].y
          })
          let playerToAttack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === playerTorrent[i].x && characterState.y === playerTorrent[i].y)
            {
              playerToAttack = key;
            }
          })
          Object.keys(fire).forEach((key) => {
            const fireToPutOut = fire[key];
            if(fireToPutOut.x === playerTorrent[i].x && fireToPutOut.y === playerTorrent[i].y)
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
            y: octopusArms[i].y
          })
          let playerToAttack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === octopusArms[i].x && characterState.y === octopusArms[i].y)
            {
              playerToAttack = key;
            }
          })
          Object.keys(fire).forEach((key) => {
            const fireToPutOut = fire[key];
            if(fireToPutOut.x === octopusArms[i].x && fireToPutOut.y === octopusArms[i].y)
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
    }
    if(myBending == "Air")
    {
      if(myAttackIdx < 16 && myMoveId == 0)
      {
        let playerToAttack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === attackAirVaccum.x && characterState.y === attackAirVaccum.y)
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
    {
      Object.keys(airSlice).forEach((key) => {
        const theSlice = airSlice[key];
        const airSliceRef = firebase.database().ref(`air-slice/${key}`);
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
          if(theSlice.x === thePlayer.x && theSlice.y === thePlayer.y)
          {
            if(!isSolid(thePlayer.x + theSlice.direction.x, thePlayer.y + theSlice.direction.y, earthBlock))
            {
              thisPlayerRef.update({
                health: thePlayer.health - 1
              });
            }
          }
        })
      })
    }
    {
      Object.keys(fireball).forEach((key) => {
        const theBall = fireball[key];
        const fireballRef = firebase.database().ref(`fireball/${key}`);
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
          if(theBall.x === thePlayer.x && theBall.y === thePlayer.y)
          {
            if(!isSolid(thePlayer.x + theBall.direction.x, thePlayer.y + theBall.direction.y, earthBlock))
            {
              thisPlayerRef.update({
                health: thePlayer.health - 1
              });
            }
          }
        })
      })
    }
    Object.keys(fire).forEach((key) => {
      const theFire = fire[key];
      if(theFire.x == players[playerId].x && theFire.y == players[playerId].y)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        me.update({
          health: players[playerId].health - damage
        })
      }
    })
    Object.keys(lava).forEach((key) => {
      const theLava = lava[key];
      if(theLava.x == players[playerId].x && theLava.y == players[playerId].y)
      {
        me = firebase.database().ref("players/" + playerId);
        var damage = randomFromArray([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        me.update({
          health: players[playerId].health - damage
        })
      }
    })

    //repeat
    setTimeout(() => {
      fourthSecondLoop();
    }, 250);
  }
  function tickLoop() {
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
          id: playerId
        })
      }
      Object.keys(wind).forEach((key) => {
        const theWind = wind[key];
        const windRef = firebase.database().ref(`wind/${key}`);
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(theWind.x === thePlayer.x && theWind.y === thePlayer.y)
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
        const airVaccumRef = firebase.database().ref(`rock/${key}`);
        airVaccumRef.update({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: false, 
          id: playerId
        })
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(mouseTile.x === thePlayer.x && mouseTile.y === thePlayer.y)
          {
            thisPlayerRef.update({
              health: thePlayer.health - 1
            });
            myAttackIdx = 16;
            firebase.database().ref(`rock/${playerId}`).remove();
            cooldown = 2;
            coolDown.innerText = "Cooldown: " + cooldown;
          }
        })
      }
      Object.keys(wind).forEach((key) => {
        const theWind = wind[key];
        const windRef = firebase.database().ref(`wind/${key}`);
        Object.keys(players).forEach((key) => {
          const thePlayer = players[key];
          const thisPlayerRef = firebase.database().ref(`players/${key}`);
          if(theWind.x === thePlayer.x && theWind.y === thePlayer.y)
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
    Object.keys(airSlice).forEach((key) => {
      const theSlice = airSlice[key];
      const airSliceRef = firebase.database().ref(`air-slice/${key}`);
      Object.keys(players).forEach((key) => {
        const thePlayer = players[key];
        const thisPlayerRef = firebase.database().ref(`players/${key}`);
        if(theSlice.x === thePlayer.x && theSlice.y === thePlayer.y)
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
        if(theBall.x === thePlayer.x && theBall.y === thePlayer.y)
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
        "3x5": {x: 3, y: 5, useable: true, id: "tl", state: "water"}, 
        "3x9": {x: 3, y: 9, useable: true, id: "tr", state: "water"}, 
        "11x5": {x: 11, y: 5, useable: true, id: "bl", state: "water"}, 
        "11x9": {x: 11, y: 9, useable: true, id: "br", state: "water"}
      })
    }
  }
  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!isSolid(newX, newY, earthBlock) && !players[playerId].isDead && !isIce(newX, newY, water)) {
      if(!(isLava(oldX, oldY, lava) && Math.random() > 0.5) && !isIce(oldX, oldY, water))
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
    direction = {x: xChange, y: yChange};
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
        state: "water"
      })
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
        state: "water"
      })
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
          state: "water"
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
          state: "water"
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
          state: "water"
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
        id: playerId
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
          id: playerId+i
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
            id: playerId + windId
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
            id: playerId + windId
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
            id: playerId + windId
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
            id: playerId + windId
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
            id: playerId + windId
          })
          windId++;
        }
      }
      myAir = 0;
      cooldown = 1;
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
            id: playerId + fireRowId
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
            id: playerId + fireRowId
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
            id: playerId + fireRowId
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
            id: playerId + fireRowId
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
            id: playerId + fireRowId
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
        id: playerId + FireId
      });
      FireId++;
      cooldown = 1;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
    if(myBending == "Air" && direction != null && myMoveId == 4 && cooldown == 0)
    {
      let sliceRef = firebase.database().ref("air-slice/" + playerId + windId);
      sliceRef.set({
        x: players[playerId].x + direction.x, 
        y: players[playerId].y + direction.y, 
        direction, 
        useable: false, 
        id: playerId + windId
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
            id: playerId + EarthBlockId
          })
          let Attack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === players[playerId].x + (direction.x * i) && characterState.y === players[playerId].y + (direction.y * i))
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
    myMoveId++;
    let moveList;
    if(myBending == "Water") moveList = WaterMoves;
    if(myBending == "Air") moveList = AirMoves;
    if(myBending == "Earth") moveList = EarthMoves;
    if(myBending == "Fire") moveList = FireMoves;
    if(myMoveId > moveList.length - 1) myMoveId = 0;
    currentMove.innerText = "Current Move: " + moveList[myMoveId];
    playerRef.update({
      cloak: "none"
    })
  }
  function setMove(move) {
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
    }
    setTimeout(() => {
      regenLoop();
    }, 30000);
  }

  function initGame() {

    new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1))
    new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1))
    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
    new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))
    new KeyPressListener("Space", () => handleAttack())
    new KeyPressListener("KeyA", () => handleArrowPress(-1, 0))
    new KeyPressListener("KeyW", () => handleArrowPress(0, -1))
    new KeyPressListener("KeyS", () => handleArrowPress(0, 1))
    new KeyPressListener("KeyD", () => handleArrowPress(1, 0))
    new KeyPressListener("KeyQ", () => switchMove())

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
          if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: water.x, y: water.y}) <= 2 && myBending == "Water")
          {
            myWater = 1;
          }
        })
      }

      // Keep a reference for removal later and add to DOM
      waterElements[key] = waterElement;
      gameContainer.appendChild(waterElement);
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

    allEarthBlockRef.on("value", (snapshot) => {
      earthBlock = snapshot.val() || {};
      //Object.keys(earthBlock).forEach((key) => {
        //const earthBlockState = earthBlock[key];
        //let el = earthBlockElements[earthBlockState.id];
        //const left = 16 * earthBlockState.x + "px";
        //const top = 16 * earthBlockState.y + "px";
        //el.style.transform = `translate3d(${left}, ${top}, 0)`;
      //})
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
        if(distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: earthBlock.x, y: earthBlock.y}) <= 3 && myBending == "Earth")
        {
          firebase.database().ref(`earth-block/${earthBlock.id}`).remove();
          EarthBlockCount--;
          if(EarthBlockCount < 0) EarthBlockCount = 0;
        }
      })

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
    window.addEventListener('mousemove', (event) => {
      mousePos = {x: event.clientX, y: event.clientY};
      screenDim = {x: window.innerWidth, y: window.innerHeight};
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((mousePos.x - margin.x) / 48), y: Math.floor((mousePos.y - margin.y) / 48)};
      //1919, 977
      if(mouseTile.x > mapData.maxX - 1) mouseTile.x = mapData.maxX - 1;
      if(mouseTile.y > mapData.maxY - 1) mouseTile.y = mapData.maxY - 1;
      if(mouseTile.x < mapData.minX) mouseTile.x = mapData.minX;
      if(mouseTile.y < mapData.minY) mouseTile.y = mapData.minY;
    });
    document.onclick = function(event) {
      if(event === undefined) event = window.event;
      var target = "target" in event ? event.target : event.srcElement;
      if(myBending == "Air")
      {
        myAir = 1;
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 4 && myMoveId == 0 && EarthBlockCount < 12 && cooldown == 0)
      {
        const earthBlockRef = firebase.database().ref(`earth-block/${playerId + EarthBlockId}`);
        earthBlockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + EarthBlockId
        })
        let Attack;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(characterState.x === mouseTile.x && characterState.y === mouseTile.y)
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
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && myMoveId == 3 && cooldown == 0)
      {
        let lavaPos = {x: players[playerId].x, y: players[playerId].y};
        for (var i = 0; i < distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}); i++) {
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
            id: playerId + LavaId
          })
          LavaId++;
        }
        cooldown = 4;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
      if(myBending == "Fire" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 5 && myMoveId == 1 && cooldown == 0 && !isSolid(mouseTile.x, mouseTile.y, earthBlock) && !isWater(mouseTile.x, mouseTile.y, water))
      {
        const fireRef = firebase.database().ref(`fire/${playerId + FireId}`);
        fireRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          useable: true, 
          id: playerId + FireId
        })
        FireId++;
        cooldown = FireId % 5 == 0 ? 1 : 0;
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
          if(isSolid(mouseTile.x + idx * changeIsY, mouseTile.y + idx * changeIsX, earthBlock)) continue;
          const earthBlockRef = firebase.database().ref(`earth-block/${playerId + EarthBlockId}`);
          earthBlockRef.set({
            x: mouseTile.x + idx * changeIsY, 
            y: mouseTile.y + idx * changeIsX, 
            useable: true, 
            id: playerId + EarthBlockId
          })
          let Attack;
          Object.keys(players).forEach((key) => {
            const characterState = players[key];
            if(characterState.x === mouseTile.x + idx * changeIsY && characterState.y === mouseTile.y + idx * changeIsX)
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
            id: playerId + FireId
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
          state: "water"
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
      if(myBending == "Earth" && myMoveId == 4 && cooldown == 0 && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 2)
      {
        let rockRef = firebase.database().ref("rock/" + playerId);
        rockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          direction, 
          useable: false, 
          id: playerId
        });
        myAttackIdx = 0;
        cooldown = 1;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
    };

    setupWater(allWaterRef);
    setMove(0);
    oneSecondLoop();
    fourthSecondLoop();
    tickLoop();
    regenLoop();
  }
	firebase.auth().onAuthStateChanged((user) =>{
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
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
        cloak: "none"
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