/**
 * MouseClckedSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de mouvement de souris
 */
interface MouseClickedSubscriber extends Subscriber {    
    mouseClicked(event: MouseEvent);
}