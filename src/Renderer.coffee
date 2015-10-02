class Renderer
    constructor: (@shaderProgram, @Camera) ->
        @Pmatrix = mat4.create()
        @BaseMVMatrix = @Camera.MVMatrix
        mat4.perspective(@Pmatrix, 0.785, CANVAS.width /CANVAS.height, 0.1, 100)

    SetShader: (@shaderProgram)->
    SetCamera: (@Camera)->

    UpdateBuffers: (objects, parent)->
        for object in objects
            renderable = object.Renderable
            if not renderable
                continue
            if renderable.needsUpdate
                for attribute in @shaderProgram.Attributes
                    renderable.buffers[attribute.name] = attribute.CreateBuffer(renderable[attribute.name])
                    renderable.counts[attribute.name] = renderable[attribute.name].length / attribute.size
                if renderable.usesIndices
                    indiceBufferLocation = GL.createBuffer()
                    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indiceBufferLocation)
                    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderable.indices), GL.STATIC_DRAW)
                    renderable.buffers["indices"] = indiceBufferLocation
                renderable.needsUpdate = false
            #On va aussi appeler la fonction sur les enfants
            if object.Children.length > 0
                @UpdateBuffers(object.Children, object)

    Render: (objects, parent)->
        for object in objects
            renderable = object.Renderable
            if not renderable
                continue
            for uniform in @shaderProgram.Uniforms
                #On va aller voir quel frequence que c'est
                value = renderable[uniform.name]
                if uniform.frequency is "hierarchical"
                    value = @[uniform.freqFunc](parent.Renderable if parent, renderable, uniform.name)
                else if uniform.frequency is "global"
                    value = @[uniform.freqFunc]()
                uniform.PushToGPU(value)
            for attribute in @shaderProgram.Attributes
                attribute.FetchBuffer(renderable.buffers[attribute.name])
                attribute.PushToGPU(renderable[attribute.name])

            if renderable.usesIndices
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, renderable.buffers["indices"])
                GL.drawElements(renderable.drawType, renderable.indices.length, GL.UNSIGNED_SHORT, 0)
            else
                GL.drawArrays(renderable.drawType, 0, renderable.counts[attribute.name])

            if object.Children.length > 0
                @Render(object.Children, object)
        GL.flush()

    GetProjectionMatrix: ()->
        return @Pmatrix

    GetMVMatrix: (parent, child, varName)->
        #C'Est possible que la valeur du parent ai été calculé avec la valeur
        #d'un autre parent alors on va voir son temp
        parentValue = @Camera.MVMatrix
        if parent
            parentValue = parent[varName]
            if parent.temp and parent.temp[varName]
                parentValue = parent.temp[varName]

        childValue = child[varName]
        resultValue = mat4.create()
        mat4.multiply(resultValue, parentValue, childValue)
        child.temp = []
        child.temp[varName] = resultValue
        return resultValue
