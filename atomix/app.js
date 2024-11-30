if(localStorage.getItem("AtomixGame") == null)
{
  window.location.href = "index.html";
}

//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
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

//Mouse Info
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: window.innerWidth, y: window.innerHeight};
let mouseTile = {x: undefined, y: undefined};
let mouseNonRelativePosition = {x: undefined, y: undefined};
let mouseDown = false;

//Player Movement
let myX = 0;
let myY = 0;
let yVel = 0;
let xVel = 0;
let isD;
let isA;
let isW;
let isS;
let isRight;
let isLeft;
let isUp;
let isDown;
let mapSize = 500;
let spaceMultiplier = 1;
let PlayerHealth = 2000;

//Electrons
let ElectronsPerShell = [0, 0, 0];

//Stats
let electronStats = {
  "Electron": {
    Health: 100, 
    Damage: 30, 
    Size: 6, 
    Reload: 2.5
  }, 
  "ChunkyElectron": {
    Health: 2000, 
    Damage: 20, 
    Size: 10, 
    Reload: 4
  }, 
  "SpedElectron": {
    Health: 100, 
    Damage: 200, 
    Size: 6, 
    Reload: 1.5
  }, 
  "SmolElectron": {
    Health: 50, 
    Damage: 10, 
    Size: 4, 
    Reload: 0.25
  }, 
  "TankElectron": {
    Health: 5000, 
    Damage: 5, 
    Size: 12, 
    Reload: 4
  }, 
  "SharpElectron": {
    Health: 50, 
    Damage: 1000, 
    Size: 7, 
    Reload: 5
  }
}
let mobStats = {
  "Gear": {
    Health: 300, 
    Damage: 50, 
    Size: 16, 
    Speed: 0, 
    Score: 1
  }, 
  "BallBearing": {
    Health: 2000, 
    Damage: 30, 
    Size: 27, 
    Speed: 0, 
    Score: 2
  }, 
  "Screw": {
    Health: 750, 
    Damage: 75, 
    Size: 14, 
    Speed: 3, 
    Score: 2
  }, 
  "LaserScrew": {
    Health: 1250, 
    Damage: 150, 
    Size: 16, 
    Speed: 3, 
    Score: 5
  }, 
  "Tanker": {
    Health: 5000, 
    Damage: 50, 
    Size: 44, 
    Speed: 0, 
    Score: 3
  }, 
  "Missile": {
    Health: 1500, 
    Damage: 100, 
    Size: 14, 
    Speed: 0.5, 
    Score: 5
  }
}

//Time
let startTime = new Date();
let startTick = startTime.getTime();
let currentTick = startTick;

//Game
let gameHost = "";
let mobSpawnID = 0;
let mobCount = 0;
let mobsSpawned = 1;
let Wave = 1;
let mobList = ["Gear", "BallBearing", "Screw", "LaserScrew", "Tanker", "Missile"];

//Misc
let isDebug = false;
let gameCode = localStorage.getItem("AtomixGame");

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
  ]);
  return `${prefix} ${animal}`;
}
function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
}

