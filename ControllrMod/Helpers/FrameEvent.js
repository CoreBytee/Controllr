

module.exports = function FrameEvent(Fn) {
    const d3d = Reflection.createClassProxyBuilder(Hud.createDraw3D().getClass())
        .addMethod('render', JavaWrapper.methodToJava((ref, args) => {
            try {
                Fn()                
            } catch (error) {
                print(error.toString())
            }
            return ref.parent(args) // call super
        })).buildInstance([])
    d3d.register()
}