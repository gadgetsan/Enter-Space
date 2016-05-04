/**
 * ShaderParam
 */
class ShaderParam {    
    value: GLM.IArray;
    //TODO: faire des implementation de ça
    constructor(public name: string, public program: ShaderProgram) {        
    }
    
    set(value: GLM.IArray){
        this.value = value;
        console.dir("cannot set a default ShaderParam");
    }
    /*
    pushToGPU(value: Float32Array){        
        switch(this.type){
            case "Matrix4fv":
                GL.uniformMatrix4fv(this.location, false, value);
                break;
            case "Vector3fv":
                GL.uniform3fv(this.location, value);
                break;
            case "VertexPointer":
                GL.vertexAttribPointer(this.location, this.size, GL.FLOAT, false, 0, 0);
                break;
        }
        
    }
    
    createBuffer(data: any){
        if(this.paramType == "attribute"){
            var bufferLocation = GL.createBuffer();
            GL.bindBuffer(GL.ARRAY_BUFFER, bufferLocation);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);
            return bufferLocation;
        }else{
            alert(`can't create buffer for type ${this.paramType}`);
        }
    }
    
    fetchBuffer(bufferLocation: WebGLBuffer){
        if(this.hasBuffer){
            GL.bindBuffer(GL.ARRAY_BUFFER, bufferLocation);
        }
    }
    */
}