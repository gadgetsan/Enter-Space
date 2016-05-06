/**
 * ControllerBehavior
 * 
 * Composant permettant de controller l'objet à partir du clavier
 */
class ControllerBehavior extends Component implements KeyPressedSubscriber{
    subscriberId: number;
    constructor(gameObject: GameObject) {
        super(gameObject);   
        this.gameObject.eventManager.subscribe(this, "KeyPressedEvent");
    }
    
    keyPressed(key: number, dt: number){
        var transform = <Transform>this.gameObject.components["transform"];
        var moveSpeed = 0.01*dt;
        switch (key)
        {
            case KeyCode.KEY_W :
                transform.location[2] += moveSpeed;
                break;
            case KeyCode.KEY_S :
                transform.location[2] -= moveSpeed;
                break;
            case KeyCode.KEY_A :
                transform.location[0] += moveSpeed;
                break;
            case KeyCode.KEY_D :
                transform.location[0] -= moveSpeed;
                break;
        }
    }
}