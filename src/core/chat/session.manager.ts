export class SessionManager {
  private activeMatches = new Map<string, string>();

  setMatch(clientId: string, partnerId: string): void {
    this.activeMatches.set(clientId, partnerId);
  }

  getPartnerId(clientId: string): string | undefined {
    return this.activeMatches.get(clientId);
  }

  removeMatch(clientId: string): void {
    const partnerId = this.activeMatches.get(clientId);
    if (partnerId) {
      this.activeMatches.delete(partnerId);
    }
    this.activeMatches.delete(clientId);
  }

  isMatched(clientId: string): boolean {
    return this.activeMatches.has(clientId);
  }
}
