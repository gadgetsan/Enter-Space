class Camera
    constructor: () ->
        @MVMatrix = mat4.create()
        @Position = vec3.create()
        @Quaternion = quat.create();
        #mat4.identity(@MVMatrix);
        #mat4.lookAt(@MVMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0])
        #mat4.translate(@MVMatrix, @MVMatrix, [0.0, -2.0, 0.0])
        vec3.add(@Position, @Position, [0, 0.0, 0.0])
        @UpdateMV([0, 0, 0])
        @Subscribers = []

    UpdateMV: (movement)->
        mat4.fromQuat(@MVMatrix, @Quaternion)
        invertedQuat = quat.create()
        quat.invert(invertedQuat, @Quaternion)
        vec3.transformQuat(movement, movement, invertedQuat)
        vec3.add(@Position, @Position, movement)
        mat4.translate(@MVMatrix, @MVMatrix, @Position)
        inverted = vec3.create()
        vec3.subtract(inverted, inverted, movement)
        @Notify("move", inverted)

    Subscribe: (to, cb) ->
        @Subscribers.push({type: to, callback: cb})

    Notify: (type, item) ->
        if @Subscribers
            subscriber.callback(item, this) for subscriber in @Subscribers when subscriber.type is type

    TurnLeftDeg: (deg) ->
        quat.rotateY(@Quaternion, @Quaternion, -Geo.DegToRad(deg))
        @UpdateMV([0, 0, 0])

    TurnRightDeg: (deg) ->
        quat.rotateY(@Quaternion, @Quaternion, Geo.DegToRad(deg))
        @UpdateMV([0, 0, 0])

    MoveLeft: (dist) ->
        @UpdateMV([dist, 0, 0])

    MoveRight: (dist) ->
        @UpdateMV([-dist, 0, 0])

    MoveForward: (dist) ->
        @UpdateMV([0, 0, dist])

    MoveBackward: (dist) ->
        @UpdateMV([0, 0, -dist])

    MoveUp: (dist) ->
        @UpdateMV([0, -dist, 0])

    MoveDown: (dist) ->
        @UpdateMV([0, dist, 0])
