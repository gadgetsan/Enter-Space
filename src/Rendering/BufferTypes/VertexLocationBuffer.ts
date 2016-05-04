/**
 * VertexLocationBuffer
 */
class VertexLocationBuffer extends Buffer{
    constructor(data: Array<number>) {
        super(data, 3);        
    }
    
    bindBuffer(){
       GL.bindBuffer(GL.ARRAY_BUFFER, this.bufferLocation); 
    }
    
    bufferData(){
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.data), GL.STATIC_DRAW);
    }    
}