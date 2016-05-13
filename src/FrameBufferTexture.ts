/**
 * FrameBufferTexture
 * 
 * un objet représentant un rendu sur une texture
 * 
 */
class FrameBufferTexture {
    
    frameBuffer: WebGLFramebuffer;
    texture: WebGLTexture;
    renderBuffer: WebGLRenderbuffer;
    width: number;
    height: number;
    
    constructor() {
        this.frameBuffer = GL.createFramebuffer();
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffer);
        this.width = 1;
        this.height = 1;
        
        this.texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.width, this.height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
        
        this.renderBuffer = GL.createRenderbuffer();
        GL.bindRenderbuffer(GL.RENDERBUFFER, this.renderBuffer);
        GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.width, this.height);
        
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.texture, 0);
        GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.renderBuffer);
        
    }
}