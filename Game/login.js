const firebaseConfig = {
  apiKey: "AIzaSyDBKwQRTu3xsHZjuzW3TFZFdHlGwbhttqY",
  authDomain: "test-game-eba29.firebaseapp.com",
  databaseURL: "https://test-game-eba29-default-rtdb.firebaseio.com",
  projectId: "test-game-eba29",
  storageBucket: "test-game-eba29.firebasestorage.app",
  messagingSenderId: "118728291028",
  appId: "1:118728291028:web:3f0a0dc3ee48dbcb304141"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

let user = document.querySelector("#player-user");
let pass = document.querySelector("#player-pass");

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
function logIn()
{
  Object.keys(usersD).forEach((key) => {
    const thisuser = usersD[key];
    if(user.value == thisuser.username && pass.value == thisuser.password)
    {
      localStorage.setItem("TheBattleUser", thisuser.username);
      window.location.href = "index.html";
    }
  })
  firebase.database().ref("users/" + user.value).set({
  	username: user.value, 
  	password: pass.value
  })
  Object.keys(usersD).forEach((key) => {
    const thisuser = usersD[key];
    if(user.value == thisuser.username && pass.value == thisuser.password)
    {
      localStorage.setItem("TheBattleUser", thisuser.username);
      window.location.href = "index.html";
    }
  })
}