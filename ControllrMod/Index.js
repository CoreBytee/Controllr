const RandomNumber = require("./Helpers/RandomNumber.js")
const Event = require("./Helpers/Event.js")
function Clamp(Value, Min, Max) {
    return Math.min(Math.max(Value, Min), Max)
}

globalThis.print = (...Args) => { Chat.log(JSON.stringify(Args)) }

globalThis.ControllrMod = {}
ControllrMod.ConnectionCode = 111111 //RandomNumber(6)
ControllrMod.Websocket = new (require("./Classes/Websocket.js"))(ControllrMod.ConnectionCode)
ControllrMod.Websocket.Connect()
ControllrMod.Websocket.SendData("Hello")

ControllrMod.Websocket.On(
    "Data",
    (Data) => {
        print(Data)
        if (Data.Type == "Ping") {
            ControllrMod.Websocket.SendData(
                {
                    Type: "Pong",
                    SentAt: Data.SentAt,
                    ReceivedAt: Date.now()
                }
            )
            ControllrMod.LastPingTime = Date.now()
        }
    }
)

Event(
    "Tick",
    () => {
        if (ControllrMod.LastPingTime + 10000 < Date.now()) {
            Chat.actionbar("Controllr is running with code " + ControllrMod.ConnectionCode)
        }
    }
)