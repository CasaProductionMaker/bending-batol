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

//Player
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
let spaceMultiplier = 1;
let PlayerHealth = 250;
let currentBuild = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let electronNames = ["Electron", "ChunkyElectron", "SpedElectron", "SmolElectron", "TankElectron", "SharpElectron", "MissileElectron", "Magnet", "Taser", "Solder", "Neutron", "HeavyElectron", "PiercingElectron", "Mirror", "QuantumParticle", "DeterioratingElectron", "Neutralizer"];

//Electrons
let ElectronsPerShell = [0, 0, 0];

//Stats
let electronStats = {
  "Electron": {
    Health: 10, 
    Damage: 10, 
    Size: 6, 
    Reload: 2, 
    sReload: 0, 
    EPS: 1
  }, 
  "ChunkyElectron": {
    Health: 100, 
    Damage: 2, 
    Size: 10, 
    Reload: 4, 
    sReload: 0, 
    EPS: 1
  }, 
  "SpedElectron": {
    Health: 5, 
    Damage: 20, 
    Size: 6, 
    Reload: 3, 
    sReload: 0, 
    EPS: 1
  },      
  "SmolElectron": {
    Health: 10, 
    Damage: 8, 
    Size: 4, 
    Reload: 0.4, 
    sReload: 0, 
    EPS: 3
  }, 
  "TankElectron": {
    Health: 200, 
    Damage: 2, 
    Size: 12, 
    Reload: 5, 
    sReload: 0, 
    EPS: 1
  }, 
  "SharpElectron": {
    Health: 2, 
    Damage: 50, 
    Size: 7, 
    Reload: 5, 
    sReload: 0, 
    EPS: 1
  }, 
  "MissileElectron": {
    Health: 10, 
    Damage: 15, 
    Size: 7, 
    Reload: 1.5, 
    sReload: 0.5, 
    EPS: 1
  }, 
  "Magnet": {
    Health: 20, 
    Damage: 3, 
    Size: 10, 
    Reload: 2, 
    sReload: 0, 
    EPS: 1
  }, 
  "Taser": {
    Health: 10, 
    Damage: 5, 
    Size: 6, 
    Reload: 3, 
    sReload: 0, 
    EPS: 1
  }, 
  "Solder": {
    Health: 10, 
    Damage: 10, 
    Size: 5, 
    Reload: 2, 
    sReload: 1, 
    EPS: 1, 
    Heal: 10
  }, 
  "Neutron": {
    Health: 10, 
    Damage: 5, 
    Size: 7, 
    Reload: 2, 
    sReload: 0, 
    EPS: 1
  }, 
  "HeavyElectron": {
    Health: 100, 
    Damage: 5, 
    Size: 10, 
    Reload: 3, 
    sReload: 0.5, 
    EPS: 1
  }, 
  "PiercingElectron": {
    Health: 10, 
    Damage: 10, 
    Size: 7, 
    Reload: 2, 
    sReload: 0, 
    EPS: 1
  }, 
  "Mirror": {
    Health: 10, 
    Damage: 5, 
    Size: 6, 
    Reload: 2, 
    sReload: 0, 
    EPS: 1, 
    Reflection: 0.4
  }, 
  "QuantumParticle": {
    Health: 200, 
    Damage: 0, 
    Size: 8, 
    Reload: 3, 
    sReload: 1, 
    EPS: 1
  }, 
  "DeterioratingElectron": {
    Health: 10, 
    Damage: 5, 
    Size: 5, 
    Reload: 3, 
    sReload: 0, 
    EPS: 1, 
    Deterioration: 3
  }, 
  "Neutralizer": {
    Health: 5, 
    Damage: 2, 
    Size: 6, 
    Reload: 2, 
    sReload: 0, 
    EPS: 1, 
    HealReduction: 0.5
  }
}

//Time
let startTime = new Date();
let startTick = startTime.getTime();
let currentTick = startTick;

