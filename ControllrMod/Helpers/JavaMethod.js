module.exports = function(Fn, Bind) {
    Fn = Fn.bind(Bind)
    return JavaWrapper.methodToJava(Fn)
}