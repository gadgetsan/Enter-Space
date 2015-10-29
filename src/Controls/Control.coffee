class Control
    constructor: (@Player)->
        @moveForward= false
        @moveBackward= false
        @turnLeft= false
        @moveLeft= false
        @moveRight= false
        @turnRight= false
        @moveUp= false
        @moveDown= false

    Update: (dt) ->
        if @turnLeft
            @Player.TurnLeftDeg(0.1*dt)
        if @turnRight
            @Player.TurnRightDeg(0.1*dt)
        if @moveLeft
            @Player.MoveLeft(0.01*dt)
        if @moveRight
            @Player.MoveRight(0.01*dt)
        if @moveForward
            @Player.MoveForward(0.01*dt)
        if @moveBackward
            @Player.MoveBackward(0.01*dt)
        if @moveUp
            @Player.MoveUp(0.001*dt)
        if @moveDown
            @Player.MoveDown(0.001*dt)