//Game
let gameHost = "";
let tickRate = 40;
let mapSize = 500;

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
  let playerElectronElements = {};
  let myElectrons = {};
  let myElectronElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");
  const chatSend = document.querySelector("#send-chat");
  const chatInput = document.querySelector("#chat-input");
  const chatDisplay = document.querySelector("#chat-display");

  function healLoop() {
    if(players[playerId] != null) {
      if(players[playerId].taserTime > 0)
      {
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
          taserTime: players[playerId].taserTime - 1
        })
      }
      if(players[playerId].healBlock > 0)
      {
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
          taserTime: players[playerId].healBlock - 0.1
        })
      }
      if(players[playerId].deterioration > 0)
      {
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
          taserTime: players[playerId].deterioration - 1, 
          health: players[playerId].health - 5
        })
      }
      if(players[playerId].health < 0)
      {
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
          health: 0
        })
      }
    }
    //repeat
    setTimeout(() => {
      healLoop();
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
        if(!thisElectron.isDetached) thisElectron.angle = (360 / ElectronsPerShell[thisElectron.layer]) * thisElectron.shellPos;
        //Rotate
        if(!thisElectron.isDetached) thisElectron.angle = (thisElectron.angle + ((currentTick * 0.15) * ((thisElectron.layer * 0.5) + 1))) % 360;
        if(!thisElectron.isDetached)
        {
          if(thisElectron.type == "MissileElectron" || thisElectron.type == "Taser")
          {
            thisElectron.direction = thisElectron.angle - 90;
          } else if(thisElectron.type == "PiercingElectron") {
            thisElectron.direction = thisElectron.angle + 90;
          } else {
            thisElectron.direction++;
          }
        }
        if(thisElectron.health > 0)
        {
          if(thisElectron.isDetached)
          {
            if(thisElectron.type == "MissileElectron")
            {
              thisElectron.x = thisElectron.x + (Math.sin(thisElectron.angle * Math.PI / 180.0) * 10);
              thisElectron.y = thisElectron.y - (Math.cos(thisElectron.angle * Math.PI / 180.0) * 10);
            }
            if(thisElectron.type == "HeavyElectron")
            {
              let multiplier = distanceBetween(myX, myY, thisElectron.x, thisElectron.y) - 250;
              thisElectron.x = thisElectron.x + (((myX - thisElectron.x) / 240) * multiplier);
              thisElectron.y = thisElectron.y + (((myY - thisElectron.y) / 240) * multiplier);
            }
          } else {
            let easing = 3;
            if(thisElectron.type == "HeavyElectron") easing = 5;
            thisElectron.x = thisElectron.x + (((players[playerId].x + (Math.sin(thisElectron.angle * Math.PI / 180.0) * ((thisElectron.layer + 1) * 32 * spaceMultiplier))) - thisElectron.x) / easing);
            thisElectron.y = thisElectron.y + (((players[playerId].y + (Math.cos(thisElectron.angle * Math.PI / 180.0) * ((thisElectron.layer + 1) * -32 * spaceMultiplier))) - thisElectron.y) / easing);
          }
        } else {
          thisElectron.x = players[playerId].x;
          thisElectron.y = players[playerId].y;
        }
        //Special
        if(thisElectron.type == "Solder" && players[playerId].health < PlayerHealth)
        {
          if(currentTick - thisElectron.timeOfDeath > (electronStats[thisElectron.type].Reload + electronStats[thisElectron.type].sReload) * 1000)
          {
            thisElectron.health = 0;
            thisElectron.x = players[playerId].x;
            thisElectron.y = players[playerId].y;
            let heal = electronStats[thisElectron.type].Heal;
            heal -= heal * players[playerId].healBlock;
            firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
              health: players[playerId].health + heal > PlayerHealth ? PlayerHealth : players[playerId].health + heal
            })
          }
        }
        if(thisElectron.type == "MissileElectron" && spaceMultiplier == 2 && currentTick - thisElectron.timeOfDeath > (electronStats[thisElectron.type].Reload + electronStats[thisElectron.type].sReload) * 1000)
        {
          thisElectron.isDetached = true;
        }
        if(thisElectron.type == "MissileElectron" && distanceBetween(thisElectron.x, thisElectron.y, myX, myY) > 500)
        {
          thisElectron.health = 0;
        }
        if(thisElectron.type == "HeavyElectron" && currentTick - thisElectron.timeOfDeath > (electronStats[thisElectron.type].Reload + electronStats[thisElectron.type].sReload) * 1000)
        {
          thisElectron.isDetached = (spaceMultiplier == 2);
        }
        //Damage
        Object.keys(players).forEach((player) => {
          const thisPlayer = players[player];

          if(thisPlayer.id != playerId && distanceBetween(thisElectron.x, thisElectron.y, thisPlayer.x, thisPlayer.y) < 14 + electronStats[thisElectron.type].Size)
          {
            let damage = electronStats[thisElectron.type].Damage;
            if(thisPlayer.health > 200 && thisElectron.type == "PiercingElectron") damage *= 10;
            thisElectron.x += ((thisElectron.x - thisPlayer.x) / (14 + electronStats[thisElectron.type].Size)) * 2;
            thisElectron.y += ((thisElectron.y - thisPlayer.y) / (14 + electronStats[thisElectron.type].Size)) * 2;
            thisElectron.health -= 10;
            thisPlayer.x += ((thisPlayer.x - thisElectron.x) / (14 + electronStats[thisElectron.type].Size)) * 2;
            thisPlayer.y += ((thisPlayer.y - thisElectron.y) / (14 + electronStats[thisElectron.type].Size)) * 2;
            thisPlayer.health -= damage;
            if(thisElectron.type == "Taser")
            {
              thisPlayer.taserTime += 3;
            }
            if(thisElectron.type == "Neutralizer")
            {
              thisPlayer.healBlock += 0.2;
            }
            if(thisElectron.type == "DeterioratingElectron")
            {
              thisPlayer.deterioration += electronStats[thisElectron.type].Deterioration;
            }
            playerRef.update({
              health: players[playerId].health - (damage * thisPlayer.reflection)
            })
            //Update
            firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
              x: thisPlayer.x, 
              y: thisPlayer.y, 
              health: thisPlayer.health, 
              taserTime: thisPlayer.taserTime
            })
          }
          if(thisPlayer.id == playerId && distanceBetween(thisElectron.x, thisElectron.y, thisPlayer.x, thisPlayer.y) < 500 && thisElectron.type == "Magnet")
          {
            thisPlayer.x += ((thisElectron.x - thisPlayer.x) / 24) * 2;
            thisPlayer.y += ((thisElectron.y - thisPlayer.y) / 24) * 2;
            //Update
            firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id).update({
              x: thisPlayer.x, 
              y: thisPlayer.y
            })
          }
          if(thisPlayer.id != playerId && thisPlayer.electrons != null)
          {
            Object.keys(thisPlayer.electrons).forEach((iE) => {
              const thisOtherElectron = thisPlayer.electrons[iE];

              if(distanceBetween(thisElectron.x, thisElectron.y, thisOtherElectron.x, thisOtherElectron.y) < electronStats[thisOtherElectron.type].Size + electronStats[thisElectron.type].Size && thisOtherElectron.health > 0)
              {
                thisElectron.x += ((thisElectron.x - thisOtherElectron.x) / (electronStats[thisOtherElectron.type].Size + electronStats[thisElectron.type].Size)) * 2;
                thisElectron.y += ((thisElectron.y - thisOtherElectron.y) / (electronStats[thisOtherElectron.type].Size + electronStats[thisElectron.type].Size)) * 2;
                thisElectron.health -= electronStats[thisOtherElectron.type].Damage;
                thisOtherElectron.x += ((thisOtherElectron.x - thisElectron.x) / (electronStats[thisOtherElectron.type].Size + electronStats[thisElectron.type].Size)) * 2;
                thisOtherElectron.y += ((thisOtherElectron.y - thisElectron.y) / (electronStats[thisOtherElectron.type].Size + electronStats[thisElectron.type].Size)) * 2;
                thisOtherElectron.health -= electronStats[thisElectron.type].Damage;
                //Update
                firebase.database().ref(`games/` + gameCode + `/players/` + thisPlayer.id + `/electrons/` + thisOtherElectron.id).update({
                  x: thisOtherElectron.x, 
                  y: thisOtherElectron.y, 
                  health: thisOtherElectron.health
                })
              }
            })
          }
        })
        if(thisElectron.health < 1 && thisElectron.health > -1000000)
        {
          thisElectron.timeOfDeath = currentTick;
          thisElectron.health = -1000000;
          thisElectron.x = players[playerId].x;
          thisElectron.y = players[playerId].y;
          thisElectron.isDetached = false;
        }
        //Respawn
        if(thisElectron.health < 1 && (currentTick - thisElectron.timeOfDeath > electronStats[thisElectron.type].Reload * 1000))
        {
          thisElectron.health = electronStats[thisElectron.type].Health;
        }
        //Update
        firebase.database().ref(`games/` + gameCode + `/players/` + playerId + `/electrons/` + thisElectron.id).update({
          angle: thisElectron.angle, 
          x: thisElectron.x, 
          y: thisElectron.y, 
          timeOfDeath: thisElectron.timeOfDeath, 
          health: thisElectron.health, 
          direction: thisElectron.direction, 
          isDetached: thisElectron.isDetached
        })
        //Render
        let left = ((thisElectron.x - myX) + ((screenDim.x / 2) - 16)) + "px";
        let top = ((thisElectron.y - myY) + ((screenDim.y / 2) - 16)) + "px";
        if(myElectronElements[thisElectron.id] != undefined)
        {
          myElectronElements[thisElectron.id].style.transform = `translate3d(${left}, ${top}, 0)`;
          myElectronElements[thisElectron.id].querySelector(".Electron_sprite").style.rotate = thisElectron.direction + "deg";
          myElectronElements[thisElectron.id].querySelector(".Electron_sprite").style.background = "url(images/Electrons/" + thisElectron.type + ".png) no-repeat no-repeat";
        }
      })

      //Move player
      if(isD || isRight)
      {
        xVel += 1 / (players[playerId].taserTime + 1);
      }
      if(isA || isLeft)
      {
        xVel -= 1 / (players[playerId].taserTime + 1);
      }
      if(isW || isUp)
      {
        yVel -= 1 / (players[playerId].taserTime + 1);
      }
      if(isS || isDown)
      {
        yVel += 1 / (players[playerId].taserTime + 1);
      }
      xVel *= 0.85;
      yVel *= 0.85;

      handleMovement(xVel, 0);
      handleMovement(0, yVel);
    }

    //repeat
    setTimeout(() => {
      tickLoop();
    }, tickRate);
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
    }, tickRate);
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
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        if(characterState.id != playerId && distanceBetween(myX, myY, characterState.x, characterState.y) < 28)
        {
          xVel = ((myX - characterState.x) / 28) * 2;
          yVel = ((myY - characterState.y) / 28) * 2;
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
    if(electron == "Neutron") PlayerHealth += 100;
    if(electron == "Mirror")
    {
      firebase.database().ref(`games/` + gameCode + `/players/` + playerId).update({
        reflection: electronStats[electron].Reflection
      });
    }
    ref.set({
      type: electron, 
      health: 0, 
      angle: (360 / ElectronsPerShell[eLayer]) * IDX, 
      layer: eLayer, 
      timeOfDeath: date.getTime(), 
      y: 0, 
      x: 0, 
      shellPos: IDX, 
      id: identifier, 
      direction: 0, 
      isDetached: false
    })
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
    const gameHostRef = firebase.database().ref(`games/` + gameCode + `/host`);

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
          if(characterState.health < 0) characterState.health = 0;
          if((characterState.health / PlayerHealth) * 100 >= 50)
          {
            document.querySelector(".hp-cover").style.left = (((((characterState.health / PlayerHealth) * 2) - 1) * 434) - 434) + "px";
            document.querySelector(".hp-cover").style.background = "url(images/health/HPAdd.png)";
          }
          if((characterState.health / PlayerHealth) * 100 < 50)
          {
            document.querySelector(".hp-cover").style.left = ((((characterState.health / PlayerHealth) * 2) * 434) - 434) + "px";
            document.querySelector(".hp-cover").style.background = "url(images/health/HPCover.png)";
          }
        }
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
        if(characterState.id != playerId)
        {
          if(playerElectronElements[key] != undefined && characterState.electrons != undefined)
          {
            Object.keys(characterState.electrons).forEach((electron) => {
              let thisElectron = characterState.electrons[electron];
              //Render
              let eleft = (thisElectron.x - characterState.x) + "px";
              let etop = ((thisElectron.y - characterState.y) - 32) + "px";
              if(playerElectronElements[key][thisElectron.id] != undefined)
              {
                playerElectronElements[key][thisElectron.id].style.transform = `translate3d(${eleft}, ${etop}, 0)`;
                playerElectronElements[key][thisElectron.id].querySelector(".Electron_sprite").style.background = "url(images/Electrons/" + thisElectron.type + ".png) no-repeat no-repeat";
                if(thisElectron.health <= 0) playerElectronElements[key][thisElectron.id].querySelector(".Electron_sprite").style.background = "url(images/Electrons/None.png) no-repeat no-repeat";
                playerElectronElements[key][thisElectron.id].querySelector(".Electron_sprite").style.rotate = thisElectron.direction + "deg";
              } else {
                let thisElectronElement = document.createElement("div");
                thisElectronElement.classList.add("Electron");
                thisElectronElement.innerHTML = (`
                  <div class="Electron_sprite"></div>
                `);

                //Render
                let eleft = (thisElectron.x - characterState.x) + "px";
                let etop = ((thisElectron.y - characterState.y) - 32) + "px";
                thisElectronElement.style.transform = `translate3d(${eleft}, ${etop}, 0)`;
                thisElectronElement.querySelector(".Electron_sprite").style.background = "url(images/Electrons/" + thisElectron.type + ".png) no-repeat no-repeat";

                //Add
                playerElectronElements[characterState.id][thisElectron.id] = thisElectronElement;
                el.appendChild(thisElectronElement);
              }
            })
          } else if(characterState.electrons != undefined) {
            playerElectronElements[characterState.id] = {};
            Object.keys(characterState.electrons).forEach((electron) => {
              let thisElectron = characterState.electrons[electron];
              let thisElectronElement = document.createElement("div");
              thisElectronElement.classList.add("Electron");
              thisElectronElement.innerHTML = (`
                <div class="Electron_sprite"></div>
              `);

              //Render
              let eleft = (thisElectron.x - characterState.x) + "px";
              let etop = ((thisElectron.y - characterState.y) - 32) + "px";
              thisElectronElement.style.transform = `translate3d(${eleft}, ${etop}, 0)`;
              thisElectronElement.querySelector(".Electron_sprite").style.background = "url(images/Electrons/" + thisElectron.type + ".png) no-repeat no-repeat";

              //Add
              playerElectronElements[characterState.id][thisElectron.id] = thisElectronElement;
              el.appendChild(thisElectronElement);
            })
            console.log(characterState.electrons)
          }
        }
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

      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      let left = ((addedPlayer.x - myX) + ((screenDim.x / 2) - 16)) + "px";
      let top = ((addedPlayer.y - myY) + ((screenDim.y / 2) - 16)) + "px";
      if(addedPlayer.id === playerId)
      {
        left = ((screenDim.x / 2) - 16) + "px";
        top = ((screenDim.y / 2) - 16) + "px";
      }
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      //Electrons
      if(addedPlayer.id != playerId && addedPlayer.electrons != undefined)
      {
        playerElectronElements[addedPlayer.id] = {};
        Object.keys(addedPlayer.electrons).forEach((electron) => {
          let thisElectron = addedPlayer.electrons[electron];
          let thisElectronElement = document.createElement("div");
          thisElectronElement.classList.add("Electron");
          thisElectronElement.innerHTML = (`
            <div class="Electron_sprite"></div>
          `);

          //Render
          let eleft = ((thisElectron.x - myX) + ((screenDim.x / 2) - 16)) + "px";
          let etop = ((thisElectron.y - myY) + ((screenDim.y / 2) - 16)) + "px";
          thisElectronElement.style.transform = `translate3d(${eleft}, ${etop}, 0)`;
          thisElectronElement.querySelector(".Electron_sprite").style.background = "url(images/Electrons/" + thisElectron.type + ".png) no-repeat no-repeat";

          //Add
          playerElectronElements[addedPlayer.id][thisElectron.id] = thisElectronElement;
          characterElement.appendChild(thisElectronElement);
        })
      }
      //Add
      playerElements[addedPlayer.id] = characterElement;
      gameContainer.appendChild(characterElement);
    })
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
      delete playerElectronElements[removedKey];
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

    gameHostRef.on("value", (snapshot) => {
      gameHost = snapshot.val();
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
    let promises = currentBuild.map((_, i) => {
      return firebase.database().ref("users/" + localStorage.getItem("AtomixUser") + "/build/" + i).once("value").then((snapshot) => {
        currentBuild[i] = electronNames.indexOf(snapshot.val());
        addElectron(firebase.database().ref("games/" + gameCode + "/players/" + playerId + "/electrons/electron" + i), electronNames[currentBuild[i]], i % 6, Math.floor(i / 6), "electron" + i);
      });
    });

    Promise.all(promises).then(() => {
      console.log("All data retrieved, ready to proceed. currentBuild: ");
      console.log(currentBuild)
    }).catch((error) => {
      console.error("Error retrieving data: ", error);
    });
    if(gameHost == localStorage.getItem("AtomixUser"))
    {
      //
    }
    healLoop();
    setTimeout(() => tickLoop(), 500);
    setTimeout(() => renderLoop(), 500);
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
      const x = Math.round(Math.random() * mapSize * 2) - mapSize;
      const y = Math.round(Math.random() * mapSize * 2) - mapSize;

      playerRef.set({
        id: playerId,
        name, 
        x,
        y,
        health: PlayerHealth, 
        isDead: false, 
        op: false, 
        taserTime: 0, 
        reflection: 0, 
        deterioration: 0, 
        healBlock: 0
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