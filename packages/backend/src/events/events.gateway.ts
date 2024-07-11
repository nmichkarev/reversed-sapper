import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class EventsGateway {

  @WebSocketServer() io: Server;

  afterInit() {
    console.log("Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    console.log(`Client id: ${client.id} connected`);
    console.debug(`Number of connected clients: ${sockets.size}`);
  }
}
