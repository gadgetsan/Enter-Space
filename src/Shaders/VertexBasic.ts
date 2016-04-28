/**
 * VertexBasic
 */
class VertexBasic extends  Shader {
    /**
     *
     */
    constructor() {
        super();
        this.name = 'VertexBasic';
        this.type = GL.VERTEX_SHADER;
        this.source = `
                        attribute vec4 color;
                        attribute vec3 position;
                        
                        uniform mat4 mvMatrix;
                        uniform mat4 pMatrix;
                        uniform vec3 offset;
                        
                        varying vec4 vColor;
                        void main(void) {
                            gl_Position = pMatrix * mvMatrix * vec4(position-offset, 1.0);
                            vColor=color;
                        }
                        `
    }
    
    init(program: ShaderProgram){
        program.uniforms.push(new ShaderParam("uniform", "Matrix4fv", "global", "getProjectionMatrix", program.program, "pMatrix", false, 1))
        program.uniforms.push(new ShaderParam("uniform", "Matrix4fv", "hierarchical", "getMVMatrix", program.program, "mvMatrix", false, 1))
        //Utiliser pour déplacer tout les sommets de manière à ne pas devoir réenvoyer toute les données
        program.uniforms.push(new ShaderParam("uniform", "Vector3fv", "local", null, program.program, "offset", false, 1))

        var positionParam = new ShaderParam("attribute", "VertexPointer", null, null, program.program, "position", true, 3)
        var colorParam = new ShaderParam("attribute", "VertexPointer", null, null, program.program, "color", true, 4)

        program.attributes.push(colorParam)
        program.attributes.push(positionParam)

        GL.enableVertexAttribArray(colorParam.location)
        GL.enableVertexAttribArray(positionParam.location)
    }
    
}