var controls_list = [
  document.getElementById("start"),
  document.getElementById("stop"),
  document.getElementById("reset"),
  document.getElementById("save"),
  document.getElementById("best_display"),
]

controls_list[0].onclick = (() => stop = false);
controls_list[1].onclick = (() => stop = true);
controls_list[2].onclick = (() => generation.reset());
controls_list[4].onclick = (() => {
  best_display = best_display ? false : true;
  if(best_display) {
    generation.new_b();
    return controls_list[4].innerText = "Show All";
  }
  controls_list[4].innerText = "Show Best"
});

var input_length = 3;
var start = true, stop = false;
var best_display = false;
var all_simulation = new Set();
var best_simulation = null;

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
    return;
  }

  new(previous) {
    this.generation++;
    var new_gen = new Set()
    let parse = 0;

    save = false;
    //console.clear();
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
    let prev_arr = Array.from(previous);
    let prev_best = Math.max(...prev_arr.map(x => x.score))

    prev_arr.forEach(game => {
      if(game.score >= best_brain.score) {
        if(prev_best < 4 || game.score < 4) return;
        best_brain.neural = game.neural;
        best_brain.score = game.score;
        best_repl_len = 1; 

        console.log("best > ", best_brain)
      }
    })
    for(let i = 0; i < best_repl_len; i++) {
      let new_game = new Simulation(best_brain.neural);
      new_gen.add(new_game);
    }

    all_simulation = new_gen;

    for(let i = 0; i < this.intervals - previous.size - best_repl_len; i++) {
      var neural = new NeuralNetwork([input_length, 6, 3]) 
      let game = new Simulation(neural);
      all_simulation.add(game);
    }
    log("___________")
    log(previous.size + " has passed")
    log("generation: " + this.generation)
    log(`best score ${prev_best} / ${best_brain.score}`)
    
  }

  new_b() {
    if(best_brain.neural == null) return;
    let game = new Simulation(best_brain.neural);
    best_simulation = game;

    let inputs = [game.player.x, game.ball.x, game.ball.y]
    let outputs = NeuralNetwork.feedForward(inputs, best_simulation.neural);
    let renderer = game.render(outputs)

    log("____________________")
    log("logging best neural")

  }

  reset() {
    Array.from(all_simulation).forEach(game => {
      game.player.kill()
    })
    this.generation = 0;
  }
}

var generation = new Generation();
var good_enough = new Set();
var best_brain = {
  score: 0,
  neural: null
};
var best_repl_len = 0;
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
    generation.new(good_enough);
    good_enough = new Set();
    return;
  } 
  let array_sim = Array.from(all_simulation);
  let best = array_sim.sort((a, b) => b.score - a.score)[0];

  if(all_simulation.size == 0) return;
  if(best_display == false) {
    return all_simulation.forEach(game => {
      if(game.player.isDead) {
        return all_simulation.delete(game);
      }

      let neural = game.neural;
      let inputs = [game.player.x, game.ball.x, game.ball.y]
      let outputs = NeuralNetwork.feedForward(inputs, neural);
      let renderer = game.render(outputs, false)
      return;
    })
  }
  if(best_simulation == null) return;
  if(best_simulation.player.isDead) {
    generation.new_b();
    return;
  }

  let neural = best_simulation.neural;
  let inputs = [best_simulation.player.x, best_simulation.ball.x, best_simulation.ball.y]
  let outputs = NeuralNetwork.feedForward(inputs, neural);
  best_simulation.render(outputs, best_display ? true : false);
  dynLog(JSON.stringify(outputs.map(x => x.toFixed(4))))
}

var app = new App("Breakout", Frame)
app.runLoop();

canvas.onmousemove = function(e) {
    mouseX = e.clientX;

}