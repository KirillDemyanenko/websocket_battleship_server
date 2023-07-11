import { WSCommands } from './constants.js';

export type WSRequest = {
  type: WSCommands;
  data: string;
  id: number;
};

export type UserLogin = {
  name: string;
  password: string;
};

export type UserLoginResponse = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type GameRoomResponse = {
  idGame: number;
  idPlayer: number;
};

export type GameRoom = {
  idGame: number;
  idPlayers: Record<number, number>;
};

export type PlayerInfo = {
  name: string;
  index: number;
};

export type AvailibleRoom = {
  roomId: number;
  roomUsers: PlayerInfo[];
};
