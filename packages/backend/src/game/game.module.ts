import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { EventsModule } from 'src/events/events.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  providers: [GameService, EventsGateway],
  imports: [EventsModule],
})
export class GameModule {}
