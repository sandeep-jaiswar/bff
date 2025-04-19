import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private prisma: PrismaService) {}

  async createMessage(content: string, sender: string) {
    return this.prisma.message.create({
      data: { content, sender },
    });
  }

  async findAll() {
    return this.prisma.message.findMany();
  }
}
