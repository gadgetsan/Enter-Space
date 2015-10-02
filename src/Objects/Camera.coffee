class Camera
    constructor: () ->
        @MVMatrix = mat4.create()
        @Position = vec3.create()
        @Quaternion = quat.create();
        #mat4.identity(@MVMatrix);
        #mat4.lookAt(@MVMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0])
        #mat4.translate(@MVMatrix, @MVMatrix, [0.0, -2.0, 0.0])
        vec3.add(@Position, @Position, [0, -1.0, 0.0])
        @UpdateMV()

    UpdateMV: ()->
        mat4.fromQuat(@MVMatrix, @Quaternion)
        mat4.translate(@MVMatrix, @MVMatrix, @Position)

    TurnLeftDeg: (deg) ->
        quat.rotateY(@Quaternion, @Quaternion, -Geo.DegToRad(deg))
        @UpdateMV()

    TurnRightDeg: (deg) ->
        quat.rotateY(@Quaternion, @Quaternion, Geo.DegToRad(deg))
        @UpdateMV()

    MoveLeft: (dist) ->
        vec3.add(@Position, @Position, [dist, 0, 0])
        @UpdateMV()

    MoveRight: (dist) ->
        vec3.add(@Position, @Position, [-dist, 0, 0])
        @UpdateMV()

    MoveForward: (dist) ->
        vec3.add(@Position, @Position, [0, 0, dist])
        @UpdateMV()

    MoveBackward: (dist) ->
        vec3.add(@Position, @Position, [0, 0, -dist])
        @UpdateMV()

    MoveUp: (dist) ->
        vec3.add(@Position, @Position, [0, -dist, 0])
        @UpdateMV()
