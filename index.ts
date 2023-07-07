import { httpServer } from "./src/http_server/index.js";
import {wsServer} from "./src/ws_server/index.js";
import {UserLogin, WSRequest} from "./src/ws_server/types.js";
import {WSCommands} from "./constants.js";
import {checkUserExist, getUserID} from "./src/ws_server/req.js";
import {users} from "./src/ws_server/db.js";
import {User} from "./src/ws_server/models.js";

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
                        users.push(new User(user.name, user.password))
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
                }
            }
        } catch (err) {
            showMessage('Parse data error!')
        }
    })
})
