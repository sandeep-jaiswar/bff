import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventServiceClient } from 'src/core/event/event.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class EventGateway implements OnModuleInit, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventServiceClient: EventServiceClient) {}

  onModuleInit() {
    const topic = 'chat.message.sent';

    this.eventServiceClient.streamEvents(topic).subscribe({
      next: (event) => {
        const payload = {
          topic: event.topic,
          payload: event.receivedPayload,
          timestamp: event.timestamp,
        };

        this.server.emit('event-stream', payload);
      },
      error: (err) => {
        console.error('gRPC stream error:', err);
      },
      complete: () => {
        console.log('gRPC stream ended');
      },
    });
  }

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }
}
