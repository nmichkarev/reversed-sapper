enum players {
  PLAYER_A,
  PLAYER_B,
}

export class Game {
  public dimension: number;
  public diamonds: number;
  private placement: number[][];
  private field: (number | null)[][];
  public playerA: string;
  public playerB: string;
  private current: players;
  public status: 'started' | 'finished' = 'started';

  playerADiamonds = 0;
  playerBDiamonds = 0;
  
  constructor(dimension: number, diamonds: number, playerAID: string, playerBID: string) {
    if (dimension < 0 || dimension > 7) throw new Error('N should be positive and <= 6');
    if (diamonds < 0 || diamonds >= dimension * dimension) throw new Error('Too much diamonds');
    if (playerAID === playerBID) throw new Error('');

    this.dimension = dimension;
    this.diamonds = diamonds;

    this.playerA = playerAID;
    this.playerB = playerBID;

    this.init();
  }

  get currentPlayer() {
    return this.current === players.PLAYER_A ? this.playerA : this.playerB;
  }

  addPoint() {
    if (this.current === players.PLAYER_A)
      this.playerADiamonds++;
    else 
      this.playerBDiamonds++;
    this.diamonds--;
  }

  finish() {
    return this.status = 'finished';
  }

  changeCurrentPlayer() {
    this.current = this.current === players.PLAYER_A ? players.PLAYER_B : players.PLAYER_A;
  }

  init() {
    this.field = new Array(this.dimension)
      .fill(0)
      .map(() => new Array(this.dimension).fill(null));

    this.placement = this.generateCells();
  }

  generateCells(): number[][] {
    const field = new Array(this.dimension).fill(undefined).map(() => []);
    let count = this.diamonds;
    const cellsCount = this.dimension * this.dimension;
    
    // place diamonds
    //TODO: make a better solution for generating random placement
    while(count) {
      const offset = getRandomInt(0, cellsCount);
      const i = Math.floor(offset / this.dimension);
      const j = offset - i * this.dimension;
      if (field[i][j] !== -1) {
        field[i][j] = -1;
        count--;
      }
    }

    // Calc numbers
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        if (field[i][j] === -1) continue;
        field[i][j] = getWeight(field, i, j);
      }
      
    }

    return field;
  }

  step(playerID: string, i: number, j: number): string | undefined {
    if (i < 0 || i > this.dimension) throw new Error('Bad request');
    if (j < 0 || j > this.dimension) throw new Error('Bad request');
    
    const isCellOpened = this.field[i][j] !== null;

    if (playerID !== this.currentPlayer) throw new Error('It\'s not your turn now');
    if (isCellOpened) throw new Error('Cell is already opened');

    const cell = this.placement[i][j];

    if (cell === -1) {
      this.addPoint();
    } else {
      this.changeCurrentPlayer();
    }
    this.field[i][j] = cell;

    if (this.diamonds === 0) return this.finish();
  }

  getState() {
    return {
      field: this.field.map((line) => [...line]),
      currentPlayer: this.currentPlayer,
      status: this.status,
      playerAPoints: this.playerADiamonds,
      playerBPoints: this.playerBDiamonds,
    }
  }
}

function getWeight(arr: number[][], i: number, j: number) {
  let sum = 0;
  
  sum += arr[i - 1]?.[j - 1] === -1 ? 1 : 0;
  sum += arr[i - 1]?.[j] === -1 ? 1 : 0;
  sum += arr[i - 1]?.[j + 1] === -1 ? 1 : 0;
  sum += arr[i]?.[j - 1] === -1 ? 1 : 0;
  sum += arr[i]?.[j + 1] === -1 ? 1 : 0;
  sum += arr[i + 1]?.[j - 1] === -1 ? 1 : 0;
  sum += arr[i + 1]?.[j] === -1 ? 1 : 0;
  sum += arr[i + 1]?.[j + 1] === -1 ? 1 : 0;
  
  return sum;
}

function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}