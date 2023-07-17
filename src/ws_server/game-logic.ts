import {
  AttackRequest,
  AttackResponse,
  Coordinates,
  ShipsInfo,
  TurnResponse,
} from './types.js';
import { AttackStatuses, ShipsTypes, WSCommands } from './constants.js';
import { games } from './rooms.js';
import { users } from './db.js';
import { sendResponse } from './index.js';

export function checkAttack(
  userID: number,
  gameID: number,
  coordinates: Coordinates
): AttackResponse[] {
  const attackResponse: AttackResponse[] = [];
  const enemyId =
    games[gameID].idPlayers[0] === userID
      ? games[gameID].idPlayers[1]
      : games[gameID].idPlayers[0];
  games[gameID].playersShips[enemyId].map((ship: ShipsInfo) => {
    if (JSON.stringify(ship.position) === JSON.stringify(coordinates)) {
      switch (ship.type) {
        case ShipsTypes.small: {
          const x = coordinates.x === 0 ? 0 : coordinates.x - 1;
          const y = coordinates.y === 0 ? 0 : coordinates.y - 1;
          const x1 = coordinates.x === 9 ? 9 : coordinates.x + 1;
          const y1 = coordinates.y === 9 ? 9 : coordinates.y + 1;
          for (let i = x; i <= x1; i++) {
            for (let j = y; j <= y1; j++) {
              const currenCoordinates: Coordinates = { x: i, y: j };
              attackResponse.push({
                currentPlayer: userID,
                status:
                  JSON.stringify(currenCoordinates) ===
                  JSON.stringify(coordinates)
                    ? AttackStatuses.killed
                    : AttackStatuses.miss,
                position: currenCoordinates,
              });
              games[gameID].openedCells[
                games[gameID].idPlayers[0] === userID ? 0 : 1
              ].push(currenCoordinates);
            }
          }
          break;
        }
        case ShipsTypes.medium: {
          break;
        }
        case ShipsTypes.large: {
          break;
        }
        default: {
          break;
        }
      }
    }
  });
  if (attackResponse.length === 0) {
    attackResponse.push({
      currentPlayer: userID,
      status: AttackStatuses.miss,
      position: coordinates,
    });
    games[gameID].openedCells[
      games[gameID].idPlayers[0] === userID ? 0 : 1
    ].push(coordinates);
  }
  return attackResponse;
}

export function isCellClosed(
  gameID: number,
  playerID: number,
  coordinates: Coordinates
): boolean {
  return (
    games[gameID].openedCells[
      games[gameID].idPlayers[0] === playerID ? 0 : 1
    ].filter((cell) => {
      return JSON.stringify(cell) === JSON.stringify(coordinates);
    }).length === 0
  );
}

export function isMiss(attackResponse: AttackResponse[]): boolean {
  return (
    attackResponse.filter((value) => {
      return value.status !== AttackStatuses.miss;
    }).length === 0
  );
}

export function attack(attack: AttackRequest): void {
  const gameID = attack.gameId;
  const movedPlayer = attack.indexPlayer;
  if (
    games[gameID].moveOf === attack.indexPlayer &&
    isCellClosed(gameID, movedPlayer, { x: attack.x, y: attack.y })
  ) {
    const attackResponse: AttackResponse[] = checkAttack(movedPlayer, gameID, {
      x: attack.x,
      y: attack.y,
    });
    if (isMiss(attackResponse))
      games[gameID].moveOf =
        games[gameID].idPlayers[0] === movedPlayer
          ? games[gameID].idPlayers[1]
          : games[gameID].idPlayers[0];
    const turnData: TurnResponse = {
      currentPlayer: games[attack.gameId].moveOf,
    };
    attackResponse.forEach((value) => {
      [0, 1].forEach((id) => {
        sendResponse(
          users[games[gameID].idPlayers[id]].ws,
          WSCommands.attack,
          JSON.stringify(value)
        );
        sendResponse(
          users[games[gameID].idPlayers[id]].ws,
          WSCommands.turn,
          JSON.stringify(turnData)
        );
      });
    });
  }
}

export function generateRandomCoordinates(
  gameID: number,
  playerID: number
): Coordinates {
  let coordinates: Coordinates = {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };
  while (!isCellClosed(gameID, playerID, coordinates)) {
    coordinates = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
  }
  return coordinates;
}
