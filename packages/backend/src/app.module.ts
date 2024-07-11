import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'packages', 'frontend', 'dist'),
    }),
    EventsModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway, GameService],
})
export class AppModule {}
