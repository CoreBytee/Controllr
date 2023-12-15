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



function GetJoystickData(JoystickElement) {
    return {
        X: Number(JoystickElement.getAttribute("data-x")),
        Y: Number(JoystickElement.getAttribute("data-y")),
        // Angle: Number(JoystickElement.getAttribute("data-angle")),
        // Force: Number(JoystickElement.getAttribute("data-force"))
    }
}

const WebSocketInstance = new WebSocketClass(QueryString.code)
WebSocketInstance.On(
    "DebugData",
    (Data) => {
        document.querySelector(".debugdata").innerText = `${Data.Ping || -1}ms, ${ShortenBytes(Data.SentDataLength)} sent ${ShortenBytes(Data.ReceivedDataLength)} received`
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
        const IsToggle = ButtonElement.hasAttribute("toggle")
        const EventName = ButtonElement.getAttribute("eventname")

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