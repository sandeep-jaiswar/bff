import { Socket } from 'socket.io';
import { EventTopics } from 'src/gateways/event.gateway';
import { Logger } from '@nestjs/common';

export class MatchEmitter {
  constructor(private readonly logger: Logger) {}

  emitSafe(socket: Socket | undefined, event: string, payload?: unknown): void {
    if (!socket?.connected) {
      this.logger.warn(`Emit failed: socket not connected for event ${event}`);
      return;
    }

    socket.emit(event, payload);
  }

  emitMatchSearching(client: Socket) {
    this.emitSafe(client, EventTopics.EVENT_MATCH_SEARCHING);
  }

  emitMatchQueued(client: Socket) {
    this.emitSafe(client, EventTopics.EVENT_MATCH_QUEUED);
  }

  emitMatchFound(client: Socket, partnerId: string) {
    this.emitSafe(client, EventTopics.EVENT_MATCH_FOUND, { partnerId });
  }

  emitMatchConnected(client: Socket) {
    this.emitSafe(client, EventTopics.EVENT_MATCH_CONNECTED);
  }

  emitMatchDisconnected(client: Socket) {
    this.emitSafe(client, EventTopics.EVENT_MATCH_DISCONNECTED);
  }
}
