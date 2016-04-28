/**
 * Cube
 */
class Cube extends GameObject{
    constructor() {
        super();
        this.renderable = new CubeRenderable();
        this.mass = 10;
        this.velocity = vec3.clone([0, 0, 0]);
        this.updatePosition(vec3.clone([0,0,0]));
    }
    
    update(dt){        
        mat4.rotate(this.renderable.mvMatrix, this.renderable.mvMatrix, 0.005, [1,0,0]);
        super.update(dt);
    }
}