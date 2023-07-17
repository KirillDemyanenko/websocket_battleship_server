import WebSocket from 'ws';

export class User {
  constructor(
    public name: string,
    public password: string,
    public ws: WebSocket
  ) {}

  updateWS(ws) {
    this.ws = ws;
  }

  getWs() {
    return this.ws;
  }
}
