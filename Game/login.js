const firebaseConfig = {
  apiKey: "AIzaSyDmjog1nfuAAcL9qP7M7vwdnzTWbb5qSpY",
  authDomain: "hakattak-74dea.firebaseapp.com",
  databaseURL: "https://hakattak-74dea-default-rtdb.firebaseio.com",
  projectId: "hakattak-74dea",
  storageBucket: "hakattak-74dea.firebasestorage.app",
  messagingSenderId: "184893472817",
  appId: "1:184893472817:web:801e4e8303d9838f22d510"
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