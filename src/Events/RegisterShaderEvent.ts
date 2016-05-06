/**
 * RegisterShaderEvent
 * 
 * Un evenement permettant d'enregistrer un shader qui devra être initialisé à chaque rendu
 */
class RegisterShaderEvent extends EventBase{
    constructor(public shader: ShaderProgram) {
        super("RegisterShaderEvent");
    }
        
    notifySubscriber(subscriber: RegisterShaderSubscriber){
        //on va apeller la methode update sur l'objet qui souscrit à l'event
        subscriber.registerShader(this.shader);
    }
}