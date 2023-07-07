import { httpServer } from "./src/http_server/index.js";
import {wsServer} from "./src/ws_server/index.js";
import {UserLogin, WSRequest} from "./src/ws_server/types.js";
import {WSCommands} from "./constants.js";
import {checkUserExist, getUserID} from "./src/ws_server/req.js";

const HTTP_PORT = 8181;


console.log(`Start static http server on the ${HTTP_PORT} port!`);
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
                        console.log(`User with nickname ${user.name} successfully login!`)
                    } else {
                        ws.send(JSON.stringify({
                            type: WSCommands.registration,
                            data:
                                JSON.stringify({
                                    name: user.name,
                                    index: 0,
                                    error: false,
                                    errorText: '',
                                }),
                            id: 0,
                        }))
                    }
                }
            }
        } catch (err) {
            console.log('Parse data error!')
        }
    })
})
