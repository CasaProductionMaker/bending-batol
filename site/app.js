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
  minX: 1,
  maxX: 14,
  minY: 3,
  maxY: 12,
  blockedSpaces: {
    "1x1": false
  }
};

let myWater = 0;
let myAir = 0;
let myAttackIdx = 16;
let mousePos = { x: undefined, y: undefined};
let screenDim = { x: undefined, y: undefined};
let mouseTile = { x: undefined, y: undefined};
let myBending;
let attackWater = null;
let attackAirVaccum = null;
let EarthBlockId = 0;
let EarthBlockCount = 0;
let fireRowId = 0;
let windId = 0;
let direction = null;
let myMoveId = 0;

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
  let wind = {};
  let windElements = {};
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
  const moveSwitch = document.querySelector("#move-switch");
  const chatSend = document.querySelector("#send-chat");
  const chatInput = document.querySelector("#chat-input");
  const chatDisplay = document.querySelector("#chat-display");

  function oneSecondLoop() {
    if(players[playerId] != null) {
      if(players[playerId].isDead > 0 && !isButton) {
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
        isButton = true;
      }
    }

    //repeat
    setTimeout(() => {
      oneSecondLoop();
    }, 1000);
  }
  function fourthSecondLoop() {
    if(myBending == "Water")
    {
      const key = playerId;
      if(myAttackIdx < 16)
      {
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
        //console.log(attackWater);
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
      if(myMoveId == 1)
      {
        Object.keys(wind).forEach((key) => {
          const theWind = wind[key];
          const windRef = firebase.database().ref(`wind/${key}`);
          windRef.update({
            x: theWind.x + theWind.direction.x, 
            y: theWind.y + theWind.direction.y
          })
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
          if(isSolid(theWind.x, theWind.y, earthBlock))
          {
            windRef.remove();
          }
        })
      }
    }
    Object.keys(fire).forEach((key) => {
      const theFire = fire[key];
      if(theFire.x == players[playerId].x && theFire.y == players[playerId].y)
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
    }
    //repeat
    setTimeout(() => {
      tickLoop();
    }, 1);
  }
  function setupWater(waterRef) {
    if(Object.values(water).length < 1)
    {
      waterRef.update({
        "3x5": {x: 3, y: 5, useable: true, id: "tl"}, 
        "3x9": {x: 3, y: 9, useable: true, id: "tr"}, 
        "11x5": {x: 11, y: 5, useable: true, id: "bl"}, 
        "11x9": {x: 11, y: 9, useable: true, id: "br"}
      })
    }
  }
  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!isSolid(newX, newY, earthBlock) && !players[playerId].isDead) {
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
    }
    direction = {x: xChange, y: yChange};
    setTimeout(() => {
      direction = null;
    }, 300);
  }
  function handleAttack() {
    if(myWater > 0 && myBending == "Water" && myMoveId == 0)
    {
      //Attack
      attackWater = {x: players[playerId].x, y: players[playerId].y};
      myAttackIdx = 0;
      const waterRef = firebase.database().ref(`water/${playerId}`);
      waterRef.set({
        x: attackWater.x, 
        y: attackWater.y, 
        useable: false, 
        id: playerId
      })
    }
    if(myAir > 0 && myBending == "Air" && myMoveId == 0)
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
    }
    if(myAir > 0 && myBending == "Air" && direction != null && myMoveId == 1)
    {
      //Attack
      for(var i = 1; i < 2; i++) {
        const windRef = firebase.database().ref(`wind/${playerId + windId}`);
        if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), earthBlock))
        {
          windRef.set({
            x: players[playerId].x + (direction.x * i), 
            y: players[playerId].y + (direction.y * i), 
            useable: false, 
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
            useable: false, 
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
            useable: false, 
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
            useable: false, 
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
            useable: false, 
            direction, 
            id: playerId + windId
          })
          windId++;
        }
      }
      myAir = 0;
    }
    if(myBending == "Fire" && direction != null && myMoveId == 0)
    {
      let blocked = false;
      for(var i = 1; i < 6; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i), earthBlock))
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
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x, earthBlock) && !blocked)
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
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x, earthBlock) && !blocked)
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
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2, earthBlock) && !sblocked)
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
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2, earthBlock) && !sblocked)
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
    }
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

    const allPlayersRef = firebase.database().ref(`players`);
    const allWaterRef = firebase.database().ref(`water`);
    const allAirVaccumRef = firebase.database().ref(`air-vaccum`);
    const allWindRef = firebase.database().ref(`wind`);
    const allEarthBlockRef = firebase.database().ref(`earth-block`);
    const allFireRef = firebase.database().ref(`fire`);

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
      if(chatInput.value.slice(0, 8) === "#switch ")
      {
        //#switch
        myMoveId = chatInput.value[8];
        chatInput.value = "";
      } else
      {
        const chatRef = firebase.database().ref(`chat/` + Math.floor(Math.random() * 1000000000000000));
        const date = new Date();
        var inputMessage = chatInput.value;
        chatRef.set({
          message: inputMessage + " | " + players[playerId].name, 
          time: date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds(), 
          day: date.getDate()
        })
        chatInput.value = "";
      }
    })
    moveSwitch.addEventListener("click", () => {
      myMoveId = 1 - myMoveId;
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
      if(mouseTile.x > 13) mouseTile.x = 13;
      if(mouseTile.y > 11) mouseTile.y = 11;
      if(mouseTile.x < 1) mouseTile.x = 1;
      if(mouseTile.y < 3) mouseTile.y = 3;
    });
    document.onclick = function(event) {
      if(event === undefined) event = window.event;
      var target = "target" in event ? event.target : event.srcElement;
      if(myBending == "Air")
      {
        myAir = 1;
      }
      if(myBending == "Earth" && target.id != "EarthBlock" && distanceBetween({x: players[playerId].x, y: players[playerId].y}, {x: mouseTile.x, y: mouseTile.y}) <= 3 && myMoveId == 0 && EarthBlockCount < 12)
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
      }
    };

    setupWater(allWaterRef);
    oneSecondLoop();
    fourthSecondLoop();
    tickLoop();
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
        bending: localStorage.getItem("Bending")
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