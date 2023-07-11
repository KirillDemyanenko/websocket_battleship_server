import WebSocket, { WebSocketServer } from 'ws';
import { showMessage } from '../service/index.js';
import {
  GameCreateResponse,
  UserLoginRequest,
  WinnersResponse,
  WSDataExchangeFormat,
} from './types.js';
import { Colors, WSCommands } from './constants.js';
import { checkUserExist, getUserID, users, winners } from './db.js';
import { User } from './models.js';
import {
  createGame,
  createRoom,
  findUserInRoom,
  getAvailableRooms,
} from './rooms.js';

const WS_PORT = 3000;

export const wsServer = new WebSocketServer({ port: WS_PORT }, () =>
  showMessage(`Start WS server on the ${WS_PORT} port!`, Colors.blue)
);

function sendResponse(ws: WebSocket, command: WSCommands, data: string): void {
  try {
    ws.send(
      JSON.stringify({
        type: command,
        data: data,
        id: 0,
      })
    );
  } catch (err: Error) {
    showMessage(
      `Sending message to client failed with error: ${err.message}`,
      Colors.red
    );
  }
}

wsServer.on('connection', (ws) => {
  showMessage(`New user connected!`, Colors.green);
  ws.on('error', (err) => {
    if (err) throw new Error(err.message);
  });
  ws.on('close', () => {
    const userId = getUserID('', ws);
    if (users[userId]?.name) {
      showMessage(
        `User with nickname >>> ${users[userId].name} <<< is disconnected!`,
        Colors.yellow
      );
    } else {
      showMessage(`Unknown user is disconnected!`, Colors.yellow);
    }
  });
  ws.on('message', (data) => {
    try {
      const request = JSON.parse(data.toString()) as WSDataExchangeFormat;
      switch (request.type) {
        case WSCommands.registration: {
          try {
            const user: UserLoginRequest = JSON.parse(request.data);
            if (checkUserExist(user.name)) {
              users[getUserID(user.name)].updateWS(ws);
              sendResponse(
                ws,
                WSCommands.registration,
                JSON.stringify({
                  name: user.name,
                  index: getUserID(user.name),
                  error: false,
                  errorText: '',
                })
              );
              showMessage(
                `User with nickname >>> ${user.name} <<< successfully login!`,
                Colors.green
              );
            } else {
              users.push(new User(user.name, user.password, ws));
              const newPotentialWinner: WinnersResponse = {
                name: user.name,
                wins: 0,
              };
              winners.push(newPotentialWinner);
              sendResponse(
                ws,
                WSCommands.registration,
                JSON.stringify({
                  name: user.name,
                  index: getUserID(user.name),
                  error: false,
                  errorText: '',
                })
              );
              users.forEach((user) => {
                sendResponse(
                  user.ws,
                  WSCommands.updateWinners,
                  JSON.stringify(winners)
                );
              });
              showMessage(
                `User with nickname >>> ${user.name} <<< successfully registered!`,
                Colors.green
              );
            }
          } catch (err: Error) {
            showMessage(`Login failed!`, Colors.red);
          }
          break;
        }
        case WSCommands.createRoom: {
          createRoom(getUserID('', ws));
          const freeRooms = getAvailableRooms();
          const freeUsers = [];
          freeRooms.forEach((room) => {
            const id = room.roomUsers.at(0)?.index;
            if (id != null) {
              freeUsers.push([id, users.at(id)?.getWs()]);
            }
          });
          freeUsers.forEach((value) => {
            sendResponse(
              value[1],
              WSCommands.updateRoom,
              JSON.stringify(
                freeRooms.filter((room) => {
                  return room.roomUsers[0].index !== value[0];
                })
              )
            );
          });
          break;
        }
        case WSCommands.addToRoom: {
          try {
            const roomIndex: { indexRoom: number } = JSON.parse(request.data);
            const players = [
              findUserInRoom(roomIndex.indexRoom),
              getUserID('', ws),
            ];
            const gameID = createGame(players);
            players.forEach((id) => {
              const newGameInfo: GameCreateResponse = {
                idGame: gameID,
                idPlayer: id === players[0] ? players[1] : players[0],
              };
              sendResponse(
                users[id].ws,
                WSCommands.createGame,
                JSON.stringify(newGameInfo)
              );
            });
          } catch (err: Error) {
            showMessage(err.message, Colors.red);
          }
          break;
        }
        default: {
          console.log(JSON.parse(request.data));
          showMessage(`Unknown command!`, Colors.red);
        }
      }
    } catch (err) {
      showMessage('Parse data error!');
    }
  });
});

wsServer.on('error', (err) => {
  if (err) throw new Error(err.message);
});
