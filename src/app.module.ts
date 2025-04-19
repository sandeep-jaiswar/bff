import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './core/chat/chat.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
