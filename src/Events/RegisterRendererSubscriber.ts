/**
 * RegisterRendererSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de RegisterRenderer
 */
interface RegisterRendererSubscriber extends Subscriber {    
    registerRenderer(renderer: Renderer);
}