import { httpServer } from "./src/http_server/index.js";
import {wsServer} from "./src/ws_server/index.js";
import {WSRequest} from "./src/ws_server/types.js";

const HTTP_PORT = 8181;


console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wsServer.on('connection', (ws) => {
    ws.on('error', (err) => {
        if (err) throw new Error(err.message)
    })
    ws.on('message', (data) => {
        const request = JSON.parse(data.toString()) as WSRequest
        console.log(JSON.parse(request.data))
    })
})
