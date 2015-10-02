class GameObject
    constructor: ()->
        @Renderable = null
        @Children = []

    Update: (dt)->
        for child in @Children
            child.Update(dt);
