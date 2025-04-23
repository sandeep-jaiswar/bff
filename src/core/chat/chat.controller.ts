import { Body, Controller, Post } from '@nestjs/common';
import { EventServiceClient } from '../event/event.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly eventService: EventServiceClient) {}

  @Post('message')
  async sendMessage(@Body() body: SendMessageDto) {
    const type = 'chat.message.sent';
    const key = 'chat.message.sent';
    try {
      const status = await this.eventService.sendEvent(type, key, body);
      return { status, success: true };
    } catch (error) {
      return {
        status: 'error',
        success: false,
        message: error.message,
      };
    }
  }
}
