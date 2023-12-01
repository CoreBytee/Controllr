const RandomNumber = require("./Helpers/RandomNumber.js")
const Event = require("./Helpers/Event.js")

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
        }
    }
)

Event("Tick", () => { })

print("Controllr is running with code " + ControllrMod.ConnectionCode)