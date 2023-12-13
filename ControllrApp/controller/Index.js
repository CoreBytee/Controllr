const QueryString = Object.fromEntries((new URLSearchParams(window.location.search)).entries())

const WebSocketInstance = new WebSocketClass(QueryString.code)
WebSocketInstance.On(
    "Data",
    function(Data) {
        if (Data.Type == "Pong") {
            console.log("Ping: " + (Date.now() - Data.SentAt) + "ms")
        }
    }
)

const MovementStick = document.getElementById("movementstick")

MovementStick.addEventListener(
    "change",
    function() {
        WebSocketInstance.SendData(
            {
                Type: "Movement",
                X: Number(MovementStick.getAttribute("data-x")),
                Y: Number(MovementStick.getAttribute("data-y")),
                Angle: Number(MovementStick.getAttribute("data-angle")),
                Force: Number(MovementStick.getAttribute("data-force"))
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
                X: Number(ViewStick.getAttribute("data-x")),
                Y: Number(ViewStick.getAttribute("data-y")),
                Angle: Number(ViewStick.getAttribute("data-angle")),
                Force: Number(ViewStick.getAttribute("data-force"))
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