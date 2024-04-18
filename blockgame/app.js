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
let seed = Math.random();
let mousePos = {x: undefined, y: undefined};
let screenDim = {x: undefined, y: undefined};
let mouseTile = {x: undefined, y: undefined};
let mouseDown = false;
let myX;
let myY;
let yVel = 0.1;
let xVel = 0;
let mineIdx = 0;
let myBlockId = localStorage.getItem("myOldBlockId");
let renderDistance = 5;
let isMapG;
let worldRad = 25;
let action = 0;
let inWater = false;

let biomeMap = [];
let BiomeRules = {
  "forest": ["plains", "ocean"], 
  "plains": ["forest", "desert", "ocean"], 
  "desert": ["plains"], 
  "ocean": ["plains", "forest"]
};
let BiomeBlock = {
  desert: "sand", 
  plains: "grass", 
  forest: "grass", 
  ocean: "water"
}
let BlockProperties = {
  "bedrock": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 9000000000000000000000000000000000000000000000000
  }, 
  "stone": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 500
  }, 
  "grass": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 30
  }, 
  "sand": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 20
  }, 
  "dirt": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 30
  }, 
  "leaves": {
    sizeX: 0.0, 
    sizeY: 0.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 15
  }, 
  "log": {
    sizeX: 0.0, 
    sizeY: 0.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 50
  }, 
  "water": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 9000000000000000000000000000000000000000000000
  }, 
  "coal_ore": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 400
  }, 
  "iron_ore": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 600
  }, 
  "gold_ore": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 300
  }, 
  "stone_bricks": {
    sizeX: 1.0, 
    sizeY: 1.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 600
  }, 
  "tall_grass": {
    sizeX: 0.0, 
    sizeY: 0.0,
    centerX: 0.0, 
    centerY: 0.0,  
    strength: 10
  }
};
let BlockTraits = {
  "bedrock": {
    drop: ["none"], 
    amount: [0]
  }, 
  "stone": {
    drop: ["stone"], 
    amount: [1]
  }, 
  "grass": {
    drop: ["grass"], 
    amount: [1]
  }, 
  "sand": {
    drop: ["sand"], 
    amount: [1]
  }, 
  "dirt": {
    drop: ["dirt"], 
    amount: [1]
  }, 
  "leaves": {
    drop: ["leaves", "stick"], 
    amount: [1]
  }, 
  "log": {
    drop: ["log"], 
    amount: [1]
  }, 
  "water": {
    drop: ["none"], 
    amount: [0]
  }, 
  "coal_ore": {
    drop: ["coal_ore"], 
    amount: [1, 2, 3]
  }, 
  "iron_ore": {
    drop: ["iron_ore"], 
    amount: [1]
  }, 
  "gold_ore": {
    drop: ["gold_ore"], 
    amount: [1]
  }, 
  "stone_bricks": {
    drop: ["stone_bricks"], 
    amount: [1]
  }, 
  "tall_grass": {
    drop: ["cotton", "none"], 
    amount: [1, 2]
  }
};
let Inventory = [
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }, 
  {
    item: "none", 
    amount: 0
  }
];
let currentSlot = 0;
let ItemProperties = {
  "none": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "stone": {
    stackSize: 16, 
    isPlaceable: true
  }, 
  "grass": {
    stackSize: 16, 
    isPlaceable: true
  }, 
  "sand": {
    stackSize: 16, 
    isPlaceable: true
  }, 
  "dirt": {
    stackSize: 16, 
    isPlaceable: true
  }, 
  "leaves": {
    stackSize: 16, 
    isPlaceable: true
  }, 
  "log": {
    stackSize: 8, 
    isPlaceable: true
  }, 
  "coal_ore": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "iron_ore": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "gold_ore": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "stick": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "long_stick": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "sharpened_stick": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "handle": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "long_handle": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "cotton": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "string": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "long_sharpened_stick": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "wood": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "wooden_blade": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "wooden_axehead": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "long_string": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "wooden_pickaxe_head": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "rock": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "pebble": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "stone_bricks": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "stone_rod": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "sharp_stone_rod": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "stone_blade": {
    stackSize: 8, 
    isPlaceable: false
  }, 
  "iron_ingot": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "iron_nugget": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "cotton_strand": {
    stackSize: 16, 
    isPlaceable: false
  }, 
  "wooden_sword": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "wooden_axe": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "wooden_pickaxe": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "bow": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "stone_pickaxe": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "stone_axe": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "stone_sword": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "stone_axehead": {
    stackSize: 1, 
    isPlaceable: false
  }, 
  "stone_pickaxe_head": {
    stackSize: 1, 
    isPlaceable: false
  }
};
let inventoryShown = false;
let inventoryPositions = [
  {x: 2, y: 4}
];
let hotbarPositions = [
  {x: 2, y: 4}
];
let inventoryMouseSlot = {
  item: "none", 
  amount: 0
};
let craftingRecipes = [
  {
    item: "long_stick", 
    amount: 1, 
    recipe: ["stick", "stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "sharpened_stick", 
    amount: 1, 
    recipe: ["stick", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 5
  }, 
  {
    item: "handle", 
    amount: 1, 
    recipe: ["stick", "string"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "long_handle", 
    amount: 1, 
    recipe: ["handle", "stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "long_sharpened_stick", 
    amount: 1, 
    recipe: ["sharpened_stick", "stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "wood", 
    amount: 2, 
    recipe: ["log", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "wooden_blade", 
    amount: 1, 
    recipe: ["sharpened_stick", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 6
  }, 
  {
    item: "wooden_axehead", 
    amount: 1, 
    recipe: ["stick", "wood"], 
    workplace: "hand", 
    pattern: false, 
    duration: 5
  }, 
  {
    item: "long_string", 
    amount: 1, 
    recipe: ["string", "string"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "wooden_pickaxe_head", 
    amount: 1, 
    recipe: ["sharpened_stick", "sharpened_stick"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "rock", 
    amount: 2, 
    recipe: ["stone", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "pebble", 
    amount: 2, 
    recipe: ["rock", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_bricks", 
    amount: 1, 
    recipe: ["stone", "stone"], 
    workplace: "hand", 
    pattern: false, 
    duration: 5
  }, 
  {
    item: "stone_rod", 
    amount: 1, 
    recipe: ["pebble", "rock"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "sharp_stone_rod", 
    amount: 1, 
    recipe: ["stone_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 8
  }, 
  {
    item: "stone_blade", 
    amount: 1, 
    recipe: ["sharp_stone_rod", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 10
  }, 
  {
    item: "iron_nugget", 
    amount: 4, 
    recipe: ["iron_ingot", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "cotton_strand", 
    amount: 1, 
    recipe: ["cotton", "none"], 
    workplace: "hand", 
    pattern: false, 
    duration: 1
  }, 
  {
    item: "string", 
    amount: 1, 
    recipe: ["cotton_strand", "cotton_strand"], 
    workplace: "hand", 
    pattern: false, 
    duration: 2
  }, 
  {
    item: "wooden_sword", 
    amount: 1, 
    recipe: ["handle", "wooden_blade"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "wooden_axe", 
    amount: 1, 
    recipe: ["long_handle", "wooden_axehead"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "wooden_pickaxe", 
    amount: 1, 
    recipe: ["long_handle", "wooden_pickaxe_head"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "bow", 
    amount: 1, 
    recipe: ["long_stick", "long_string"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_sword", 
    amount: 1, 
    recipe: ["handle", "stone_blade"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }, 
  {
    item: "stone_pickaxe_head", 
    amount: 1, 
    recipe: ["sharp_stone_rod", "sharp_stone_rod"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "stone_axehead", 
    amount: 1, 
    recipe: ["stick", "rock"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "stone_pickaxe", 
    amount: 1, 
    recipe: ["stone_pickaxe_head", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 3
  }, 
  {
    item: "stone_axe", 
    amount: 1, 
    recipe: ["stone_axehead", "long_handle"], 
    workplace: "hand", 
    pattern: false, 
    duration: 4
  }
]
let craftProgress = 0;
let isQPressed = false;
document.querySelector(".inventory").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
document.querySelector(".hotbar").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
document.querySelector(".mouse-holding-item").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
document.querySelector(".selected-slot").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));

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
var Z = Math.floor(seed * M);
function rand(){
  Z = (A * Z + C) % M;
  return Z / M - 0.5;
};

function interpolate(pa, pb, px){
  var ft = px * Math.PI,
  f = (1 - Math.cos(ft)) * 0.5;
  return pa * (1 - f) + pb * f;
}

function onClickItem(slotID) {
  if(inventoryShown)
  {
    if(Inventory[slotID].item == "none" && slotID != 22)
    {
      if(!isQPressed) {
        Inventory[slotID].item = inventoryMouseSlot.item;
        Inventory[slotID].amount = inventoryMouseSlot.amount;
        inventoryMouseSlot.item = "none";
        inventoryMouseSlot.amount = 0;
      } else if(Inventory[slotID].amount < 16){
        Inventory[slotID].item = inventoryMouseSlot.item;
        Inventory[slotID].amount += 1;
        inventoryMouseSlot.amount--;
        if(inventoryMouseSlot.amount <= 0)
        {
          inventoryMouseSlot.item = "none";
        }
      }
    } else if(inventoryMouseSlot.item == "none"){
      inventoryMouseSlot.item = Inventory[slotID].item;
      inventoryMouseSlot.amount = Inventory[slotID].amount;
      Inventory[slotID].item = "none";
      Inventory[slotID].amount = 0;
    } else if(inventoryMouseSlot.item != Inventory[slotID].item && slotID != 22) {
      let saveSlot = {
        item: inventoryMouseSlot.item, 
        amount: inventoryMouseSlot.amount
      };
      inventoryMouseSlot.item = Inventory[slotID].item;
      inventoryMouseSlot.amount = Inventory[slotID].amount;
      Inventory[slotID].item = saveSlot.item;
      Inventory[slotID].amount = saveSlot.amount;
    } else if(slotID != 22){
      if(!isQPressed)
      {
        while(Inventory[slotID].amount < ItemProperties[Inventory[slotID].item].stackSize)
        {
          Inventory[slotID].amount++;
          inventoryMouseSlot.amount--;
          if (inventoryMouseSlot.amount <= 0)
          {
            inventoryMouseSlot.item = "none";
            break;
          }
        }
      } else if(Inventory[slotID].amount < 16){
        Inventory[slotID].item = inventoryMouseSlot.item;
        Inventory[slotID].amount += 1;
        inventoryMouseSlot.amount--;
        if(inventoryMouseSlot.amount <= 0)
        {
          inventoryMouseSlot.item = "none";
        }
      }
    }
  }
}

function craftItem() {
  if(inventoryShown)
  {
    let itemCrafted = "none";
    let craftInterval = 5;
    let craftAmount = 1;
    for (var i = 0; i < craftingRecipes.length; i++) {
      if((craftingRecipes[i].recipe[0] == Inventory[20].item && craftingRecipes[i].recipe[1] == Inventory[21].item) || (craftingRecipes[i].recipe[0] == Inventory[21].item && craftingRecipes[i].recipe[1] == Inventory[20].item && craftingRecipes[i].pattern == false) && craftingRecipes[i].workplace == "hand")
      {
        itemCrafted = craftingRecipes[i].item;
        craftInterval = (craftingRecipes[i].duration * 1000) / 10;
        craftAmount = craftingRecipes[i].amount;
        break;
      }
    }
    if(itemCrafted != "none")
    {
      setTimeout(() => {
        craftProgress++;
        setTimeout(() => {
          craftProgress++;
          setTimeout(() => {
            craftProgress++;
            setTimeout(() => {
              craftProgress++;
              setTimeout(() => {
                craftProgress++;
                setTimeout(() => {
                  craftProgress++;
                  setTimeout(() => {
                    craftProgress++;
                    setTimeout(() => {
                      craftProgress++;
                      setTimeout(() => {
                        craftProgress++;
                        setTimeout(() => {
                          craftProgress++;
                          itemCrafted = "none";
                          for (var i = 0; i < craftingRecipes.length; i++) {
                            if((craftingRecipes[i].recipe[0] == Inventory[20].item && craftingRecipes[i].recipe[1] == Inventory[21].item) || (craftingRecipes[i].recipe[0] == Inventory[21].item && craftingRecipes[i].recipe[1] == Inventory[20].item && craftingRecipes[i].pattern == false) && craftingRecipes[i].workplace == "hand")
                            {
                              itemCrafted = craftingRecipes[i].item;
                              break;
                            }
                          }
                          if(itemCrafted != "none")
                          {
                            Inventory[20].amount--;
                            if(Inventory[20].amount <= 0)
                            {
                              Inventory[20].item = "none";
                              Inventory[20].amount = 0;
                            }
                            Inventory[21].amount--;
                            if(Inventory[21].amount <= 0)
                            {
                              Inventory[21].item = "none";
                              Inventory[21].amount = 0;
                            }
                            Inventory[22].item = itemCrafted;
                            Inventory[22].amount += craftAmount;
                          }
                          craftProgress = 0;
                        }, craftInterval)
                      }, craftInterval)
                    }, craftInterval)
                  }, craftInterval)
                }, craftInterval)
              }, craftInterval)
            }, craftInterval)
          }, craftInterval)
        }, craftInterval)
      }, craftInterval)
    }
  }
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

  function addToInventory(item, amount) {
    for (var i = 0; i < amount; i++) {
      let foundExistingItemStack = false;
      for (var j = 0; j < Inventory.length; j++) {
        if(Inventory[j].item == item && Inventory[j].amount < ItemProperties[Inventory[j].item].stackSize)
        {
          foundExistingItemStack = true;
          Inventory[j].item = item;
          Inventory[j].amount++;
          break;
        }
      }
      for (var j = 0; j < Inventory.length; j++) {
        if(Inventory[j].item == "none" && !foundExistingItemStack)
        {
          Inventory[j].item = item;
          Inventory[j].amount++;
          break;
        }
      }
    }
  }
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
  function worldLoop() {
    Object.keys(block).forEach((key) => {
      const blockState = block[key];
      if(blockState.type == "grass")
      {
        let blockAbove = false;
        Object.keys(block).forEach((tkey) => {
          const blockStateT = block[tkey];
          if(blockStateT.y === blockState.y - 1 && blockStateT.x == blockState.x && Math.random() > 0.3 && blockStateT.sizeX > 0.0)
          {
            firebase.database().ref("block/" + blockState.id).update({
              type: "dirt"
            });//blockState.type = "dirt";
          }
          if(blockStateT.y === blockState.y - 1 && blockStateT.x == blockState.x)
          {
            blockAbove = true;
          }
        })
        if(Math.random() < 0.5 && !blockAbove)
        {
          let growGrass = firebase.database().ref(`block/pn` + Math.round(blockState.x) + "x" + Math.round(blockState.y-1));
          growGrass.set({
            x: Math.round(blockState.x), 
            y: Math.round(blockState.y-1), 
            id: "pn" + Math.round(blockState.x) + "x" + Math.round(blockState.y-1), 
            type: "tall_grass", 
            sizeX: BlockProperties["tall_grass"].sizeX, 
            sizeY: BlockProperties["tall_grass"].sizeY,
            centerX: BlockProperties["tall_grass"].centerX, 
            centerY: BlockProperties["tall_grass"].centerY,  
            hp: 5, 
            strength: BlockProperties["tall_grass"].strength
          })
        }
      }
      if(blockState.type == "dirt")
      {
        let found = false;
        Object.keys(block).forEach((tkey) => {
          const blockStateT = block[tkey];
          if(blockStateT.y === blockState.y - 1 && blockStateT.x == blockState.x && blockStateT.sizeX > 0.0)
          {
            found = true;
          }
        })
        if(!found)
        {
          firebase.database().ref("block/" + blockState.id).update({
            type: "grass"
          });//blockState.type = "dirt";
        }
      }
    })
    //repeat
    setTimeout(() => {
      worldLoop();
    }, 60000);
  }
  function tickLoop() {
    if(players[playerId] != null) {
      if(players[playerId].health <= 0) {
        playerRef.update({
          isDead: true
        })
      }
      document.querySelector(".hotbar-item-ui-1").style.background = "url(images/" + Inventory[0].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hotbar-item-ui-1").children) {
        child.innerText = Inventory[0].amount;
        if(Inventory[0].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hotbar-item-ui-2").style.background = "url(images/" + Inventory[1].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hotbar-item-ui-2").children) {
        child.innerText = Inventory[1].amount;
        if(Inventory[1].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hotbar-item-ui-3").style.background = "url(images/" + Inventory[2].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hotbar-item-ui-3").children) {
        child.innerText = Inventory[2].amount;
        if(Inventory[2].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hotbar-item-ui-4").style.background = "url(images/" + Inventory[3].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hotbar-item-ui-4").children) {
        child.innerText = Inventory[3].amount;
        if(Inventory[3].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hotbar-item-ui-5").style.background = "url(images/" + Inventory[4].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hotbar-item-ui-5").children) {
        child.innerText = Inventory[4].amount;
        if(Inventory[4].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-1").style.background = "url(images/" + Inventory[5].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-1").children) {
        child.innerText = Inventory[5].amount;
        if(Inventory[5].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-2").style.background = "url(images/" + Inventory[6].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-2").children) {
        child.innerText = Inventory[6].amount;
        if(Inventory[6].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-3").style.background = "url(images/" + Inventory[7].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-3").children) {
        child.innerText = Inventory[7].amount;
        if(Inventory[7].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-4").style.background = "url(images/" + Inventory[8].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-4").children) {
        child.innerText = Inventory[8].amount;
        if(Inventory[8].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-5").style.background = "url(images/" + Inventory[9].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-5").children) {
        child.innerText = Inventory[9].amount;
        if(Inventory[9].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-6").style.background = "url(images/" + Inventory[10].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-6").children) {
        child.innerText = Inventory[10].amount;
        if(Inventory[10].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-7").style.background = "url(images/" + Inventory[11].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-7").children) {
        child.innerText = Inventory[11].amount;
        if(Inventory[11].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-8").style.background = "url(images/" + Inventory[12].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-8").children) {
        child.innerText = Inventory[12].amount;
        if(Inventory[12].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-9").style.background = "url(images/" + Inventory[13].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-9").children) {
        child.innerText = Inventory[13].amount;
        if(Inventory[13].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-10").style.background = "url(images/" + Inventory[14].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-10").children) {
        child.innerText = Inventory[14].amount;
        if(Inventory[14].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-11").style.background = "url(images/" + Inventory[15].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-11").children) {
        child.innerText = Inventory[15].amount;
        if(Inventory[15].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-12").style.background = "url(images/" + Inventory[16].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-12").children) {
        child.innerText = Inventory[16].amount;
        if(Inventory[16].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-13").style.background = "url(images/" + Inventory[17].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-13").children) {
        child.innerText = Inventory[17].amount;
        if(Inventory[17].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-14").style.background = "url(images/" + Inventory[18].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-14").children) {
        child.innerText = Inventory[18].amount;
        if(Inventory[18].amount <= 1) child.innerText = "";
      }
      document.querySelector(".inventory-item-ui-15").style.background = "url(images/" + Inventory[19].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".inventory-item-ui-15").children) {
        child.innerText = Inventory[19].amount;
        if(Inventory[19].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hand-crafting-item-ui-1").style.background = "url(images/" + Inventory[20].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hand-crafting-item-ui-1").children) {
        child.innerText = Inventory[20].amount;
        if(Inventory[20].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hand-crafting-item-ui-2").style.background = "url(images/" + Inventory[21].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hand-crafting-item-ui-2").children) {
        child.innerText = Inventory[21].amount;
        if(Inventory[21].amount <= 1) child.innerText = "";
      }
      document.querySelector(".hand-crafting-item-ui-3").style.background = "url(images/" + Inventory[22].item + ".png) no-repeat no-repeat";
      for (const child of document.querySelector(".hand-crafting-item-ui-3").children) {
        child.innerText = Inventory[22].amount;
        if(Inventory[22].amount <= 1) child.innerText = "";
      }
      document.querySelector(".mouse-holding-item").style.background = "url(images/" + inventoryMouseSlot.item + ".png) no-repeat no-repeat";
      document.querySelector(".selected-slot").style.left = (45 + (currentSlot * 32)) + "px";
      document.querySelector(".crafting-progress-bar").style.background = "url(images/crafting-progress/crafting-" + craftProgress + ".png)"

      handleMovement(0, yVel);
      handleMovement(xVel, 0);
      yVel += 0.002;
    }
    localStorage.setItem("myOldBlockId", myBlockId);

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
        el.querySelector(".Block_break_sprite_overlay").setAttribute("data-far", "false");
        el.querySelector(".Block_sprite").setAttribute("data-type", blockState.type);
      } else {
        let el = blockElements[blockState.id];
        el.querySelector(".Block_sprite").setAttribute("data-far", "true");
        el.querySelector(".Block_break_sprite_overlay").setAttribute("data-far", "true");
      }
    })

    //repeat
    setTimeout(() => {
      renderLoop();
    }, 1);
  }
  function mineLoop() {
    if(mouseDown && !inventoryShown)
    {
      let margin = {x: (screenDim.x - 720) / 2, y: (screenDim.y - 624) / 2};
      mouseTile = {x: Math.floor((((mousePos.x + ((myX - 7) * 48)) - margin.x)) / 48), y: Math.floor(((mousePos.y + ((myY - 7) * 48)) - margin.y) / 48)};
      let isBlock = false;
      Object.keys(block).forEach((key) => {
        const blockState = block[key];
        if(blockState.x === mouseTile.x && blockState.y === mouseTile.y)
        {
          isBlock = true;
        }
        if(blockState.x === mouseTile.x && blockState.y === mouseTile.y && action != 2)
        {
          let hpRed = 0;
          if(mineIdx % blockState.strength == 0)
          {
            hpRed = 1;
          }
          firebase.database().ref("block/" + key).update({
            hp: blockState.hp - hpRed
          })
          if(blockState.hp - 1 < 0)
          {
            addToInventory(randomFromArray(BlockTraits[blockState.type].drop), randomFromArray(BlockTraits[blockState.type].amount));
            firebase.database().ref("block/" + key).remove();
          }
          action = 1;
        }
      })
      let beside = false;
      Object.keys(block).forEach((key) => {
        const blockState = block[key];
        if(blockState.x === mouseTile.x - 1 && blockState.y === mouseTile.y)
        {
          beside = true;
        }
        if(blockState.x === mouseTile.x + 1 && blockState.y === mouseTile.y)
        {
          beside = true;
        }
        if(blockState.x === mouseTile.x && blockState.y === mouseTile.y - 1)
        {
          beside = true;
        }
        if(blockState.x === mouseTile.x && blockState.y === mouseTile.y + 1)
        {
          beside = true;
        }
      })
      if(!isBlock && action != 1 && beside && Inventory[currentSlot].amount > 0 && ItemProperties[Inventory[currentSlot].item].isPlaceable)
      {
        blockRef = firebase.database().ref(`block/` + playerId + myBlockId);
        blockRef.set({
          x: mouseTile.x, 
          y: mouseTile.y, 
          id: playerId + myBlockId, 
          type: Inventory[currentSlot].item, 
          sizeX: BlockProperties[Inventory[currentSlot].item].sizeX, 
          sizeY: BlockProperties[Inventory[currentSlot].item].sizeY,
          centerX: BlockProperties[Inventory[currentSlot].item].centerX, 
          centerY: BlockProperties[Inventory[currentSlot].item].centerY,  
          hp: 5, 
          strength: BlockProperties[Inventory[currentSlot].item].strength
        })
        myBlockId++;
        action = 2;
        Inventory[currentSlot].amount--;
        if(Inventory[currentSlot].amount == 0)
        {
          Inventory[currentSlot].item = "none";
        }
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
      inWater = false;
      Object.keys(block).forEach((key) => {
        const blockState = block[key];
        if(myX + 0.25 > (blockState.x + blockState.centerX) - (blockState.sizeX/2) && myX - 0.25 < (blockState.x + blockState.centerX) + (blockState.sizeX/2) && (myY - 0.275) + 0.5 > (blockState.y + blockState.centerY) - (blockState.sizeY/2) && (myY - 0.15) - 0.5 < (blockState.y + blockState.centerY) + (blockState.sizeY/2) && !(blockState.sizeX == 0) && !(blockState.type == "water"))
        {
          isCollision = true;
        }
        if(myX + 0.25 > (blockState.x + blockState.centerX) - (blockState.sizeX/2) && myX - 0.25 < (blockState.x + blockState.centerX) + (blockState.sizeX/2) && (myY - 0.275) + 0.5 > (blockState.y + blockState.centerY) - (blockState.sizeY/2) && (myY - 0.15) - 0.5 < (blockState.y + blockState.centerY) + (blockState.sizeY/2) && blockState.type == "water")
        {
          inWater = true;
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
        centerX: 0.0, 
        centerY: 0.0,  
        hp: 5, 
        strength: 500
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
      centerX: 0.0, 
      centerY: 0.0, 
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
        centerX: 0.0, 
        centerY: 0.0,  
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

    let changeCount = 0;
    let initBiome = randomFromArray(["plains", "forest", "desert"]);
    let currentBiome = initBiome;
    for (var i = 0; i <= worldRad*2; i++) {
      biomeMap[i] = currentBiome;
      changeCount++;
      if(Math.random() * 20 < changeCount - 6)
      {
        currentBiome = randomFromArray(BiomeRules[currentBiome]);
        changeCount = 0;
      }
    }
    for(let i = -worldRad; i < worldRad; i++) {
      blockRef = firebase.database().ref(`block/init` + i + "x" + "0");
      let thisGroundBlock = BiomeBlock[biomeMap[i+worldRad]];
      blockRef.set({
        x: i, 
        y: 0, 
        id: "init" + i + "x" + "0", 
        type: thisGroundBlock, 
        sizeX: BlockProperties[thisGroundBlock].sizeX, 
        sizeY: BlockProperties[thisGroundBlock].sizeY,
        centerX: BlockProperties[thisGroundBlock].centerX, 
        centerY: BlockProperties[thisGroundBlock].centerY,  
        hp: 5, 
        strength: BlockProperties[thisGroundBlock].strength
      })
    }
    console.log(biomeMap);

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
      if(biomeMap[x+worldRad] == "ocean")
      {
        y = worldSurface;
      }
      blockRef = firebase.database().ref(`block/pn` + Math.round(x) + "x" + Math.round(y));
      let thisGroundBlock = BiomeBlock[biomeMap[x+worldRad]];
      blockRef.set({
        x: Math.round(x), 
        y: Math.round(y), 
        id: "pn" + Math.round(x) + "x" + Math.round(y), 
        type: thisGroundBlock, 
        sizeX: BlockProperties[thisGroundBlock].sizeX, 
        sizeY: BlockProperties[thisGroundBlock].sizeY,
        centerX: BlockProperties[thisGroundBlock].centerX, 
        centerY: BlockProperties[thisGroundBlock].centerY,  
        hp: 5, 
        strength: BlockProperties[thisGroundBlock].strength
      })
      if(Math.random() < 0.4 && biomeMap[x+worldRad] != "desert" && biomeMap[x+worldRad] != "ocean")
      {
        blockRef = firebase.database().ref(`block/pn` + Math.round(x) + "x" + Math.round(y-1));
        blockRef.set({
          x: Math.round(x), 
          y: Math.round(y-1), 
          id: "pn" + Math.round(x) + "x" + Math.round(y-1), 
          type: "tall_grass", 
          sizeX: BlockProperties["tall_grass"].sizeX, 
          sizeY: BlockProperties["tall_grass"].sizeY,
          centerX: BlockProperties["tall_grass"].centerX, 
          centerY: BlockProperties["tall_grass"].centerY,  
          hp: 5, 
          strength: BlockProperties["tall_grass"].strength
        })
      }
      if(Math.random() < 0.1 && biomeMap[x+worldRad] != "desert" && biomeMap[x+worldRad] != "ocean")
      {
        treePos.push([Math.round(x), Math.round(y-1)]);
      }
      if(Math.random() < 0.2 && biomeMap[x+worldRad] == "forest")
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
          type: thisGroundBlock, 
          sizeX: BlockProperties[thisGroundBlock].sizeX, 
          sizeY: BlockProperties[thisGroundBlock].sizeY,
          centerX: BlockProperties[thisGroundBlock].centerX, 
          centerY: BlockProperties[thisGroundBlock].centerY,  
          hp: 5, 
          strength: BlockProperties[thisGroundBlock].strength
        })
        if(Math.round(y+1+i) == 0)
        {
          if(biomeMap[Math.round(x-2)+25] != null && biomeMap[Math.round(x-2)+25] == "ocean" && biomeMap[Math.round(x+25)] == "ocean" && biomeMap[Math.round(x+2)+25] != null && biomeMap[Math.round(x+2)+25] == "ocean")
          {
            firebase.database().ref("block/init" + Math.round(x) + "x" + (Math.round(y+i)+2)).update({
              type: "water", 
              sizeX: BlockProperties["water"].sizeX, 
              sizeY: BlockProperties["water"].sizeY, 
              centerX: BlockProperties["water"].centerX, 
              centerY: BlockProperties["water"].centerY, 
              strength: BlockProperties["water"].strength
            });
          }
        }
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
            centerX: 0.0, 
            centerY: 0.0,  
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
    for(let i = -worldRad; i < worldRad; i++) {
      let oreChance = Math.random();
      if(oreChance < 0.2)
      {
        let veinSize = Math.round(Math.random() * 3) + 2;
        let thisY = Math.round((Math.random() * 8) + 1);
        let oreSpawnPos = {
          x: i, 
          y: thisY
        };
        for (var h = 0; h < veinSize; h++) {
          if(oreSpawnPos.y <= 9)
          {
            blockRef = firebase.database().ref("block/init" + oreSpawnPos.x + "x" + oreSpawnPos.y);
            blockRef.set({
              x: oreSpawnPos.x, 
              y: oreSpawnPos.y, 
              id: "init" + oreSpawnPos.x + "x" + oreSpawnPos.y, 
              type: "coal_ore", 
              sizeX: BlockProperties["coal_ore"].sizeX, 
              sizeY: BlockProperties["coal_ore"].sizeY,
              centerX: BlockProperties["coal_ore"].centerX, 
              centerY: BlockProperties["coal_ore"].centerY,  
              hp: 5, 
              strength: BlockProperties["coal_ore"].strength
            })
            if(Math.random() < 0.5)
            {
              oreSpawnPos.x += (Math.round(Math.random()) * 2) - 1;
            }
            if(Math.random() < 0.5)
            {
              oreSpawnPos.y += (Math.round(Math.random()) * 2) - 1;
            }
          }
        }
      } else if(oreChance < 0.4)
      {
        let veinSize = Math.round(Math.random() * 2) + 2;
        let thisY = Math.round((Math.random() * 6) + 3);
        let oreSpawnPos = {
          x: i, 
          y: thisY
        };
        for (var h = 0; h < veinSize; h++) {
          if(oreSpawnPos.y <= 9)
          {
            blockRef = firebase.database().ref("block/init" + oreSpawnPos.x + "x" + oreSpawnPos.y);
            blockRef.set({
              x: oreSpawnPos.x, 
              y: oreSpawnPos.y, 
              id: "init" + oreSpawnPos.x + "x" + oreSpawnPos.y, 
              type: "iron_ore", 
              sizeX: BlockProperties["iron_ore"].sizeX, 
              sizeY: BlockProperties["iron_ore"].sizeY,
              centerX: BlockProperties["iron_ore"].centerX, 
              centerY: BlockProperties["iron_ore"].centerY,  
              hp: 5, 
              strength: BlockProperties["iron_ore"].strength
            })
            if(Math.random() < 0.5)
            {
              oreSpawnPos.x += (Math.round(Math.random()) * 2) - 1;
            }
            if(Math.random() < 0.5)
            {
              oreSpawnPos.y += (Math.round(Math.random()) * 2) - 1;
            }
          }
        }
      } else if(oreChance < 0.5)
      {
        let veinSize = Math.round(Math.random() * 3) + 1;
        let thisY = Math.round((Math.random() * 5) + 4);
        let oreSpawnPos = {
          x: i, 
          y: thisY
        };
        for (var h = 0; h < veinSize; h++) {
          if(oreSpawnPos.y <= 9)
          {
            blockRef = firebase.database().ref("block/init" + oreSpawnPos.x + "x" + oreSpawnPos.y);
            blockRef.set({
              x: oreSpawnPos.x, 
              y: oreSpawnPos.y, 
              id: "init" + oreSpawnPos.x + "x" + oreSpawnPos.y, 
              type: "gold_ore", 
              sizeX: BlockProperties["gold_ore"].sizeX, 
              sizeY: BlockProperties["gold_ore"].sizeY,
              centerX: BlockProperties["gold_ore"].centerX, 
              centerY: BlockProperties["gold_ore"].centerY,  
              hp: 5, 
              strength: BlockProperties["gold_ore"].strength
            })
            if(Math.random() < 0.5)
            {
              oreSpawnPos.x += (Math.round(Math.random()) * 2) - 1;
            }
            if(Math.random() < 0.5)
            {
              oreSpawnPos.y += (Math.round(Math.random()) * 2) - 1;
            }
          }
        }
      }
    }
  }

  function initGame() {
    new KeyPressListener("ArrowUp", () => {
      if((yVel == 0.002 || inWater) && !inventoryShown) handleMovement(0, -0.07)
    }, () => handleMovement(0, 0))
    new KeyPressListener("ArrowLeft", () => {if(!inventoryShown) xVel = -0.03}, () => {if(xVel == -0.03) xVel = 0})
    new KeyPressListener("ArrowRight", () => {if(!inventoryShown) xVel = 0.03}, () => {if(xVel == 0.03) xVel = 0})
    new KeyPressListener("KeyW", () => {
      if((yVel == 0.002 || inWater) && !inventoryShown) handleMovement(0, -0.07)
    }, () => handleMovement(0, 0))
    new KeyPressListener("KeyA", () => {if(!inventoryShown) xVel = -0.03}, () => {if(xVel == -0.03) xVel = 0})
    new KeyPressListener("KeyD", () => {if(!inventoryShown) xVel = 0.03}, () => {if(xVel == 0.03) xVel = 0})
    new KeyPressListener("Space", () => handleAttack(), () => {})
    new KeyPressListener("KeyE", () => {
      if(craftProgress == 0)
      {
        inventoryShown = !inventoryShown;
        document.querySelector(".inventory").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
        document.querySelector(".hotbar").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
        document.querySelector(".mouse-holding-item").setAttribute("data-inv", (inventoryShown ? "true" : "false"));
        document.querySelector(".selected-slot").setAttribute("data-inv", (!inventoryShown ? "true" : "false"));
      }
    }, () => {})
    new KeyPressListener("Digit1", () => {currentSlot = 0}, () => {})
    new KeyPressListener("Digit2", () => {currentSlot = 1}, () => {})
    new KeyPressListener("Digit3", () => {currentSlot = 2}, () => {})
    new KeyPressListener("Digit4", () => {currentSlot = 3}, () => {})
    new KeyPressListener("Digit5", () => {currentSlot = 4}, () => {})
    new KeyPressListener("KeyQ", () => {isQPressed = true}, () => {isQPressed = false})

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
        el.querySelector(".Block_break_sprite_overlay").setAttribute("data-hp", blockState.hp);
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
      let mouseBlock = document.querySelector(".mouse-holding-item");
      const left = mousePos.x - (screenDim.x/2);
      const top = mousePos.y - (screenDim.y/2);
      mouseBlock.style.transform = `translate3d(${left}px, ${top}px, 0) scale(3)`;
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
    setTimeout(() => worldLoop(), 1000);
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