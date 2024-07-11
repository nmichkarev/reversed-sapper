import { Injectable } from '@nestjs/common';
import { Game } from './Game';
import { EventsGateway } from 'src/events/events.gateway';
import { Socket } from 'socket.io';

//TODO: implement lobby for players
@Injectable()
export class GameService {
  constructor(private readonly ioGateway: EventsGateway) {}
  
  game: Game;
  player1: Socket;
  player2: Socket;
  
  bindHandlers(socket: Socket) {
    const self = this;
    socket.on('click', function(data) {
      const { i, j } = data;
      if (!Number.isInteger(i) || !Number.isInteger(j)) {
        throw new Error('incorrect data')
      }
      try {
        const finish = self.game.step(socket.id, i, j);
        self.ioGateway.io.emit('state', self.game.getState());
        //if (finish) self.reset();
      } catch (e) {
        socket.send('error', e.message);
      }
    })

    socket.on('disconnect', self.reset);
  }

  reset() {
    this.player1?.removeAllListeners();
    this.player2?.removeAllListeners();
    this.game = null;
    console.log('Game reseted');
  }

  start(size: number, diamondsCount: number) {
    const { sockets } = this.ioGateway.io.sockets;
    
    if (this.game) {
      this.reset();
    }
 
    if (sockets.size < 2) throw new Error(`Count of connected players: ${sockets.size}`);

    const sockKeys = Array.from(sockets.keys()).slice(0, 2);
    const socket1 = sockets.get(sockKeys[0]);
    const socket2 = sockets.get(sockKeys[1]);

    this.game = new Game(size, diamondsCount, socket1.id, socket2.id);
    
    this.bindHandlers(socket1);
    this.bindHandlers(socket2);

    this.player1 = socket1;
    this.player2 = socket2;

    this.ioGateway.io.emit('state', this.game.getState());
  }
}
