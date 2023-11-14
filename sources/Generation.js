var controls_list = [
  document.getElementById("start"),
  document.getElementById("stop"),
  document.getElementById("reset"),
  document.getElementById("save"),
  document.getElementById("best_display"),
]

controls_list[0].onclick = (() => stop = false);
controls_list[1].onclick = (() => stop = true);
controls_list[4].onclick = (() => {
  best_display = best_display ? false : true;
  if(best_display) return controls_list[4].innerText = "Show All";
  controls_list[4].innerText = "Show Best"
});

var input_length = 3;
var start = true, stop = false;
var best_display = false;
var all_simulation = new Set();

class Generation {
  constructor() {
    this.intervals = 50;
    this.generation = 0;

    for(let i = 0; i < this.intervals; i++) {
      var neural = new NeuralNetwork([3, 6, 2]) 
      let game = new Simulation(neural);
      all_simulation.add(game);

      let inputs = [game.player.x, game.ball.x, game.ball.y]
      let outputs = NeuralNetwork.feedForward(inputs, neural);
      let renderer = game.render(outputs)
    }
  }

  new(previous) {
    this.generation++;
    var new_gen = new Set()
    let parse = 0;

    save = false;
    console.clear();
    if(previous.size > 0) {
      previous.forEach(game => {
        if(Math.round(Math.random()) == 1) {
          log("winner has mutated")
          game.neural.mutate(game.neural)
        }
        let new_game = new Simulation(game.neural);
        new_gen.add(new_game);
        parse++;
      })
    }
    all_simulation = new_gen;

    for(let i = 0; i < this.intervals - previous.size; i++) {
      var neural = new NeuralNetwork([input_length, 6, 3]) 
      let game = new Simulation(neural);
      all_simulation.add(game);
    }
    log("___________")
    log(previous.size + " has passed")
    log("generation: " + this.generation)
    
  }
}

var generation = new Generation();
var good_enough = new Set();
var save = false;
function Frame() {
  consoles.innerText = MsgConsole;
  if(stop) return;

  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  if(all_simulation.size < generation.intervals * 0.2 && !save) {
    good_enough = new Set([...good_enough, ...all_simulation]);
    save = true;
  }

  if(all_simulation.size < generation.intervals * 0.02) {
    console.log(good_enough)
    generation.new(good_enough);
    good_enough = new Set();
    return;
  } 

  let best = Array.from(all_simulation).sort((a, b) => b.score - a.score)[0];

  if(all_simulation.size == 0) return;
  all_simulation.forEach(game => {
    if(game.player.isDead) {
      return all_simulation.delete(game);
    }

    if(game == best && best_display) {
      let neural = best.neural;
      let inputs = [best.player.x, best.ball.x, best.ball.y]
      let outputs = NeuralNetwork.feedForward(inputs, neural);
      best.render(outputs, best_display ? true : false);
      return;
    }

    let neural = game.neural;
    let inputs = [game.player.x, game.ball.x, game.ball.y]
    let outputs = NeuralNetwork.feedForward(inputs, neural);
    let renderer = game.render(outputs, false)
  })
}

var app = new App("Breakout", Frame)
app.runLoop();

canvas.onmousemove = function(e) {
    mouseX = e.clientX;

}