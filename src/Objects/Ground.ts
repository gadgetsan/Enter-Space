/**
 * Ground
 */
class Ground extends GameObject {
    constructor() {
        super();
        this.renderable = new Renderable();
    }
    update(dt){
        //mat4.rotate(this.renderable.mvMatrix, this.renderable.mvMatrix, 0.02, [1,0,0]);
        super.update(dt);
    }
}