class Shader
    name: 'basic'
    source: ""

    build: () ->
        typeString = if @type == GL.VERTEX_SHADER then "VERTEX" else "FRAGMENT"
        @shader = GL.createShader(@type)
        GL.shaderSource(@shader, @source)
        GL.compileShader(@shader)
        if not GL.getShaderParameter(@shader, GL.COMPILE_STATUS)
            alert("ERROR IN #{typeString} Shader Named #{@name}: #{GL.getShaderInfoLog(@shader)}")
        return @shader

    Init: (program) ->
        #DAns ce cas specifique on n'en as pas mais sinon on ferais:
        #nomDeVar = GL.getAttribLocation(program, "nomDeVar")
        #GL.enableVertexAttribArray(nomDeVar)
