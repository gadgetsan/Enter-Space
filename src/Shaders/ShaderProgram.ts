/**
 * ShaderProgram
 */
class ShaderProgram {
    
    program: WebGLProgram;
    params: Array<ShaderParam>;
        
    constructor(public vertexShader: Shader, public fragmentShader: Shader) {
        this.program = GL.createProgram();
        this.params = [];
        
        //on va build les shaders que l'on a reçu en paramêtre
        GL.attachShader(this.program, this.vertexShader.build());
        GL.attachShader(this.program, this.fragmentShader.build());
                
        GL.linkProgram(this.program);
        
        this.vertexShader.init(this);
        this.fragmentShader.init(this);
    }
    
    use() {
        //GL.linkProgram(this.program);
        console.log("using Shader " + this.vertexShader.name + " and " + this.fragmentShader.name);
        GL.useProgram(this.program);
        //console.log(`Using Shader ${this.vertexShader.name} With ${this.fragmentShader.name}`)
    }
    
    startRender(camera: Camera){
        this.vertexShader.startRender(this, camera);
        this.fragmentShader.startRender(this, camera);
    }
    
    renderElement(render: Render){
        //on va demander au shaders d'aller chercher ce qu'ils ont de besoin
        this.vertexShader.renderElement(this, render);
        this.fragmentShader.renderElement(this, render);
    }
    
    draw(indexBuffer: Buffer, drawType: number){        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer.bufferLocation);
        GL.drawElements(drawType, indexBuffer.itemCount, GL.UNSIGNED_SHORT, 0);
    }
}