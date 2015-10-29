class Player extends GameObject
    constructor: ()->
        super()
        @Camera = new Camera()
        @Mass = 10

    UpdateDownDirection: (newDown)->
        @Camera.ChangeDownDirection(newDown)

    TurnLeftDeg: (deg) ->
        @Camera.TurnLeftDeg(deg)

    TurnRightDeg: (deg) ->
        @Camera.TurnRightDeg(deg)

    MoveLeft: (dist) ->
        vec3.add(@Location, @Location, @Camera.MoveLeft(dist))

    MoveRight: (dist) ->
        vec3.add(@Location, @Location, @Camera.MoveRight(dist))

    MoveForward: (dist) ->
        vec3.add(@Location, @Location, @Camera.MoveForward(dist))

    MoveBackward: (dist) ->
        vec3.add(@Location, @Location, @Camera.MoveBackward(dist))

    MoveUp: (dist) ->
        vec3.add(@Location, @Location, @Camera.MoveUp(dist))

    MoveDown: (dist) ->
        vec3.add(@Location, @Location, @Camera.MoveDown(dist))

    Update: (dt)->
        super(dt)
        #console.log("Camera: " + @Camera.Position)
        #console.log("Player: " + @Location)
        @Camera.Position = [-@Location[0], -@Location[1], -@Location[2]]
        @Camera.UpdateMV([0,0,0])
