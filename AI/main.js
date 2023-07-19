import { RNA } from './rna.js';

const getDistance = (a, b) => {
  return Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2));
}

export class AI {
  constructor(game) {
    this.game = game;
    this.keys = [
      'ArrowDown',
      'ArrowUp',
      'ArrowLeft',
      'ArrowRight',
      'Enter',
    ];
    this.game.input = { keys: [] };
    this.bestScore = Number(localStorage.getItem('best-score') || 0);
    this.rna = new RNA(2, [10, 5]);
    this.rna.load();
    this.rna.mutate(0.2);
  }

  reload() {
    if (this.game.score > this.bestScore) {
      localStorage.setItem('best-score', this.game.score);
      this.rna.save();
    }
    window.location.reload();
  }

  move(outputList) {
    this.game.input.keys = this.keys.filter((_, i) => outputList[i]);
  }

  update() {
    const player = this.game.player;
    const [nearly] = this.game.enemies;
    if (!player || !nearly) return;

    const topScreen = {
      x: this.game.width,
      y: this.game.height,
    }

    const maxDistance = getDistance(player, topScreen);

    // Signals
    const offset = Math.min(1, getDistance(nearly, player) / maxDistance);
    const height =  nearly.y / topScreen.y;

    // Compute movements
    const outputList = this.rna.compute([offset, height]);
    this.move(outputList);
  }
}