/**
 * VertexIndexBuffer
 */
class VertexIndexBuffer extends Buffer {
    constructor(data: Array<number>) {
        super(data, 1);        
    }
    
    bindBuffer(){
       GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.bufferLocation); 
    }
    
    bufferData(){
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), GL.STATIC_DRAW);
    }
}