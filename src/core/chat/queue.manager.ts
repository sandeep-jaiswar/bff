import { Socket } from 'socket.io';

export class QueueManager {
  private queue: Socket[] = [];

  add(client: Socket): void {
    if (!this.queue.find((c) => c.id === client.id)) {
      this.queue.push(client);
    }
  }

  remove(client: Socket): void {
    this.queue = this.queue.filter((c) => c.id !== client.id);
  }

  findPartner(client: Socket): Socket | undefined {
    return this.queue.find((c) => c.id !== client.id);
  }

  isQueued(client: Socket): boolean {
    return !!this.queue.find((c) => c.id === client.id);
  }
}
