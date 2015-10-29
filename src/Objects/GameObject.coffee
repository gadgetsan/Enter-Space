class GameObject
    constructor: ()->
        @Renderable = null
        @Children = []
        @Mass = 0
        @Velocity = [0,0,0]
        @Location = [0,0,0]
        @CanCollide = true

    Add: (child) ->
        @Children.push(child)

    UpdatePosition: (newLocation)->
        delta = []
        vec3.sub(delta, newLocation, @Location)
        @Location = newLocation
        mat4.translate(@Renderable.MVmatrix, @Renderable.MVmatrix, delta)

    UpdateDownDirection: (newDown)->

    Update: (dt)->

        # On met à jour la Position avec la Vitesse (qui est en m/s)
        displacement = []
        vec3.scale(displacement, @Velocity, dt/1000)
        vec3.add(@Location, @Location, displacement)

        #si on a un Renderable, on met à jour sa position
        if(@Renderable)
            #ON reset les informations
            mat4.translate(@Renderable.MVmatrix, @Renderable.MVmatrix, displacement)

        for child in @Children
            child.Update(dt);

    CameraMoved: (move, Camera)->
        #Si on voudrais avoir un LOD pour cet objet
