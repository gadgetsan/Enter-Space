class Keyboard
    constructor: (@Control)->
        document.addEventListener( 'keydown', @onKeyDown, false )
        document.addEventListener( 'keyup', @onKeyUp, false )
        #document.addEventListener( 'mousewheel', onMouseWheel, false)
        #document.addEventListener( 'mousedown', onMouseClick, false)

    #Ces fonctions seront appelées avec un callback alors on les bind au present 'this'
    onKeyDown: (event) =>
        switch event.keyCode
            #Up, W
            when 38, 87
                @Control.moveForward = true;
            #Left, A
            when 37, 65
                @Control.turnLeft = true;
            #Right, D
            when 39, 68
                @Control.turnRight = true;
            #Down, S
            when 40, 83
                @Control.moveBackward = true;
            #Q
            when 81
                @Control.moveLeft = true;
            #E
            when 69
                @Control.moveRight = true;
            #SPACE
            when 32
                @Control.moveUp = true;
            #Alt
            when 18
                @Control.moveDown = true;

    onKeyUp: (event) =>
        switch event.keyCode
            #Up, W
            when 38, 87
                @Control.moveForward = false;
            #Left, A
            when 37, 65
                @Control.turnLeft = false;
            #Right, D
            when 39, 68
                @Control.turnRight = false;
            #Down, S
            when 40, 83
                @Control.moveBackward = false;
            #Q
            when 81
                @Control.moveLeft = false;
            #E
            when 69
                @Control.moveRight = false;
            #SPACE
            when 32
                @Control.moveUp = false;
            #Alt
            when 18
                @Control.moveDown = false;
