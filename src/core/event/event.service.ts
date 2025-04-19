import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface GrpcEventService {
  SendEvent(data: { type: string; key: string; payload: string }): Observable<{
    status: string;
    topic: string;
    receivedPayload: string;
    timestamp: string;
  }>;
}

@Injectable()
export class EventServiceClient implements OnModuleInit {
  private grpcService: GrpcEventService;

  constructor(@Inject('EVENT_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.client.getService<GrpcEventService>('EventService');
  }

  async sendEvent(type: string, key: string, payload: any): Promise<string> {
    const result = await this.grpcService
      .SendEvent({
        type,
        key,
        payload: JSON.stringify(payload),
      })
      .toPromise();
    return result.status;
  }
}
