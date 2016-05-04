/**
 * VertexColorBuffer
 */
class VertexColorBuffer extends Buffer {
    constructor(data: Array<number>) {
        super(data, 4);        
    }
    
    bindBuffer(){
       GL.bindBuffer(GL.ARRAY_BUFFER, this.bufferLocation); 
    }
    
    bufferData(){
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.data), GL.STATIC_DRAW);
    }    
}