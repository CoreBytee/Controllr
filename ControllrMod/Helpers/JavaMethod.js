module.exports = function(Fn, Bind) {
    Fn = Fn.bind(Bind)
    return JavaWrapper.methodToJavaAsync(Fn)
}