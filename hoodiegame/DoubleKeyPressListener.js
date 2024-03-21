class DoubleKeyPressListener {
  constructor(keyCode, secondCode, callback, lastcallback) {
    let keySafe = true;
    this.keydownFunction = function(event) {
      if (event.code === keyCode || event.code === secondCode) {
         if (keySafe) {
            keySafe = false;
            callback();
         }  
      }
   };
   this.keyupFunction = function(event) {
      if (event.code === keyCode || event.code === secondCode) {
         keySafe = true;
         lastcallback();
      }         
   };
   document.addEventListener("keydown", this.keydownFunction);
   document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() { 
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}