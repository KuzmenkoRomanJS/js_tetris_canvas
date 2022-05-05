import { tetraminoes } from './tetraminoes.js';
import { ROWS, COLUMNS } from '../index.js';

export class Game {
  score = 0;
  lines = 0;
  level = 1;
  record = localStorage.getItem('tetris-record') || 0;

  points = [0, 100, 300, 700, 1500];

  gameOver = false;

  area = [
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
  ];

  activeTetramino = this.createTetramino();

  nextTetramino = this.createTetramino();

  createTetramino() {
    const keys = Object.keys(tetraminoes);
    const letterTetramino = keys[Math.floor(Math.random() * keys.length)];
    const rotation = tetraminoes[letterTetramino];
    const rotationIndex = Math.floor(Math.random() * rotation.length);
    const block = rotation[rotationIndex];

    return {
      block,
      rotationIndex,
      rotation,
      x: 3,
      y: 0,
    };
  }

  changeTetramino() {
    this.activeTetramino = this.nextTetramino;
    this.nextTetramino = this.createTetramino();
  }

  moveLeft() {
    if (
      this.checkOutPosition(this.activeTetramino.x - 1, this.activeTetramino.y)
    ) {
      this.activeTetramino.x -= 1;
    }
  }

  moveRight() {
    if (
      this.checkOutPosition(this.activeTetramino.x + 1, this.activeTetramino.y)
    ) {
      this.activeTetramino.x += 1;
    }
  }

  moveDown() {
    if (this.gameOver) return;
    if (
      this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y + 1)
    ) {
      this.activeTetramino.y += 1;
    } else {
      this.stopMove();
    }
  }

  rotateTetramino() {
    this.activeTetramino.rotationIndex =
      this.activeTetramino.rotationIndex < 3
        ? this.activeTetramino.rotationIndex + 1
        : 0;

    this.activeTetramino.block =
      this.activeTetramino.rotation[this.activeTetramino.rotationIndex];

    if (
      !this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y)
    ) {
      this.activeTetramino.rotationIndex =
        this.activeTetramino.rotationIndex > 0
          ? this.activeTetramino.rotationIndex - 1
          : 3;

      this.activeTetramino.block =
        this.activeTetramino.rotation[this.activeTetramino.rotationIndex];
    }
  }

  get viewArea() {
    const area = JSON.parse(JSON.stringify(this.area));
    const { x, y, block: tetramino } = this.activeTetramino;

    for (let i = 0; i < tetramino.length; i++) {
      const row = tetramino[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 'o') {
          area[y + i][x + j] = tetramino[i][j];
        }
      }
    }
    return area;
  }

  checkOutPosition(x, y) {
    const tetramino = this.activeTetramino.block;
    for (let i = 0; i < tetramino.length; i++) {
      for (let j = 0; j < tetramino[i].length; j++) {
        if (tetramino[i][j] === 'o') continue;
        if (
          !this.area[y + i] ||
          !this.area[y + i][x + j] ||
          this.area[y + i][x + j] !== 'o'
        ) {
          return false;
        }
      }
    }
    return true;
  }

  stopMove() {
    const { x, y, block: tetramino } = this.activeTetramino;
    for (let i = 0; i < tetramino.length; i++) {
      const row = tetramino[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 'o') {
          this.area[y + i][x + j] = tetramino[i][j];
        }
      }
    }

    this.changeTetramino();
    const countRow = this.clearRow();
    this.calcScore(countRow);
    this.updatePanels();
    this.gameOver = !this.checkOutPosition(
      this.activeTetramino.x,
      this.activeTetramino.y,
    );
  }

  clearRow() {
    const rows = [];

    for (let i = ROWS - 1; i >= 0; i--) {
      let countBlock = 0;
      for (let j = 0; j < COLUMNS; j++) {
        if (this.area[i][j] !== 'o') {
          countBlock += 1;
        }
      }
      if (!countBlock) break;

      if (countBlock === COLUMNS) {
        rows.unshift(i);
      }
    }

    rows.forEach(i => {
      this.area.splice(i, 1);
      this.area.unshift(Array(COLUMNS).fill('o'));
    });

    return rows.length;
  }

  calcScore(lines) {
    this.score += this.points[lines];
    this.lines += lines;
    this.level = Math.floor(this.lines / 10) + 1;

    if (this.score > this.record) {
      this.record = this.score;
      localStorage.setItem('tetris-record', this.score);
    }
  }

  createUpdatePanels(showScore, showNextTetramino) {
    showScore(this.lines, this.score, this.level, this.record);
    showNextTetramino(this.nextTetramino.block);

    this.updatePanels = () => {
      showScore(this.lines, this.score, this.level, this.record);
      showNextTetramino(this.nextTetramino.block);
    };
  }
}
