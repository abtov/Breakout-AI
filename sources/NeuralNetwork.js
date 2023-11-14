function sigmoid(x) {
  return 1 / (1 + Math.exp(-x/2));
}

class Layer {
    constructor(inputCount, outputCount) {
      this.inputs = new Array(inputCount);
      this.outputs = new Array(outputCount);
      this.biases = new Array(outputCount);
  
      this.weights = [];
  
      for(let i = 0; i < inputCount; i++) {
        this.weights[i] = new Array(outputCount);
      }
  
      Layer.#randomize(this);
    }
  
    sigmoid(x) {
      return 1 / (1 + Math.exp(-x/2));
    }
  
    static #randomize(level) {
      for(let i = 0; i < level.inputs.length; i++) {
        for(let j = 0; j < level.outputs.length; j++) {
          level.weights[i][j] = Math.random() * 2 - 1;
        }
      }
  
      for(let i = 0; i < level.biases.length; i++) {
        level.biases[i] = Math.random() * 2 - 1;
      }
    }
  
    static feedForward(givenInputs, level) {
      for(let i = 0; i < level.inputs.length; i++) {
        level.inputs[i] = givenInputs[i];
      }
      for(let i = 0; i < level.outputs.length; i++) {
        let sum = 0;
        for(let j = 0; j < level.inputs.length; j++) {
          sum += level.inputs[j] * level.weights[j][i];
        }
        level.outputs[i] = sigmoid(sum + level.biases[i]);
      }
      return level.outputs;
    }
  }
  
  function lerp(a, b, t) {
    return a + (b - a) * t
  }
  
  class NeuralNetwork {
    constructor(neron) {
      this.levels = [];
      for(let i = 0; i < neron.length; i++) {
        this.levels[i] = new Layer(neron[i], neron[i + 1]);
      }
    }
  
    mutate(network, amount=0.2) {
      network.levels.forEach((level) => {
        for(let i = 0; i < level.biases.length; i++) {
          level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
        }
        for(let i = 0; i < level.weights.length; i++) {
          for(let j = 0; j < level.weights[i].length; j++) {
            level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
          }
        }
      })
    }
  
    static feedForward(givenInputs, neuralNetwork) {
      let outputs = Layer.feedForward(givenInputs, neuralNetwork.levels[0]);
      for(let i = 1; i < neuralNetwork.levels.length - 1; i++) {
        outputs = Layer.feedForward(outputs, neuralNetwork.levels[i]);
      }
  
      return outputs;
    }
  }