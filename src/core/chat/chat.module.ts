import { Module } from '@nestjs/common';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  providers: [ChatRepository],
  exports: [ChatRepository],
})
export class ChatModule {}
