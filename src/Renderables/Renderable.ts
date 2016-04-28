/**
 * Renderable
 */
class Renderable {
    mvMatrix: GLM.IArray;
    bufferable: boolean;
    needsUpdate: boolean;
    drawType: number;
    usesIndices: boolean;
    buffers: Array<any>;
    counts: Array<any>;
    offset: Array<number>;
    position: Array<number>;
    color: Array<number>;
    indices: Array<number>;
    constructor() {
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        this.bufferable = true;
        this.needsUpdate = true;
        this.drawType = GL.TRIANGLES;
        this.usesIndices = true;
        
        this.offset = [0, 0, 0];
        
        this.position = [
            -1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        
        this.color = [
            1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ];
        
        this.indices =  [0,3,2,0,1,2];
        
    }
}