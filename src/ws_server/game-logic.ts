import { AttackResponse, Coordinates, ShipsInfo } from './types.js';
import { AttackStatuses, ShipsTypes } from './constants.js';
import { games } from './rooms.js';

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

export function isCellOpen(
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
