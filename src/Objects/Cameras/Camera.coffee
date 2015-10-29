class Camera
    constructor: () ->
        @MVMatrix = mat4.create()
        @Position = vec3.create()
        @Quaternion = quat.create();
        #mat4.identity(@MVMatrix);
        #mat4.lookAt(@MVMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0])
        #mat4.translate(@MVMatrix, @MVMatrix, [0.0, -2.0, 0.0])
        vec3.add(@Position, @Position, [0, 0.0, 0.0])
        @Up = [0,0,1]
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
        if movement != [0,0,0]
            @Notify("move", inverted)
        return inverted

    ChangeDownDirection: (down)->
        center = [@Position[0], @Position[1], @Position[2]+1]
        newUp = [0,0,0]
        vec3.sub(newUp, newUp, down)
        @Up = [0,1,0]
        #console.log(down)
        newUp[1] = -newUp[1]
        #On va faire un produit vectoriel pour trouver l'axe de rotation
        rotationAxis = [0,0,0]
        normNew = []
        vec3.normalize(normNew, newUp)
        normOld = []
        vec3.normalize(normOld, @Up)
        vec3.cross(rotationAxis, normNew, normOld)
        angle = Math.acos(vec3.dot(normNew, normOld))
        #console.log(rotationAxis)
        #console.log(normNew)
        #console.log(normOld)
        #console.log()
        #mat4.lookAt(@MVMatrix, @Position, center, normNew)
        #mat4.rotate(@MVMatrix, @MVMatrix, -angle, rotationAxis)
        #quat.setAxisAngle(@Quaternion, rotationAxis, -angle)
        #@Up = newUp

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
        return @UpdateMV([dist, 0, 0])

    MoveRight: (dist) ->
        return @UpdateMV([-dist, 0, 0])

    MoveForward: (dist) ->
        return @UpdateMV([0, 0, dist])

    MoveBackward: (dist) ->
        return @UpdateMV([0, 0, -dist])

    MoveUp: (dist) ->
        return @UpdateMV([0, -dist, 0])

    MoveDown: (dist) ->
        return @UpdateMV([0, dist, 0])
