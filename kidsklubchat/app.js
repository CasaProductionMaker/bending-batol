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
if(user == "null")
{
  window.location.href = "index.html"
}

window.addEventListener('beforeunload', (event) => {
  localStorage.setItem("username", "null");
  event.returnValue = '';
});

function sendMessage() {
  const date = Date.now();
  const chatRef = firebase.database().ref(`chat/` + date);
  chatRef.set({
    message: document.querySelector("#bottom-bar").querySelector("#chat_input").value, 
    id: date, 
    sender: user
  })
  document.querySelector("#bottom-bar").querySelector("#chat_input").value = "";
}

const chatContainer = document.querySelector("#chat-container");
let chatD = firebase.database().ref("chat");
const chat = firebase.database().ref("chat");
chat.on("child_added", (snapshot) => {
  const thismessage = snapshot.val();
  const key = thismessage.id;
  chatD[key] = thismessage;

  // Create the DOM Element
  const messageElement = document.createElement("div");
  messageElement.classList.add("Message");
  messageElement.innerHTML = "<div class='message-name'>" + thismessage.sender + "</div>" + thismessage.message;

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