import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message } from '../models/message.model';

@Injectable()
export class ChatRepository {
  private readonly logger = new Logger(ChatRepository.name);
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, senderId } = createMessageDto;
    try {
      return this.prisma.message.create({
        data: { content, senderId },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create message: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create message');
    }
  }

  async findAll(page = 1, limit = 10, orderBy: 'asc' | 'desc' = 'desc') {
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.message.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: orderBy,
          },
        }),
        this.prisma.message.count(),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch messages: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch messages');
    }
  }

  async findBySenderId(senderId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.message.findMany({
      where: { senderId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.message.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMessage(id: string) {
    return this.prisma.message.delete({
      where: { id },
    });
  }

  async updateMessage(id: string, content: string) {
    return this.prisma.message.update({
      where: { id },
      data: { content },
    });
  }
}
