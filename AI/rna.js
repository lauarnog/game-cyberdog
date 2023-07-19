function randomRange (min, max) {
  return Math.random() * (max - min) + min;
}

function lerp (a, b, t) {
  return a + (b-a) * t;
}

// Neural Classes
class Neuron {
  constructor(inputs) {
    this.bias = randomRange(-1, 1);
    this.weightList = new Array(inputs)
      .fill()
      .map(() => randomRange(-1, 1))
  };

  g (signalList = []) {
    let u = 0;

    //Atribui o peso à cada sinal
    for (let i=0; i<this.weightList.length; i++) {
      u += signalList[i] * this.weightList[i];
    }

    if (u > this.bias) return 1; //Ativado
    else return 0; // não ativado
  }

  mutate (rate = 1) {
    this.weightList = this.weightList.map((w) => {
      return lerp(w, randomRange(-1,1), rate);
    });
    this.bias = lerp(this.bias, randomRange(-1,1), rate);
  }
}

export class RNA {
  constructor(inputCount = 1, levelList = []) {
    this.score = 0;
    this.levelList = levelList.map((l, i) => {
      const inputSize = i === 0 ? inputCount : levelList[i - 1];
      return new Array(l).fill().map(() => new Neuron(inputSize));
    });
  }

  compute (list = []) {
    for (let i = 0; i < this.levelList.length; i++) {
      const tempList = [];
      for (const neuron of this.levelList[i]) {
        if (list.length !== neuron.weightList.length) throw new Error('Invalid input');
        tempList.push(neuron.g(list))
      }
      list = tempList;
    }
    return list;
  }

  mutate(rate = 1) {
    for (const level of this.levelList) {
      for (const neuron of level) {
        neuron.mutate(rate);
      }
    }
  }

  load () {
    try {
      const rawRNA = localStorage.getItem('rna');
      const rna = JSON.parse(rawRNA);

      this.levelList = rna.map((neuronList) => {
        return neuronList.map((neuron) => {
          const n = new Neuron();
          n.bias = neuron.bias;
          n.weightList = neuron.weightList;
          return n;
        });
      })
    } catch (e) {
      return;
    }
  }

  save () {
    localStorage.setItem('rna', JSON.stringify(this.levelList));
  }
}
