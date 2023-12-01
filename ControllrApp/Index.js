document.addEventListener(
    "DOMContentLoaded",
    function () {
        const Button = document.querySelector("button")
        const Input = document.querySelector("input")

        Button.addEventListener(
            "click",
            function () {
                location.href = `/controller/?code=${Input.value}`
            }
        )
    }
)