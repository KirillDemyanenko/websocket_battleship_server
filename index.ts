import { httpServer } from "./src/http_server/index.js";
import {wsServer} from "./src/ws_server/index.js";
import {GameRoomResponse, UserLogin, WSRequest} from "./src/ws_server/types.js";
import {WSCommands} from "./constants.js";
import {checkUserExist, getUserID} from "./src/ws_server/req.js";
import {users} from "./src/ws_server/db.js";
import {User} from "./src/ws_server/models.js";
import {createGame, createRoom, findUserInRoom, getAvailibleRooms} from "./src/ws_server/rooms.js";

const HTTP_PORT = 8181;

function showMessage(mes, col?) {
    let color;
    switch (col) {
        case "green":
            color = 32;
            break;
        case "red":
            color = 31;
            break;
        case "yellow":
            color = 33;
            break;
        case "blue":
            color = 34;
            break;
        default:
            color = 37;
            break;
    }
    console.log(`\x1b[${color}m >>> ${mes} <<< \x1b[0m`);
}

showMessage(`Start static http server on the ${HTTP_PORT} port!`, 'blue');
httpServer.listen(HTTP_PORT);

wsServer.on('connection', (ws) => {
    ws.on('error', (err) => {
        if (err) throw new Error(err.message)
    })
    ws.on('message', (data) => {
        try {
            const request = JSON.parse(data.toString()) as WSRequest
            switch (request.type) {
                case WSCommands.registration: {
                    const user = JSON.parse(request.data) as UserLogin;
                    if (checkUserExist(user.name)) {
                        users[getUserID(user.name)].updateWS(ws)
                        ws.send(JSON.stringify({
                            type: WSCommands.registration,
                            data:
                                JSON.stringify({
                                    name: user.name,
                                    index: getUserID(user.name),
                                    error: false,
                                    errorText: '',
                                }),
                            id: 0,
                        }))
                        showMessage(`User with nickname >>> ${user.name} <<< successfully login!`, 'green')
                    } else {
                        users.push(new User(user.name, user.password, ws))
                        ws.send(JSON.stringify({
                            type: WSCommands.registration,
                            data:
                                JSON.stringify({
                                    name: user.name,
                                    index: getUserID(user.name),
                                    error: false,
                                    errorText: '',
                                }),
                            id: 0,
                        }))
                        showMessage(`User with nickname >>> ${user.name} <<< successfully registered!`, 'green')
                    }
                    break;
                }
                case WSCommands.createRoom: {
                    createRoom(getUserID('', ws))
                    const freeRooms = getAvailibleRooms();
                    const freeUsers = []
                    freeRooms.forEach(room => {
                        const id = room.roomUsers.at(0)?.index
                        if (id != null) {
                            freeUsers.push([id, users.at(id)?.getWs()])
                        }
                    })
                    freeUsers.forEach(value => {
                        value[1].send(
                            JSON.stringify({
                                type: WSCommands.updateRoom,
                                data:
                                    JSON.stringify(freeRooms.filter(room => {
                                        return room.roomUsers[0].index !== value[0]
                                        })),
                                id: 0,
                            })
                        )
                    })
                    break;
                }
                case WSCommands.addToRoom: {
                    const roomIndex: {indexRoom: number} = JSON.parse(request.data);
                    const players = [findUserInRoom(roomIndex.indexRoom), getUserID('', ws)]
                    const gameID = createGame(players);
                    players.forEach(id => {
                        users[id].ws.send(
                            JSON.stringify({
                                type: WSCommands.createGame,
                                data:
                                    JSON.stringify(<GameRoomResponse>{idGame: gameID, idPlayer: id === players[0] ? players[1] : players[0]}),
                                id: 0,
                            })
                        )
                    })
                    break;
                }
                default: {
                    console.log(JSON.parse(request.data))
                    showMessage(`Unknown command!`, 'red')
                }
            }
        } catch (err) {
            showMessage('Parse data error!')
        }
    })
})
