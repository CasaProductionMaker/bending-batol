//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyAyXJ0yN8bVzOPN3afxcdqOm08Y1LIP4-A",
  authDomain: "ancestor-hunt.firebaseapp.com",
  projectId: "ancestor-hunt",
  storageBucket: "ancestor-hunt.appspot.com",
  messagingSenderId: "857995038451",
  appId: "1:857995038451:web:33fef9adc79c26d9af3186"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//My code
let myLocation = "Lobby";
let myDurability = 0;
let initPotPlace = false;
let initSwordPlace = false;
let initAxePlace = false;

const lobbyMapData = {
  minX: 1,
  maxX: 14,
  minY: 3,
  maxY: 12,
  blockedSpaces: {
    "7x4": true,
    "1x11": true,
    "12x10": true,
    "7x9": true,
    "9x9": true,
    "1x3": true,
    "2x3": true,
    "4x3": true,
    "5x3": true,
    "6x3": true,
    "7x3": true,
    "8x3": true,
    "9x3": true,
    "10x3": true,
    "12x3": true,
    "13x3": true,
    "7x7": true
  }, 
  portals: {
    "8x9": "Graveyard", 
    "3x3": "Shop", 
    "11x3": "Field"
  }, 
  portalBlocked: {
    "8x9": true, 
    "3x3": true, 
    "11x3": true
  }
};
const shopMapData = {
  minX: 2,
  maxX: 13,
  minY: 2,
  maxY: 12,
  blockedSpaces: {
    "2x11": true, 
    "3x11": true, 
    "4x11": true, 
    "5x11": true, 
    "6x11": true, 
    "8x11": true, 
    "9x11": true, 
    "10x11": true, 
    "11x11": true, 
    "12x11": true, 
    "2x7": true, 
    "2x8": true, 
    "3x5": true, 
    "3x6": true, 
    "4x8": true, 
    "4x9": true, 
    "10x7": true, 
    "10x8": true, 
    "12x6": true, 
    "12x7": true, 
    "4x2": true, 
    "4x3": true, 
    "5x3": true, 
    "6x3": true, 
    "7x3": true, 
    "8x3": true, 
    "8x2": true,  
    "10x4": true, 
    "11x4": true
  }, 
  portals: {
    "7x11": "Lobby"
  }, 
  portalBlocked: {
    "7x11": true
  }
  //shopkeeper at 6x3
};
const graveyardMapData = {
  minX: 2,
  maxX: 13,
  minY: 2,
  maxY: 11,
  blockedSpaces: {
    "2x11": false
  }, 
  portals: {
    "7x2": "Lobby"
  }, 
  portalBlocked: {
    "7x2": true
  }
  //shopkeeper at 6x3
};
const fieldMapData = {
  minX: 2,
  maxX: 13,
  minY: 4,
  maxY: 12,
  blockedSpaces: {
    "2x11": false
  }, 
  portals: {
    "11x11": "Lobby"
  }, 
  portalBlocked: {
    "11x11": true
  }
  //shopkeeper at 6x3
};

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

