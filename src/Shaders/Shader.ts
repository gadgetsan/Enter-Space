/**
 * Shader
 */
class Shader {
    name:string;
    source: string;
    typeString: string;
    type: number;
    shader: WebGLShader;
    constructor() {
        this.name = 'basic';
    }
    build(){
        if(this.type == GL.VERTEX_SHADER){
            this.typeString = "VERTEX";
        }else{
            this.typeString = "FRAGMENT";
        }
        this.shader = GL.createShader(this.type);
        GL.shaderSource(this.shader, this.source);
        GL.compileShader(this.shader);
        
        //si le shader n'as pas pu être compilé
        if(!GL.getShaderParameter(this.shader, GL.COMPILE_STATUS)){
            alert(`ERROR IN ${this.typeString} 
            Shader Named ${this.name}: 
            ${GL.getShaderInfoLog(this.shader)}`);   
        }
        return this.shader;
    }
    
    init(program){        
        //DAns ce cas specifique on n'en as pas mais sinon on ferais:
        //nomDeVar = GL.getAttribLocation(program, "nomDeVar")
        //GL.enableVertexAttribArray(nomDeVar)
    }
    
    startRender(program: ShaderProgram, camera: Camera){
        //le Shader de base, on ne fait rien ici...
    }
    
    renderElement(program: ShaderProgram, render: Render){
        //le Shader de base, on ne fait rien ici...
    }
}