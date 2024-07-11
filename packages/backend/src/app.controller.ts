import { BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { GameService } from './game/game.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private gameService: GameService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // TODO: implement input of size of a field and count of diamonds
  @Post('/start')
  start(): string {
    try {
      this.gameService.start(5, 5);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    return 'started';
  }
}
