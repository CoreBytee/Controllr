const JavaMethod = require("./JavaMethod.js")

module.exports = function(EventName, Listener, BindListener) {
    JsMacros.on(EventName, JavaMethod(Listener, BindListener))
}