import { users } from './db.js';
import WebSocket from 'ws';

export function checkUserExist(name: string) {
  return users.filter((user) => user.name === name).length > 0;
}

export function getUserID(name: string, ws?: WebSocket) {
  if (ws) return users.findIndex((user) => Object.is(user.ws, ws));
  return users.findIndex((user) => user.name === name);
}
