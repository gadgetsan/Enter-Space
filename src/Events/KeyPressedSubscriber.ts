/**
 * KeyPressedSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de touche appuyé
 */
interface KeyPressedSubscriber extends Subscriber {    
    keyPressed(keyPressed: number, dt: number);
}