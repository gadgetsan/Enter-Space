/**
 * PickingRenderer
 * 
 * Une classe permetant de rendre sur un buffer pour savoir quel element on clique
 * 
 */
class PickingRenderer extends Renderer {
    
    frameBufferTexture: FrameBufferTexture;
    
    constructor(public eventManager: EventManager) {
        super(eventManager);
        this.setShader(new ShaderProgram(new VertexPicking(), new FragmentBasic()));
        eventManager.publish(new RegisterRendererEvent(this));
        
        //TODO: Ajouter les shaders que l'on veux
        this.frameBufferTexture = new FrameBufferTexture();
        
    }    
    startRender(){
        //on utilise seulement le mainShader qui sera celui pour notre rendu picking              
        this.mainShader.use();
        this.mainShader.startRender(this.getCamera());
    }    
        
    drawMesh(render: Render){        
        GL.bindTexture(GL.TEXTURE_2D, null);
        GL.bindRenderbuffer(GL.RENDERBUFFER, null);
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);        
        
        this.mainShader.use();
        this.mainShader.renderElement(render);
        
        var lastCapturedColourMap = new Uint8Array(this.frameBufferTexture.width * this.frameBufferTexture.height * 4);
        GL.readPixels(0, 0, this.frameBufferTexture.width, this.frameBufferTexture.height, GL.RGBA, GL.UNSIGNED_BYTE, lastCapturedColourMap);
        console.log(lastCapturedColourMap[0])
    }
    
    drawMeshWithShader(render: Render, shader: ShaderProgram){
        //on ne permet pas à l'objet d'utiliser un autre Shader
        this.drawMesh(render);
    }
}