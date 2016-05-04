/**
 * Buffer
 */
class Buffer {
    bufferLocation: WebGLBuffer;
    itemCount: number;
    constructor(public data: Array<number>, public itemSize: number) {
        this.itemCount = data.length / this.itemSize;
        this.bufferLocation = GL.createBuffer();
        this.bindBuffer(); 
        this.bufferData();       
    }
        
    bindBuffer(){
       console.log("cannot instantiate a Buffer without a type");
    }
    
    bufferData(){
       console.log("cannot instantiate a Buffer without a type");
    }
}