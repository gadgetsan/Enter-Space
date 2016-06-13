/**
 * HoveringObjectEvent
 * 
 * Un evenement permettant d'avertir que le joueur pointe son curseur sur un objet
 */
class HoveringObjectEvent extends EventBase{
    constructor(public object: GameObject) {
        super("HoveringObjectEvent");
    }
        
    notifySubscriber(subscriber: HoveringObjectSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.hovering(this.object);
    }
}