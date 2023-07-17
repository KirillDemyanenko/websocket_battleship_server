import { AttackStatuses, ShipsTypes, WSCommands } from './constants.js';

export type WSDataExchangeFormat = {
  type: WSCommands;
  data: string;
  id: number;
};

export type UserLoginRequest = {
  name: string;
  password: string;
};

export type WinnersResponse = {
  name: string;
  wins: number;
};

export type AddUserToRoomRequest = {
  indexRoom: number;
};

export type UserLoginResponse = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type GameCreateResponse = {
  idGame: number;
  idPlayer: number;
};

export type Room = {
  idGame: number;
  idPlayer: number;
};

export type Game = {
  idGame: number;
  idPlayers: Record<number, number>;
  playersStatus: Record<boolean, boolean>;
  playersShips: Record<ShipsInfo, ShipsInfo>;
  moveOf: number;
  openedCells: Record<Coordinates[], Coordinates[]>;
};

export type PlayerInfo = {
  name: string;
  index: number;
};

export type UpdateRoomResponse = {
  roomId: number;
  roomUsers: PlayerInfo[];
};

export type Coordinates = {
  x: number;
  y: number;
};

export type ShipsInfo = {
  position: Coordinates;
  direction: boolean;
  length: number;
  type: ShipsTypes;
};

export type AddShipRequest = {
  gameId: number;
  ships: ShipsInfo[];
  indexPlayer: number;
};

export type StartGameResponse = {
  ships: ShipsInfo[];
  currentPlayerIndex: number;
};

export type AttackRequest = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export type AttackResponse = {
  position: Coordinates;
  currentPlayer: number;
  status: AttackStatuses;
};

export type RandomAttackRequest = {
  gameId: number;
  indexPlayer: number;
};

export type TurnResponse = {
  currentPlayer: number;
};

export type FinishGameResponse = {
  winPlayer: number;
};
