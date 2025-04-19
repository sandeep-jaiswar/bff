import { Body, Controller, Post } from '@nestjs/common';
import { EventServiceClient } from '../event/event.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly eventService: EventServiceClient) {}

  @Post('message')
  async sendMessage(@Body() body: { sender: string; content: string }) {
    const type = 'anonymous.user.created';
    const key = body.sender;

    const status = await this.eventService.sendEvent(type, key, body);

    return { status };
  }
}
