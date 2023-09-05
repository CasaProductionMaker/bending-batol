var timer = -1;
let hexList = ["80ff84", "b5f556", "f5f24e", "f79c40", "f74040"];
let lost = false;
(function(){
  function timerLoop() {
    timer += 0.0045;
    document.querySelector(".timerDisplay").innerText = timer.toString().slice(0, 6);
    document.body.style.backgroundColor = "#" + hexList[Math.floor(timer) / 2];
    //repeat
    setTimeout(() => {
      if(timer < 10){
        timerLoop();
      } else {
        document.querySelector(".timerDisplay").innerText = "YOU LOST";
        lost = true;
        setTimeout(() => {
          timer = -1;
        }, 2000);
      }
    }, 1);
  }
  document.onclick = function(event) {
    if(event === undefined) event = window.event;
    var target = "target" in event ? event.target : event.srcElement;
    let wastimer = timer
    timer = 0;
    if(wastimer === -1) timerLoop();
  };
})();