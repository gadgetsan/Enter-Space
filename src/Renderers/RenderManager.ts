/**
 * RenderManager
 * 
 * Un gestionnaire des plusieurs phases de rendu (si il y en as)
 * 
 */
class RenderManager implements RegisterRendererSubscriber {
    
    subscriberId: number;
    mainRenderer: Renderer;
    
    renderers: Array<Renderer>;
    
    constructor(public eventManager: EventManager, mainShader: ShaderProgram) {
        this.mainRenderer = new Renderer(eventManager);
        this.eventManager.subscribe(this, "RegisterRendererEvent");
        this.mainRenderer.setShader(mainShader);
        this.renderers = Array();
    }
    
    registerRenderer(renderer: Renderer){
        this.renderers.push(renderer);
    }
    
    render(){        
        console.log("rendering with main renderer");
        this.mainRenderer.startRender();
        this.eventManager.publish(new RenderRequestEvent(this.mainRenderer));
        console.log("rendering with other renderers");
        //on roule la requête de rendu pour chaque element pour chaque renderer        
        this.renderers.forEach(renderer=>{
            renderer.startRender();
            this.eventManager.publish(new RenderRequestEvent(renderer));
        })        
    }
}