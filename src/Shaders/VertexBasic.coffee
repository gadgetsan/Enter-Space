class VertexBasic extends Shader
    name: 'VertexBasic'
    type: GL.VERTEX_SHADER
    source: """
        attribute vec4 color;
        attribute vec3 position;

        uniform mat4 MVmatrix;
        uniform mat4 Pmatrix;
        uniform vec3 offset;

        varying vec4 vColor;
        void main(void) {
            gl_Position = Pmatrix * MVmatrix * vec4(position-offset, 1.0);
            vColor=color;
        }
        """
    Init: (program) ->
        program.Uniforms.push(new ShaderParam("uniform", "Matrix4fv", "global", "GetProjectionMatrix", program.program, "Pmatrix", false, 1))
        program.Uniforms.push(new ShaderParam("uniform", "Matrix4fv", "hierarchical", "GetMVMatrix", program.program, "MVmatrix", false, 1))
        #Utiliser pour déplacer tout les sommets de manière à ne pas devoir réenvoyer toute les données
        program.Uniforms.push(new ShaderParam("uniform", "Vector3fv", "local", null, program.program, "offset", false, 1))

        positionShader = new ShaderParam("attribute", "VertexPointer", null, null, program.program, "position", true, 3)
        colorShader = new ShaderParam("attribute", "VertexPointer", null, null, program.program, "color", true, 4)

        program.Attributes.push(colorShader)
        program.Attributes.push(positionShader)

        GL.enableVertexAttribArray(colorShader.location)
        GL.enableVertexAttribArray(positionShader.location)
