import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  providers: [PrismaService, ChatRepository],
  exports: [PrismaService],
})
export class ChatModule {}
