class Control
    constructor: (@Camera)->
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
            @Camera.TurnLeftDeg(0.1*dt)
        if @turnRight
            @Camera.TurnRightDeg(0.1*dt)
        if @moveLeft
            @Camera.MoveLeft(0.01*dt)
        if @moveRight
            @Camera.MoveRight(0.01*dt)
        if @moveForward
            @Camera.MoveForward(0.01*dt)
        if @moveBackward
            @Camera.MoveBackward(0.01*dt)
        if @moveUp
            @Camera.MoveUp(0.001*dt)
        if @moveDown
            @Camera.MoveDown(0.001*dt)
