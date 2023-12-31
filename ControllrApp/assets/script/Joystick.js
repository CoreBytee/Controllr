function Clamp(Value, Min, Max) {
    return Math.min(Math.max(Value, Min), Max)
}

function Degrees(Radians) {
    return Radians * (180 / Math.PI)
}

function GetDirection(Number) {
    if (Number > 0) {
        return 1
    } else if (Number < 0) {
        return -1
    } else {
        return 0
    }
}

function Round(Value, Decilmals) {
    const Multiplier = Math.pow(10, Decilmals)
    return Math.round(Value * Multiplier) / Multiplier
}

function Joystick(Element) {
    const JoystickWidth = Element.offsetWidth
    const JoystickHeight = Element.offsetHeight
    const JoystickLeft = Element.offsetLeft
    const JoystickTop = Element.offsetTop
    const JoystickCenterX = JoystickWidth / 2
    const JoystickCenterY = JoystickHeight / 2
    const Precision = 1

    // console.log(JoystickWidth, JoystickHeight, JoystickLeft, JoystickTop, JoystickCenterX, JoystickCenterY)

    const StickElement = document.createElement("div")
    StickElement.classList.add("stick")
    Element.appendChild(StickElement)

    function SetStickPosition(X, Y) {
        const TransformX = Clamp(X, -JoystickCenterX, JoystickCenterX)
        const TransformY = Clamp(Y, -JoystickCenterY, JoystickCenterY)
        StickElement.style.transform = `translate(${TransformX}px, ${TransformY}px)`

        const DirectionX = GetDirection(TransformX)
        const DirectionY = GetDirection(TransformY)

        let PercentX = TransformX / JoystickCenterX
        let PercentY = TransformY / JoystickCenterY
        let Force = Math.min(Math.sqrt(Math.pow(PercentX, 2) + Math.pow(PercentY, 2)), 1)
        let Angle = Degrees(Math.atan2(PercentY, PercentX)) + 90
        if (Angle < 0) {
            Angle = 360 + Angle
        } else {
            Angle = Angle % 360
        }

        let Changed = false

        PercentX = Round(PercentX, Precision)
        PercentY = Round(PercentY, Precision)
        Force = Round(Force, Precision)
        Angle = Round(Angle, Precision)

        const CurrentPercentX = Number(Element.getAttribute("data-x"))
        const CurrentPercentY = Number(Element.getAttribute("data-y"))
        const CurrentAngle = Number(Element.getAttribute("data-angle"))
        const CurrentForce = Number(Element.getAttribute("data-force"))

        if (CurrentPercentX != PercentX) { Changed = true }
        if (CurrentPercentY != PercentY) { Changed = true }
        // if (CurrentAngle != Angle) { Changed = true }
        // if (CurrentForce != Force) { Changed = true }

        Element.setAttribute("data-x", PercentX)
        Element.setAttribute("data-y", PercentY)
        Element.setAttribute("data-angle", Angle)
        Element.setAttribute("data-force", Force)

        if (Changed) {
            Element.dispatchEvent(new Event("change"))
        }
    }

    Element.addEventListener(
        "touchend",
        () => {
            StickElement.classList.add("transition")
            SetStickPosition(0, 0)
        }
    )
    Element.addEventListener(
        "touchmove",
        (TouchEvent) => {
            const TouchMovement = Array.from(TouchEvent.touches).find((Touch) => Touch.target == Element || Touch.target == StickElement)
            StickElement.classList.remove("transition")
            SetStickPosition(
                (TouchMovement.clientX - JoystickLeft) - JoystickCenterX,
                (TouchMovement.clientY - JoystickTop) - JoystickCenterY
            )
        }
    )

    SetStickPosition(0, 0)
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const Joysticks = document.querySelectorAll(".joystick")
        Joysticks.forEach(Element => Joystick(Element))
    }
)