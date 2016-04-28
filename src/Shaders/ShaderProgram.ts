/**
 * ShaderProgram
 */
class ShaderProgram {
    
    program: WebGLProgram;
    attributes: Array<ShaderParam>;
    uniforms: Array<ShaderParam>;
        
    constructor(public vertexShader: Shader, public fragmentShader: Shader) {
        this.attributes = new Array();
        this.uniforms = new Array();
        this.program = GL.createProgram();
        
        //on va build les shaders que l'on a reçu en paramêtre
        GL.attachShader(this.program, this.vertexShader.build());
        GL.attachShader(this.program, this.fragmentShader.build());
        
        GL.linkProgram(this.program);
        
        //on va aussi attribuer les variables pour nos Shaders
        this.vertexShader.init(this);
        this.fragmentShader.init(this);
    }
    
    use() {
        GL.useProgram(this.program);
    }
}