/**
 * CubeRenderable
 */
class CubeRenderable extends Renderable {
    constructor() {
        super();
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        
        this.bufferable = true;
        this.needsUpdate = true;
        this.drawType = GL.TRIANGLES;
        this.usesIndices = true;
        this.buffers = [];
        this.counts = [];
        this.offset = [0,0,0];
        
        this.position = [
            -10.0, -10.0,  -10.0,
            -10.0,  10.0,  -10.0,
            10.0,  10.0,  -10.0,
            10.0, -10.0,  -10.0,
            -10.0, -10.0,  10.0,
            -10.0,  10.0,  10.0,
            10.0,  10.0,  10.0,
            10.0, -10.0,  10.0
        ]

        this.color = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ]
        this.indices = [
            0,1,2,
            2,3,0,

            0,1,5,
            5,4,0,

            1,2,6,
            6,5,1,

            2,3,7,
            7,6,2,

            3,0,4,
            4,7,3,

            4,5,6,
            6,7,4
        ]
    }
}