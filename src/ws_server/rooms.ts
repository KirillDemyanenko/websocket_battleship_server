import { UpdateRoomResponse, Game, PlayerInfo, Room } from './types.js';
import { users } from './db.js';

export let rooms: Room[] = [];
export const games: Game[] = [];
let currenIdRoom: number = 0;
let currenIdGame: number = 0;

export function createRoom(userID: number): void {
  if (rooms.findIndex((room) => room.idPlayer === userID) < 0) {
    const newRoom: Room = { idGame: currenIdRoom, idPlayer: userID };
    rooms.push(newRoom);
    currenIdRoom++;
  }
}

export function createGame(usersID: Record<number, number>): number {
  const newGame: Game = {
    idGame: currenIdGame,
    idPlayers: usersID,
    playersStatus: [false, false],
    playersShips: [[], []],
    moveOf: -1,
  };
  games.push(newGame);
  rooms.filter(value => value.idPlayer === newGame.idPlayers[0] || value.idPlayer === newGame.idPlayers[1]).forEach(room => {
    findUserInRoom(room.idGame)
  })
  currenIdGame++;
  return currenIdGame - 1;
}

export function findUserInRoom(roomIndex: number): number {
  const roomInd = rooms.findIndex((room) => room.idGame === roomIndex);
  if (roomInd < 0) throw new Error('Room not find!');
  const findingUserID = rooms[roomInd].idPlayer;
  console.log(rooms)
  delete rooms.splice(roomInd, 1);
  console.log(rooms)
  return findingUserID;
}

export function getAvailableRooms(): UpdateRoomResponse[] {
  const availableRooms: UpdateRoomResponse[] = [];
  rooms.forEach((room: Room) => {
    const playerInfo: PlayerInfo[] = [
      {
        name: users[room.idPlayer].name,
        index: room.idPlayer,
      },
    ];
    availableRooms.push({
      roomId: room.idGame,
      roomUsers: playerInfo,
    } as UpdateRoomResponse);
  });
  return [...availableRooms];
}
