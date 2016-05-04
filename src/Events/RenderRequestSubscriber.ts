/**
 * RenderRequestSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de RenderRequest
 */
interface RenderRequestSubscriber extends Subscriber {    
    render(renderer: Renderer);
}