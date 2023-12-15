//wss://ccws.skystuff.cc/connect/<channel name>/[password]
const JavaMethod = require("../Helpers/JavaMethod.js")

class Websocket {
    constructor(ConnectionCode) {
        this.Listeners = {}

        this.RawWebsocket = Request.createWS(`wss://ws.controllr.corebyte.me?Controllr${ConnectionCode}`)
        this.RawWebsocket.onConnect = JavaMethod( (_, Headers) => { this.Emit("Connect", Headers) }, this )
        this.RawWebsocket.onTextMessage = JavaMethod( async (_, Data) => { this.Emit("TextMessage", Data) }, this )
        this.RawWebsocket.onDisconnect = JavaMethod( (_) => { this.Emit("Disconnect") } )

        this.ClientSequences = {}

        this.On(
            "TextMessage",
            async (Data) => {
                try {
                    Data = JSON.parse(Data)
                } catch (e) {
                    print("JSON error")
                    return
                }
                print(Data.Sequence, Data.ClientId)
                if (Data.ClientId && Data.Sequence) {
                    if (!this.ClientSequences[Data.ClientId]) { this.ClientSequences[Data.ClientId] = Data.Sequence - 1 }
                    if (Data.Sequence != this.ClientSequences[Data.ClientId] + 1) {
                        print("Sequence error")
                    }
                    this.ClientSequences[Data.ClientId] = Data.Sequence
                }
                this.LastSequence = Data.Sequence
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

    async Emit(Event, Data) {
        if (this.Listeners[Event] != undefined) {
            this.Listeners[Event].forEach(async (Callback) => {
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