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
    this.rna = new RNA(4, [10, 10, 5]);
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
    const totalEnemies = Math.max(this.game.enemies.length, 1);
    const enemiesR = this.game.enemies.filter(e => e.x >= player.x).length;
    const enemiesL = this.game.enemies.filter(e => e.x < player.x).length;

    // Signals
    const offset = Math.min(1, getDistance(nearly, player) / maxDistance);
    const height =  nearly.y / topScreen.y;
    const rightRate = enemiesR / totalEnemies;
    const leftRate = enemiesL / totalEnemies;

    // Compute movements
    const outputList = this.rna.compute([offset, height, rightRate, leftRate]);
    this.move(outputList);
  }
}