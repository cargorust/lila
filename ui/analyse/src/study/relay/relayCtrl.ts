import { RelayData, LogEvent } from './interfaces';

export default class RelayCtrl {

  data: RelayData;
  log: LogEvent[] = [];

  constructor(d: RelayData, readonly send: SocketSend, readonly redraw: () => void, readonly members: any) {
    this.data = d;
  }

  setSync = (v: Boolean) => {
    this.send('relaySync', v);
    this.redraw();
  }

  socketHandlers = {
    relayData: (d: RelayData) => {
      this.data = d;
      this.redraw();
    },
    relayLog: (event: LogEvent) => {
      this.data.sync.log.push(event);
      this.data.sync.log.splice(20);
      this.redraw();
      if (event.error) console.warn(`lichess relay synchronisation error: ${event.error}`);
      else console.log(`lichess relay synchronisation success`);
    }
  };

  socketHandler = (t: string, d: any) => {
    const handler = this.socketHandlers[t];
    if (handler) {
      handler(d);
      return true;
    }
    return false;
  }
}
