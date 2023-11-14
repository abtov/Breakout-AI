class App {
  constructor(title, renderer) {
    this.title = title;
    this.renderer = renderer;
    this.startTime = Date.now();
    this.nbFrame = 0;
    this.runLoop = this.runLoop.bind(this)
  }

  runLoop() {
    this.updateFPS();
    this.renderer();
    if(this.runLoop == null) return;
    requestAnimationFrame(this.runLoop);
  }

  updateFPS() {
    const deltaTime = (Date.now() - this.startTime) / 1000;
    if(deltaTime < 2) return this.nbFrame++;
    document.title = `${this.title} - (${parseInt(this.nbFrame / deltaTime)})`;
    this.startTime = Date.now();
    this.nbFrame = 0;
  }

  stopLoop() {
    this.runLoop = null;
  }
}

var MsgConsole = "";
var consoles = document.getElementById("consoles");
var info = document.getElementById("info");


function log(msg) {
    MsgConsole += msg + "\n";
    setTimeout(function() {
      consoles.scrollTop = consoles.scrollHeight;
    }, 50)
    
}

function dynLog(msg) {
    info.innerText = msg;
}
