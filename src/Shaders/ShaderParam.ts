/**
 * ShaderParam
 */
class ShaderParam {
    
    //TODO: faire des implementation de ça
    location: any;
    constructor(public paramType: string,
                public type: string,
                public frequency: string,
                public freqFunc: any,
                program: WebGLProgram,
                public name: string,
                public hasBuffer: boolean,
                public size: number) {
        switch(this.paramType){
            case "attribute":
                this.location = GL.getAttribLocation(program, this.name);
                break;
            case "uniform"://ON VA DEVOIR REPENSER CETTE PARTIE
                this.location = GL.getUniformLocation(program, this.name);
                break;
        }
        
    }
    
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
}