(function() {
	let playerId;
	let playerRef;
  let players = {};
  let playerElements = {};
  let myElectrons = {};
  let myElectronElements = {};
  let mobs = {};
  let mobElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");
  const chatSend = document.querySelector("#send-chat");
  const chatInput = document.querySelector("#chat-input");
  const chatDisplay = document.querySelector("#chat-display");

  function oneSecondLoop() {
    //repeat
    setTimeout(() => {
      oneSecondLoop();
    }, 1000);
  }
  function tickLoop() {
    let tempTime = new Date();
    currentTick = tempTime.getTime() - startTick;
    screenDim = {x: window.innerWidth, y: window.innerHeight};
    if(players[playerId] != null) {
      //Electrons:
      Object.keys(players[playerId].electrons).forEach((electron) => {
        const thisElectron = players[playerId].electrons[electron];
        //Reorder
        thisElectron.angle = (360 / ElectronsPerShell[thisElectron.layer]) * thisElectron.shellPos;
        //Rotate
        thisElectron.angle = (thisElectron.angle + ((currentTick * 0.15) * ((thisElectron.layer * 0.5) + 1))) % 360;
        if(thisElectron.health > 0)
        {
          thisElectron.x = thisElectron.x + (((players[playerId].x + (Math.sin(thisElectron.angle * Math.PI / 180.0) * ((thisElectron.layer + 1) * 32 * spaceMultiplier))) - thisElectron.x) / 3);
          thisElectron.y = thisElectron.y + (((players[playerId].y + (Math.cos(thisElectron.angle * Math.PI / 180.0) * ((thisElectron.layer + 1) * -32 * spaceMultiplier))) - thisElectron.y) / 3);
        } else {
          thisElectron.x = players[playerId].x;
          thisElectron.y = players[playerId].y;
        }
        //Damage
        Object.keys(mobs).forEach((mob) => {
          const thisMob = mobs[mob];
          if(mobStats[thisMob.type] != undefined && distanceBetween(thisElectron.x, thisElectron.y, thisMob.x, thisMob.y) <= electronStats[thisElectron.type].Size + mobStats[thisMob.type].Size)
          {
            thisElectron.x += ((thisElectron.x - thisMob.x) / Math.abs(thisElectron.x - thisMob.x)) * 5;
            thisElectron.y += ((thisElectron.y - thisMob.y) / Math.abs(thisElectron.y - thisMob.y)) * 5;
            thisElectron.health -= mobStats[thisMob.type].Damage;
            thisMob.x += ((thisMob.x - thisElectron.x) / (electronStats[thisElectron.type].Size + mobStats[thisMob.type].Size)) * 2.5;
            thisMob.y += ((thisMob.y - thisElectron.y) / (electronStats[thisElectron.type].Size + mobStats[thisMob.type].Size)) * 2.5;
            thisMob.health -= electronStats[thisElectron.type].Damage;
          }
        })
        if(thisElectron.health < 1 && thisElectron.health > -1000000)
        {
          thisElectron.timeOfDeath = currentTick;
          thisElectron.health = -1000000;
          thisElectron.x = players[playerId].x;
          thisElectron.y = players[playerId].y;
        }
        if(thisElectron.health < 1 && (currentTick - thisElectron.timeOfDeath > electronStats[thisElectron.type].Reload * 1000))
        {
          thisElectron.health = electronStats[thisElectron.type].Health;
        }
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId + `/electrons/` + thisElectron.id).update({
          angle: thisElectron.angle, 
          x: thisElectron.x, 
          y: thisElectron.y, 
          timeOfDeath: thisElectron.timeOfDeath, 
          health: thisElectron.health
        })
        //Render
        let left = ((thisElectron.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((thisElectron.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        myElectronElements[thisElectron.id].style.transform = `translate3d(${left}, ${top}, 0)`;
        myElectronElements[thisElectron.id].querySelector(".Electron_sprite").style.background = "url(images/Electrons/" + thisElectron.type + ".png) no-repeat no-repeat";
      })

      //Mobs
      Object.keys(mobs).forEach((mob) => {
        const thisMob = mobs[mob];
        //Move
        let TargetX = 0;
        let TargetY = 0;
        let shortestDist = mapSize * 3;
        Object.keys(players).forEach((key) => {
          const characterState = players[key];
          if(distanceBetween(thisMob.x, thisMob.y, characterState.x, characterState.y) < shortestDist)
          {
            TargetX = characterState.x;
            TargetY = characterState.y;
          }
        })
        let targetDir = 90 - (Math.atan((TargetY - thisMob.y) / (TargetX - thisMob.x)) * 180.0 / Math.PI);
        if(TargetX < thisMob.x)
        {
          targetDir = (-90) - (Math.atan((TargetY - thisMob.y) / (TargetX - thisMob.x)) * 180.0 / Math.PI);
        }
        if(thisMob.type == "Screw")
        {
          thisMob.xV = Math.sin(targetDir * Math.PI / 180.0) * mobStats[thisMob.type].Speed;
          thisMob.yV = Math.cos(targetDir * Math.PI / 180.0) * mobStats[thisMob.type].Speed;
          thisMob.direction += 20;
        }
        //Velocities
        thisMob.xV *= 0.85;
        thisMob.yV *= 0.85;
        thisMob.x += thisMob.xV;
        thisMob.y += thisMob.yV;
        //Out of bounds
        if(thisMob.x > mapSize)
        {
          thisMob.x = mapSize;
        }
        if(thisMob.y > mapSize)
        {
          thisMob.y = mapSize;
        }
        if(thisMob.x < -mapSize)
        {
          thisMob.x = -mapSize;
        }
        if(thisMob.y < -mapSize)
        {
          thisMob.y = -mapSize;
        }
        firebase.database().ref(`games/` + gameCode + `/mobs/` + thisMob.id).update({
          x: thisMob.x, 
          y: thisMob.y, 
          xV: thisMob.x, 
          yV: thisMob.y, 
          health: thisMob.health, 
          direction: thisMob.direction
        })
        //Render
        let left = ((thisMob.x - myX) + ((screenDim.x / 2) - 64)) + "px";
        let top = ((thisMob.y - myY) + ((screenDim.y / 2) - 64)) + "px";
        mobElements[thisMob.id].style.transform = `translate3d(${left}, ${top}, 0)`;
        mobElements[thisMob.id].querySelector(".Mob_sprite").style.background = "url(images/Mobs/" + thisMob.type + ".png) no-repeat no-repeat";
        mobElements[thisMob.id].querySelector(".Mob_sprite").style.rotate = thisMob.direction + "deg";
        //Die If Dead
        if(thisMob.health <= 0)
        {
          firebase.database().ref("games/" + gameCode + "/mobs/" + thisMob.id).remove();
        }
      })

      //Move player
      if(isD || isRight)
      {
        xVel += 1
      }
      if(isA || isLeft)
      {
        xVel -= 1
      }
      if(isW || isUp)
      {
        yVel -= 1
      }
      if(isS || isDown)
      {
        yVel += 1
      }
      xVel *= 0.85;
      yVel *= 0.85;

      handleMovement(xVel, 0);
      handleMovement(0, yVel);
    }

    //repeat
    setTimeout(() => {
      tickLoop();
    }, 50);
  }
  function mobSpawnLoop() {
    if(players[playerId] != null) {
      //Game host mob spawn
      if(gameHost == localStorage.getItem("AtomixUser"))
      {
        if(mobsSpawned < Wave * 2)
        {
          let nMX = Math.round((Math.random() * (mapSize*2)) - mapSize);
          let nMY = Math.round((Math.random() * (mapSize*2)) - mapSize);
          let mobToSpawn = "";
          if(Wave < 4)
          {
            mobToSpawn = "Gear";
          } else if(Wave < 6) {
            mobToSpawn = randomFromArray(["Gear", "BallBearing"]);
          } else if(Wave < 8) {
            mobToSpawn = randomFromArray(["Gear", "BallBearing", "Screw"]);
          } else if(Wave < 11) {
            mobToSpawn = randomFromArray(["Gear", "BallBearing", "Screw", "LaserScrew"]);
          } else if(Wave < 16) {
            mobToSpawn = randomFromArray(["Gear", "BallBearing", "Screw", "LaserScrew", "Tanker"]);
          } else if(Wave < 21) {
            mobToSpawn = randomFromArray(mobList);
          } else {
            if(Wave % 7 == 0)
            {
              mobToSpawn = randomFromArray(mobList);
            } else {
              mobToSpawn = mobList[Wave % 7];
            }
          }
          while(distanceBetween(players[playerId].x, players[playerId].y, nMX, nMY) < 128)
          {
            nMX = Math.round((Math.random() * (mapSize*2)) - mapSize);
            nMY = Math.round((Math.random() * (mapSize*2)) - mapSize);
          }
          spawnMob(firebase.database().ref("games/" + gameCode + "/mobs/mob" + mobSpawnID), mobToSpawn, nMX, nMY);
          mobsSpawned++;
        }
        if(mobCount < 2)
        {
          Wave++;
          mobsSpawned = 0;
          firebase.database().ref(`games/` + gameCode + `/wave`).set(Wave);
        }
      }
    }

    //repeat
    setTimeout(() => {
      mobSpawnLoop();
    }, 1000);
  }
  function renderLoop() {
    document.querySelector("#rightWall").style.transform = "translate3d(" + (mapSize - myX) + "px, " + (-myY) + "px, 0)";
    document.querySelector("#rightWall").style.height = (2 * mapSize) + (screenDim.x/100) + "px";
    document.querySelector("#leftWall").style.transform = "translate3d(" + (-mapSize - myX) + "px, " + (-myY) + "px, 0)";
    document.querySelector("#leftWall").style.height = (2 * mapSize) + (screenDim.x/100) + "px";
    document.querySelector("#topWall").style.transform = "translate3d(" + (-myX) + "px, " + (-mapSize - myY) + "px, 0)";
    document.querySelector("#topWall").style.width = (2 * mapSize) + (screenDim.x/100) + "px";
    document.querySelector("#bottomWall").style.transform = "translate3d(" + (-myX) + "px, " + (mapSize - myY) + "px, 0)";
    document.querySelector("#bottomWall").style.width = (2 * mapSize) + (screenDim.x/100) + "px";

    //repeat
    setTimeout(() => {
      renderLoop();
    }, 50);
  }
  function handleMovement(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!players[playerId].isDead) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      myX = players[playerId].x;
      myY = players[playerId].y;
      let isCollision = false;
      if(Math.abs(myX) > mapSize || Math.abs(myY) > mapSize) isCollision = true;
      Object.keys(mobs).forEach((mob) => {
        const thisMob = mobs[mob];
        if(mobStats[thisMob.type] != undefined && distanceBetween(players[playerId].x, players[playerId].y, thisMob.x, thisMob.y) <= 13.0 + mobStats[thisMob.type].Size)
        {
          xVel = ((players[playerId].x - thisMob.x) / (13.0 + mobStats[thisMob.type].Size)) * 6;
          yVel = ((players[playerId].y - thisMob.y) / (13.0 + mobStats[thisMob.type].Size)) * 6;
          PlayerHealth -= mobStats[thisMob.type].Damage;
          thisMob.xV = ((players[playerId].x - thisMob.x) / (13.0 + mobStats[thisMob.type].Size)) * -1;
          thisMob.yV = ((players[playerId].y - thisMob.y) / (13.0 + mobStats[thisMob.type].Size)) * -1;
          thisMob.health -= 10;
        }
      })
      if(isCollision)
      {
        players[playerId].x = oldX;
        players[playerId].y = oldY;
        myX = players[playerId].x;
        myY = players[playerId].y;
      }
      playerRef.update({
        x: players[playerId].x, 
        y: players[playerId].y
      });
    }
  }
  function addElectron(ref, electron, IDX, eLayer, identifier) {
    let date = new Date();
    ElectronsPerShell[eLayer]++;
    ref.set({
      type: electron, 
      health: 0, 
      angle: (360 / ElectronsPerShell[eLayer]) * IDX, 
      layer: eLayer, 
      timeOfDeath: date.getTime(), 
      y: 0, 
      x: 0, 
      shellPos: IDX, 
      id: identifier
    })
  }
  function spawnMob(ref, mob, xPos, yPos) {
    ref.set({
      type: mob, 
      health: mobStats[mob].Health, 
      x: xPos, 
      y: yPos, 
      xV: 0, 
      yV: 0, 
      id: "mob" + mobSpawnID, 
      direction: 0
    })
    mobSpawnID++;
  }

  function initGame() {
    //Key Registers
    new KeyPressListener("ArrowUp", () => {isUp = true;}, () => {isUp = false;})
    new KeyPressListener("ArrowDown", () => {isDown = true;}, () => {isDown = false;})
    new KeyPressListener("ArrowLeft", () => {isLeft = true;}, () => {isLeft = false;})
    new KeyPressListener("ArrowRight", () => {isRight = true;}, () => {isRight = false})
    new KeyPressListener("KeyW", () => {isW = true;}, () => {isW = false;})
    new KeyPressListener("KeyA", () => {isA = true;}, () => {isA = false;})
    new KeyPressListener("KeyS", () => {isS = true;}, () => {isS = false;})
    new KeyPressListener("KeyD", () => {isD = true;}, () => {isD = false;})
    new KeyPressListener("Space", () => {spaceMultiplier = 2;}, () => {spaceMultiplier = 1;})

    const allPlayersRef = firebase.database().ref(`games/` + gameCode + `/players`);
    const myElectronsRef = firebase.database().ref(`games/` + gameCode + `/players/` + playerId + `/electrons`);
    const allMobsRef = firebase.database().ref(`games/` + gameCode + `/mobs`);
    const gameHostRef = firebase.database().ref(`games/` + gameCode + `/host`);
    const waveRef = firebase.database().ref(`games/` + gameCode + `/wave`);
    firebase.database().ref(`games/` + gameCode + `/wave`).set(Wave);

    allPlayersRef.on("value", (snapshot) => {
      //change
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        let left = ((characterState.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((characterState.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        if(characterState.id === playerId)
        {
          left = ((screenDim.x / 2) - 16) + "px";
          top = ((screenDim.y / 2) - 16) + "px";
        }
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //new nodes
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character");
      if(addedPlayer.id === playerId)
      {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
        <div class="Character_sprite"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
        </div>
      `);

      playerElements[addedPlayer.id] = characterElement;
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      let left = ((addedPlayer.x - myX) + ((screenDim.x / 2) - 16)) + "px";
      let top = ((addedPlayer.y - myY) + ((screenDim.y / 2) - 16)) + "px";
      if(addedPlayer.id === playerId)
      {
        left = ((screenDim.x / 2) - 16) + "px";
        top = ((screenDim.y / 2) - 16) + "px";
      }
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
    })
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })

    myElectronsRef.on("value", (snapshot) => {
      //change
      myElectrons = snapshot.val() || {};
      Object.keys(myElectrons).forEach((key) => {
        const thisElectron = myElectrons[key];
        //console.log(myElectronElements)
        let el = myElectronElements[key];
        let left = ((thisElectron.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((thisElectron.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    myElectronsRef.on("child_added", (snapshot) => {
      //new nodes
      const addedElectron = snapshot.val();
      const electronElement = document.createElement("div");
      electronElement.classList.add("Electron");
      electronElement.innerHTML = (`
        <div class="Electron_sprite"></div>
      `);

      myElectronElements[addedElectron.id] = electronElement;
      let left = ((addedElectron.x - myX) + ((screenDim.x / 2) - 16));
      let top = ((addedElectron.y - myY) + ((screenDim.y / 2) - 16));
      electronElement.style.transform = "translate3d(" + left + "px, " + top + "px, 0)";
      gameContainer.appendChild(electronElement);
    })
    myElectronsRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(myElectronElements[removedKey]);
      delete myElectronElements[removedKey];
    })

    allMobsRef.on("value", (snapshot) => {
      //change
      mobs = snapshot.val() || {};
      Object.keys(mobs).forEach((key) => {
        const thisMob = mobs[key];
        //console.log(myElectronElements)
        let el = mobElements[key];
        let left = ((thisMob.x - myX) + ((screenDim.x / 2) - 64)) + "px";
        let top = ((thisMob.y - myY) + ((screenDim.y / 2) - 64)) + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allMobsRef.on("child_added", (snapshot) => {
      //new nodes
      const addedMob = snapshot.val();
      const mobElement = document.createElement("div");
      mobElement.classList.add("Mob");
      mobElement.innerHTML = (`
        <div class="Mob_sprite"></div>
      `);

      mobElements[addedMob.id] = mobElement;
      let left = ((addedMob.x - myX) + ((screenDim.x / 2) - 64));
      let top = ((addedMob.y - myY) + ((screenDim.y / 2) - 64));
      mobElement.style.transform = "translate3d(" + left + "px, " + top + "px, 0)";
      gameContainer.appendChild(mobElement);
      mobCount++;
    })
    allMobsRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(mobElements[removedKey]);
      delete mobElements[removedKey];
      mobCount--;
    })

    gameHostRef.on("value", (snapshot) => {
      gameHost = snapshot.val();
    })
    waveRef.on("value", (snapshot) => {
      Wave = snapshot.val();
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
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      const left = mousePos.x - (screenDim.x/2);
      const top = mousePos.y - (screenDim.y/2);
      //1919, 977
    });
    window.onmousedown = () => {
      mouseDown = true;
    }
    window.onmouseup = () => {
      mouseDown = false;
    }

    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron1"), "Electron", 0, 0, "electron1");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron2"), "ChunkyElectron", 1, 0, "electron2");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron3"), "SpedElectron", 2, 0, "electron3");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron4"), "SmolElectron", 3, 0, "electron4");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron5"), "SharpElectron", 4, 0, "electron5");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron6"), "TankElectron", 5, 0, "electron6");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron7"), "Electron", 0, 1, "electron7");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron8"), "ChunkyElectron", 1, 1, "electron8");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron9"), "SpedElectron", 2, 1, "electron9");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron10"), "SmolElectron", 3, 1, "electron10");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron11"), "SharpElectron", 4, 1, "electron11");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron12"), "TankElectron", 5, 1, "electron12");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron13"), "Electron", 0, 2, "electron13");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron14"), "ChunkyElectron", 1, 2, "electron14");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron15"), "SpedElectron", 2, 2, "electron15");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron16"), "SmolElectron", 3, 2, "electron16");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron17"), "SharpElectron", 4, 2, "electron17");
    addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron18"), "TankElectron", 5, 2, "electron18");
    if(gameHost == localStorage.getItem("AtomixUser"))
    {
      spawnMob(firebase.database().ref("games/" + gameCode + "/mobs/mob" + mobSpawnID), "Gear", 100, 100);
    }
    oneSecondLoop();
    setTimeout(() => tickLoop(), 500);
    setTimeout(() => renderLoop(), 500);
    setTimeout(() => mobSpawnLoop(), 500);
  }
	firebase.auth().onAuthStateChanged((user) =>{
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`games/` + gameCode + `/players/${playerId}`);

      let name;
      if(localStorage.getItem("AtomixName") != null)
      {
        name = localStorage.getItem("AtomixName");
      } else {
        name = createName();
      }
      const x = 0;
      const y = 0;

      playerRef.set({
        id: playerId,
        name, 
        x,
        y,
        health: 100, 
        isDead: false, 
        op: false
      })

      //ADD PLAYER JOIN MSG

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