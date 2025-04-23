import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { QueueManager } from '../chat/queue.manager';
import { SessionManager } from '../chat/session.manager';
import { MatchEmitter } from '../chat/emitter';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);
  private server?: Server;

  private readonly queueManager = new QueueManager();
  private readonly sessionManager = new SessionManager();
  private readonly emitter = new MatchEmitter(this.logger);

  setServer(server: Server) {
    this.server = server;
  }

  addToQueue(client: Socket) {
    if (
      this.sessionManager.isMatched(client.id) ||
      this.queueManager.isQueued(client)
    ) {
      this.logger.warn(`Client ${client.id} is already in a session or queued`);
      return;
    }

    this.emitter.emitMatchSearching(client);

    const partner = this.queueManager.findPartner(client);
    if (partner) {
      this.connectMatch(client, partner);
    } else {
      this.queueManager.add(client);
      this.emitter.emitMatchQueued(client);
      this.logger.log(`Queued client ${client.id}`);
    }
  }

  private connectMatch(client: Socket, partner: Socket) {
    this.queueManager.remove(partner);

    this.sessionManager.setMatch(client.id, partner.id);
    this.sessionManager.setMatch(partner.id, client.id);

    this.emitter.emitMatchFound(client, partner.id);
    this.emitter.emitMatchFound(partner, client.id);

    this.emitter.emitMatchConnected(client);
    this.emitter.emitMatchConnected(partner);

    this.logger.log(`Matched ${client.id} with ${partner.id}`);
  }

  disconnect(client: Socket) {
    this.queueManager.remove(client);

    const partnerId = this.sessionManager.getPartnerId(client.id);
    if (partnerId) {
      const partner = this.server?.sockets.sockets.get(partnerId);
      if (partner) {
        this.emitter.emitMatchDisconnected(partner);
      }
      this.sessionManager.removeMatch(partnerId);
    }

    this.sessionManager.removeMatch(client.id);
    this.emitter.emitMatchDisconnected(client);

    this.logger.log(`Disconnected ${client.id}`);
  }

  getPartnerId(clientId: string): string | undefined {
    return this.sessionManager.getPartnerId(clientId);
  }
}
