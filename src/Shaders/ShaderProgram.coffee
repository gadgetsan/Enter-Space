class ShaderProgram
    constructor: (@vertex, @fragment) ->
        @program = GL.createProgram()
        #On va build les 2 Shaders que l'on reçoit en param
        GL.attachShader(@program, @vertex.build())
        GL.attachShader(@program, @fragment.build())

        GL.linkProgram(@program)

        #On va aussi assigner attribuer les variables de nos shader
        @vertex.Init(this)
        @fragment.Init(this)

    #Attributes, une fois par vertex
    Attributes: []

    #Uniformes, une fois pour chaque objet
    Uniforms: []

    Use: () ->
        GL.useProgram(@program)
