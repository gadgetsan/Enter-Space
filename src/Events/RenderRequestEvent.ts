/**
 * RenderRequestEvent
 * 
 * Un evenement demandant aux éléments de s'afficher à l'écran
 */
class RenderRequestEvent extends EventBase{
    constructor(public renderer: Renderer) {
        super("RenderRequestEvent");
    }
        
    notifySubscriber(subscriber: RenderRequestSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.render(this.renderer);
    }
}