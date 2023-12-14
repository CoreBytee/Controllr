const RandomNumber = require("./Helpers/RandomNumber.js")
const Event = require("./Helpers/Event.js")
const FrameEvent = require("./Helpers/FrameEvent.js")
Hud.clearDraw2Ds()
Hud.clearDraw3Ds()

function Clamp(Value, Min, Max) {
    return Math.min(Math.max(Value, Min), Max)
}

globalThis.print = (...Args) => { Chat.log(JSON.stringify(Args)) }

globalThis.ControllrMod = {}
ControllrMod.ConnectionCode = 111111 //RandomNumber(6)
ControllrMod.Websocket = new (require("./Classes/Websocket.js"))(ControllrMod.ConnectionCode)
ControllrMod.Websocket.Connect()
ControllrMod.Websocket.SendData("Hello")
ControllrMod.PlayerOrientation = {X: 0, Y: 0}
ControllrMod.CrouchState = false
ControllrMod.JumpState = false
ControllrMod.SprintState = false

ControllrMod.Websocket.On(
    "Data",
    (Data) => {
        // print(Data)
        if (Data.Type == "Ping") {
            ControllrMod.Websocket.SendData(
                {
                    Type: "Pong",
                    SentAt: Data.SentAt,
                    ReceivedAt: Date.now()
                }
            )
            ControllrMod.LastPingTime = Date.now()
        } else if (Data.Type == "Movement") {
            ControllrMod.MovementState = Data.Data
        } else if (Data.Type == "View") {
            ControllrMod.ViewState = Data.Data
        } else if (Data.Type == "Punch") {
            if (Data.State == false) { return }
            const InteractionManager = Player.interactions()
            InteractionManager.attack()
        } else if (Data.Type == "Crouch") {
            ControllrMod.CrouchState = Data.State
        } else if (Data.Type == "Jump") {
            ControllrMod.JumpState = Data.State
        } else if (Data.Type == "Sprint") {
            ControllrMod.SprintState = Data.State
        } else if (Data.Type == "Interact") {
            const InteractionManager = Player.interactions()
            InteractionManager.holdInteract(Data.State)
        }
    }
)

let LastFrameTime = Time.time()

FrameEvent(
    () => {

        const Now = Time.time()
        const DeltaTime = (Now - LastFrameTime) / 1000
        LastFrameTime = Now

        if (ControllrMod.LastPingTime + 5000 < Date.now()) {
            Chat.actionbar("Controllr is running with code " + ControllrMod.ConnectionCode)
        }

        let MovementState = ControllrMod.MovementState
        if (!MovementState) {
            MovementState = {X: 0, Y: 0}
        }

        let ViewState = ControllrMod.ViewState
        if (!ViewState) {
            ViewState = {X: 0, Y: 0}
        }

        ControllrMod.PlayerOrientation.X += ViewState.X * 150 * DeltaTime
        ControllrMod.PlayerOrientation.Y += ViewState.Y * 150 * DeltaTime
        ControllrMod.PlayerOrientation.Y = Clamp(ControllrMod.PlayerOrientation.Y, -90, 90)

        const Input = Player.createPlayerInput(-MovementState.Y, -MovementState.X, ControllrMod.PlayerOrientation.X, ControllrMod.PlayerOrientation.Y, ControllrMod.JumpState, ControllrMod.CrouchState, ControllrMod.SprintState)
        Player.clearInputs()
        Player.addInput(Input)
    }
)