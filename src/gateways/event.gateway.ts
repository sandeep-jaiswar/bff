import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventServiceClient } from 'src/core/event/event.service';

export type ChatMessage = {
  senderId: string;
  content: string;
  timestamp: string;
};

@Injectable()
@WebSocketGateway({ cors: true })
export class EventGateway
  implements
    OnModuleInit,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventServiceClient: EventServiceClient) {}

  // onModuleInit() {
  //   const topic = 'chat.message.sent';
  //   this.eventServiceClient.streamEvents(topic).subscribe({
  //     next: (event) => {
  //       const payload = {
  //         topic: event.topic,
  //         payload: event.receivedPayload,
  //         timestamp: event.timestamp,
  //       };
  //       this.server.emit('event-stream', payload);
  //     },
  //     error: (err) => {
  //       console.error('gRPC stream error:', err);
  //     },
  //     complete: () => {
  //       console.log('gRPC stream ended');
  //     },
  //   });
  // }

  onModuleInit() {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('user connected: ', client.id);
    client.emit('server-stream', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected: ', client.id);
  }

  @SubscribeMessage('message-stream')
  handleNewMessage(client: Socket, message: ChatMessage) {
    console.log(message);

    // we can sent the notification to the user that your msg is sent
    // client.emit('message-stream', message);

    // client.broadcast.emit('message-stream', message);
    this.server.emit('message-stream', message);
  }
}
