const RandomNumber = require("./Helpers/RandomNumber.js")
globalThis.ControllrMod = {}
ControllrMod.ConnectionCode = RandomNumber(6)
ControllrMod.Websocket = new (require("./Classes/Websocket.js"))(ControllrMod.ConnectionCode)
ControllrMod.Websocket.Connect()
ControllrMod.Websocket.SendData("Hello")

Chat.log("Controllr is running with code " + ControllrMod.ConnectionCode)