import { Module } from '@nestjs/common';
import { ChatRepository } from './repositories/chat.repository';
import { ChatController } from './chat.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule],
  controllers: [ChatController],
  providers: [ChatRepository],
  exports: [ChatRepository],
})
export class ChatModule {}
