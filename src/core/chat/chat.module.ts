import { Module } from '@nestjs/common';
import { ChatRepository } from './repositories/chat.repository';
import { ChatController } from './chat.controller';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatRepository],
  exports: [ChatRepository],
})
export class ChatModule {}
