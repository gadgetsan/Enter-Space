class ShaderParam

    constructor: (@paramType, @type, @frequency, @freqFunc, program, @name, @hasBuffer, @size)->
        @location = switch @paramType
            when "attribute" then GL.getAttribLocation(program, @name)
            when "uniform" then GL.getUniformLocation(program, @name)

    PushToGPU: (value)->
        switch @type
            when "Matrix4fv" then GL.uniformMatrix4fv(@location, false, value)
            when "VertexPointer" then GL.vertexAttribPointer(@location, @size, GL.FLOAT, false, 0, 0)

    CreateBuffer: (data)->
        if @paramType == "attribute"
            bufferLocation = GL.createBuffer()
            GL.bindBuffer(GL.ARRAY_BUFFER, bufferLocation)
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW)
            return bufferLocation
        else
            alert "can't create a buffer for type #{@paramType}"

    FetchBuffer: (bufferLocation)->
        if @hasBuffer
            GL.bindBuffer(GL.ARRAY_BUFFER, bufferLocation)
