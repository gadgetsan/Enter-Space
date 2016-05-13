/**
 * PlayerMovedEvent
 * 
 * Un evenement permettant d'avertir lorsque le joueur bouge
 */
class PlayerMovedEvent extends EventBase{
    constructor(public player: Player) {
        super("PlayerMovedEvent");
    }
        
    notifySubscriber(subscriber: PlayerMovedSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.playerMoved(this.player);
    }
}