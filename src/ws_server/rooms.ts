import {AvailibleRoom, GameRoom, GameRoomResponse, PlayerInfo} from "./types.js";
import {users} from "./db.js";

export const rooms: GameRoomResponse[] = [];
export const games = [];
let currenIdRoom = 0
let currenIdGame = 0

export function createRoom(userID: number): void {
    if (rooms.findIndex(room => room.idPlayer === userID) < 0) {
        rooms.push(<GameRoomResponse>{idGame: currenIdRoom, idPlayer: userID})
        currenIdRoom++
    }
}

export function createGame(usersID: number[]): number {
    games.push(<GameRoom>{idGame: currenIdGame, idPlayers: usersID})
    currenIdGame++
    return currenIdGame - 1
}

export function findUserInRoom (roomIndex: number): number {
    const roomInd = rooms.findIndex(room => room.idGame === roomIndex);
    let findingUserID = -1;
    if (roomInd >= 0) {
        findingUserID = rooms[roomInd].idPlayer
        delete rooms.at(roomInd)
    }
    return findingUserID;
}

export function getAvailibleRooms (): AvailibleRoom[] {
    const availibleRooms: AvailibleRoom[] = []
    rooms.forEach(room => {
        availibleRooms.push({roomId: room.idGame, roomUsers: [{name: users.at(room.idPlayer)?.name, index: room.idPlayer} as PlayerInfo]} as AvailibleRoom)
    })
    return [...availibleRooms]
}
