const QueryString = Object.fromEntries((new URLSearchParams(window.location.search)).entries())

function ShortenBytes(Bytes) {
    const Units = ["B", "KB", "MB", "GB", "TB"]
    let UnitIndex = 0
    while (Bytes > 1024) {
        Bytes /= 1024
        UnitIndex++
    }
    return `${Bytes.toFixed(2)} ${Units[UnitIndex]}`
}

function Round(Value, Decilmals) {
    const Multiplier = Math.pow(10, Decilmals)
    return Math.round(Value * Multiplier) / Multiplier
}

function GetJoystickData(JoystickElement) {
    return {
        X: Round(Number(JoystickElement.getAttribute("data-x")), 3),
        Y: Round(Number(JoystickElement.getAttribute("data-y")), 3),
        Angle: Round(Number(JoystickElement.getAttribute("data-angle")), 3),
        Force: Round(Number(JoystickElement.getAttribute("data-force")), 3)
    }
}

const WebSocketInstance = new WebSocketClass(QueryString.code)
WebSocketInstance.On(
    "DebugData",
    (Data) => {
        console.log(Data)
        document.querySelector(".debugdata").innerText = `${Data.Ping || -1}ms, ${ShortenBytes(Data.SentDataLength)} sent`
    }
)

const MovementStick = document.getElementById("movementstick")

MovementStick.addEventListener(
    "change",
    function() {
        WebSocketInstance.SendData(
            {
                Type: "Movement",
                Data: GetJoystickData(MovementStick)
            }
        )
    }
)

const ViewStick = document.getElementById("viewstick")

ViewStick.addEventListener(
    "change",
    function() {
        WebSocketInstance.SendData(
            {
                Type: "View",
                Data: GetJoystickData(ViewStick)
            }
        )
    }
)

Array.from(document.querySelectorAll(
    ".buttons button"
)).forEach(
    (ButtonElement) => {
        console.log(ButtonElement)

        const IsToggle = ButtonElement.hasAttribute("toggle")
        const EventName = ButtonElement.getAttribute("eventname")
        console.log(IsToggle, EventName)

        ButtonElement.addEventListener(
            "touchstart",
            () => {
                const State = ButtonElement.classList.contains("active")
                if (IsToggle) {
                    ButtonElement.classList.toggle("active")
                }

                WebSocketInstance.SendData(
                    {
                        Type: EventName,
                        State: !State
                    }
                )
            }
        )

        ButtonElement.addEventListener(
            "touchend",
            () => {
                if (!IsToggle) {
                    ButtonElement.classList.remove("active")

                    WebSocketInstance.SendData(
                        {
                            Type: EventName,
                            State: false
                        }
                    )
                }
            }
        )
    }
)