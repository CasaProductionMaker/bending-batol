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

function reset(){
  firebase.database().ref("info").set({
    useramount: 0, 
    teams: {}, 
    private: {
      key: "fdSSGxGVn4my8yl"
    }, 
    encPassword: "tl9bQHpB7SYrxUj"
  });
}

let encPass = "";
let key = "";

firebase.database().ref("info/encPassword").once("value").then((snapshot) => {
  encPass = snapshot.val() || "";
});
firebase.database().ref("info/private/key").once("value").then((snapshot) => {
  key = snapshot.val() || "";
});

function decipher(string, key) {
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let decodedString = "";
  for (var i = 0; i < string.length; i++) {
    decodedString += alphabet[(alphabet.indexOf(string[i]) + alphabet.indexOf(key[i])) % alphabet.length]
  }
  return decodedString;
}

function submitPassword() {
  if(document.querySelector("#password").value == decipher(encPass, key))
  {
    firebase.database().ref("winningTeam").set(document.querySelector("#teamname").value);
  }
  document.querySelector("#password").value = "";
  document.querySelector("#teamname").value = "";
}
