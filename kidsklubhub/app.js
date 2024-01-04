const firebaseConfig = {
  apiKey: "AIzaSyBTFGg_9ITdXiqUIklFg7u6qWzfSiVnfTc",
  authDomain: "kidsklubchat.firebaseapp.com",
  databaseURL: "https://kidsklubchat-default-rtdb.firebaseio.com",
  projectId: "kidsklubchat",
  storageBucket: "kidsklubchat.appspot.com",
  messagingSenderId: "173944093629",
  appId: "1:173944093629:web:b4c99ad053bc77d8adf0d4"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//My Code
let user = localStorage.getItem("username");
let saveUser = false;
if(user == "null")
{
  window.location.href = "index.html";
}
function loadHomepage() {
  saveUser = true;
  console.log(saveUser)
  window.location.href = "homepage.html";
}
function logUserOut() {
  localStorage.setItem("username", "null");
  window.location.href = "index.html";
}

let replytomsg = null;

window.addEventListener('beforeunload', (event) => {
  if(!saveUser)
  {
    localStorage.setItem("username", "null");
    event.returnValue = '';
  }
});

function sendMessage() {
  const date = Date.now();
  const chatRef = firebase.database().ref(`chat/` + date);
  chatRef.set({
    message: document.querySelector("#bottom-bar").querySelector("#chat_input").value, 
    id: date, 
    sender: user, 
    replyto: replytomsg
  })
  document.querySelector("#bottom-bar").querySelector("#chat_input").value = "";
  replytomsg = null;
}

let usersD = firebase.database().ref("users");
const users = firebase.database().ref("users");
users.on("child_added", (snapshot) => {
  const thisuser = snapshot.val();
  const key = thisuser.username;
  usersD[key] = thisuser;
})
firebase.database().ref("reloader").set({
  rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});
const chatContainer = document.querySelector("#chat-container");
let chatD = firebase.database().ref("chat");
const chat = firebase.database().ref("chat");
let previousload = {sender: "blub"};
chat.on("child_added", (snapshot) => {
  const thismessage = snapshot.val();
  const key = thismessage.id;
  chatD[key] = thismessage;

  // Create the DOM Element
  const messageElement = document.createElement("div");
  messageElement.classList.add("Message");
  if (thismessage.message.indexOf("@" + user) > -1)
  {
    messageElement.classList.add("Mention");
  }
  let thisrank = "worker";
  for (let auser in usersD) {
    if(usersD[auser]["username"] == thismessage.sender)
    {
      thisrank = usersD[auser]["rank"];
    }
  }
  if(previousload.sender == thismessage.sender && thismessage.replyto == null)
  {
    messageElement.innerHTML = thismessage.message + "<button onclick='replytomsg = " + thismessage.id + "' class='reply-button'>Reply</button>";
  } else {
    if(thismessage.replyto != null)
    {
      messageElement.innerHTML = "<div class='reply-text'>" + chatD[thismessage.replyto].sender + ": " + chatD[thismessage.replyto].message + "</div><div class='message-name " + thisrank + "'>" + thismessage.sender + "</div>" + thismessage.message + "<button onclick='replytomsg = " + thismessage.id + "' class='reply-button'>Reply</button>";
    } else {
      messageElement.innerHTML = "<div class='message-name " + thisrank + "'>" + thismessage.sender + "</div>" + thismessage.message + "<button onclick='replytomsg = " + thismessage.id + "' class='reply-button'>Reply</button>";
    }
  }
  previousload = thismessage;

  // Keep a reference for removal later and add to DOM
  //coinElements[key] = messageElement;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  //if (chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight) {
    //chatContainer.scrollTop = chatContainer.scrollHeight;
  //}
})
firebase.database().ref("reloader").set({
  rl: Math.random()*Math.random()*Math.random()*Math.random()*Math.random()
});

new KeyPressListener("Enter", () => sendMessage());
new KeyPressListener("KeyQ", () => {
  console.log(replytomsg)
});