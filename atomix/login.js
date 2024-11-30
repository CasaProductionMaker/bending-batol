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
      localStorage.setItem("AtomixUser", thisuser.username);
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
      localStorage.setItem("AtomixUser", thisuser.username);
      window.location.href = "index.html";
    }
  })
}