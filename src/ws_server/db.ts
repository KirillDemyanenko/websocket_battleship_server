import { User } from './models.js';
import WebSocket from 'ws';
import { WinnersResponse } from './types.js';

export const users: User[] = [];
export const winners: WinnersResponse[] = [];

export function checkUserExist(name: string): boolean {
  return users.filter((user: User) => user.name === name).length > 0;
}

export function getUserID(name: string, ws?: WebSocket): number {
  if (ws) return users.findIndex((user: User) => Object.is(user.ws, ws));
  return users.findIndex((user: User) => user.name === name);
}

export function ValidateUser(userName: string, userPassword: string) {
  const namePattern = new RegExp(/^[a-zA-z0-9_.]{5,}$/)
  const passPattern = new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){5,}$/)
  return namePattern.test(userName) && passPattern.test(userPassword)
}
