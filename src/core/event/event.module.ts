import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EventServiceClient } from './event.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'com.eligius.event',
          protoPath: join(__dirname, './event.proto'),
          url: process.env.GRPC_EVENT_SERVICE_URL || 'localhost:9090',
        },
      },
    ]),
  ],
  providers: [EventServiceClient],
  exports: [EventServiceClient],
})
export class EventModule {}
