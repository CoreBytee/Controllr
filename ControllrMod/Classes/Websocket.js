//wss://ccws.skystuff.cc/connect/<channel name>/[password]
const JavaMethod = require("../Helpers/JavaMethod.js")

class Websocket {
    constructor(ConnectionCode) {
        this.Listeners = {}

        this.RawWebsocket = Request.createWS(`wss://ccws.skystuff.cc/connect/Controllr${ConnectionCode}/Controllr`)
        this.RawWebsocket.onConnect = JavaMethod( (_, Headers) => { this.Emit("Connect", Headers) }, this )
        this.RawWebsocket.onTextMessage = JavaMethod( (_, Data) => { this.Emit("TextMessage", Data) }, this )
        this.RawWebsocket.onDisconnect = JavaMethod( (_) => { this.Emit("Disconnect") } )

        this.On(
            "TextMessage",
            (Data) => {
                try {
                    Data = JSON.parse(Data)
                } catch (e) {
                    return
                }
                this.Emit("Data", Data)
            }
        )

    }

    On(Event, Callback) {
        if (!this.Listeners[Event]) {
            this.Listeners[Event] = []
        }
        this.Listeners[Event].push(Callback)
        return Callback
    }

    Emit(Event, Data) {
        if (this.Listeners[Event] != undefined) {
            this.Listeners[Event].forEach((Callback) => {
                Callback(Data)
            })
        }
    }

    Connect() {
        this.RawWebsocket.connect()
    }

    Close(Code) {
        this.RawWebsocket.close(Code)
    }

    SendText(Text) {
        this.RawWebsocket.sendText(Text)
    }

    SendData(Data) {
        this.SendText(
            JSON.stringify(Data)
        )
    }


}

module.exports = Websocket