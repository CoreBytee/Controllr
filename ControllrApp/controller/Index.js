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