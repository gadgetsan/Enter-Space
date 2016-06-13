/**
 * PickingRenderer
 * 
 * Une classe permetant de rendre sur un buffer pour savoir quel element on clique
 * 
 */
class PickingRenderer extends Renderer {
    
    frameBufferTexture: FrameBufferTexture;
    currentSelectableIndex: number;
    selectableComponents: Array<Selectable>;
    lastSelectedId: number;
    
    constructor(public eventManager: EventManager) {
        super(eventManager);
        this.setShader(new ShaderProgram(new VertexPicking(), new FragmentBasic()));
        eventManager.publish(new RegisterRendererEvent(this));
        this.lastSelectedId = 0;
        
        //TODO: Ajouter les shaders que l'on veux
        this.frameBufferTexture = new FrameBufferTexture();
        
    }    
    startRender(){
        //on utilise seulement le mainShader qui sera celui pour notre rendu picking              
        this.mainShader.use();
        this.mainShader.startRender(this.getCamera());        
        GL.clearColor(0.0, 0.0, 0.0, 1.0);
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBufferTexture.frameBuffer);   
        
        this.currentSelectableIndex = 1;
        this.selectableComponents = new Array();
    }    
        
    drawMesh(render: Render){        
        //GL.bindTexture(GL.TEXTURE_2D, null);
        //GL.bindRenderbuffer(GL.RENDERBUFFER, null);
        //GL.bindFramebuffer(GL.FRAMEBUFFER, null);     
        if(render.gameObject.components["selectable"] == null){
            this.mainShader.use();
            this.mainShader.renderElement(render);
        }else{
            var selectable = <Selectable>(render.gameObject.components["selectable"]);
            selectable.renderingColor = Utils.numberToColor(this.currentSelectableIndex);
            this.selectableComponents[this.currentSelectableIndex] =selectable;
            this.mainShader.use();
            this.mainShader.renderElement(render);
            this.currentSelectableIndex++;
        }
    }
    
    drawMeshWithShader(render: Render, shader: ShaderProgram){
        //on ne permet pas à l'objet d'utiliser un autre Shader
        this.drawMesh(render);
    }
    
    doneRendering(){        
        var lastCapturedColourMap = new Uint8Array(this.frameBufferTexture.width * this.frameBufferTexture.height * 4);
        GL.readPixels(0, 0, this.frameBufferTexture.width, this.frameBufferTexture.height, GL.RGBA, GL.UNSIGNED_BYTE, lastCapturedColourMap);  
        var itemId = Utils.colorToNumber(lastCapturedColourMap);
        
        if(this.lastSelectedId != itemId){    
            console.log(itemId)
            if(itemId != 0 && this.selectableComponents[itemId] != null){                
                console.log(itemId)
                //this.selectableComponents[itemId].hover();
                this.eventManager.publish(new HoveringObjectEvent(this.selectableComponents[itemId].gameObject));
            }
            if(this.lastSelectedId != 0 && this.selectableComponents[this.lastSelectedId] != null){
                console.log(this.lastSelectedId)
                //this.selectableComponents[this.lastSelectedId].unHover();
                this.eventManager.publish(new HoveringObjectEvent(null));
            }
        }
        this.lastSelectedId = itemId;
    }
}