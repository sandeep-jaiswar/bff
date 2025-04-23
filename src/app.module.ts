import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './core/chat/chat.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { EventModule } from './core/event/event.module';
import { EventGateway } from './gateways/event.gateway';
import { MatchModule } from './core/match/match.module';

@Module({
  imports: [PrismaModule, ChatModule, EventModule, MatchModule],
  controllers: [AppController],
  providers: [AppService, EventGateway],
})
export class AppModule {}
