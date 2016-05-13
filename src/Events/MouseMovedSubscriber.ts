/**
 * MouseMovedSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de mouvement de souris
 */
interface MouseMovedSubscriber extends Subscriber {    
    mouseMoved(event: MouseEvent);
}