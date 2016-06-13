/**
 * HoveringObjectSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de pointer sur un objet
 */
interface HoveringObjectSubscriber extends Subscriber {    
    hovering(object: GameObject);
}