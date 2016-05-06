/**
 * ShaderUniform
 */
class ShaderUniform extends ShaderParam{
    location: WebGLUniformLocation;
    valueStack: Array<any>;
    constructor(name: string, program: ShaderProgram, public valueType: string) {
        super(name, program);
        this.location = GL.getUniformLocation(program.program, name);
        this.valueStack = [];
    }

    set(value: any){
        this.value = value;
        if(this.valueType == "Matrix4fv"){
            GL.uniformMatrix4fv(this.location, false, new Float32Array(value));
        }else if(this.valueType == "Vector3fv"){
            GL.uniform3fv(this.location, value);
        }
    }
    push(newValue: any){
        this.valueStack.push(this.value);
        var actualNewValue = mat4.create();
        mat4.multiply(actualNewValue, this.value, newValue);
        this.set(actualNewValue);
    }

    pop(){
        this.value = this.valueStack.pop();
    }
}