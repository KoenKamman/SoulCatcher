import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs';
import { ServerInfo } from './models/server-info';
import SteamID from 'steamid';

export class DotaServerLog {
  private path: string;
  private watcher: FSWatcher | undefined;
  private updateCallback: (info: ServerInfo) => void;

  public constructor(path: string) {
    this.path = path;
    this.updateCallback = () => { };
  }

  public watch(): void {
    this.watcher = chokidar.watch(this.path);
    this.watcher.on('change', () => {
      const lines = fs.readFileSync(this.path).toString().split('\n').filter((line) => line !== '');
      const serverInfo = this.parseLine(lines[lines.length - 1]);
      if (serverInfo) {
        this.updateCallback(serverInfo);
      }
    });
  }

  public stopWatching(): void {
    this.watcher?.close();
  }

  public onUpdate(callback: (info: ServerInfo) => void) {
    this.updateCallback = callback;
  }

  private parseLine(line: string): ServerInfo | undefined {
    let serverInfo: ServerInfo | undefined;
    const match = line.match(/(.*?) - (.*?): (.*?) \(Lobby (\d+) (\w+) (.*?)\)/);
    if (match !== null && match.length === 7) {
      const timestamp = Date.parse(match[1] + ' ' + match[2]);
      const server = match[3];
      const lobby = match[4];
      const gameMode = match[5];
      const players = this.parsePlayers(match[6]);
      serverInfo = { timestamp, server, lobby, gameMode, players };
    }
    return serverInfo;
  }

  private parsePlayers(players: string): SteamID[] {
    const playerIDs: SteamID[] = [];
    const regex = /\d:(\[U:\d:\d+])/g;
    let match: RegExpExecArray | null;
    do {
      match = regex.exec(players);
      if (match) {
        playerIDs.push(new SteamID(match[1]));
      }
    } while (match);
    return playerIDs;
  }
}