function isMobile() {
  return true;
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
  ]);
  return `${prefix} ${animal}`;
}
function getCurrentMapData(location=myLocation) {
  let mapData;
  if(location == "Lobby")
  {
    mapData = lobbyMapData;
  }
  if(location == "Shop")
  {
    mapData = shopMapData;
  }
  if(location == "Graveyard")
  {
    mapData = graveyardMapData;
  }
  if(location == "Field")
  {
    mapData = fieldMapData;
  }
  return mapData;
}
function isSolid(x, y, location=myLocation) {
  const mapData = getCurrentMapData(location);
  let blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  return (
    blockedNextSpace || 
    x >= mapData.maxX || 
    x < mapData.minX || 
    y >= mapData.maxY || 
    y < mapData.minY
  )
}
function isPortal(x, y, location=myLocation) {
  const mapData = getCurrentMapData(location);
  const blockedNextSpace = mapData.portalBlocked[getKeyString(x, y)];
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
  while(isSolid(x, y) || isPortal(x, y))
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
  let coins = {};
  let coinElements = {};
  let potions = {};
  let potionElements = {};
  let items = {};
  let itemElements = {};
  let ancestors = {};
  let ancestorElements = {};
  let isButton = false;
  let chatMsg = 0;

  const gameContainer = document.querySelector(".game-container");
  const respawnContainer = document.querySelector(".respawn-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerColorButton = document.querySelector("#player-color");
  const chatSend = document.querySelector("#send-chat");
  const chatInput = document.querySelector("#chat-input");
  const chatDisplay = document.querySelector("#chat-display");
  const dialogueDisplay = document.querySelector(".dialogue-container");
  const durDisplay = document.querySelector(".player-dur-info");

  gameContainer.setAttribute("data-map", "Lobby");

  function repairTool() {
    if(players[playerId].coins > 20)
    {
      myDurability = 50;
      durDisplay.innerText = "Current Durability: " + myDurability;
      firebase.database().ref("players/" + playerId).update({
        coins: players[playerId].coins - 20
      });
    }
  }
  function placeCoin() {
    var x = getRandomSafeSpot().x;
    var y = getRandomSafeSpot().y;

    if(players[playerId] != null) {
      x = players[playerId].x;
      y = players[playerId].y;
      if(players[playerId].potionDuration > 0) {
        if(!isSolid(x, y + 1)) {
          y += 1;
        } else if(!isSolid(x, y - 1)) {
          y -= 1;
        } else if(!isSolid(x + 1, y)) {
          x += 1;
        } else if(!isSolid(x + 1, y)) {
          x -= 1;
        }
        if(isSolid(x, y)) {
          x = players[playerId].x;
          y = players[playerId].y;
        }
      } else {
        x = getRandomSafeSpot().x;
        y = getRandomSafeSpot().y;
      }
    }
    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }
    console.log(isSolid(x, y));
    if(myLocation == "Lobby")
    {
      const coinRef = firebase.database().ref(`coins/${getKeyString(x, y)}`);
      coinRef.set({
        x, 
        y, 
        location: myLocation
      })
    }

    const coinTimeouts = [40000, 50000, 60000, 70000];
    setTimeout(() => {
      placeCoin();
    }, randomFromArray(coinTimeouts));
  }
  function spawnAncestor() {
    var x = getRandomSafeSpot().x;
    var y = getRandomSafeSpot().y;

    if(players[playerId] != null) {
      x = players[playerId].x;
      y = players[playerId].y;
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }
    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }
    let thisValue = Math.floor(Math.random() * 5) + 3;
    let thisType = "Ancestor";
    if(Math.random() < 0.2)
    {
      thisValue += 10;
      thisType = "Ma";
    }
    if(Math.random() < 0.1)
    {
      thisValue += 10;
      thisType = "Pa";
    }
    if(Math.random() < 0.05)
    {
      thisValue += 10;
      thisType = "";
    }
    if(myLocation == "Lobby" || myLocation == "Graveyard" || myLocation == "Field")
    {
      const ancestorRef = firebase.database().ref(`ancestors/${getKeyString(x, y)}`);
      ancestorRef.set({
        x, 
        y, 
        location: myLocation, 
        direction: "right", 
        health: 5, 
        cid: playerId, 
        value: thisValue, 
        initId: getKeyString(x, y), 
        type: thisType
      })
    }

    const time = [8000, 9000, 10000, 12000];
    setTimeout(() => {
      spawnAncestor();
    }, randomFromArray(time));
  }
  function placeItem(itemType) {
    var x = getRandomSafeSpot().x;
    var y = getRandomSafeSpot().y;
    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    if(isSolid(x, y)) {
      x = getRandomSafeSpot().x;
      y = getRandomSafeSpot().y;
    }

    const itemRef = firebase.database().ref(`items/${getKeyString(x, y)}`);
    itemRef.set({
      x, 
      y, 
      type: itemType, 
      location: myLocation
    })

    const itemTimeouts = [40000, 50000, 60000, 70000];
    setTimeout(() => {
      placeItem(itemType);
    }, randomFromArray(itemTimeouts));
  }
  function oneSecondLoop() {
    if(players[playerId] != null) {
      if(players[playerId].potionDuration > 0) {
        playerRef.update({
          potionDuration: players[playerId].potionDuration - 1,
        })
      }
      if(players[playerId].isDead > 0 && !isButton) {
        const buttonElement = document.createElement("div");
        buttonElement.classList.add("respawnButton");
        buttonElement.innerHTML = (`
          <button id="respawn">Respawn</button>
        `)
        const respawnButton = buttonElement.querySelector("#respawn");
        respawnButton.addEventListener("click", () => {
          isButton = false;
          myLocation = "Lobby";
          gameContainer.setAttribute("data-map", myLocation);
          respawnContainer.querySelector(".respawnButton").remove();
          const {x, y} = getRandomSafeSpot();
          playerRef.update({
            isDead: false, 
            coins: 0, 
            health: 5, 
            x, 
            y, 
            location: "Lobby"
          })
        })
        respawnContainer.appendChild(buttonElement);
        isButton = true;
      }
      if(players[playerId].coins >= 50 && !initPotPlace) {
        placePotion();
        initPotPlace = true;
      }
      if(players[playerId].coins >= 70 && !initSwordPlace) {
        placeItem("sword");
        initSwordPlace = true;
      }
      if(players[playerId].coins >= 90 && !initAxePlace) {
        placeItem("axe");
        initAxePlace = true;
      }
    }

    Object.keys(ancestors).forEach((key) => {
      const characterState = ancestors[key];
      if(characterState.cid === playerId)
      {
        const xChange = Math.floor(Math.random() * 3) - 1;
        const yChange = Math.floor(Math.random() * 3) - 1;
        const newX = ancestors[key].x + xChange;
        const newY = ancestors[key].y + yChange;
        const oldX = ancestors[key].x;
        const oldY = ancestors[key].y;
        if (!isSolid(newX, newY, ancestors[key].location)) {
          //move to the next space
          ancestors[key].x = newX;
          ancestors[key].y = newY;
          if (xChange === 1) {
            ancestors[key].direction = "right";
          }
          if (xChange === -1) {
            ancestors[key].direction = "left";
          }
          const ancestorRef = firebase.database().ref("ancestors/" + key);
          ancestorRef.set(ancestors[key]);
          const mapData = getCurrentMapData(ancestors[key].location);
          if(mapData.portals[getKeyString(newX, newY)])
          {
            const portalToEnter = mapData.portals[getKeyString(newX, newY)];
            if(portalToEnter == "Shop")
            {
              ancestors[key].x = 7;
              ancestors[key].y = 11;
            }
            if(portalToEnter == "Lobby" && ancestors[key].location == "Shop")
            {
              ancestors[key].x = 3;
              ancestors[key].y = 3;
            }
            if(portalToEnter == "Lobby" && myLocation == "Graveyard")
            {
              ancestors[key].x = 8;
              ancestors[key].y = 9;
            }
            if(portalToEnter == "Graveyard")
            {
              ancestors[key].x = 7;
              ancestors[key].y = 2;
            }
            if(portalToEnter == "Lobby" && myLocation == "Field")
            {
              ancestors[key].x = 11;
              ancestors[key].y = 3;
            }
            if(portalToEnter == "Field")
            {
              ancestors[key].x = 11;
              ancestors[key].y = 11;
            }
            ancestors[key].location = portalToEnter;
          }
          ancestorRef.set(ancestors[key]);
        }
      }
    })

    //repeat
    setTimeout(() => {
      oneSecondLoop();
    }, 1000);
  }
  function sort_by_property(list, property_name_list) {
    list.sort((a, b) => {
      for (var p = 0; p < property_name_list.length; p++) {
        prop = property_name_list[p];
        if (a[prop] < b[prop]) {
          return -1;
        } else if (a[prop] !== a[prop]) {
          return 1;
        }
      }
      return 0;
    });
  }
  function tickLoop() {
    if(players[playerId] != null) {
      if(players[playerId].health <= 0) {
        playerRef.update({
          isDead: true
        })
      }
      playerRef.update({
        location: myLocation
      })
    }

    for (let x in coinElements)
    {
      coinElements[x].querySelector(".Coin_sprite").setAttribute("data-location", coins[x].location == myLocation ? "some" : "none");
      coinElements[x].querySelector(".Coin_shadow").setAttribute("data-location", coins[x].location == myLocation ? "some" : "none");
    }
    for (let x in potionElements)
    {
      potionElements[x].querySelector(".Potion_sprite").setAttribute("data-location", potions[x].location == myLocation ? "some" : "none");
      potionElements[x].querySelector(".Potion_shadow").setAttribute("data-location", potions[x].location == myLocation ? "some" : "none");
    }
    for (let x in itemElements)
    {
      itemElements[x].setAttribute("data-location", items[x].location == myLocation ? "some" : "none");
      itemElements[x].querySelector(".Coin_shadow").setAttribute("data-location", items[x].location == myLocation ? "some" : "none");
    }
    for (let x in ancestorElements)
    {
      if(ancestors[x] != null) 
      {
        ancestorElements[x].querySelector(".Ancestor_health_bar").setAttribute("data-location", ancestors[x].location == myLocation ? "some" : "none");
        ancestorElements[x].querySelector(".Ancestor_name-container").setAttribute("data-location", ancestors[x].location == myLocation ? "some" : "none");
        ancestorElements[x].querySelector(".Ancestor_name").setAttribute("data-location", ancestors[x].location == myLocation ? "some" : "none");
        ancestorElements[x].setAttribute("data-location", ancestors[x].location == myLocation ? "some" : "none");
        ancestorElements[x].querySelector(".Ancestor_shadow").setAttribute("data-location", ancestors[x].location == myLocation ? "some" : "none");
      }
    }
    let first = 0;
    let second = 0;
    let third = 0;
    let firstN = "";
    let secondN = "";
    let thirdN = "";
    let places = [];
    for (let x in players)
    {
      places.push({name: players[x].name, coins: players[x].coins});
    }
    sort_by_property(places, ["name", "coins"]);
    places = places.reverse();
    if(places[0] != null)
    {
      first = places[0].coins;
    }
    if(places[1] != null)
    {
      second = places[1].coins;
    }
    if(places[2] != null)
    {
      third = places[2].coins;
    }
    if(places[0] != null)
    {
      firstN = places[0].name;
    }
    if(places[1] != null)
    {
      secondN = places[1].name;
    }
    if(places[2] != null)
    {
      thirdN = places[2].name;
    }
    document.querySelector("#first-place").innerText = firstN + " - " + first;
    document.querySelector("#second-place").innerText = secondN + " - " + second;
    document.querySelector("#third-place").innerText = thirdN + " - " + third;

    //repeat
    setTimeout(() => {
      tickLoop();
    }, 1);
  }
  function attemptGrabCoin(x, y) {
    const key = getKeyString(x, y);
    if (coins[key]) {
      if(coins[key].location == myLocation)
      {
        // Remove this key from data, then uptick Player's coin count
        firebase.database().ref(`coins/${key}`).remove();
        playerRef.update({
          coins: players[playerId].coins + 1,
        })
      }
    }
  }
  function placePotion() {
    const {x, y} = getRandomSafeSpot();
    const potionRef = firebase.database().ref(`potions/${getKeyString(x, y)}`);
    potionRef.set({
      x, 
      y, 
      location: myLocation
    })

    const potionTimeouts = [40000, 50000, 60000, 30000];
    setTimeout(() => {
      placePotion();
    }, randomFromArray(potionTimeouts));
  }
  function attemptDrinkPotion(x, y) {
    const key = getKeyString(x, y);
    if (potions[key]) {
      // Remove this key from data, then uptick Player's coin count
      firebase.database().ref(`potions/${key}`).remove();
      playerRef.update({
        potionDuration: players[playerId].potionDuration + 20,
      })
    }
  }
  function attemptGrabItem(x, y) {
    const key = getKeyString(x, y);
    if (items[key]) {
      // Remove this key from data, then uptick Player's coin count
      playerRef.update({
        weapon: items[key].type
      })
      myDurability = items[key].type == "sword" ? 50 : 70;
      durDisplay.innerText = "Current Durability: " + myDurability;
      firebase.database().ref(`items/${key}`).remove();
    }
  }
  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    if ((!isSolid(newX, newY) || players[playerId].isDev) && !players[playerId].isDead) {
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
      attemptGrabCoin(newX, newY);
      attemptDrinkPotion(newX, newY);
      attemptGrabItem(newX, newY);
      const mapData = getCurrentMapData();
      if(mapData.portals[getKeyString(newX, newY)])
      {
        const portalToEnter = mapData.portals[getKeyString(newX, newY)];
        if(portalToEnter == "Shop")
        {
          players[playerId].x = 7;
          players[playerId].y = 11;
        }
        if(portalToEnter == "Lobby" && myLocation == "Shop")
        {
          players[playerId].x = 3;
          players[playerId].y = 3;
        }
        if(portalToEnter == "Lobby" && myLocation == "Graveyard")
        {
          players[playerId].x = 8;
          players[playerId].y = 9;
        }
        if(portalToEnter == "Graveyard")
        {
          players[playerId].x = 7;
          players[playerId].y = 2;
        }
        if(portalToEnter == "Lobby" && myLocation == "Field")
        {
          players[playerId].x = 11;
          players[playerId].y = 3;
        }
        if(portalToEnter == "Field")
        {
          players[playerId].x = 11;
          players[playerId].y = 11;
        }
        myLocation = portalToEnter;
        gameContainer.setAttribute("data-map", myLocation);
      }
      if(myLocation == "Shop" && getKeyString(newX, newY) == "6x4")
      {
        //Talk to shopkeeper
        if(myDurability < 10 && myDurability != 0)
        {
          OpenDialogue(
            "Hello there, I am the shopkeeper.", 
            "Ok", 
            null, 
            "dialogue", 
            null, 
            () => OpenDialogue(
              "I have a great deal for you.", 
              "What is it?", 
              "No thanks, Bye.", 
              "dialogue", 
              "dialogue", 
              () => OpenDialogue(
                "I see your weapon there is about to break. I can repair that for you. It'll cost you 20 coins", 
                "Ok, sure", 
                "Nope", 
                "dialogue", 
                "dialogue", 
                () => repairTool(), 
                () => CloseDialogue()
              ), 
              () => CloseDialogue()
            ), 
            null
          );
        } else {
          OpenDialogue(
            "Hello there, I am the shopkeeper.", 
            "Ok", 
            null, 
            "dialogue", 
            null, 
            () => OpenDialogue(
              "Are you gonna buy something or are you just wasting my time?!", 
              "I'll buy something", 
              "Just wasting your time.", 
              "dialogue", 
              "dialogue", 
              () => OpenDialogue(
                "I can sell this sword for 40 coins", 
                "Buy", 
                null, 
                "item", 
                null, 
                {
                  "item": "sword", 
                  "price": 40
                }, 
                null
              ), 
              () => CloseDialogue()
            ), 
            null
          );
        }
      }
      if(myLocation == "Shop" && getKeyString(oldX, oldY) == "6x4")
      {
        //End talk to shopkeeper
        CloseDialogue();
      }
      playerRef.set(players[playerId]);
    }
  }
  function handleAttack() {
    var attackX;
    if(players[playerId].direction === "right") {
      //right
      attackX = players[playerId].x + 1;
      let playerToAttack;
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        if(characterState.x === attackX && characterState.y === players[playerId].y)
        {
          playerToAttack = key;
        }
        if(characterState.x === players[playerId].x && characterState.y === players[playerId].y && characterState.id != playerId)
        {
          playerToAttack = key;
        }
      })
      if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead) {
        myDurability--;
        if(myDurability < 0)
        {
          myDurability = 0;
          firebase.database().ref("players/" + playerId).update({
            weapon: "none"
          })
        }
        playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
        var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
        if(players[playerId].weapon == "sword")
        {
          damage = randomFromArray([0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        }
        if(players[playerId].weapon == "axe")
        {
          damage = randomFromArray([1, 1, 1, 1, 1, 1, 1, 1, 1, 2]);
        }
        if(players[playerId].location == players[playerToAttack].location)
        {
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
        }
        if(players[playerToAttack].health - damage <= -1) {
          playerRef.update({
            coins: players[playerId].coins + players[playerToAttack].coins
          })
          if(players[playerToAttack].weapon != "none")
          {
            playerRef.update({
              weapon: players[playerToAttack].weapon
            })
            myDurability = players[playerToAttack].weapon == "sword" ? 50 : 70
          }
          playerToAttackRef.update({
            coins: 0, 
            weapon: "none"
          })
        }
      }
      let ancestorToAttack;
      Object.keys(ancestors).forEach((key) => {
        const characterState = ancestors[key];
        if(characterState.x === attackX && characterState.y === players[playerId].y)
        {
          ancestorToAttack = key;
        }
        if(characterState.x === players[playerId].x && characterState.y === players[playerId].y)
        {
          ancestorToAttack = key;
        }
      })
      if(ancestorToAttack != null && !players[playerId].isDead) {
        myDurability--;
        if(myDurability < 0)
        {
          myDurability = 0;
          firebase.database().ref("players/" + playerId).update({
            weapon: "none"
          })
        }
        playerToAttackRef = firebase.database().ref("ancestors/" + ancestorToAttack);
        var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
        if(players[playerId].weapon == "sword")
        {
          damage = randomFromArray([0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        }
        if(players[playerId].weapon == "axe")
        {
          damage = randomFromArray([1, 1, 1, 1, 1, 1, 1, 1, 1, 2]);
        }
        if(players[playerId].location == ancestors[ancestorToAttack].location)
        {
          playerToAttackRef.update({
            health: ancestors[ancestorToAttack].health - damage
          })
        }
        if(ancestors[ancestorToAttack].health - damage <= -1) {
          playerRef.update({
            coins: players[playerId].coins + ancestors[ancestorToAttack].value
          })
          firebase.database().ref("ancestors/" + ancestorToAttack).remove();
        }
      }
    } else {
      //left
      attackX = players[playerId].x - 1;
      let playerToAttack;
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        if(characterState.x === attackX && characterState.y === players[playerId].y)
        {
          playerToAttack = key;
        }
        if(characterState.x === players[playerId].x && characterState.y === players[playerId].y && characterState.id != playerId)
        {
          playerToAttack = key;
        }
      })
      if(playerToAttack != null && !players[playerId].isDead && !players[playerToAttack].isDead) {
        myDurability--;
        if(myDurability < 0)
        {
          myDurability = 0;
          firebase.database().ref("players/" + playerId).update({
            weapon: "none"
          })
        }
        playerToAttackRef = firebase.database().ref("players/" + playerToAttack);
        var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
        if(players[playerId].weapon == "sword")
        {
          damage = randomFromArray([0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        }
        if(players[playerId].weapon == "axe")
        {
          damage = randomFromArray([1, 1, 1, 1, 1, 1, 1, 1, 1, 2]);
        }
        if(players[playerId].location == players[playerToAttack].location)
        {
          playerToAttackRef.update({
            health: players[playerToAttack].health - damage
          })
        }
        if(players[playerToAttack].health - damage <= -1) {
          playerRef.update({
            coins: players[playerId].coins + players[playerToAttack].coins
          })
          if(players[playerToAttack].weapon != "none")
          {
            playerRef.update({
              weapon: players[playerToAttack].weapon
            })
            myDurability = players[playerToAttack].weapon == "sword" ? 50 : 70
          }
          playerToAttackRef.update({
            coins: 0, 
            weapon: "none"
          })
        }
      }
      let ancestorToAttack;
      Object.keys(ancestors).forEach((key) => {
        const characterState = ancestors[key];
        if(characterState.x === attackX && characterState.y === players[playerId].y)
        {
          ancestorToAttack = key;
        }
        if(characterState.x === players[playerId].x && characterState.y === players[playerId].y)
        {
          ancestorToAttack = key;
        }
      })
      if(ancestorToAttack != null && !players[playerId].isDead) {
        myDurability--;
        if(myDurability < 0)
        {
          myDurability = 0;
          firebase.database().ref("players/" + playerId).update({
            weapon: "none"
          })
        }
        playerToAttackRef = firebase.database().ref("ancestors/" + ancestorToAttack);
        var damage = randomFromArray([0, 0, 0, 0, 0, 0, 0, 1, 1, 1]);
        if(players[playerId].weapon == "sword")
        {
          damage = randomFromArray([0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
        }
        if(players[playerId].weapon == "axe")
        {
          damage = randomFromArray([1, 1, 1, 1, 1, 1, 1, 1, 1, 2]);
        }
        if(players[playerId].location == ancestors[ancestorToAttack].location)
        {
          playerToAttackRef.update({
            health: ancestors[ancestorToAttack].health - damage
          })
        }
        if(ancestors[ancestorToAttack].health - damage <= -1) {
          playerRef.update({
            coins: players[playerId].coins + ancestors[ancestorToAttack].value
          })
          firebase.database().ref("ancestors/" + ancestorToAttack).remove();
        }
      }
    }
    durDisplay.innerText = "Current Durability: " + myDurability;
  }
  function OpenDialogue(message, buttonone, buttontwo, b1func, b2func, b1fdata, b2fdata) {
    //open a dialogue
    let number = 2;
    dialogueDisplay.querySelector("#dialogue-text").innerText = message;
    dialogueDisplay.querySelector("#first-button").innerText = buttonone;
    dialogueDisplay.querySelector("#second-button").innerText = buttontwo;
    dialogueDisplay.querySelector("#first-button").setAttribute("data-show", "true");
    dialogueDisplay.querySelector("#second-button").setAttribute("data-show", "true");
    if(buttonone == null)
    {
      dialogueDisplay.querySelector("#first-button").setAttribute("data-show", "false");
      dialogueDisplay.querySelector("#second-button").setAttribute("data-show", "false");
      number = 0;
    } else if(buttontwo == null)
    {
      dialogueDisplay.querySelector("#second-button").setAttribute("data-show", "false");
      number = 1;
    }
    dialogueDisplay.querySelector("#exit-button").setAttribute("data-show", "true");
    dialogueDisplay.setAttribute("data-show", "true");
    dialogueDisplay.querySelector("#exit-button").addEventListener("click", () => {
      CloseDialogue();
    })
    if(b1func == "item")
    {
      dialogueDisplay.querySelector("#first-button").addEventListener("click", () => {
        if(players[playerId].coins >= b1fdata.price)
        {
          playerRef.update({
            coins: players[playerId].coins - b1fdata.price, 
            weapon: b1fdata.item
          })
          myDurability = 30;
        }
        console.log(players[playerId].coins);
        dialogueDisplay.querySelector("#first-button").replaceWith(dialogueDisplay.querySelector("#first-button").cloneNode(true));
      })
    }
    if(b2func == "item")
    {
      dialogueDisplay.querySelector("#second-button").addEventListener("click", () => {
        if(players[playerId].coins >= b2fdata.price)
        {
          playerRef.update({
            coins: players[playerId].coins - b2fdata.price, 
            weapon: b2fdata.item
          })
          myDurability = 30;
        }
        dialogueDisplay.querySelector("#second-button").replaceWith(dialogueDisplay.querySelector("#second-button").cloneNode(true));
      })
    }
    if(b1func == "dialogue")
    {
      dialogueDisplay.querySelector("#first-button").addEventListener("click", () => {
        dialogueDisplay.querySelector("#first-button").replaceWith(dialogueDisplay.querySelector("#first-button").cloneNode(true));
        b1fdata();
      })
    }
    if(b2func == "dialogue")
    {
      dialogueDisplay.querySelector("#second-button").addEventListener("click", () => {
        dialogueDisplay.querySelector("#second-button").replaceWith(dialogueDisplay.querySelector("#second-button").cloneNode(true));
        b2fdata();
      })
    }
    dialogueDisplay.querySelector("#dialogue-text").setAttribute("data-number", number);
  }
  function CloseDialogue() {
    //open a dialogue
    dialogueDisplay.querySelector("#dialogue-text").innerText = "";
    dialogueDisplay.querySelector("#first-button").innerText = "";
    dialogueDisplay.querySelector("#second-button").innerText = "";
    dialogueDisplay.querySelector("#first-button").setAttribute("data-show", "false");
    dialogueDisplay.querySelector("#second-button").setAttribute("data-show", "false");
    dialogueDisplay.querySelector("#exit-button").setAttribute("data-show", "false");
    dialogueDisplay.setAttribute("data-show", "false");
  }

  function initGame() {

    new DoubleKeyPressListener("ArrowUp", "KeyW", () => handleArrowPress(0, -1))
    new DoubleKeyPressListener("ArrowDown", "KeyS", () => handleArrowPress(0, 1))
    new DoubleKeyPressListener("ArrowLeft", "KeyA", () => handleArrowPress(-1, 0))
    new DoubleKeyPressListener("ArrowRight", "KeyD", () => handleArrowPress(1, 0))
    new KeyPressListener("Space", () => handleAttack())

    const allPlayersRef = firebase.database().ref(`players`);
    const allCoinsRef = firebase.database().ref(`coins`);
    const allPotionsRef = firebase.database().ref(`potions`);
    const allItemsRef = firebase.database().ref(`items`);
    const allAncestorsRef = firebase.database().ref(`ancestors`);

    allPlayersRef.on("value", (snapshot) => {
      //change
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.querySelector(".Character_coins").innerText = characterState.coins;
        el.setAttribute("data-color", characterState.color);
        el.setAttribute("data-direction", characterState.direction);
        el.setAttribute("data-weapon", characterState.weapon);
        el.setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        var luckState = "false";
        if(characterState.potionDuration > 0) {
          luckState = "true";
        }
        el.querySelector(".Luck-effect").setAttribute("data-luck", luckState);
        el.querySelector(".Character_health_bar").setAttribute("data-health", characterState.health);
        el.querySelector(".Character_name").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Character_coins").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Character_name-container").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Character_shadow").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Character_health_bar").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
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
          <span class="Character_coins">0</span>
        </div>
        <div class="Character_you-arrow"></div>
        <div class="Character_health_bar"></div>
        <div class="Luck-effect"></div>
      `);


      playerElements[addedPlayer.id] = characterElement;
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins;
      characterElement.setAttribute("data-color", addedPlayer.color);
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      characterElement.setAttribute("data-weapon", addedPlayer.weapon);
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

    allAncestorsRef.on("value", (snapshot) => {
      //change
      ancestors = snapshot.val() || {};
      Object.keys(ancestors).forEach((key) => {
        const characterState = ancestors[key];
        let el = ancestorElements[key];
        el.setAttribute("data-direction", characterState.direction);
        el.setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Ancestor_health_bar").setAttribute("data-health", characterState.health);
        el.querySelector(".Ancestor_name").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Ancestor_name-container").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Ancestor_shadow").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        el.querySelector(".Ancestor_health_bar").setAttribute("data-location", characterState.location == myLocation ? "some" : "none");
        const left = 16 * characterState.x + "px";
        const top = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;
      })
    })
    allAncestorsRef.on("child_added", (snapshot) => {
      //new nodes
      const addedPlayer = snapshot.val();
      const key = addedPlayer.initId;
      ancestors[key] = true;

      //adding element
      const characterElement = document.createElement("div");
      characterElement.classList.add("Ancestor", "grid-cell");
      characterElement.innerHTML = (`
        <div class="Ancestor_shadow grid-cell"></div>
        <div class="Ancestor_sprite grid-cell"></div>
        <div class="Ancestor_name-container">
          <span class="Ancestor_name"></span>
        </div>
        <div class="Ancestor_health_bar"></div>
      `);


      ancestorElements[key] = characterElement;
      characterElement.querySelector(".Ancestor_name").innerText = "Alex " + addedPlayer.type;
      characterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(characterElement);
    })
    allAncestorsRef.on("child_removed", (snapshot) => {
      const obj = snapshot.val();
      gameContainer.removeChild(ancestorElements[obj.initId]);
      delete ancestorElements[ancestorElements[obj.initId]];
    })

    allCoinsRef.on("value", (snapshot) => {
      coins = snapshot.val() || {};
    });
    allCoinsRef.on("child_added", (snapshot) => {
      const coin = snapshot.val();
      const key = getKeyString(coin.x, coin.y);
      coins[key] = true;

      // Create the DOM Element
      const coinElement = document.createElement("div");
      coinElement.classList.add("Coin", "grid-cell");
      coinElement.innerHTML = `
        <div class="Coin_shadow grid-cell"></div>
        <div class="Coin_sprite grid-cell"></div>
      `;

      //coinElement.querySelector(".Coin_sprite").setAttribute("data-location", players[playerId].location == myLocation ? "some" : "none");
      //coinElement.querySelector(".Coin_shadow").setAttribute("data-location", players[playerId].location == myLocation ? "some" : "none");

      // Position the Element
      const left = 16 * coin.x + "px";
      const top = 16 * coin.y - 4 + "px";
      coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      coinElements[key] = coinElement;
      gameContainer.appendChild(coinElement);
    })
    allCoinsRef.on("child_removed", (snapshot) => {
      const {x, y} = snapshot.val();
      const keyToRemove = getKeyString(x, y);
      gameContainer.removeChild(coinElements[keyToRemove]);
      delete coinElements[keyToRemove];
    })

    allPotionsRef.on("value", (snapshot) => {
      potions = snapshot.val() || {};
    });
    allPotionsRef.on("child_added", (snapshot) => {
      const potion = snapshot.val();
      const key = getKeyString(potion.x, potion.y);
      potions[key] = true;

      // Create the DOM Element
      const potionElement = document.createElement("div");
      potionElement.classList.add("Potion", "grid-cell");
      potionElement.innerHTML = `
        <div class="Potion_shadow grid-cell"></div>
        <div class="Potion_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * potion.x + "px";
      const top = 16 * potion.y - 4 + "px";
      potionElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      // Keep a reference for removal later and add to DOM
      potionElements[key] = potionElement;
      gameContainer.appendChild(potionElement);
    })
    allPotionsRef.on("child_removed", (snapshot) => {
      const {x, y} = snapshot.val();
      const keyToRemove = getKeyString(x, y);
      gameContainer.removeChild(potionElements[keyToRemove]);
      delete potionElements[keyToRemove];
    })

    allItemsRef.on("value", (snapshot) => {
      items = snapshot.val() || {};
    });
    allItemsRef.on("child_added", (snapshot) => {
      const item = snapshot.val();
      const key = getKeyString(item.x, item.y);
      items[key] = true;

      // Create the DOM Element
      const itemElement = document.createElement("div");
      itemElement.classList.add("Item", "grid-cell");
      itemElement.innerHTML = `
        <div class="Coin_shadow grid-cell"></div>
        <div class="Item_sprite grid-cell"></div>
      `;

      // Position the Element
      const left = 16 * item.x + "px";
      const top = 16 * item.y - 4 + "px";
      itemElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      itemElement.setAttribute("data-type", item.type);

      // Keep a reference for removal later and add to DOM
      itemElements[key] = itemElement;
      gameContainer.appendChild(itemElement);
    })
    allItemsRef.on("child_removed", (snapshot) => {
      const {x, y} = snapshot.val();
      const keyToRemove = getKeyString(x, y);
      gameContainer.removeChild(itemElements[keyToRemove]);
      delete itemElements[keyToRemove];
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
        console.log(date.getDate());
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

    durDisplay.innerText = "Current Durability: " + myDurability;
    placeCoin();
    spawnAncestor();
    oneSecondLoop();
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

      const {x, y} = getRandomSafeSpot();


      playerRef.set({
        id: playerId,
        name, 
        direction: "right",
        color: randomFromArray(playerColors),
        x,
        y,
        coins: 0,
        potionDuration: 0,
        health: 5, 
        isDead: false, 
        weapon: "none", 
        location: myLocation, 
        isDev: false
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