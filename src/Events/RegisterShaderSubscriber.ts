/**
 * RegisterShaderSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de RenderRequest
 */
interface RegisterShaderSubscriber extends Subscriber {    
    registerShader(shader: ShaderProgram);
}