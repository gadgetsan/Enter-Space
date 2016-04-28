/**
 * Keyboard
 */
class Keyboard {
    
    constructor(public control: Control) {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
    
    //Ces fonctions seront appelées avec un callback alors on les bind au present 'this'
    onKeyDown(event: KeyboardEvent){
        switch(event.keyCode){
            case KeyCode.UP_ARROW, KeyCode.KEY_W:
                this.control.moveForward = true;
                break;
            case KeyCode.LEFT_ARROW, KeyCode.KEY_A:
                this.control.turnLeft = true;
                break;
            case KeyCode.RIGHT_ARROW, KeyCode.KEY_D:
                this.control.turnRight = true;
                break;
            case KeyCode.DOWN_ARROW, KeyCode.KEY_S:
                this.control.moveBackward = true;
                break;
            case KeyCode.KEY_Q:
                this.control.moveLeft = true;
                break;
            case KeyCode.KEY_E:
                this.control.moveRight = true;
                break;
            case KeyCode.SPACE:
                this.control.moveUp = true;
                break;
            case KeyCode.ALT:
                this.control.moveDown = true;
                break;            
        }
    }
    
    onKeyUp(event: KeyboardEvent){        
        switch(event.keyCode){
            case KeyCode.UP_ARROW, KeyCode.KEY_W:
                this.control.moveForward = false;
                break;
            case KeyCode.LEFT_ARROW, KeyCode.KEY_A:
                this.control.turnLeft = false;
                break;
            case KeyCode.RIGHT_ARROW, KeyCode.KEY_D:
                this.control.turnRight = false;
                break;
            case KeyCode.DOWN_ARROW, KeyCode.KEY_S:
                this.control.moveBackward = false;
                break;
            case KeyCode.KEY_Q:
                this.control.moveLeft = false;
                break;
            case KeyCode.KEY_E:
                this.control.moveRight = false;
                break;
            case KeyCode.SPACE:
                this.control.moveUp = false;
                break;
            case KeyCode.ALT:
                this.control.moveDown = false;
                break;  
        }
    }
}