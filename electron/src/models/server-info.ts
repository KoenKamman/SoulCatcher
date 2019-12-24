import SteamID from 'steamid';

export interface ServerInfo {
  timestamp: number;
  server: string;
  lobby: string;
  gameMode: string;
  players: SteamID[];
}
