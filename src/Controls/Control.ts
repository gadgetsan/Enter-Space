/**
 * Control
 */
class Control {
    moveForward: boolean;
    moveBackward:boolean;
    turnLeft: boolean;
    moveLeft: boolean;
    turnRight: boolean;
    moveRight: boolean;
    moveUp: boolean;
    moveDown: boolean;
    
    constructor(public player: Player) {
        this.moveForward = false;
        this.moveBackward = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }
    
    update(dt: number){
        this.player.update(dt);
        if(this.turnLeft){
            this.player.turnLeftDeg(0.1*dt);
        }
        if(this.turnRight){
            this.player.turnRightDeg(0.1*dt);
        }
        if(this.moveRight){
            this.player.moveRight(0.1*dt);
        }
        if(this.moveLeft){
            this.player.moveLeft(0.1*dt);
        }
        if(this.moveBackward){
            this.player.moveBackward(0.1*dt);
        }
        if(this.moveForward){
            this.player.moveForward(0.1*dt);
        }
        if(this.moveUp){
            this.player.moveUp(0.001*dt);
        }
        if(this.moveDown){
            this.player.moveDown(0.001*dt);
        }
    }
}