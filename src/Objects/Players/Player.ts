/**
 * Player
 */
class Player extends GameObject{
    /**
     *
     */
    camera: Camera;
    mass: number;
    constructor() {
        super();
        this.camera = new Camera();
        this.mass = 10;
        
    }
    
    updateDownDirecte(newDown: Array<number>){
        this.camera.changeDownDirection(newDown);
    }
    
    turnLeftDeg(deg: number){
        this.camera.turnLeftDeg(deg);
    }
    
    turnRightDeg(deg: number){
        this.camera.turnRightDeg(deg);
    }
    
    moveLeft(dist: number){
        vec3.add(this.location, this.location, this.camera.moveLeft(dist));
    }
    
    moveRight(dist: number){
        vec3.add(this.location, this.location, this.camera.moveRight(dist));
    }
    
    moveForward(dist: number){
        vec3.add(this.location, this.location, this.camera.moveForward(dist));
    }
    
    moveBackward(dist: number){
        vec3.add(this.location, this.location, this.camera.moveBackward(dist));
    }
    
    moveUp(dist: number){
        vec3.add(this.location, this.location, this.camera.moveUp(dist));
    }
    
    moveDown(dist: number){
        vec3.add(this.location, this.location, this.camera.moveDown(dist));
    }
    
    update(dt: number){
        super.update(dt);
    }
}