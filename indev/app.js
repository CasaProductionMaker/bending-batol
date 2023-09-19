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

let myAttackIdx = 16;
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: undefined, y: undefined};
let mouseTile = {x: undefined, y: undefined};
let myBending;
let FireId = 0;
let fireRowId = 0;
let direction = null;
let myMoveId = 0;
let cooldown = 0;
let experience = -1;
let currentDir = {x: 1, y: 0};
let myBinds = [null, null, null];
let bindMove = null;
let FireMoves = ["Blaze Arrow Indev", "Blaze Mouse Indev"];
let FireXP = [0, 0];
let FireDesc = [
  "Shoot out a huge flame to burn your enemies.", 
  "Smae thing"
];
let FireInst = [
  "Move in the direction you want to shoot the fire and then quickly press space.", 
  "Click on a tile on the same axis as you to shoot there."
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
function isSolid(x, y) {
  const mapData = getCurrentMapData();
  let blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  return (
    blockedNextSpace || 
    x >= mapData.maxX || 
    x < mapData.minX || 
    y >= mapData.maxY || 
    y < mapData.minY
  )
}
function getRandomSafeSpot() {
  let x = Math.floor(Math.random() * 13);
  let y = Math.floor(Math.random() * 11);
  while(isSolid(x, y))
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
  let fire = {};
  let fireElements = {};
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
    let MoveDescList;
    let MoveInstList;
    if(myBending == "Fire") MoveDescList = FireDesc;
    if(myBending == "Fire") MoveInstList = FireInst;
    MoveDesc.innerText = MoveDescList[myMoveId];
    MoveInst.innerText = MoveInstList[myMoveId];
    //repeat
    setTimeout(() => {
      tickLoop();
    }, 1);
  }
  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if (!isSolid(newX, newY) && !players[playerId].isDead && players[playerId].health > 0 && document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT') {
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
    currentDir = {x: xChange, y: yChange};
    setTimeout(() => {
      direction = null;
    }, 300);
  }
  function handleAttack() {
    if(myBending == "Fire" && direction != null && myMoveId == 0 && cooldown == 0)
    {
      let blocked = false;
      for(var i = 1; i < 6; i++) {
        const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
        if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i)))
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
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x) && !blocked)
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
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x) && !blocked)
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
        if(!isSolid(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2) && !sblocked)
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
        if(!isSolid(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2) && !sblocked)
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
      cooldown = 1;
      coolDown.innerText = "Cooldown: " + cooldown;
    }
  }
  function switchMove() {
    myMoveId++;
    let moveList;
    let xpList;
    if(myBending == "Fire") moveList = FireMoves;
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
    new KeyPressListener("KeyB", () => bindCurrentMove())
    new KeyPressListener("Digit1", () => attemptBindMove(0))
    new KeyPressListener("Digit2", () => attemptBindMove(1))
    new KeyPressListener("Digit3", () => attemptBindMove(2))
    new KeyPressListener("ShiftLeft", () => HoldPlayer())

    const allPlayersRef = firebase.database().ref(`players`);
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

    document.querySelector("#up-move").addEventListener("click", () => handleArrowPress(0, -1))
    document.querySelector("#down-move").addEventListener("click", () => handleArrowPress(0, 1))
    document.querySelector("#left-move").addEventListener("click", () => handleArrowPress(-1, 0))
    document.querySelector("#right-move").addEventListener("click", () => handleArrowPress(1, 0))
    document.querySelector("#attack").addEventListener("click", () => handleAttack())

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
    document.onclick = async function(event) {
      if(event === undefined) event = window.event;
      var target = "target" in event ? event.target : event.srcElement;
      let change = {x: players[playerId].x - mouseTile.x, y: players[playerId].y - mouseTile.y};
      let changeIsX = 0;
      let changeIsY = 0;
      if(Math.abs(change.x) >= Math.abs(change.y))
      {
        direction = {x: -change.x / Math.abs(change.x), y: 0}
      }
      if(Math.abs(change.y) > Math.abs(change.x))
      {
        direction = {x: 0, y: -change.y / Math.abs(change.y)}
      }
      if(myBending == "Fire" && direction != null && myMoveId == 1 && cooldown == 0)
      {
        let blocked = false;
        for(var i = 1; i < 6; i++) {
          const fireRef = firebase.database().ref(`fire/${playerId + fireRowId}`);
          if(!isSolid(players[playerId].x + (direction.x * i), players[playerId].y + (direction.y * i)))
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
          if(!isSolid(players[playerId].x + (direction.x * i) + direction.y, players[playerId].y + (direction.y * i) + direction.x) && !blocked)
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
          if(!isSolid(players[playerId].x + (direction.x * i) - direction.y, players[playerId].y + (direction.y * i) - direction.x) && !blocked)
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
          if(!isSolid(players[playerId].x + (direction.x * i) + direction.y * 2, players[playerId].y + (direction.y * i) + direction.x * 2) && !sblocked)
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
          if(!isSolid(players[playerId].x + (direction.x * i) - direction.y * 2, players[playerId].y + (direction.y * i) - direction.x * 2) && !sblocked)
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
        cooldown = 1;
        coolDown.innerText = "Cooldown: " + cooldown;
      }
    };
    setMove(0);
    if(myBending == "Fire") myMoveId = 1;
    let moveList;
    if(myBending == "Fire") moveList = FireMoves;
    currentMove.innerText = "Current Move: " + moveList[myMoveId];
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

      let name;
      if(localStorage.getItem("Name") == null)
      {
        localStorage.setItem("Name", createName());
      }
      name = localStorage.getItem("Name");
      playerNameInput.value = name;

      const {x, y} = getRandomSafeSpot();


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

      myBending = "Fire";

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