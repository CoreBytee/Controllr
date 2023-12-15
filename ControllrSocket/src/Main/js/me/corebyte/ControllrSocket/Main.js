console.log("Hello world")

const Websocket = require("ws")
const FS = require("fs")
const Logger = TypeWriter.CreateLogger("wsp2p")

const WebsocketPort = FS.readFileSync("./Port", "utf-8")
const WebsocketServer = new Websocket.WebSocketServer(
    {
        port: WebsocketPort
    },
    () => {
        console.log("Websocket server started")
    }
)

const Channels = {}

WebsocketServer.on(
    "connection",
    (WebsocketClient, Request) => {
        const Channel = Request.url.split("?")[1]
        console.log(Channel)

        if (!Channels[Channel]) { Channels[Channel] = [] }
        Channels[Channel].push(WebsocketClient)

        Logger.Information("New connection on channel " + Channel + " there are now " + Channels[Channel].length + " clients")

        WebsocketClient.on(
            "close",
            () => {
                Logger.Information("Client disconnected")
                Channels[Channel].splice(Channels[Channel].indexOf(WebsocketClient), 1)
                if (Channels[Channel].length == 0) { delete Channels[Channel] }
            }
        )

        WebsocketClient.on(
            "message",
            (Message) => {
                Channels[Channel].forEach(
                    (Client) => {
                        if (Client == WebsocketClient) { return }
                        console.log(Message.toString())
                        Client.send(Message.toString())
                    }
                )
            }
        )
    }
)