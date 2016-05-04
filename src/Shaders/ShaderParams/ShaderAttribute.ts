/**
 * ShaderAttribute
 */
class ShaderAttribute extends ShaderParam{
    location: number;
    constructor(name: string, program: ShaderProgram) {
        super(name, program);
        this.location = GL.getAttribLocation(program.program, name);
        GL.enableVertexAttribArray(this.location);
    }
    
    bind(buffer: Buffer){        
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.bufferLocation);
        GL.vertexAttribPointer(this.location, buffer.itemSize, GL.FLOAT, false, 0, 0);
    }
    
}