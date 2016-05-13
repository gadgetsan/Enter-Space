/**
 * RegisterRendererEvent
 * 
 * Un evenement permettant d'avertir que l'ont veux ajouter un nouveau type de rendu
 */
class RegisterRendererEvent extends EventBase{
    constructor(public renderer: Renderer) {
        super("RegisterRendererEvent");
    }
        
    notifySubscriber(subscriber: RegisterRendererSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.registerRenderer(this.renderer);
    }
}