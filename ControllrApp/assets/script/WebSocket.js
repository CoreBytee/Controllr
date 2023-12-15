function RandomString(Length) {
    let Result = ""
    const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < Length; i++) {
        Result += Characters.charAt(Math.floor(Math.random() * Characters.length))
    }
    return Result
}

class WebSocketClass {
    constructor(ConnectionCode) {
        this.Listeners = {}
        this.ClientId = RandomString(16)

        this.RawWebsocket = new WebSocket(`wss://ws.controllr.corebyte.me?Controllr${ConnectionCode}`)
        this.RawWebsocket.onopen = (Event) => { this.Emit("Connect", Event) }
        this.RawWebsocket.onmessage = (Event) => { this.Emit("TextMessage", Event.data) }
        this.RawWebsocket.onclose = (Event) => { this.Emit("Disconnect", Event) }

        this.SentDataLength = 0
        this.ReceivedDataLength = 0
        this.Sequence = 0

        this.On(
            "TextMessage",
            (Data) => {
                this.ReceivedDataLength += Data.length
                try {
                    Data = JSON.parse(Data)
                } catch (e) {
                    return
                }
                if (Data.ClientId && Data.ClientId != this.ClientId) { console.log("Ignoring message"); return }
                this.Emit("Data", Data)
            }
        )

        this.PingInterval = setInterval(
            () => {
                this.SendData(
                    { Type: "Ping", SentAt: Date.now()}
                )
            },
            1000
        )

        this.On(
            "Data",
            (Data) => {
                if (Data.Type != "Pong") { return }
                const Ping = Date.now() - Data.SentAt
                this.Ping = Ping
                this.Emit("DebugData", {Ping: Ping, SentDataLength: this.SentDataLength, ReceivedDataLength: this.ReceivedDataLength})
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

    Close(Code) {
        this.RawWebsocket.close(Code)
    }

    SendText(Text) {
        if (this.RawWebsocket.readyState != 1) { return }
        this.SentDataLength += Text.length
        this.RawWebsocket.send(Text)
        this.Emit("DebugData", {Ping: this.Ping, SentDataLength: this.SentDataLength, ReceivedDataLength: this.ReceivedDataLength})
    }

    SendData(Data) {
        Data.Sequence = this.Sequence
        this.Sequence += 1
        Data.ClientId = this.ClientId
        this.SendText(
            JSON.stringify(Data)
        )
    }
}

window.WebSocketClass = WebSocketClass