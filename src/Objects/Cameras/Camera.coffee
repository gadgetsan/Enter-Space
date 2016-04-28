class Camera
    constructor: () ->
        @MVMatrix = mat4.create()
        @Position = vec3.create()
        @RotationMatrix = mat4.create();
        #mat4.identity(@MVMatrix);
        #mat4.lookAt(@MVMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0])
        #mat4.translate(@MVMatrix, @MVMatrix, [0.0, -2.0, 0.0])
        vec3.add(@Position, @Position, [0, 0.0, 0.0])
        @Up = [0,1,0]
        @UpdateMV([0, 0, 0])
        @Subscribers = []

    UpdateMV: (movement)->
        #On recréé notre matrice de transformation à partir de notre quaternion
        #@MVMatrix = @RotationMatrix #mat4.fromQuat(@MVMatrix, @Quaternion)
        mat4.identity(@MVMatrix)
        mat4.multiply(@MVMatrix, @MVMatrix, @RotationMatrix)

        #Ensuite, on transforme notre déplacement pour qu'il soit dans le même plan que notre camera
        invertedRotation = mat4.create()
        mat4.invert(invertedRotation, @RotationMatrix)
        vec3.transformMat4(movement, movement, invertedRotation)
        vec3.add(@Position, @Position, movement)
        mat4.translate(@MVMatrix, @MVMatrix, @Position)

        #ensuite, on retourne le déplacement inversé parce que la camera vois tout inversé...
        inverted = vec3.create()
        vec3.subtract(inverted, inverted, movement)
        if movement != [0,0,0]
            @Notify("move", inverted)
        return inverted

    ChangeDownDirection: (down)->
        #On trouve le up à partir du down
        newUp = [0,0,0]
        vec3.sub(newUp, newUp, down)

        #Ensuite, on trouve le vecteur de rotation (En faisant un produit croisé)
        rotationAxis = [0,0,0]
        normNew = []
        vec3.normalize(normNew, newUp)
        normOld = []
        vec3.normalize(normOld, @Up)
        vec3.cross(rotationAxis, normNew, normOld)

        #Finalement, on trouve l'angle entre les 2 vecteurs
        angle = Math.acos(vec3.dot(normNew, normOld))

        #et on effectue la rotation
        mat4.rotate(@RotationMatrix, @RotationMatrix, angle, rotationAxis)

        @Up = normNew

    Subscribe: (to, cb) ->
        @Subscribers.push({type: to, callback: cb})

    Notify: (type, item) ->
        if @Subscribers
            subscriber.callback(item, this) for subscriber in @Subscribers when subscriber.type is type

    TurnLeftDeg: (deg) ->
        mat4.rotateY(@RotationMatrix, @RotationMatrix, -Geo.DegToRad(deg))
        @UpdateMV([0, 0, 0])

    TurnRightDeg: (deg) ->
        mat4.rotateY(@RotationMatrix, @RotationMatrix, Geo.DegToRad(deg))
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
