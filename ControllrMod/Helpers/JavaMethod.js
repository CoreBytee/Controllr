module.exports = function(Fn, Bind) {
    Fn = Fn.bind(Bind)
    JavaWrapper.methodToJava(Fn)
}