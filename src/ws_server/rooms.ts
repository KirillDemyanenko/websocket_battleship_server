import {AvailibleRoom, GameRoom, PlayerInfo} from "./types.js";
import {users} from "./db.js";

export const rooms: GameRoom[] = [];
export const games = [];
let currenIdRoom = 0
let currenIdGame = 0

export function createRoom(userID: number): void {
    if (rooms.findIndex(room => room.idPlayer === userID) < 0) {
        rooms.push(<GameRoom>{idGame: currenIdRoom, idPlayer: userID})
        currenIdRoom++
    }
}

export function createGame(userID: number): void {
    if (rooms.findIndex(room => room.idPlayer === userID) < 0) {
        rooms.push(<GameRoom>{idGame: currenIdRoom, idPlayer: userID})
        currenIdRoom++
    }
}

export function addUserToRoom (roomIndex: number) {
    const roomID = rooms.findIndex(room => room.idGame === roomIndex)
    if (roomID >= 0) {
        const existPlayerID = rooms.at(roomID)?.idPlayer
        if (existPlayerID) {
            delete rooms.at(roomID)
        }
    }
}

export function getAvailibleRooms (): AvailibleRoom[] {
    const availibleRooms: AvailibleRoom[] = []
    rooms.forEach(room => {
        availibleRooms.push({roomId: room.idGame, roomUsers: [{name: users.at(room.idPlayer)?.name, index: room.idPlayer} as PlayerInfo]} as AvailibleRoom)
    })
    return [...availibleRooms]
}
