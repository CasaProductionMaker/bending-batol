//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyD45xgHgOVARIYyKkx1tJztg2QKLwVX4j0",
  authDomain: "block-game-2b27b.firebaseapp.com",
  projectId: "block-game-2b27b",
  storageBucket: "block-game-2b27b.appspot.com",
  messagingSenderId: "664778162781",
  appId: "1:664778162781:web:ee1a91d4a59e2629bd83b4"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//My Code
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: undefined, y: undefined};
let mouseTile = {x: undefined, y: undefined};
let mouseDown = false;
let myX;
let myY;
let yVel = 0.1;
let xVel = 0;
let mineIdx = 0;
let myBlockId = 0;
let renderDistance = 5;
let isMapG;
let worldRad = 20;
let action = 0;

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

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
function isSolid(x, y) {
  return false;
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
var M = 4294967296, 
A = 1664525, 
C = 1;
var Z = Math.floor(Math.random() * M);
function rand(){
  Z = (A * Z + C) % M;
  return Z / M - 0.5;
};

function interpolate(pa, pb, px){
  var ft = px * Math.PI,
  f = (1 - Math.cos(ft)) * 0.5;
  return pa * (1 - f) + pb * f;
}

(function() {

	let playerId;
	let playerRef;
  let players = {};
  let playerElements = {};
  let block = {};
  let blockElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");
  const respawnContainer = document.querySelector(".respawn-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerColorButton = document.querySelector("#player-color");
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
          const {x, y} = getRandomSafeSpot();
          playerRef.update({
            isDead: false, 
            coins: 0, 
            health: 5, 
            x, 
            y, 
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
  function tickLoop() {
    if(players[playerId] != null) {
      if(players[playerId].health <= 0) {
        playerRef.update({
          isDead: true
        })
      }
      handleMovement(0, yVel);
      handleMovement(xVel, 0);
      yVel += 0.001;
    }

    //repeat
    setTimeout(() => {
      tickLoop();
    }, 1);
  }
  function renderLoop() {
    Object.keys(block).forEach((key) => {
      const blockState = block[key];
      if(!(blockState.x - myX > renderDistance || blockState.x - myX < -renderDistance || blockState.y - myY > renderDistance || blockState.y - myY < -renderDistance))
      {
        let el = blockElements[blockState.id];
        const left = 16 * ((blockState.x - myX) + 7) + "px";
        const top = 16 * ((blockState.y - myY) + 7) + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
        el.querySelector(".Block_sprite").setAttribute("data-far", "false");
      } else {
        let el = blockElements[blockState.id];
        el.querySelector(".Block_sprite").setAttribute("data-far", "true");
      }
    })

    //repeat
    setTimeout(() => {
      renderLoop();
    }, 1);
  }
  function mineLoop() {
    if(mouseDown)
    {
      let isBlock = false;
      Object.keys(block).forEach((key) => {
        const blockState = block[key];
        if(blockState.x === mouseTile.x && blockState.y === mouseTile.y && action != 2)
        {
          isBlock = true;
          let hpRed = 0;
          if(mineIdx % blockState.strength == 0)
          {
            hpRed = 1;
          }
          firebase.database().ref("block/" + key).update({
            hp: blockState.hp - hpRed
          })
          if(blockState.hp - 1 <= 0)
          {
            firebase.database().ref("block/" + key).remove();
          }
          action = 1;
        }
      })
      if(!isBlock && action != 1)
      {
        blockRef = firebase.database().ref(`block/` + playerId + myBlockId);
        blockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          id: playerId + myBlockId, 
          type: "grass", 
          sizeX: 1.0, 
          sizeY: 1.0, 
          hp: 5, 
          strength: 30
        })
        myBlockId++;
        action = 2;
      }
    }
    mineIdx += 1;

    //repeat
    setTimeout(() => {
      mineLoop();
    }, 10);
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
      if(yChange < 0)
      {
        yVel = yChange;
      }
      if (xChange > 0) {
        players[playerId].direction = "right";
      }
      if (xChange < 0) {
        players[playerId].direction = "left";
      }
      myX = players[playerId].x;
      myY = players[playerId].y;
      let isCollision = false;
      Object.keys(block).forEach((key) => {
        const blockState = block[key];
        if(myX + 0.25 > blockState.x - (blockState.sizeX/2) && myX - 0.25 < blockState.x + (blockState.sizeX/2) && (myY - 0.275) + 0.5 > blockState.y - (blockState.sizeY/2) && (myY - 0.15) - 0.5 < blockState.y + (blockState.sizeY/2) && !(blockState.sizeX == 0))
        {
          isCollision = true;
        }
      })
      if(isCollision && yChange != 0)
      {
        yVel = 0;
      }
      if(isCollision)
      {
        players[playerId].x = oldX;
        players[playerId].y = oldY;
        myX = players[playerId].x;
        myY = players[playerId].y;
      }
      playerRef.set(players[playerId]);
    }
    Object.keys(block).forEach((key) => {
      const blockState = block[key];
      if(!(blockState.x - myX > renderDistance || blockState.x - myX < -renderDistance || blockState.y - myY > renderDistance || blockState.y - myY < -renderDistance))
      {
        let el = blockElements[blockState.id];
        const left = 16 * ((blockState.x - myX) + 7) + "px";
        const top = 16 * ((blockState.y - myY) + 7) + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
        el.querySelector(".Block_sprite").setAttribute("data-far", "false");
      } else {
        let el = blockElements[blockState.id];
        el.querySelector(".Block_sprite").setAttribute("data-far", "true");
      }
    })
  }
  function handleAttack() {
    //
  }
  function generateStoneLayer(y)
  {
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/init` + i + "x" + y);
      blockRef.set({
        x: i, 
        y, 
        id: "init" + i + "x" + y, 
        type: "stone", 
        sizeX: 1.0, 
        sizeY: 1.0, 
        hp: 5, 
        strength: 50
      })
    }
  }
  function placeBlock(type, x, y, Xs, Ys, str, uniquifier)
  {
    let blockRef = firebase.database().ref(`block/` + uniquifier + x + "x" + y);
    blockRef.set({
      x, 
      y, 
      id: uniquifier + x + "x" + y,  
      type, 
      sizeX: Xs, 
      sizeY: Ys, 
      hp: 5, 
      strength: str
    })
  }
  function generateMap()
  {
    let blockRef;
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/init` + i + "x" + "10");
      blockRef.set({
        x: i, 
        y: 10, 
        id: "init" + i + "x" + "10", 
        type: "bedrock", 
        sizeX: 1.0, 
        sizeY: 1.0, 
        hp: 5, 
        strength: 9000000000000000000000000000000000000000000000000
      })
    }
    generateStoneLayer(9);
    generateStoneLayer(8);
    generateStoneLayer(7);
    generateStoneLayer(6);
    generateStoneLayer(5);
    generateStoneLayer(4);
    generateStoneLayer(3);
    generateStoneLayer(2);
    generateStoneLayer(1);
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/init` + i + "x" + "0");
      blockRef.set({
        x: i, 
        y: 0, 
        id: "init" + i + "x" + "0", 
        type: "grass", 
        sizeX: 1.0, 
        sizeY: 1.0, 
        hp: 5, 
        strength: 30
      })
    }

    var x = -worldRad,
    y = 10,
    amp = -3, //amplitude
    wl = 5, //wavelength
    a = rand(),
    b = rand(), 
    worldSurface = -2;

    let treePos = [];
    while(x < worldRad){
      if(x % wl === 0){
        a = b;
        b = rand();
        y = worldSurface + a * amp;
      }else{
        y = worldSurface + interpolate(a, b, (x % wl) / wl) * amp;
      }
      blockRef = firebase.database().ref(`block/pn` + Math.round(x) + "x" + Math.round(y));
      blockRef.set({
        x: Math.round(x), 
        y: Math.round(y), 
        id: "pn" + Math.round(x) + "x" + Math.round(y), 
        type: "grass", 
        sizeX: 1.0, 
        sizeY: 1.0, 
        hp: 5, 
        strength: 30
      })
      if(Math.random() < 0.1)
      {
        treePos.push([Math.round(x), Math.round(y-1)]);
      }
      for(let i = 0; i < Math.abs(Math.round(y)); i++)
      {
        blockRef = firebase.database().ref(`block/pn` + Math.round(x) + "x" + Math.round(y+i));
        blockRef.set({
          x: Math.round(x), 
          y: Math.round(y+i), 
          id: "pn" + Math.round(x) + "x" + Math.round(y+i), 
          type: "grass", 
          sizeX: 1.0, 
          sizeY: 1.0, 
          hp: 5, 
          strength: 30
        })
      }
      x += 1;
    }
    for(var i = 0; i < treePos.length; i++) {
      for (var Hi = 0; Hi < 5; Hi++) {
        if(Math.random() < (1 - (Hi/5)) || Hi < 2)
        {
          blockRef = firebase.database().ref(`block/pn` + treePos[i][0] + "x" + (treePos[i][1] - Hi));
          blockRef.set({
            x: treePos[i][0], 
            y: (treePos[i][1] - Hi), 
            id: "pn" + treePos[i][0] + "x" + (treePos[i][1] - Hi), 
            type: "log", 
            sizeX: 0.0, 
            sizeY: 0.0, 
            hp: 5, 
            strength: 30
          })
        } else {
          placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
          placeBlock("leaves", treePos[i][0] + 1, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
          placeBlock("leaves", treePos[i][0] - 1, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
          if(Math.random() < 0.6)
          {
            placeBlock("leaves", treePos[i][0] + 2, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] + 3, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] + 4, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              }
            }
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] + 1, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] + 2, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] + 3, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                }
              }
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] + 1, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] + 2, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  if(Math.random() < 0.05)
                  {
                    placeBlock("leaves", treePos[i][0] + 3, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  }
                }
              }
            }
          }
          if(Math.random() < 0.6)
          {
            placeBlock("leaves", treePos[i][0] - 2, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] - 3, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] - 4, (treePos[i][1] - Hi) + 1, 0.0, 0.0, 15, "pn");
              }
            }
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0] - 1, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] - 2, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] - 3, (treePos[i][1] - Hi), 0.0, 0.0, 15, "pn");
                }
              }
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0] - 1, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                if(Math.random() < 0.1)
                {
                  placeBlock("leaves", treePos[i][0] - 2, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  if(Math.random() < 0.05)
                  {
                    placeBlock("leaves", treePos[i][0] - 3, (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
                  }
                }
              }
            }
          }
          if(Math.random() < 0.6)
          {
            placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi) - 1, 0.0, 0.0, 15, "pn");
            if(Math.random() < 0.4)
            {
              placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi) - 2, 0.0, 0.0, 15, "pn");
              if(Math.random() < 0.2)
              {
                placeBlock("leaves", treePos[i][0], (treePos[i][1] - Hi) - 3, 0.0, 0.0, 15, "pn");
              }
            }
          }
          break;
        }
      }
    }
  }

  function initGame() {
    new KeyPressListener("ArrowUp", () => {
      if(yVel == 0.001) handleMovement(0, -0.05)
    }, () => handleMovement(0, 0))
    new KeyPressListener("ArrowLeft", () => {xVel = -0.03}, () => {if(xVel == -0.03) xVel = 0})
    new KeyPressListener("ArrowRight", () => {xVel = 0.03}, () => {if(xVel == 0.03) xVel = 0})
    new KeyPressListener("KeyW", () => {
      if(yVel == 0.001) handleMovement(0, -0.05)
    }, () => handleMovement(0, 0))
    new KeyPressListener("KeyA", () => {xVel = -0.03}, () => {if(xVel == -0.03) xVel = 0})
    new KeyPressListener("KeyD", () => {xVel = 0.03}, () => {if(xVel == 0.03) xVel = 0})
    new KeyPressListener("Space", () => handleAttack())

    const allPlayersRef = firebase.database().ref(`players`);
    const allBlockRef = firebase.database().ref(`block`);
    const isMap = firebase.database().ref(`isMapGen`);

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
        let left = 16 * ((characterState.x - myX) + 7) + "px";
        let top = 16 * ((characterState.y - myY) + 7) + "px";
        if(characterState.id === playerId)
        {
          left = "112px";
          top = "112px";
        }
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
      setTimeout(() => {
        console.log(isMapG);
        if(isMapG === false)
        {
          generateMap();
          firebase.database().ref().update({
            isMapGen: true
          })
        }
      }, 1000)
    })
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })

    allBlockRef.on("value", (snapshot) => {
      block = snapshot.val() || {};
      Object.keys(block).forEach((key) => {
        const blockState = block[key];
        let el = blockElements[blockState.id];
        const left = 16 * ((blockState.x - myX) + 7) + "px";
        const top = 16 * ((blockState.y - myY) + 7) + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    });
    allBlockRef.on("child_added", (snapshot) => {
      const block = snapshot.val();
      const key = block.id;
      block[key] = true;

      // Create the DOM Element
      const blockElement = document.createElement("div");
      blockElement.classList.add("Block", "grid-cell");
      blockElement.innerHTML = `
        <div class="Block_sprite grid-cell"></div>
        <div class="Block_break_sprite_overlay grid-cell"></div>
      `;
      // Style the Element
      blockElement.querySelector(".Block_sprite").setAttribute("data-type", block.type);
      const left = 16 * ((block.x - myX) + 7) + "px";
      const top = 16 * ((block.y - myY) + 7) + "px";
      blockElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      blockElements[key] = blockElement;
      gameContainer.appendChild(blockElement);
    })
    allBlockRef.on("child_removed", (snapshot) => {
      const {id} = snapshot.val();
      const keyToRemove = id;
      gameContainer.removeChild(blockElements[keyToRemove]);
      delete blockElements[keyToRemove];
    })

    isMap.on("value", (snapshot) => {
      isMapG = snapshot.val();
    });

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
        console.log(date.getDate());
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
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      //1919, 977
    });
    window.onmousedown = () => {
      mouseDown = true;
    }
    window.onmouseup = () => {
      mouseDown = false;
      action = 0;
    }

    oneSecondLoop();
    setTimeout(() => tickLoop(), 1000);
    setTimeout(() => renderLoop(), 1000);
    setTimeout(() => mineLoop(), 1000);
  }
	firebase.auth().onAuthStateChanged((user) =>{
    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      playerNameInput.value = name;

      const {x, y} = getRandomSafeSpot();


      playerRef.set({
        id: playerId,
        name, 
        direction: "right",
        color: randomFromArray(playerColors),
        x: 1,
        y: -5,
        coins: 0,
        potionDuration: 0,
        health: 5, 
        isDead: false, 
        weapon: "none", 
      })

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
//x+w>x2-w2 && x-w<x2+w2 && y+h>y2-h2 && y-h<y2+h2