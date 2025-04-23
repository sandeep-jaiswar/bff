import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MatchService } from 'src/core/match/match.service';

export type ChatMessage = {
  senderId: string;
  content: string;
  timestamp: string;
};

export enum EventTopics {
  EVENT_SERVER_READY = 'EVENT.SERVER.READY',
  EVENT_MATCH_SEARCHING = 'EVENT.MATCH.SEARCHING',
  EVENT_MATCH_QUEUED = 'EVENT.MATCH.QUEUED',
  EVENT_MATCH_FOUND = 'EVENT.MATCH.FOUND',
  EVENT_MATCH_CONNECTED = 'EVENT.MATCH.CONNECTED',
  EVENT_MATCH_DISCONNECTED = 'EVENT.MATCH.DISCONNECTED',
  EVENT_MATCH_TIMEOUT = 'EVENT.MATCH.TIMEOUT',
  EVENT_MATCH_MESSAGE = 'EVENT.MATCH.MESSAGE',
  EVENT_USER_TYPING = 'EVENT.USER.TYPING',
  EVENT_USER_STOPPED_TYPING = 'EVENT.USER.STOPPED_TYPING',
  EVENT_MATCH_REPORTED = 'EVENT.MATCH.REPORTED',
  EVENT_MATCH_FEEDBACK = 'EVENT.MATCH.FEEDBACK',
  EVENT_ERROR = 'EVENT.ERROR',
  EVENT_MATCH_INVALID_STATE = 'EVENT.MATCH.INVALID_STATE',
  EVENT_MATCH_NOTIFICATION = 'EVENT.MATCH.NOTIFICATION',
}

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

  private readonly logger = new Logger(EventGateway.name);

  constructor(private readonly matchingService: MatchService) {}

  onModuleInit() {}

  afterInit(): void {
    this.matchingService.setServer(this.server);
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`User connected: ${client.id}`);
    client.emit(EventTopics.EVENT_SERVER_READY, client.id);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`User disconnected: ${client.id}`);
    this.matchingService.disconnect(client);
  }

  @SubscribeMessage(EventTopics.EVENT_MATCH_SEARCHING)
  handleFindMatch(client: Socket): void {
    this.matchingService.addToQueue(client);
  }

  @SubscribeMessage(EventTopics.EVENT_MATCH_MESSAGE)
  handleNewMessage(client: Socket, message: ChatMessage): void {
    const partnerId = this.matchingService.getPartnerId(client.id);
    if (!partnerId) {
      this.logger.warn(`Partner not found for client ${client.id}. Dropping message.`);
      return;
    }

    // Minimal logging – do not log entire message content
    this.logger.debug(`Message from ${client.id} to ${partnerId}`);

    // Echo to sender
    client.emit(EventTopics.EVENT_MATCH_MESSAGE, message);
    // Deliver only to partner
    this.server.to(partnerId).emit(EventTopics.EVENT_MATCH_MESSAGE, message);
  }

  @SubscribeMessage(EventTopics.EVENT_MATCH_DISCONNECTED)
  handleEndChat(client: Socket): void {
    const partnerId = this.matchingService.getPartnerId(client.id);
    if (partnerId) {
      const partnerSocket = this.server.sockets.sockets.get(partnerId);
      partnerSocket?.emit(EventTopics.EVENT_MATCH_DISCONNECTED);
    }

    this.matchingService.disconnect(client);
  }
}
