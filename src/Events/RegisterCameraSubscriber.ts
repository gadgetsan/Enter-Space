/**
 * RegisterCameraSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de RenderRequest
 */
interface RegisterCameraSubscriber extends Subscriber {    
    registerCamera(camera: Camera);
}